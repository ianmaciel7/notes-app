## ADDED Requirements

### Requirement: Offline durable writes
Approved workspace mutations SHALL commit locally without network connectivity and SHALL enqueue one idempotent synchronization operation in the same transaction.

#### Scenario: Device is offline
- **WHEN** the user edits an object and reloads
- **THEN** the edit SHALL remain readable locally and pending for later sync.

### Requirement: Incremental push/pull
Synchronization SHALL exchange per-Space operations/changes with durable cursors rather than replace the complete workspace.

#### Scenario: Remote batch applies
- **WHEN** changes after the current cursor are received
- **THEN** the batch SHALL commit transactionally and the cursor SHALL advance only after success.

### Requirement: Explicit conflict resolution
Concurrent local/remote updates that cannot be merged safely SHALL preserve both candidate versions and expose a resolution state.

#### Scenario: Keep local is chosen
- **WHEN** the user resolves a conflict in favor of local
- **THEN** that candidate SHALL become canonical and a new sync operation SHALL publish the decision.

### Requirement: Sync and media status
The UI SHALL expose per-Space sync/media availability without blocking access to already-local notes.

#### Scenario: Network disconnects
- **WHEN** local content is available
- **THEN** it SHALL remain usable while status indicates offline/pending state.
