## ADDED Requirements

### Requirement: Table Blocks have stable internal identity

A Table Block SHALL contain stable table, row, column, and cell identities plus validated dimensions, header configuration, presentation metadata, and bounded supported cell content.

#### Scenario: Row is moved
- **WHEN** a row is reordered
- **THEN** its row ID and cell identities SHALL remain stable
- **AND** only ordered presentation SHALL change.

### Requirement: Table operations are pure and undoable

Insert, delete, move, resize, header, clear, style, alignment, sort, and cell-edit commands SHALL validate before applying one reversible document transaction.

#### Scenario: Invalid delete would remove the final required dimension
- **WHEN** an operation violates minimum table dimensions
- **THEN** it SHALL fail without partially changing the document.

### Requirement: Table import and export are explicit

Standard Markdown tables MAY be converted into Table Blocks, CSV export SHALL escape values safely, and native export SHALL preserve the full table model.

#### Scenario: Rich cell exports to CSV
- **WHEN** a cell contains marks or object references
- **THEN** CSV SHALL export its defined display text
- **AND** the export result SHALL record the lost rich semantics.

### Requirement: Table Block conversion is atomic

Turning a Table Block into a Table Object SHALL create one canonical object and replace the block only after successful creation.

#### Scenario: Object creation fails
- **WHEN** conversion cannot create or persist the Table Object
- **THEN** the original Table Block SHALL remain unchanged.
