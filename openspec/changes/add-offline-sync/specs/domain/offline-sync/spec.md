## ADDED Requirements

### Requirement: Offline durable writes
Approved locally supported workspace mutations SHALL commit without network connectivity and SHALL enqueue one idempotent synchronization operation in the same transaction.

### Requirement: Incremental push/pull
Synchronization SHALL exchange per-Space operations/changes with durable cursors rather than replace the complete workspace.

### Requirement: Explicit conflict resolution
Concurrent local/remote updates that cannot be merged safely SHALL preserve both candidate versions and expose a resolution state.

### Requirement: Sync and media status
The UI SHALL expose per-Space sync/media availability without blocking access to already-local notes/content.

### Requirement: Offline capability matrix is explicit
Every network-sensitive subsystem SHALL declare whether it is available offline, available only for already-local data, degraded, or online-required.

#### Scenario: Online-required feature is invoked offline
- **WHEN** a feature such as remote AI/integration/server-dependent enrichment or unavailable remote media requires network access
- **THEN** the app SHALL expose a clear offline/unavailable state and SHALL NOT report a successful remote action.

#### Scenario: Core local content is available
- **WHEN** canonical object/property/block data and required local indexes are already present
- **THEN** locally supported editing/navigation/query behavior SHALL remain usable according to the declared capability contract.

### Requirement: Private sync internals remain unspecified
This change SHALL NOT claim Capacities protocol, CRDT/OT, merge algorithm, or backend parity without independent evidence.
