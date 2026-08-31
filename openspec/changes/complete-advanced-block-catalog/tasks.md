## 1. Schema and Migration

- [x] 1.1 Add failing schema tests for every advanced node/interface, invalid attributes, depth limits, unknown nodes, and stable IDs.
- [x] 1.2 Implement schema version 3, pure v2-to-v3 migration, normalization, serialization, and safe unsupported-node handling.
- [x] 1.3 Add Markdown/native export tests with explicit lossiness for layouts and transclusion.

## 2. Text, Highlight, Code, and Math

- [ ] 2.1 Implement toggle and emoji text interfaces with keyboard, selection, read-only, and persistence tests.
- [x] 2.2 Implement highlight blocks with source metadata and safe import/render behavior.
- [ ] 2.3 Implement language-aware code blocks, copy/download actions, Mermaid rendering, and invalid-diagram fallback.
- [ ] 2.4 Implement TeX math blocks and inline math with source-preserving error states.

## 3. Layout and Group Blocks

- [ ] 3.1 Implement group/ungroup transactions preserving child IDs, order, selection, and undo/redo.
- [ ] 3.2 Implement multi-column/grid layout creation, reorder, resize policy, responsive linearization, and accessible reading order.
- [ ] 3.3 Add width and appearance controls through shared editor primitives.

## 4. Object Blocks

- [ ] 4.1 Complete inline, small-card, wide-card, embed/transclusion, and supported media display variants.
- [ ] 4.2 Add recursion, missing-target, permission, offline, and read-only fallbacks.
- [x] 4.3 Integrate advanced blocks into slash/plus catalogs and block menus without duplicate commands.

## 5. Acceptance

- [ ] 5.1 Run contract, migration, unit, browser, accessibility, keyboard, drag, responsive, reduced-motion, export, security, performance, and persistence checks.
- [ ] 5.2 Run repository verification and `openspec validate complete-advanced-block-catalog --strict`.
