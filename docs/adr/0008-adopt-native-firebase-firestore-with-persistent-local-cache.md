# ADR 0008: Adopt Native Firebase Firestore with Persistent Local Cache

## Status

Accepted (not yet implemented on `dev`)

## Date

2026-09-29

## Current State (2026-10-06)

The decision is accepted, but only its groundwork exists on `dev`: `firebase`
12.19.0 is installed, `allowBuilds` covers `protobufjs` and `@firebase/util`, and
`firebase.json` configures the Firestore emulator (`127.0.0.1:8080`). Not yet
implemented: `src/lib/firebase/firestore.ts` (the `src/lib/firebase/`
directory does not exist yet), the persistent local cache initialization, and
the emulator connection logic. Treat the structure below as the target design.

## Context

The application requires an offline-capable, zero-latency data persistence layer that seamlessly synchronizes with cloud storage when online, eliminating dual-store complexity.

Key requirements and challenges of alternative approaches include:
1. **Schema and Logic Duplication**: Separate local and remote stores require maintaining custom synchronization protocols and transformation logic.
2. **Conflict Resolution and Offline Queueing**: Manually reconciling offline writes with remote state is error-prone and adds high maintenance overhead.
3. **Multi-Tab Coordination**: Synchronizing IndexedDB writes across multiple browser tabs without race conditions requires complex manual locking.
4. **Unified Identity and Testing**: Seamless integration with the Firebase Auth identity model, Firebase UI auth stack, and local emulator suite for hermetic testing.
5. **Binary Serialization Governance**: Firestore's internal engine requires `protobufjs` build script execution for high-throughput protocol buffer serialization in local IndexedDB caches.

## Decision

We adopt native Firebase Firestore (`firebase/firestore` via `firebase` 12.19.0) with persistent local cache as the foundational data persistence layer for the application.

Key architectural rules and structure:
- **Persistent Local Cache Configuration**: In browser environments (`typeof window !== "undefined"`), initialize Firestore via `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`. This leverages IndexedDB for durable offline storage and manages multi-tab state transitions without locking conflicts.
- **Engine Build Script Authorization**: In accordance with project supply-chain governance in `pnpm-workspace.yaml`, package build scripts for `protobufjs` (7.6.6) and `@firebase/util` (1.15.3) are approved via `pnpm approve-builds`. This unblocks native protobuf compilation required by Firestore's serialization pipeline and IndexedDB caching engine.
- **Resilient Initialization and SSR Fallback**: In server-side rendering (SSR) / Server Component contexts or environments where IndexedDB is restricted (e.g. private browsing or strict storage partitioning), fall back gracefully to `getFirestore(app)` or `initializeFirestore(app, { localCache: memoryLocalCache() })`.
- **Local Emulator Integration**: Configure transparent connection to the Firebase Firestore emulator (`127.0.0.1:8080`) during local development and testing, supporting deterministic offline and multi-client testing in coordination with the Auth emulator (`127.0.0.1:9099`).
- **Unified Firebase SDK**: Use the native Firestore client as the single data persistence layer with snapshot listeners (`onSnapshot`) and optimistic writes, achieving zero-latency local interactions backed by native IndexedDB persistence.
- **Single Source of Truth Export**: All Firestore database interactions must route through the single-source-of-truth export `db` in `src/lib/firebase/firestore.ts`. Emulator connection logic must remain idempotent and safe against Next.js Fast Refresh restarts.
- **Canonical Persisted Identifiers**: Data structures maintain canonical English identifiers for database keys and system attributes.
- **Architectural Alignment**: Aligns with system context in [`ARCHITECTURE.md`](../../ARCHITECTURE.md), authentication in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), locale synchronization in [ADR 0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md), and end-to-end testing in [`TESTING.md`](../../TESTING.md).

## Consequences

### Positive Outcomes

- **Zero-Latency Offline First**: Read and write operations immediately resolve against the local IndexedDB cache with background cloud synchronization.
- **Simplified Stack**: Single SDK and API surface eliminate duplicate validation and manual synchronization layers.
- **Build Policy Compliance**: Resolves `ERR_PNPM_IGNORED_BUILDS` in `pnpm-workspace.yaml`, ensuring reliable build and installation of Firestore's `protobufjs` engine.
- **Built-In Multi-Tab Sync**: `persistentMultipleTabManager` synchronizes mutations across concurrent open tabs automatically.
- **Seamless Local Testing**: Full integration with the Firebase Firestore emulator enables hermetic local development and CI testing.
- **SSR and Universal Safety**: Graceful fallback ensures no crashes in Node.js server environments or restricted browser contexts.

### Trade-offs and Considerations

- Requires careful query design matching Firestore indexing and compound query capabilities.
- Local integration tests require the Firestore emulator running alongside the Auth emulator (refer to [`TESTING.md`](../../TESTING.md)).
