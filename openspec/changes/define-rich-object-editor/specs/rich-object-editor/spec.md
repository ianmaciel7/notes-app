## ADDED Requirements

### Requirement: Persisted Rich Block Editor
The object page SHALL support schema-valid headings, paragraphs, lists, emphasis, links, code blocks, attachments, and additional approved block types with history and deterministic serialization.

#### Scenario: User edits body content
- **WHEN** blocks are inserted, reordered, changed, undone, or redone
- **THEN** the editor preserves a valid document, updates optimistically, and persists the resulting revision

#### Scenario: User scans document blocks
- **WHEN** the object body is rendered
- **THEN** headings, lists, code blocks, attachments, and other supported blocks appear as modular content units with light visual structure and deterministic serialized output

### Requirement: Editable Object Metadata
Users SHALL be able to change the object emoji/icon, type where valid, collections, title, aliases, description, tags, and custom properties from the object page.

#### Scenario: User changes metadata
- **WHEN** a valid property value is committed
- **THEN** all dependent lists, search records, calendar placements, and relationship labels update consistently

#### Scenario: User edits structured metadata
- **WHEN** a typed object exposes properties such as Autor for Livro
- **THEN** metadata appears in a distinct structured area near the object header or contextual panel and remains visually separate from freeform body blocks

### Requirement: Keyboard and Document Navigation
The editor SHALL provide documented keyboard commands, slash insertion, visible focus, block navigation, and an outline that navigates to headings.

#### Scenario: Keyboard-only editing
- **WHEN** a user edits and navigates without a pointer
- **THEN** every editing, formatting, property, outline, and save/error action remains operable and announced

#### Scenario: User navigates with outline
- **WHEN** an object contains headings
- **THEN** an outline surface provides quick navigation to document sections without replacing the editable content

### Requirement: Object Presentation Mode
The object page SHALL provide a presentation mode for supported objects that prioritizes readable document content while preserving a safe exit path and object context.

#### Scenario: User presents an object
- **WHEN** the user activates Present or an equivalent presentation action
- **THEN** the object opens in a presentation-oriented view with non-document chrome minimized, a labelled exit control, preserved document position where applicable, and no mutation to the object content unless the user explicitly edits it
