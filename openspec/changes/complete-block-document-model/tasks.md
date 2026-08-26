## 0. Evidence and dependency gate

- [x] 0.1 Finish/stabilize `add-block-editor` before apply.
- [x] 0.2 Re-confirm project reference files and Blocks/Markdown documentation.

## 1. Schema and migration

- [x] 1.1 Define BlockId, referenceable node classes, schema versioning, validation, and id generation with failing-first tests.
- [x] 1.2 Migrate existing documents and reject/normalize duplicate ids deterministically.

## 2. Editor invariants

- [x] 2.1 Preserve ids through edits, undo/redo, conversion, reorder, split/merge, and read-only rendering.
- [x] 2.2 Allocate fresh ids for insertion, duplication, import, and external paste.

## 3. Acceptance

- [x] 3.1 Browser-test id stability across edit/reorder/duplicate/reload/mobile/read-only flows.
- [x] 3.2 Run editor tests, `pnpm verify`, build, parity regression, and strict OpenSpec validation.

## 4. Completion

- [x] 4.1 Sync canonical specs and archive only after evidence is complete.
