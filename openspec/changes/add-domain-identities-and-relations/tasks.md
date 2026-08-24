## 0. Evidence and dependency gate

- [ ] 0.1 Complete or isolate `add-typed-property-values` before apply.
- [ ] 0.2 Re-confirm project reference files and tag/collection/property documentation.

## 1. Identity domain

- [ ] 1.1 Add TagId, CollectionId, canonical records, relation helpers, validators, and reverse selectors.
- [ ] 1.2 Add failing-first tests for rename, duplicate display names, invalid targets, and guarded deletion.

## 2. Migration and UI

- [ ] 2.1 Migrate legacy string tags/collections to ids with deterministic collision handling.
- [ ] 2.2 Move pickers, chips, counts, collection views, and relation controls to id-based selectors.

## 3. Acceptance

- [ ] 3.1 Browser-test rename, membership, relations, reload, and deletion guardrails.
- [ ] 3.2 Run `pnpm verify`, relevant Playwright/parity suites, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
