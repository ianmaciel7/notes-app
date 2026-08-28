## ADDED Requirements

### Requirement: Runtime Structure-backed object creation
The object lifecycle SHALL derive creatable types, labels, icons, tones, lifecycle behavior, counts, and custom-type projections from the canonical runtime Structure registry.

#### Scenario: Creation palette renders built-in and custom Structures
- **WHEN** the user opens `Novo`
- **THEN** the palette SHALL list eligible built-in and runtime custom Structures from canonical state
- **AND** reserved Structures and suggested presets that have not been instantiated SHALL NOT appear as fixed creatable domain ids.

#### Scenario: Custom Structure object is created and reopened
- **WHEN** the user creates an object for a runtime custom Structure, writes content, navigates away, and reloads the workspace
- **THEN** the sidebar, tab, editor, object-type listing, count, and persisted object SHALL resolve the same Structure id and current Structure metadata
- **AND** creation, selection, editing, and reload SHALL NOT create a duplicate Structure or object.

#### Scenario: Preset is added through the object-type studio
- **WHEN** the user confirms Book, Person, Meeting, Project, or another suggested preset in the studio
- **THEN** the studio SHALL create a custom Structure first and then expose that Structure to creation and projections
- **AND** it SHALL NOT append a visual-only sidebar row or promote the preset id into a built-in registry.

### Requirement: Runtime Structure projection consistency
All object-type UI projections SHALL consume the same canonical Structure record while object counts remain derived from canonical objects.

#### Scenario: Structure is renamed
- **WHEN** a runtime custom Structure is renamed
- **THEN** its sidebar row, studio details, creation option, active tab type label, editor chip, and listing heading SHALL display the new name
- **AND** existing object records and counts SHALL remain unchanged.

#### Scenario: Structure appearance changes
- **WHEN** a runtime custom Structure icon or tone changes
- **THEN** every visible Structure and object projection SHALL use the updated serializable icon/tone mapping
- **AND** no React component or localized label SHALL be persisted in domain state.

