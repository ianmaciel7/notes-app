## 1. Domain and Storage

- [x] 1.1 Add failing tests for active/trashed/purged transitions, idempotency, retention dates, invalid commands, and snapshot migration.
- [x] 1.2 Implement Trash records and Space-scoped repository commands.
- [x] 1.3 Add database indexes and resumable bounded automatic cleanup.

## 2. Projection Integration

- [x] 2.1 Add failing tests proving trashed entities are excluded from search, queries, graph, backlinks, dashboards, calendar, tasks, and integrations.
- [x] 2.2 Implement shared active-entity selectors instead of scattered deletion checks.
- [x] 2.3 Preserve recoverable missing-reference states until restore or purge.

## 3. Media and Sync

- [x] 3.1 Add tests proving media bytes remain while a trashed owner is recoverable.
- [x] 3.2 Create permanent tombstones and enable garbage collection only on purge.
- [x] 3.3 Verify offline trash/restore/purge commands synchronize idempotently.

## 4. UI

- [ ] 4.1 Add the Trash route/list, individual restore/delete, Empty Trash, retention copy, confirmations, loading, empty, error, and unavailable states.
- [ ] 4.2 Verify keyboard, focus recovery, accessibility, responsive behavior, localization, and reduced motion.

## 5. Acceptance

- [ ] 5.1 Run domain, database, sync, media, projection, browser, migration, and retention-boundary tests.
- [ ] 5.2 Run repository verification and `openspec validate add-trash-lifecycle --strict`.
