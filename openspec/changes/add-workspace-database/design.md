## Context

Capacities is documented as offline-first and uses internal application storage rather than a user-editable Markdown folder; its private database technology is not public. Primary references: `https://docs.capacities.io/misc/offline-support` and `https://docs.capacities.io/misc/sync`.

Notes App will use a clean repository abstraction and browser-appropriate transactional database, not infer the vendor's storage engine.

## Goals / Non-Goals

**Goals:** incremental durable writes, transactions, indexed record stores, revisions, integrity audit, crash-safe legacy migration.

**Non-Goals:** remote sync, user accounts, collaboration, or Capacities storage compatibility.

## Decisions

- Domain services depend on repository interfaces, never IndexedDB directly; tests use an in-memory adapter.
- Durable aggregate boundaries are normalized into indexed stores keyed by stable ids.
- Legacy snapshot migration is journaled/idempotent: validate → write records transactionally → verify → mark database authoritative.
- Local revision metadata is introduced now for safe transactions and later sync but is Notes App-specific.

## Risks / Trade-offs

- Interrupted browser migration requires resume/restart without duplication.
- Index drift requires deterministic audit/rebuild tooling.
- Storage quota errors must preserve the previous committed state.

## Migration Plan

1. Define repository/transaction/revision/schema contracts and in-memory tests.
2. Implement IndexedDB adapter and indexed lookups.
3. Add snapshot-to-database migration journal, equivalence verification, and recovery/export path.
4. Move hydration and common writes to incremental repositories.
5. Retire whole-snapshot writes only after compatibility evidence passes.

## Open Questions

None for planning.
