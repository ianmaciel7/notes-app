# ADR 0010: Adopt Owner-Scoped Spaces in Firestore

## Status

Accepted

## Implementation

Implemented for the Firebase layer. `DER.md` documents the Space model and ADR 0008 points to this ADR.

## Date

2026-10-09

## Current State (2026-10-09)

Delivered: the Space rules in `firestore.rules` (`tests/rules/spaces.rules.test.ts`),
`src/lib/firebase/spaces.ts` with emulator-backed tests
(`tests/rules/spaces-client.test.ts`, `tests/rules/spaces-offline.test.ts`) and
unit tests for document parsing (`tests/unit/firebase-spaces.test.ts`). The
Space ID was changed from the Firestore automatic ID to a UUID v4 on the same
day, before any data existed, so no migration is needed.
`getDb()` is exported for data modules in `src/lib/firebase/`. No UI, route or
component consumes the module: that is out of scope for this ADR.

## Context

A Space (see [`GLOSSARY.md`](../../GLOSSARY.md)) is the first application data
stored in Firestore. [ADR 0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md)
left "study-domain collections" unchosen and `DER.md` told implementers not to
fix collection paths early. Spaces are concrete enough now to settle the path,
the rules and the client contract. This ADR resolves that pending item for
Spaces only; other study entities remain undecided.

## Decision

**Path and identity.** Spaces live at `/users/{uid}/spaces/{spaceId}`. The
client generates `spaceId` as a UUID v4 (`crypto.randomUUID()`), which works
offline and is a standard format outside Firestore. The Firestore automatic ID
was considered and rejected for that reason. The rules require `spaceId` to be
a lowercase UUID v4, `id == spaceId` and `ownerId == uid` from the path, and
`request.auth.uid == uid`. Random UUIDs do not concentrate writes the way
sequential IDs would. Ownership is path-based; there is no `roles`,
`members` or `permissions` field.

**Document.** `id`, `ownerId`, `name` (1-80), `description` (optional, at most
500; cleared by removing the field), `icon` (1-40, `^[a-z0-9-]+$`),
`stateVersion` (integer, starts at 1), `createdAt`, `updatedAt`. The schema is
closed on create (`keys().hasOnly`). Types are validated by one helper used by
both `create` and `update`. Because `description` may be absent, the helper
reads it with `data.get('description', default)`; reading a missing field
directly errors and denies the write.

**Rules.** Separate `get`, `list`, `create`, `update` and `delete` for the
exact path only; everything else stays denied. `users/{uid}` keeps
`write: false`. Update uses an allowlist
(`diff().affectedKeys().hasOnly(['name','description','icon','stateVersion','updatedAt'])`),
so `id`, `ownerId` and `createdAt` are immutable. `createdAt` and `updatedAt`
come from `serverTimestamp()` and are checked against `request.time`.
Ownership transfer is impossible by construction.

**Concurrency.** Update requires `stateVersion == resource.data.stateVersion + 1`.
The client uses plain `updateDoc` with the known version plus one, not
`runTransaction`, which fails offline. A rejected write is reported as a typed
conflict that carries the user's attempted changes, and the Space is re-read
from the server, so nothing is lost silently.

**Client.** One file, `src/lib/firebase/spaces.ts`: types, hand-written
document parsing (no schema library), `createSpace`, `getSpace`, `listSpaces`
(ordered by `createdAt`), `updateSpace`, `deleteSpace` and `subscribeToSpaces`
(`onSnapshot`). It uses the internal `getDb()`; `db` is not exported. Delete is
a hard delete with no per-user limit. Each subscriber owns its unsubscribe
function; `clearFirestoreCache()` calls `terminate`, which also stops the
listeners of that instance.

**Out of scope, deliberately not adopted.** Custom Claims, RBAC, sharing,
members and App Check. Path-based ownership is enough for personal Spaces; any
of these needs its own ADR. The Admin SDK bypasses the rules, so any future
server-side code touching Spaces must enforce ownership itself and use
least-privilege IAM.

## Consequences

- A permission denial from a stale `stateVersion` is indistinguishable from
  any other `permission-denied` in the SDK error. The client infers a conflict
  by re-reading the Space.
- With the persistent cache, a pending write survives a reload. If the server
  rejects it afterwards, its promise no longer exists. The conflict is then
  detected by the listener, whose snapshot reverts to server state and is
  compared with the attempted change. There is no custom sync queue.
  Offline write behavior beyond last-write-wins was not confirmed in the
  official docs and is covered by emulator tests instead of being assumed.
- `request.time` equality for `serverTimestamp()` is likewise verified by
  emulator tests. The official docs only show the same pattern in passing
  (`...last_updated == request.time` in the transactions page), not its
  semantics.
- Sign-out clears the cache with `terminate` followed by
  `clearIndexedDbPersistence`. `terminate` does not cancel pending writes, and
  clearing discards them, so unsynced Space changes are lost on sign-out. The
  cache is shared by tabs (`persistentMultipleTabManager`), so clearing rejects
  while another tab holds it and the caller must surface that failure instead
  of treating the user as signed out of the cache.
- A stale `stateVersion` can also come from another tab of the same user, not
  only from offline edits. The same conflict path handles both.
- Deleting a Space does not cascade. The ADR that introduces child data must
  define cascade behavior.

## Verification

- [x] Rules tests with `@firebase/rules-unit-testing`: signed-in owner, other
  user, unauthenticated, forged `ownerId` or `id`, unknown or invalid fields,
  immutable fields, allowed-field update, wrong `stateVersion`, delete own
  versus other, and a `spaceId` that is not a lowercase UUID v4 (non-UUID,
  uppercase and non-v4 UUIDs are rejected).
- [x] Emulator tests for CRUD, queries, `onSnapshot` and permission errors.
- [x] Offline create and stale offline update, in Node against the emulator.

Out of scope here (needs a UI consumer of `spaces.ts`, decided in a later ADR):
browser coverage of IndexedDB persistence across reloads, conflict handling
after a reload, account switch leaving no cached Spaces, and the failure path
when another tab holds the cache.

## References

- [Rules fields](https://firebase.google.com/docs/firestore/security/rules-fields)
- [Rules conditions](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Secure queries](https://firebase.google.com/docs/firestore/security/rules-query)
- [Offline data](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Best practices](https://firebase.google.com/docs/firestore/best-practices)
  (document ID guidance: avoid sequential IDs)
