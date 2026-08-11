## ADDED Requirements

### Requirement: Persisted Rich Block Editor
The object page SHALL support schema-valid headings, paragraphs, lists, emphasis, links, code blocks, attachments, and additional approved block types with history and deterministic serialization.

#### Scenario: User edits body content
- **WHEN** blocks are inserted, reordered, changed, undone, or redone
- **THEN** the editor preserves a valid document, updates optimistically, and persists the resulting revision

### Requirement: Editable Object Metadata
Users SHALL be able to change the object emoji/icon, type where valid, collections, title, aliases, description, tags, and custom properties from the object page.

#### Scenario: User changes metadata
- **WHEN** a valid property value is committed
- **THEN** all dependent lists, search records, calendar placements, and relationship labels update consistently

### Requirement: Keyboard and Document Navigation
The editor SHALL provide documented keyboard commands, slash insertion, visible focus, block navigation, and an outline that navigates to headings.

#### Scenario: Keyboard-only editing
- **WHEN** a user edits and navigates without a pointer
- **THEN** every editing, formatting, property, outline, and save/error action remains operable and announced

### Requirement: Object Presentation Mode
The object page SHALL provide a presentation mode for supported objects that prioritizes readable document content while preserving a safe exit path and object context.

#### Scenario: User presents an object
- **WHEN** the user activates Present or an equivalent presentation action
- **THEN** the object opens in a presentation-oriented view with non-document chrome minimized, a labelled exit control, preserved document position where applicable, and no mutation to the object content unless the user explicitly edits it
