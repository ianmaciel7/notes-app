## Context

A table block is structured note content, not a Data View and not initially a full Table Object. It requires stable internal identity so row/column operations, formulas, references, undo/redo, and conversion can be deterministic.

## Domain Model

`TableBlock` contains stable table ID, ordered columns, ordered rows, cells keyed by row/column IDs, header row/column flags, column widths, row heights if supported, selection-independent styles, and version.

Cell content supports a bounded rich-text document subset: text, marks, external links, object links, line breaks, and numeric literal/formula result integration. Bullet lists, images, merged cells, and arbitrary nested blocks are out of scope unless separately specified.

## Operations

Pure commands validate and apply insert/delete/move/resize, header toggles, clear, style, alignment, sort, and cell updates. Selection is editor presentation state using anchor/focus cell IDs. Every operation is undoable and preserves unaffected IDs.

A new table defaults to 2 columns and 3 rows.

## Clipboard and Export

A standard Markdown table pasted into an eligible empty context becomes a Table Block after preview/validation. Plain tabular paste may fill a compatible selection. CSV export follows RFC-style escaping, preserves displayed cell text, and reports lossiness for rich marks/references. Native export preserves the full table model.

## Conversion

“Turn into object” creates one canonical Table Object and moves or references the existing table content according to an explicit conversion transaction. The source block becomes an object block/reference only after object creation succeeds. Failure leaves the block intact.

## UI

Keyboard arrows navigate cells; Enter enters editing; Shift+arrows extends selection; platform commands insert/delete/move rows/columns as registered. Pointer drag supports row/column reorder and bounded resize. Header and styling controls use shared action panels. Read-only rendering is semantic and responsive.

## Security and Performance

Dimensions, text size, paste payload, operation complexity, and recursion are bounded. Sorting is stable. Large-table edits update only affected cells/projections and do not serialize the whole workspace per keystroke.

## Testing

Tests cover identities, operations, bounds, selection, keyboard, drag, Markdown/CSV, conversion rollback, references, styling, sorting, undo/redo, migration, accessibility, responsive behavior, and performance.
