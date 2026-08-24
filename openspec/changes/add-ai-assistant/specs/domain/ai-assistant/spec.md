## ADDED Requirements

### Requirement: Explicit contextual AI
AI requests SHALL be Space-scoped and SHALL use explicit recorded context references, with response provenance available to the user.

#### Scenario: AI is disabled
- **WHEN** normal editing/search/sync occurs
- **THEN** workspace content SHALL not be transmitted to AI providers.

### Requirement: Provider-neutral streaming and cancellation
Configured provider adapters SHALL expose streaming, cancellation, typed errors, and capability checks through one gateway.

#### Scenario: User cancels generation
- **WHEN** a response is streaming
- **THEN** generation SHALL stop promptly and no pending write SHALL commit implicitly.

### Requirement: Guarded AI tools
AI-initiated workspace mutations SHALL use existing application services with Space scope, validation, idempotency, and configured confirmation policy.

#### Scenario: Tool proposes a destructive update
- **WHEN** the mutation requires confirmation
- **THEN** no canonical change SHALL occur until the user/policy explicitly approves it.

### Requirement: Privacy and provenance
The application SHALL disclose provider/model/context provenance while excluding secrets and unnecessary sensitive logs.

#### Scenario: Response provenance is opened
- **WHEN** the user inspects a message
- **THEN** provider/model and local source references SHALL be shown without revealing credentials.
