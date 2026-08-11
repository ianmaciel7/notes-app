## ADDED Requirements

### Requirement: Context-Aware AI Conversation
The AI panel SHALL support streaming conversations, authorized object mentions, model/provider selection, cancellation, retry, and clear empty/error states.

#### Scenario: User mentions an object
- **WHEN** a message references an authorized object
- **THEN** only permitted content is supplied to the provider and the response identifies its workspace sources

### Requirement: AI Trust Boundaries
AI credentials and provider calls MUST remain server-side, retrieval MUST enforce space authorization, and retention behavior MUST be disclosed and configurable.

#### Scenario: User lacks object access
- **WHEN** retrieval encounters an unauthorized object
- **THEN** its content is excluded without revealing its title, metadata, or existence

### Requirement: AI Input Modes and Safety
The composer SHALL support text, object mentions, approved voice transcription, send, stop, and policy feedback without silently performing destructive actions.

#### Scenario: AI proposes a mutation
- **WHEN** a response requests a persistent or destructive workspace action
- **THEN** the system presents the exact proposed change and requires explicit user confirmation
