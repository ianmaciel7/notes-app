# Offline Sync Protocol

This protocol is a clean-room Notes App contract. Capacities public evidence
only confirms offline-first behavior; its private sync protocol, conflict
algorithm, CRDT/OT choices, and backend details are `UNKNOWN`.

## Local Contract

- Every approved synchronized mutation commits locally first.
- The same IndexedDB transaction writes one idempotent operation per changed or
  deleted aggregate.
- Operations are scoped by Space and aggregate key. A sync client must never
  replace a whole workspace snapshot as a remote synchronization primitive.
- Pull cursors advance only after the client transactionally applies the remote
  changes that the cursor covers.

## Push

The client sends pending operations that are past their retry time. The server
deduplicates by `idempotencyKey`; duplicate retries return the existing accepted
change instead of creating another remote revision. Failed pushes remain in the
outbox with exponential backoff metadata.

## Pull

The server returns ordered remote changes after the last durable cursor. Changes
carry sequence, remote revision, aggregate key, base revision, payload, and a
delete flag. Deletes produce tombstones. A remote change whose base revision is
older than the local aggregate revision is preserved as a conflict instead of
overwriting local content.

## Media

Media metadata can synchronize separately from binary availability. A media item
can be locally available, remotely available, queued for upload/download,
syncing, missing, or unavailable while offline. Local notes remain usable when
remote media bytes have not been downloaded.

## Offline Capability Matrix

Core local content, block editing, task editing, navigation, and local indexes
are available for already-local data. Remote AI, remote integrations, server
search/enrichment, public API calls, and unavailable remote media expose an
offline/degraded state and must not report a successful remote action.
