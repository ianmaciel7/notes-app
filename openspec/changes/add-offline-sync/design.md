## Context

The public Capacities sources specify observable offline/sync behavior but not its private protocol, merge algorithm, or backend. Primary references: `https://docs.capacities.io/misc/offline-support`, `https://docs.capacities.io/misc/sync`, and `https://developers.capacities.io/api/overview/concurrency` (API concurrency is contextual evidence, not proof of internal sync behavior).

## Goals / Non-Goals

**Goals:** offline durable writes, incremental push/pull, idempotent retry, tombstones, explicit conflicts, separate media availability, visible sync status.

**Non-Goals:** Capacities protocol compatibility, CRDT/OT claims, or collaborative real-time editing.

## Decisions

- Each committed local synchronized mutation emits an idempotent WorkspaceOperation in the same transaction.
- Pull uses a server-issued monotonic cursor/sequence and advances it only after transactional batch apply.
- Unsafe concurrent changes preserve both candidates and enter an explicit conflict state; no candidate is silently discarded before resolution.
- Media metadata sync and binary local/remote availability are separate state machines.

## Risks / Trade-offs

- Retries require server/client idempotency to prevent duplicate effects.
- Block-document conflicts are initially aggregate-level; both versions must remain recoverable.
- Backend technology is not specified by the sources and must remain behind protocol/service contracts.

## Migration Plan

1. Add outbox/operation/cursor/tombstone/conflict/media-sync records to local DB.
2. Specify a remote sync contract and fake-server conformance suite first.
3. Emit operations transactionally and implement push/pull/retry/reconnect.
4. Add conflict preservation/resolution and media upload/download state.
5. Add sync UI/diagnostics and two-client fault simulations.

## Open Questions

Concrete hosted backend/deployment remains an implementation decision after protocol tests.
