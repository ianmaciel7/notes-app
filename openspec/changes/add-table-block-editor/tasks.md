## 1. Table Domain

- [ ] 1.1 Add failing schema tests for stable table/row/column/cell IDs, dimensions, headers, widths, styles, supported cell content, and bounds.
- [ ] 1.2 Implement the neutral Table Block model, normalization, serialization, and block-document migration.
- [ ] 1.3 Add pure command tests and implementation for insert/delete/move/resize/header/clear/style/align/sort/update.

## 2. Editor Interaction

- [ ] 2.1 Implement 2×3 creation through slash/plus/block menus.
- [ ] 2.2 Add keyboard navigation, editing, range selection, row/column shortcuts, focus, and undo/redo.
- [ ] 2.3 Add pointer reorder/resize, action-panel styling, header controls, and responsive/read-only renderers.
- [ ] 2.4 Integrate text marks and canonical object-link suggestions in supported cells.

## 3. Import, Export, and Conversion

- [ ] 3.1 Add Markdown-table paste parsing with preview, limits, and fallback.
- [ ] 3.2 Add CSV export with escaping and explicit rich-content lossiness.
- [ ] 3.3 Implement atomic Table Block to Table Object conversion with rollback tests.
- [ ] 3.4 Preserve full fidelity in native import/export.

## 4. Acceptance

- [ ] 4.1 Run domain, editor, clipboard, conversion, export, accessibility, keyboard, drag, responsive, migration, security, and performance tests.
- [ ] 4.2 Run repository verification and `openspec validate add-table-block-editor --strict`.
