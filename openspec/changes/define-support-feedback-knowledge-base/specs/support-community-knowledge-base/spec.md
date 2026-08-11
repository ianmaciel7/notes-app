## ADDED Requirements

### Requirement: In-App Knowledge Base
The workspace SHALL provide a searchable self-service knowledge base covering object methodology, UI reference, shortcuts, FAQ, troubleshooting, and advanced workspace features.

#### Scenario: User opens contextual help
- **WHEN** a user opens help from a button, command, panel, setting, object type, collection view, graph, AI panel, or onboarding surface
- **THEN** the system opens relevant knowledge-base content with a path to search the broader reference without losing workspace context

### Requirement: Detailed UI Reference
The knowledge base SHALL document workspace controls, keyboard commands, panels, object actions, collection views, graph controls, AI actions, import/export options, and settings categories.

#### Scenario: User searches for a command
- **WHEN** the user searches for a UI command or shortcut
- **THEN** the reference explains the command purpose, preconditions, trigger methods, resulting behavior, related settings, and safety boundaries

### Requirement: Community Feedback Loop
The workspace SHALL provide a feedback surface for bug reports, suggestions, product questions, and community links with submission status and recoverable failure states.

#### Scenario: User submits feedback
- **WHEN** the user submits feedback from the workspace
- **THEN** the system captures the selected category, affected surface, user text, safe app diagnostics, and optional user-approved attachments, then reports queued, submitted, failed, or retryable status

### Requirement: Feedback Privacy and Triage Metadata
Feedback and community submissions SHALL avoid sending object bodies, secrets, AI prompts, exports, or unauthorized identifiers by default and SHALL include triage metadata useful for routing.

#### Scenario: Diagnostic context is attached
- **WHEN** the user includes diagnostic context with feedback
- **THEN** the payload includes safe metadata such as app version, route category, feature area, browser/device class, error code, and correlation id without sensitive workspace content

### Requirement: Configurable Community Destinations
External community and feedback destinations SHALL be configurable, labelled, revocable, and non-blocking.

#### Scenario: Community destination is unavailable
- **WHEN** the configured feedback portal, community link, or webhook is unavailable
- **THEN** the workspace remains usable and the feedback surface shows a recoverable disconnected or retry state
