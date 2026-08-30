## ADDED Requirements

### Requirement: Advanced blocks use a versioned vendor-neutral schema

Toggle/emoji text interfaces, highlight blocks, code/Mermaid blocks, math blocks, column layouts, group blocks, and advanced object blocks SHALL be represented by validated Notes App-owned nodes and attributes without exposing Tiptap or renderer-library types.

#### Scenario: Version 2 document is opened
- **WHEN** a valid version 2 document is loaded
- **THEN** it SHALL migrate deterministically to the advanced schema while preserving block IDs, content, links, hierarchy, and order.

### Requirement: Layout transactions preserve child identity

Grouping, ungrouping, column creation, column movement, and responsive presentation SHALL preserve canonical child block IDs and logical reading order.

#### Scenario: Columns collapse on a narrow viewport
- **WHEN** a column layout cannot be displayed side by side
- **THEN** its children SHALL render in deterministic accessible order
- **AND** the canonical document structure SHALL not be rewritten merely because viewport size changed.

### Requirement: Advanced source blocks fail safely

Invalid Mermaid, TeX, highlight metadata, or object/embed targets SHALL preserve source data and expose a safe recoverable representation.

#### Scenario: Mermaid source is invalid
- **WHEN** diagram rendering fails
- **THEN** executable output SHALL not be inserted
- **AND** the original source SHALL remain editable or exportable with a localized error.
