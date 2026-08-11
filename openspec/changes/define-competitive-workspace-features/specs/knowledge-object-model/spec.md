## ADDED Requirements

### Requirement: Typed Extensible Objects
The system SHALL store every object with stable identity, space ownership, object type, title, icon, timestamps, properties, content, collections, and relationships, while allowing custom object-type schemas.

#### Scenario: User creates a custom object type
- **WHEN** an authorized user defines its name, icon, color, and properties
- **THEN** new and existing compatible objects can use the versioned schema without corrupting prior data

### Requirement: Durable Authorized Mutations
Create, update, move, archive, restore, and delete operations SHALL be validated, authorized, revisioned, and durable across reloads.

#### Scenario: User edits an object
- **WHEN** a valid mutation is accepted
- **THEN** the object receives a new revision and the change is reflected in navigation, views, search, calendar, and relationships

### Requirement: Safe Object Creation
The New command SHALL offer searchable type choices and create an object in the active space only after the user selects a type.

#### Scenario: User cancels creation
- **WHEN** the user dismisses the New command before selection
- **THEN** no object or empty record is persisted

### Requirement: Built-In Type-Specific Behavior
Built-in object types SHALL retain their type-specific fields, creation sources, validation, and presentation instead of degrading into generic pages.

#### Scenario: User creates or edits a task
- **WHEN** the user uses quick-add or opens a Task
- **THEN** title, status, date, priority, context, due date, tags, completion, and notes are available and persist consistently in task views and search

#### Scenario: User creates a media or file object
- **WHEN** the user creates an Image, PDF, Audio, or File
- **THEN** the supported upload and URL sources are shown, Image also offers approved remote-source options where configured, and the resulting object exposes an appropriate viewer or player plus type-specific metadata

#### Scenario: User creates a URL-derived object
- **WHEN** the user submits a URL for Weblink or Tweet
- **THEN** source metadata is fetched into the correct type, fetch failures remain recoverable, and no duplicate or unexplained empty object is persisted

#### Scenario: User opens Tag or Query
- **WHEN** the user opens a Tag or configures a Query
- **THEN** Tag exposes its collection, query, import, and add surfaces, and Query supports Object Type, Tag, or Search sources with filters, sort, group, and result limits

### Requirement: Complete Object Action Surface
Each supported object SHALL expose applicable find, customize, template, pin, change-type, type-settings, share, present, export, import, text-statistics, copy, duplicate, and guarded delete actions.

#### Scenario: An object action is unavailable
- **WHEN** an action does not apply to the active type or the user lacks permission
- **THEN** it is hidden or disabled with an accessible explanation and no partial mutation is written
