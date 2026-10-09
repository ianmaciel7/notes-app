# ADR 0008: Adopt Native Firebase Firestore with Persistent Local Cache

## Status

Accepted

## Implementation

Partially implemented

## Date

2026-09-29

## Current State (2026-10-08)

**Implementation: base Firestore configuration, security rules, cache cleanup,
and their tests are delivered (GitHub CI green on `dev`). The Space client now
reads and writes owner-scoped Space data through Firestore; broader application
data access remains pending.**

Delivered:

- `src/lib/firebase/firestore.ts`: idempotent browser instance with
  `persistentLocalCache` + `persistentMultipleTabManager`, fallback to the
  existing or in-memory instance when persistence fails, in-memory default on
  the server, and `connectFirestoreEmulator` (`127.0.0.1:8080`) only outside
  production, once per instance (state kept on `globalThis` so Fast Refresh
  reuses it). `getDb()` is the browser Firestore access point for
  `src/client/space-client.ts`.
- `clearFirestoreCache()` runs `terminate` then `clearIndexedDbPersistence`
  and rejects on failure. The sign-out hook calls it after Auth sign-out and
  surfaces the error without redirecting.
- `firestore.rules` (deny by default; a user may read only `users/{uid}`; no
  client writes) wired through `firebase.json`, with emulator tests in
  `tests/rules/` (`pnpm run test:rules`, also run in CI).
- Unit tests (`tests/unit/firebase-firestore.test.ts` and the sign-out cases)
  and `tests/e2e/firestore-cache.spec.ts` (sign-out leaves no `firestore/`
  IndexedDB database in Chromium).
- Build-script policy: `allowBuilds` is `false` for `protobufjs` and
  `@firebase/util`; their install scripts are inert here.
- The JS size budget was raised to 600 kB for the Firestore SDK.

Still pending (needs a feature that reads Firestore from the browser):

- `onSnapshot` listeners and optimistic writes for application data.
- Browser tests of IndexedDB persistence across reloads and multi-tab
  behavior. Observed in Chromium with Firebase 12.19.0: `clearIndexedDbPersistence`
  did not reject while a second tab was open, contrary to the failure scenario
  the Decision anticipates; the error path stays implemented and unit tested.
- Study-domain collections and indexes beyond owner-scoped Spaces (ADR 0010)
  and root Object Types (partially implemented in ADR 0011). Object Type
  inheritance and a runtime write path for non-null `parentTypeId` remain
  pending.

The `Decision` and `Consequences` below remain the target architecture for the
pending items.

## Context

The application requires an offline-capable, zero-latency data persistence layer that seamlessly synchronizes with cloud storage when online, eliminating dual-store complexity.

Key requirements and challenges of alternative approaches include:
1. **Schema and Logic Duplication**: Separate local and remote stores require maintaining custom synchronization protocols and transformation logic.
2. **Conflict Resolution and Offline Queueing**: Manually reconciling offline writes with remote state is error-prone and adds high maintenance overhead.
3. **Multi-Tab Coordination**: Synchronizing IndexedDB writes across multiple browser tabs without race conditions requires complex manual locking.
4. **Unified Identity and Testing**: Seamless integration with the Firebase Auth identity model, Firebase UI auth stack, and local emulator suite for hermetic testing.
5. **Dependency Build-Script Governance**: `firebase` pulls in `protobufjs` and `@firebase/util`, whose install scripts are gated by `allowBuilds` in `pnpm-workspace.yaml`. See the Decision section for what those scripts actually do.

## Decision

We adopt native Firebase Firestore (`firebase/firestore` via `firebase` 12.19.0) with persistent local cache as the foundational data persistence layer for the application.

Key architectural rules and structure:
- **Persistent Local Cache Configuration**: In browser environments (`typeof window !== "undefined"`), initialize Firestore via `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`. This stores the cache in IndexedDB for durable offline data and lets the SDK coordinate which tab owns the network connection, so the app does not implement its own cross-tab locking.
- **Dependency Build-Script Policy**: `pnpm-workspace.yaml` currently sets `allowBuilds` to `true` for `protobufjs` (7.6.6) and `@firebase/util` (1.15.3) to clear `ERR_PNPM_IGNORED_BUILDS`. Neither script compiles native code or is needed for the IndexedDB cache: the `protobufjs` `postinstall` only checks the dependent's version scheme (verified in the installed 7.6.6), and the `@firebase/util` `postinstall` only generates default-config files from `FIREBASE_WEBAPP_CONFIG` for App Hosting (verified against `main` in the firebase-js-sdk repository; the installed 1.15.3 copy was not readable). In the browser, Firestore does not use `protobufjs` for its cache; it is a transitive dependency of the gRPC path used on Node. Whether these entries must stay `true` (or can be `false`) is an open supply-chain decision that needs human approval before `pnpm-workspace.yaml` changes.
- **Resilient Initialization and SSR Fallback**: Persistent IndexedDB cache is browser-only, and the Firestore docs list support only for Chrome, Safari and Firefox. On the server (Server Component / SSR) use the default in-memory cache (`getFirestore(app)` or `initializeFirestore(app, { localCache: memoryLocalCache() })`). In the browser, wrap persistent initialization in `try/catch` and fall back to `memoryLocalCache()`. Two caveats must be covered by tests rather than assumed:
  - The SDK can log "Falling back to memory cache" and continue without throwing (reported in firebase-js-sdk issues), so a `catch` alone does not prove persistence is active.
  - `initializeFirestore` can be called only once per app with a given configuration; after a failed or repeated call, `getFirestore(app)` returns whatever instance already exists. Guard initialization so Fast Refresh and the fallback path never create conflicting instances.
- **Local Emulator Integration**: Connect to the Firestore emulator (`127.0.0.1:8080`) with `connectFirestoreEmulator` only in local development and test runs, gated by an explicit environment flag so production builds never connect to it. Run it alongside the Auth emulator (`127.0.0.1:9099`) for deterministic offline and multi-client testing.
- **Unified Firebase SDK**: Use the native Firestore client as the single data persistence layer with snapshot listeners (`onSnapshot`) and optimistic writes, so the UI reacts to local state immediately (latency compensation) while the SDK syncs with the backend in the background.
- **Single Source of Truth Export**: All browser Firestore access goes through
  `getDb()` in `src/lib/firebase/firestore.ts`. Initialization and emulator
  connection must be idempotent so Next.js Fast Refresh does not re-initialize
  Firestore or reconnect the emulator.
- **Cache Lifecycle and Privacy**: The persistent cache is not cleared between sessions, and the Firestore docs advise against persistence when cached data is sensitive to disclosure between users on the same device. Notes are user data, so the cache must not outlive the signed-in user: on sign-out, call `terminate(db)` and then `clearIndexedDbPersistence(db)` before the next user can sign in. `clearIndexedDbPersistence` requires a terminated instance and can fail while other tabs are open, so the sign-out flow must handle that failure explicitly (for example by surfacing it and blocking the next sign-in on the same instance). The exact UX is to be validated at implementation.
- **Cache Size**: Keep the SDK default cache threshold (older unused documents are garbage-collected periodically). Do not use `CACHE_SIZE_UNLIMITED` unless a later ADR justifies it. Set `cacheSizeBytes` explicitly only if measurements require it.
- **Canonical Persisted Identifiers**: Data structures maintain canonical English identifiers for database keys and system attributes.
- **Architectural Alignment**: Aligns with system context in [`ARCHITECTURE.md`](../../ARCHITECTURE.md), authentication in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), locale synchronization in [ADR 0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md), and end-to-end testing in [`TESTING.md`](../../TESTING.md).

## Consequences

### Positive Outcomes (targets once implemented)

- **Local-First Reads and Writes**: Snapshot listeners and writes act on the local cache immediately, and the SDK syncs with the backend in the background. Promises from writes still resolve only after backend acknowledgment, so UI code must rely on listeners and latency compensation, not on awaiting writes.
- **Simplified Stack**: Single SDK and API surface eliminate duplicate validation and manual synchronization layers.
- **Build Policy Compliance**: `allowBuilds` entries keep installs free of `ERR_PNPM_IGNORED_BUILDS` (see the open build-script question above).
- **Built-In Multi-Tab Sync**: `persistentMultipleTabManager` shares the local cache and coordinates listeners across open tabs.
- **Hermetic Local Testing**: The Firestore emulator is already configured in `firebase.json`, enabling local and CI tests once the npm scripts start it (see Trade-offs).
- **SSR and Restricted-Context Safety**: The in-memory fallback is intended to avoid crashes in Node.js and restricted browser contexts; this must be proven by tests in both environments.

### Trade-offs and Considerations

- Requires careful query design matching Firestore indexing and compound query capabilities.
- Local integration tests require the Firestore emulator running alongside the Auth emulator (refer to [`TESTING.md`](../../TESTING.md)). The `emulator`, `emulators:seed` and `test:e2e` scripts in `package.json` already start `--only auth,firestore` (added for ADR 0007 locale-profile tests).
- Persistence is unavailable in unsupported browsers and some restricted contexts; those clients run with an in-memory cache and lose offline durability.
- Multi-tab persistence has a known open issue where hidden tabs can re-run queries with a stale resume token after the primary tab changes, increasing billed reads ([firebase-js-sdk #10410](https://github.com/firebase/firebase-js-sdk/issues/10410); not re-checked against 12.19.0). `memoryLocalCache()` is the fallback if this proves material.
- Multi-tab persistence relies on `localStorage` and is not supported inside Web Workers.
- Sign-out must clear the persistent cache (see Cache Lifecycle and Privacy), which adds a failure path to the sign-out flow.

## References

- [Access data offline (Firebase docs)](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Multi-Tab Offline Support in Cloud Firestore (Firebase Blog)](https://firebase.blog/posts/2018/09/multi-tab-offline-support-in-cloud/)
