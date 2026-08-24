## Why

Capacities is documented as offline-first: local notes remain editable offline and synchronize later, media availability is separate, and conflicts can require explicit resolution. Notes App needs its own incremental clean-room sync protocol over the normalized database rather than synchronizing whole snapshots.

## What Changes

- Add a per-Space idempotent operation/outbox log and remote change cursor for incremental push/pull.
- Add remote revisions, tombstones, retries/backoff, media sync states, and explicit conflict preservation/resolution.
- Add sync status/diagnostics UI for offline, pending, syncing, synced, error, conflict, and media availability states.

## Capabilities

### New Capabilities

- `domain/offline-sync`: Offline durable mutations, incremental synchronization, conflict resolution, media availability, and sync status.

### Modified Capabilities

- None.

## Impact

- Priority: **P9**.
- Depends on workspace database and account/Space isolation.
- Does not claim protocol compatibility with Capacities and does not add multi-user real-time collaboration.
