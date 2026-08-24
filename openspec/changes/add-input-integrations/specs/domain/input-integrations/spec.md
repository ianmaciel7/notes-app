## ADDED Requirements

### Requirement: Space-scoped secure integration connections
Every integration SHALL be connected to one Space and SHALL store credentials through a secure secret boundary separate from content.

#### Scenario: Integration disconnects
- **WHEN** the user revokes a connection
- **THEN** future provider jobs SHALL stop and secrets SHALL be revoked/removed without deleting already imported canonical objects.

### Requirement: Canonical capture pipeline
Provider inputs SHALL normalize into a capture/import envelope and SHALL reuse existing URL/text/media/Daily Note/object validation services.

#### Scenario: Media capture arrives
- **WHEN** an external adapter submits supported media
- **THEN** MediaAsset validation/storage SHALL succeed before canonical object creation is reported successful.

### Requirement: Idempotent external items
Sources with stable external ids SHALL not create duplicate canonical items on repeated delivery.

#### Scenario: Provider item is redelivered
- **WHEN** a mapped external id already exists
- **THEN** the configured update/skip policy SHALL run without duplicate creation.

### Requirement: Outbound task actions preserve native identity
External task-action adapters SHALL record provider results/references without replacing the native Task object.

#### Scenario: External provider rejects action
- **WHEN** send fails
- **THEN** the native Task SHALL remain unchanged and a retryable integration error SHALL be exposed.
