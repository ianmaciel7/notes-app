## MODIFIED Requirements

### Requirement: Typed workspace object state
The system SHALL represent every object created from the `Novo` palette as a discriminated workspace entity whose type-specific fields, title, creation timestamp, and stable identifier are owned by workspace state rather than by an editor component; Page and Atomic note `DocumentEntity.body` and `QuoteEntity.body` SHALL use validated `BlockEditorDocument` values while other simple body/note fields remain strings.

#### Scenario: Object is created from the palette
- **WHEN** a user selects any supported object type from `Novo`
- **THEN** the system SHALL create or begin the type-appropriate workflow with a collision-free identifier and the selected central icon/tone definition
- **AND** the resulting object SHALL remain selectable independently of other objects of the same type
- **AND** Page, Atomic note, and Quote SHALL receive a valid empty block document

#### Scenario: Unsupported definition is requested
- **WHEN** a creation request references an object type that is not in the central registry
- **THEN** the system SHALL reject the request without changing counts, tabs, or stored entities
- **AND** it SHALL present a localized error status

### Requirement: Type-specific creation workflows
The system SHALL dispatch the thirteen `Novo` palette entries into the creation flow observed for their object family instead of rendering one generic editor for all types.

#### Scenario: Full editor object is created
- **WHEN** the user selects Atomic note, Quote, or Page
- **THEN** the system SHALL create and activate an untitled object immediately
- **AND** SHALL render the appropriate title, structured block body, tags, collections, or quote fields for that type

#### Scenario: Table object is created
- **WHEN** the user selects Table
- **THEN** the system SHALL create and activate an untitled table with notes and a deterministic editable starter grid
- **AND** changes to each cell SHALL remain associated with its row and column

#### Scenario: Task is quick-captured
- **WHEN** the user selects Task
- **THEN** the system SHALL open a localized quick-capture surface without replacing the currently active object
- **AND WHEN** the user submits a non-empty title
- **THEN** the system SHALL create the task, close the capture surface, update task state, and offer an action to open the created task

#### Scenario: URL-derived object is created
- **WHEN** the user selects Weblink or Tweet
- **THEN** the system SHALL request a URL before creating the object
- **AND** SHALL reject empty, malformed, or type-incompatible URLs with a localized inline error
- **AND** SHALL derive deterministic local display metadata without a network request

#### Scenario: Tag is created
- **WHEN** the user selects Tag
- **THEN** the system SHALL create and activate an untitled tag index
- **AND** editing its title SHALL update the tab and tag index label

#### Scenario: Query is created
- **WHEN** the user selects Query
- **THEN** the system SHALL create and activate a query builder with natural-language description and direct filter controls
- **AND WHEN** a supported description template is applied
- **THEN** the system SHALL generate deterministic local filters, update the title when still untitled, and display matching local workspace objects

#### Scenario: File-backed object is created
- **WHEN** the user selects Image, PDF, Audio, or File
- **THEN** the system SHALL open a local file chooser with an appropriate accept contract
- **AND** SHALL create an object only after a compatible file is selected
- **AND** SHALL store local metadata and an ephemeral preview reference without uploading or persisting the file bytes

### Requirement: Editing synchronizes every workspace projection
The system SHALL keep an object's canonical data synchronized with its active editor, main tab, sidebar counts, object-type index, and query results without causing controlled-editor update loops or selection loss.

#### Scenario: Title or content is edited
- **WHEN** the user edits an object's title, structured body, simple body, tags, table cells, task fields, URL notes, or query definition
- **THEN** the canonical entity SHALL update immediately or through the documented short persistence buffer
- **AND** every visible projection of the changed field SHALL reflect the same value without creating a duplicate object

#### Scenario: Structured body changes externally
- **WHEN** a Page, Atomic note, or Quote receives a valid external body that differs from its current editor JSON
- **THEN** the editor SHALL replace content without emitting a recursive update or losing future editability

#### Scenario: Untitled object receives content
- **WHEN** the first meaningful title remains blank but type-specific content is entered
- **THEN** the tab SHALL retain the localized untitled fallback while the content is preserved

#### Scenario: Object type count changes
- **WHEN** a new object is committed or a stored workspace is hydrated
- **THEN** the object-type count SHALL equal the number of canonical entities of that type
- **AND** opening or editing an object SHALL NOT increment the count

### Requirement: Versioned local workspace persistence
The system SHALL persist canonical object state in a version 2, locale-neutral browser-storage record, SHALL hydrate it only after client mount, and SHALL validate every structured body before accepting the snapshot.

#### Scenario: First visit has no stored workspace
- **WHEN** no valid stored record exists
- **THEN** the system SHALL render the deterministic acceptance seed and become ready without a hydration mismatch

#### Scenario: Version 1 workspace is migrated
- **WHEN** a valid version 1 record contains Page, Atomic note, or Quote text bodies
- **THEN** the system SHALL split each body on line boundaries into paragraph nodes, preserve empty lines as empty paragraphs, retain stable entity identifiers and simple fields, and hydrate a version 2 state

#### Scenario: Version 2 workspace is restored
- **WHEN** a valid version 2 record exists and a localized route reloads
- **THEN** the system SHALL restore entities, counts, active selection, simple editable values, and validated block documents after client mount
- **AND** SHALL preserve stable identifiers and structured content across the reload

#### Scenario: Stored workspace is invalid or from a future version
- **WHEN** parsing, document validation, or version checks fail
- **THEN** the system SHALL ignore the record, retain the deterministic seed, and expose a non-blocking localized recovery status

#### Scenario: Unknown document content is present
- **WHEN** a version 2 snapshot contains an unknown block node, mark, or attribute
- **THEN** the entire invalid record SHALL be rejected rather than silently dropping or preserving the unknown content
