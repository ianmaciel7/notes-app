## Why

Notes App has a built-in Table object lifecycle and table data-view presentation, but no editable Table Block inside the block document. Current documentation defines a 2×3 default table, row/column resize and reorder, headers, Markdown-table paste, keyboard cell navigation and selection, text/object links in cells, cell styling, sorting, conversion to Table Object, and CSV export.

## What Changes

- Add a vendor-neutral Table Block schema with stable row, column, and cell identities.
- Add creation, row/column insert/delete/reorder/resize, headers, selection, navigation, editing, styling, sorting, and clipboard import.
- Support text formatting and canonical object references inside cells within explicit scope limits.
- Add Table Block to Table Object conversion preserving identity through a conversion record.
- Add CSV export and native snapshot persistence.
- Defer formulas to `add-table-formulas` and reuse number formatting from `add-number-formatting`.

## Capabilities

### New Capabilities

- `domain/table-block`: Table block structure, operations, conversion, import/export, and validation.

### Modified Capabilities

- `ui/block-editor`: Add accessible table-block editing and rendering.

## Impact

- Block schema, editor extensions, commands, clipboard, export, Table object conversion, localization, tests, and migrations.
