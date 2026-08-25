## 0. Evidence and dependency gate

- [x] 0.0 Restore the missing platform type primitives required by the immutable domain model without changing existing string-id compatibility.
- [ ] 0.1 Complete or isolate typed-property values before apply.
- [ ] 0.2 Re-confirm tag/collection/Object Select documentation and project references.

## 1. Identity and relation domain

- [ ] 1.1 Add TagId, CollectionId, canonical records, relation helpers, validators, and reverse selectors.
- [ ] 1.2 Extend Object Select definitions with single/multiple cardinality, target Structures, optional fixed candidate sets, and optional paired inverse-property identity.
- [ ] 1.3 Add one atomic two-way relation command with recursion/duplication protection.
- [ ] 1.4 Add failing-first tests for rename, duplicate display names, collection scope, invalid targets/cardinality/fixed-set, inverse compatibility, and guarded deletion.

## 2. Migration and UI

- [ ] 2.1 Migrate legacy string tags/collections to ids with deterministic collision handling.
- [ ] 2.2 Move pickers, chips, counts, collection views, and relation controls to id-based selectors.
- [ ] 2.3 Keep derived backlinks visually/conceptually separate from paired relation properties.

## 3. Acceptance

- [ ] 3.1 Browser-test rename, memberships, single/multiple/fixed-set selection, two-way add/remove, reload, and deletion guardrails.
- [ ] 3.2 Run `pnpm verify`, relevant Playwright/parity suites, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
