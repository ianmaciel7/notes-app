## ADDED Requirements

### Requirement: Account and Workspace Settings
The settings dialog SHALL provide accessible categories for account, editor, appearance, language, date/time, authentication, space configuration, object types, resources, and integrations with persisted preferences.

#### Scenario: User changes a preference
- **WHEN** a valid preference is saved
- **THEN** affected workspace surfaces update and the setting restores on the next authorized session

### Requirement: Import and Full Export
The system SHALL validate imports before commit and generate authorized full exports of objects, metadata, content, collections, relationships, and supporting files with explicit format, progress, completion, and failure states so users retain data sovereignty.

#### Scenario: Import contains invalid records
- **WHEN** validation fails
- **THEN** no records are committed and the user receives record-level actionable errors

#### Scenario: User imports into an object
- **WHEN** the user selects one `.md`, `.txt`, `.docx`, `.html`, `.tex`, or `.csv` file within the configured size limit
- **THEN** the import is previewed, validated, and attached or converted only after explicit confirmation

#### Scenario: User exports an object
- **WHEN** the user exports an object as PDF, Markdown, Microsoft Word, or LaTeX
- **THEN** applicable embedded-content, outline, empty-property, type-label, paper-size, and property-selection options are honored without exposing unauthorized related content

#### Scenario: User exports the full workspace
- **WHEN** an authorized user requests a full export
- **THEN** the export includes authorized objects, type definitions, editable metadata, collections, relationships, backlinks where representable, and file attachments in documented formats without exposing unauthorized content

### Requirement: Portable Export Manifest
Full exports SHALL include a documented manifest that preserves object identity, type schema versions, metadata, content, collection membership, relationship edges, backlinks where representable, attachments, created/updated timestamps, and import compatibility metadata.

#### Scenario: User inspects export contents
- **WHEN** a full export completes
- **THEN** the export contains a manifest in a documented machine-readable format, such as JSON, plus user-readable content files where applicable, and the manifest explains how object relationships and type schema versions can be reconstructed

#### Scenario: Export format cannot represent a feature
- **WHEN** a selected export format cannot preserve relationships, backlinks, metadata, attachments, or type schema versions losslessly
- **THEN** the system warns the user, offers a lossless manifest-backed export option, and records any intentional omissions in the export report

### Requirement: Import Compatibility With Export Manifest
The importer SHALL validate exported manifests before commit and report compatibility, schema migration needs, missing attachments, relationship reconstruction issues, and permission constraints.

#### Scenario: User imports a prior full export
- **WHEN** a user selects a prior full export package
- **THEN** the system previews objects, types, metadata, collections, relationships, attachments, conflicts, and required schema migrations before importing anything

### Requirement: Sharing and Access Management
Authorized users SHALL be able to grant, inspect, and revoke supported object or space access without exposing private content by default.

#### Scenario: Access is revoked
- **WHEN** a collaborator or public link loses access
- **THEN** subsequent reads, search, sync, graph, export, and AI retrieval deny that access

### Requirement: Guarded Integrations and API
Calendar, task, developer API, and integration capabilities SHALL use explicit authorization, least-privilege scopes, revocable credentials, documented resources, and observable connection status.

#### Scenario: Integration authorization fails
- **WHEN** an external provider rejects or expires authorization
- **THEN** the workspace remains usable and settings show a recoverable disconnected state

#### Scenario: Developer uses the API
- **WHEN** an authorized developer creates an integration against workspace objects
- **THEN** the API documentation describes available object, metadata, collection, relationship, import/export, and permission resources with authentication, rate-limit, error, and revocation behavior
