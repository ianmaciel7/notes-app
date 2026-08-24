## ADDED Requirements

### Requirement: Hard Space isolation
Every durable and derived workspace record SHALL belong to exactly one Space context and SHALL be inaccessible through another active Space.

#### Scenario: Equal object id exists in two Spaces
- **WHEN** either Space resolves that id
- **THEN** only the record scoped to that Space SHALL be returned.

### Requirement: Isolation covers every knowledge subsystem
Structures, property definitions/values, tags, collections, Object Select relations, content links/backlinks, blocks, queries/views, search indexes, tasks/dates, assets/media, operations, and sync metadata SHALL be Space-scoped.

#### Scenario: Search/query runs in Space A
- **WHEN** matching content exists only in Space B
- **THEN** Space A SHALL return no result or derived relationship from Space B.

#### Scenario: Relation target belongs to another Space
- **WHEN** a relation/link attempts to target an object in another Space
- **THEN** the write SHALL be rejected.

### Requirement: Separate account/session boundary
Authentication/session state SHALL remain separate from workspace content; remote authorization expiry SHALL not automatically delete local content.

### Requirement: Guarded Space lifecycle
Create, rename, switch, and delete operations SHALL not leak or silently destroy another Space's data.

### Requirement: No implicit collaboration claim
Unsupported team/collaboration semantics SHALL not be presented as implemented functionality.
