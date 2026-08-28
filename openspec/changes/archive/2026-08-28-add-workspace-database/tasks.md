## 0. Evidence and dependency gate

- [x] 0.1 Complete import/export and media prerequisites; capture current snapshot version and rollback/export path.
- [x] 0.2 Re-confirm offline/storage reference sources and keep vendor database internals `UNKNOWN`.

## 1. Repository architecture

- [x] 1.1 Define record schemas, repository interfaces, transactions, revisions, migrations, integrity checks, and in-memory contract tests.
- [x] 1.2 Implement IndexedDB stores/indexes/transactions with quota/interruption tests.

## 2. Legacy migration

- [x] 2.1 Add journaled snapshot migration, equivalence verification, recovery marker/export fallback, and idempotent resume.
- [x] 2.2 Move hydration and mutation persistence to repositories without breaking public provider APIs.

## 3. Acceptance

- [x] 3.1 Stress-test large record sets and prove common edits avoid whole-workspace rewrites.
- [x] 3.2 Browser-test upgrade/reload/interruption/recovery and run `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [x] 4.1 Sync canonical specs and archive only after evidence is complete.
