## 0. Evidence and dependency gate

- [ ] 0.1 Complete typed properties, identities/relations, and linking prerequisites before apply.
- [ ] 0.2 Re-confirm query/search/group-by reference sources.

## 1. Query and search domain

- [ ] 1.1 Define QueryDefinition, typed operators, nested filters, sort/group/limit/result-kind/variables, validation, dependency extraction, and evaluator.
- [ ] 1.2 Add title/alias/full-text indexes with deterministic rebuild and incremental update paths.
- [ ] 1.3 Migrate current simple QueryEntity state where semantics are equivalent.

## 2. UI

- [ ] 2.1 Build generic query-builder and unified search/command-palette/object-block picker consumers.

## 3. Acceptance

- [ ] 3.1 Browser-test typed filters, nesting, sort/group, variable queries, reload, block search, keyboard/mobile access, invalid-schema states, and no duplication.
- [ ] 3.2 Run performance checks, `pnpm verify`, Playwright, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
