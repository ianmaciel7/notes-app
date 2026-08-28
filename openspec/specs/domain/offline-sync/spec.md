# Offline Sync Specification

## Purpose

Offline sync defines how Notes App keeps already-local workspace content usable without network access while exchanging Space-scoped changes incrementally when connectivity returns.

## Requirements

### Requirement: Offline durable writes
Approved locally supported workspace mutations SHALL commit without network connectivity and SHALL enqueue one idempotent synchronization operation in the same transaction.

#### Scenario: Local edit commits while offline
- **WHEN** a locally supported workspace aggregate is created, updated, or deleted while network is unavailable
- **THEN** the local database SHALL commit the aggregate mutation and a pending idempotent operation in one transaction.

### Requirement: Incremental push/pull
Synchronization SHALL exchange per-Space operations/changes with durable cursors rather than replace the complete workspace.

#### Scenario: Reconnect sync exchanges ordered deltas
- **WHEN** a Space reconnects after offline edits
- **THEN** sync SHALL push pending operations and pull remote changes after the durable cursor without replacing unrelated workspace aggregates.

### Requirement: Explicit conflict resolution
Concurrent local/remote updates that cannot be merged safely SHALL preserve both candidate versions and expose a resolution state.

#### Scenario: Concurrent unsafe update is detected
- **WHEN** a remote change targets an aggregate whose local revision advanced beyond the remote base revision
- **THEN** the app SHALL keep the local candidate, keep the remote candidate, and expose an open conflict instead of overwriting either version.

### Requirement: Sync and media status
The UI SHALL expose per-Space sync/media availability without blocking access to already-local notes/content.

#### Scenario: Media bytes are remote-only while offline
- **WHEN** a local note references media metadata whose bytes are available only remotely and the app is offline
- **THEN** local note content SHALL remain accessible and media status SHALL show the binary as unavailable offline.

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

#### Scenario: Protocol documentation references Capacities evidence
- **WHEN** Notes App documents sync behavior inspired by public Capacities evidence
- **THEN** private protocol, merge algorithm, CRDT/OT, and backend details SHALL be marked unspecified or `UNKNOWN`.
