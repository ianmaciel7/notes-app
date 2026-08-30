## ADDED Requirements

### Requirement: Editor provides complete bounded Table Block interaction

The editor SHALL create a 2-column by 3-row table and support accessible cell navigation/editing, range selection, row/column insert/delete/move/resize, headers, formatting, stable sorting, and shared object-link suggestions.

#### Scenario: User extends a cell selection
- **WHEN** the user holds Shift and navigates with arrow keys
- **THEN** the visible and programmatic table selection SHALL expand from its anchor
- **AND** formatting or clearing SHALL affect the selected cells in one transaction.

### Requirement: Table controls preserve document and focus safety

Pointer and keyboard table controls SHALL use stable IDs, visible focus, reversible transactions, responsive containment, and semantic read-only rendering.

#### Scenario: User exits cell editing
- **WHEN** navigation moves from editing to another cell or outside the table
- **THEN** accepted cell content SHALL commit once
- **AND** focus SHALL move to the intended stable target.
