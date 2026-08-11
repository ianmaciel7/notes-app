## ADDED Requirements

### Requirement: Account and Workspace Settings
The settings dialog SHALL provide accessible categories for account, editor, appearance, language, date/time, authentication, space configuration, object types, resources, and integrations with persisted preferences.

#### Scenario: User changes a preference
- **WHEN** a valid preference is saved
- **THEN** affected workspace surfaces update and the setting restores on the next authorized session

### Requirement: Import and Full Export
The system SHALL validate imports before commit and generate authorized full exports with explicit format, progress, completion, and failure states.

#### Scenario: Import contains invalid records
- **WHEN** validation fails
- **THEN** no records are committed and the user receives record-level actionable errors

#### Scenario: User imports into an object
- **WHEN** the user selects one `.md`, `.txt`, `.docx`, `.html`, `.tex`, or `.csv` file within the configured size limit
- **THEN** the import is previewed, validated, and attached or converted only after explicit confirmation

#### Scenario: User exports an object
- **WHEN** the user exports an object as PDF, Markdown, Microsoft Word, or LaTeX
- **THEN** applicable embedded-content, outline, empty-property, type-label, paper-size, and property-selection options are honored without exposing unauthorized related content

### Requirement: Sharing and Access Management
Authorized users SHALL be able to grant, inspect, and revoke supported object or space access without exposing private content by default.

#### Scenario: Access is revoked
- **WHEN** a collaborator or public link loses access
- **THEN** subsequent reads, search, sync, graph, export, and AI retrieval deny that access

### Requirement: Guarded Integrations and API
Calendar, task, and API integrations SHALL use explicit authorization, least-privilege scopes, revocable credentials, and observable connection status.

#### Scenario: Integration authorization fails
- **WHEN** an external provider rejects or expires authorization
- **THEN** the workspace remains usable and settings show a recoverable disconnected state
