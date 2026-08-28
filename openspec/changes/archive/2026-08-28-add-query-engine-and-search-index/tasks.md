## 0. Evidence and dependency gate

- [x] 0.1 Complete typed properties, identities/relations, and linking prerequisites before apply.
- [x] 0.2 Re-confirm query/search/group-by references and documented query families.

## 1. Query and search domain

- [x] 1.1 Define QueryDefinition source/kinds, typed operators, nested filters, backlink/relation operands, sort/group/limit/result-kind/variables/result-selection mode, validation, dependency extraction, and evaluator.
- [x] 1.2 Add deterministic randomized-selection fixtures/seed policy.
- [x] 1.3 Add title/alias/full-text indexes with deterministic rebuild and incremental update paths.
- [x] 1.4 Migrate current simple QueryEntity state where semantics are equivalent.

## 2. UI

- [x] 2.1 Build generic query-builder and unified search/command-palette/object-block picker consumers.

## 3. Acceptance

- [x] 3.1 Browser-test query families, typed filters, backlink/relation filters, nesting, sort/group/limit, randomized mode, variable queries, reload, block search, invalid-schema states, and no duplication.
- [x] 3.2 Run performance checks, `pnpm verify`, Playwright, build, and strict OpenSpec validation.

## 4. Completion

- [x] 4.1 Sync canonical specs and archive only after evidence is complete.
