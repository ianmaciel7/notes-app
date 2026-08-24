## Context

Public Capacities sources specify observable offline-first behavior but not the private sync protocol, merge algorithm, or backend. Notes are available locally and edits can be made without network once data is local, while some network-dependent capabilities are not parity requirements for offline execution. API concurrency is contextual evidence only, not proof of internal sync behavior.

## Goals / Non-Goals

**Goals:** offline durable writes, incremental push/pull, idempotent retry, tombstones, explicit conflicts, separate media availability, visible sync status, and an explicit capability matrix for offline-supported vs network-required features.

**Non-Goals:** Capacities protocol compatibility, CRDT/OT claims, collaborative real-time editing, or pretending every online service works offline.

## Decisions

- Each committed local synchronized mutation emits an idempotent WorkspaceOperation in the same transaction.
- Pull uses a server-issued cursor/sequence and advances only after transactional apply.
- Unsafe concurrent changes preserve both candidates and enter explicit conflict state.
- Media metadata sync and binary local/remote availability are separate state machines.
- Offline capability is declared per subsystem. Core locally available object/property/block editing, navigation, and local query/index capabilities may operate offline when their data/indexes are local; network-dependent AI, remote integrations, server-only search/enrichment, remote media not downloaded, or other explicitly online services expose an unavailable/degraded state instead of fake local success.
- The implementation SHALL document where Notes App intentionally differs from Capacities if Notes App chooses to support an additional capability offline.

## Risks / Trade-offs

- Retries require end-to-end idempotency.
- Block-document conflicts initially preserve aggregate-level candidates.
- Online-only capability boundaries can drift -> one tested capability registry/contract.
- Backend technology remains behind service contracts.

## Migration Plan

1. Add outbox/operation/cursor/tombstone/conflict/media-sync records to local DB.
2. Define and test an offline capability matrix before wiring UI.
3. Specify a remote sync contract and fake-server conformance suite.
4. Implement transactional emit/push/pull/retry/reconnect/conflicts/media state.
5. Add sync/offline UI/diagnostics and two-client fault simulations.

## Open Questions

Concrete hosted backend/deployment remains an implementation decision after protocol tests.
