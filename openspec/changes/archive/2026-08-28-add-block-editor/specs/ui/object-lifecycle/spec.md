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

#### Scenario: Page is created and written
- **WHEN** the user activates `Novo` and selects Page
- **THEN** the system SHALL instantiate an untitled page with a stable id, the central page icon/tone, an active workspace tab, selected sidebar/object-type projections, and a contentEditable title/body surface
- **AND WHEN** the user writes a title, body text, tags, or collection metadata
- **THEN** the title, tab label, sidebar count, object-type list, query results, and persisted entity SHALL update without creating a duplicate object
- **AND** the active editor SHALL keep Capacities-compatible hover, focus, caret, and post-click appearance.

#### Scenario: Atomic note is created and written
- **WHEN** the user activates `Novo` and selects Atomic note
- **THEN** the system SHALL create a compact document-like object with central atomic-note icon/tone, active selection, and an editable title/body contract
- **AND WHEN** the user types into the title or note body
- **THEN** the canonical entity and every visible projection SHALL synchronize immediately while preserving the localized untitled fallback when the title remains empty.

#### Scenario: Quote is created and written
- **WHEN** the user activates `Novo` and selects Quote
- **THEN** the system SHALL create an untitled quote object with quote content, source or attribution fields where present, central quote icon/tone, active tab selection, and updated quote count
- **AND WHEN** the user edits quote content or attribution
- **THEN** the quote editor, tab, object-type index, and persisted entity SHALL remain synchronized.

#### Scenario: Table object is created
- **WHEN** the user selects Table
- **THEN** the system SHALL create and activate an untitled table with notes and a deterministic editable starter grid
- **AND** changes to each cell SHALL remain associated with its row and column

#### Scenario: Table is created and edited
- **WHEN** the user activates `Novo` and selects Table
- **THEN** the system SHALL create an untitled table with a deterministic starter grid, central table icon/tone, active tab selection, and updated table count
- **AND WHEN** the user clicks or tabs between cells and writes values
- **THEN** the edited values SHALL stay associated with the correct row and column, and the grid SHALL preserve focus-visible and selected-cell appearance after each edit.

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

#### Scenario: Weblink is created from a URL
- **WHEN** the user activates `Novo` and selects Weblink
- **THEN** the system SHALL request a URL before creating the object
- **AND WHEN** the user submits a valid URL
- **THEN** the system SHALL create a local weblink object with deterministic metadata, central weblink icon/tone, active selection, and updated count without performing a network fetch
- **AND WHEN** the URL is empty or malformed
- **THEN** the surface SHALL show a localized inline error and SHALL NOT change counts, tabs, or stored entities.

#### Scenario: Tweet is created from a URL
- **WHEN** the user activates `Novo` and selects Tweet
- **THEN** the system SHALL request a tweet-compatible URL before creating the object
- **AND WHEN** the user submits a compatible URL
- **THEN** the system SHALL create a local tweet object with deterministic display metadata, central tweet icon/tone, active selection, and updated count without copying data from Capacities
- **AND WHEN** the URL is empty, malformed, or incompatible
- **THEN** the system SHALL keep the creation surface open with a localized inline error and no storage mutation.

#### Scenario: Tag is created
- **WHEN** the user selects Tag
- **THEN** the system SHALL create and activate an untitled tag index
- **AND** editing its title SHALL update the tab and tag index label

#### Scenario: Tag is created and renamed
- **WHEN** the user activates `Novo` and selects Tag
- **THEN** the system SHALL create and activate an untitled tag index with central tag icon/tone and updated tag count
- **AND WHEN** the user writes or renames the tag
- **THEN** tag labels, tagged-object projections, tabs, and persisted state SHALL synchronize without localizing the stored tag identifier.

#### Scenario: Query is created
- **WHEN** the user selects Query
- **THEN** the system SHALL create and activate a query builder with natural-language description and direct filter controls
- **AND WHEN** a supported description template is applied
- **THEN** the system SHALL generate deterministic local filters, update the title when still untitled, and display matching local workspace objects

#### Scenario: Query is created and written
- **WHEN** the user activates `Novo` and selects Query
- **THEN** the system SHALL create and activate a query builder with central query icon/tone, updated query count, natural-language description, and direct filter controls
- **AND WHEN** the user writes a supported description or edits filters
- **THEN** the query title, local filters, matching local object list, tab label, and persisted entity SHALL update deterministically.

#### Scenario: File-backed object is created
- **WHEN** the user selects Image, PDF, Audio, or File
- **THEN** the system SHALL open a local file chooser with an appropriate accept contract
- **AND** SHALL create an object only after a compatible file is selected
- **AND** SHALL store local metadata and an ephemeral preview reference without uploading or persisting the file bytes

#### Scenario: Custom object type is instantiated
- **WHEN** the user creates or selects a custom object type such as the current reference's `Default` type
- **THEN** the system SHALL instantiate objects using the custom type's stored name, icon/tone fallback, active selection, count, and object-type index row
- **AND** custom-type labels SHALL remain local user data, not copied from the Capacities account.

#### Scenario: Book preset object is instantiated
- **WHEN** the user creates or selects the Book preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central book icon/tone, active selection, updated count, and editable title/body or metadata fields
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Person preset object is instantiated
- **WHEN** the user creates or selects the Person preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central person icon/tone, active selection, updated count, and editable title/body or profile-style fields
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Area preset object is instantiated
- **WHEN** the user creates or selects the Area preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central area icon/tone, active selection, updated count, and editable title/body or area metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Meeting preset object is instantiated
- **WHEN** the user creates or selects the Meeting preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central meeting icon/tone, active selection, updated count, and editable title/body or meeting metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Definition preset object is instantiated
- **WHEN** the user creates or selects the Definition preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central definition icon/tone, active selection, updated count, and editable term/body fields
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Idea preset object is instantiated
- **WHEN** the user creates or selects the Idea preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central idea icon/tone, active selection, updated count, and editable title/body fields
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Place preset object is instantiated
- **WHEN** the user creates or selects the Place preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central place icon/tone, active selection, updated count, and editable title/body or place metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Project preset object is instantiated
- **WHEN** the user creates or selects the Project preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central project icon/tone, active selection, updated count, and editable title/body or project metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Organization preset object is instantiated
- **WHEN** the user creates or selects the Organization preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central organization icon/tone, active selection, updated count, and editable title/body or organization metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Media preset object is instantiated
- **WHEN** the user creates or selects the Media preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central media icon/tone, active selection, updated count, and editable title/body or media metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: Travel preset object is instantiated
- **WHEN** the user creates or selects the Travel preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central travel icon/tone, active selection, updated count, and editable title/body or travel metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write.

#### Scenario: AI chat preset object is instantiated
- **WHEN** the user creates or selects the AI chat preset object type
- **THEN** the system SHALL instantiate a local object with stable id, central AI chat icon/tone, active selection, updated count, and editable local title/body or conversation metadata
- **AND** tab, sidebar/object-type row, search, query, and persisted projections SHALL synchronize after click and write
- **AND** creation SHALL NOT imply a network AI request unless a separate user action explicitly starts one.

#### Scenario: Archive type remains reserved
- **WHEN** the central registry includes Archive
- **THEN** the system SHALL treat it as a reserved or system-owned type that is not offered as a normal `Novo` or object-type-studio instantiation target
- **AND** it SHALL NOT be counted as a missing creatable object in lifecycle parity.

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

#### Scenario: Created object is clicked after creation
- **WHEN** a newly created object is visible in a tab, sidebar/object-type list, search result, collection, query result, or related-object card
- **AND** the user clicks its primary surface
- **THEN** the object SHALL become the single active selection, the previous transient creation surface SHALL close, and all selected/post-click visuals SHALL agree across header, content, and sidebar
- **AND** nested menu, close, disclosure, pin, or file actions SHALL NOT accidentally trigger the primary open action.

#### Scenario: Created object is edited and re-opened
- **WHEN** the user writes into a newly created object, navigates away, and then re-opens it from another projection
- **THEN** the latest canonical title/content/type-specific fields SHALL render in the editor
- **AND** counts SHALL NOT increment from opening, re-opening, clicking, or editing an existing object.

### Requirement: Versioned local workspace persistence
The system SHALL persist canonical object state in a version 2, locale-neutral browser-storage record, SHALL hydrate it only after client mount, and SHALL validate every structured body before accepting the snapshot.

#### Scenario: First visit has no stored workspace
- **WHEN** no valid stored record exists
- **THEN** the system SHALL render the deterministic acceptance seed and become ready without a hydration mismatch

#### Scenario: Stored workspace is restored
- **WHEN** a valid supported record exists and `/en` reloads
- **THEN** the system SHALL restore entities, counts, active selection, and editable values after client mount
- **AND** SHALL preserve stable identifiers across the reload

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
