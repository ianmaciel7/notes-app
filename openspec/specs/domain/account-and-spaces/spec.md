# account-and-spaces Specification

## Purpose

Account and Spaces define the local account/session boundary and hard workspace partitions so personal Spaces remain isolated while future sync and account features have stable domain contracts.

## Requirements

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

#### Scenario: Session expires with cached local content
- **WHEN** the active session becomes expired
- **THEN** previously loaded local Space content SHALL remain available according to the offline cache policy.

### Requirement: Guarded Space lifecycle
Create, rename, switch, and delete operations SHALL not leak or silently destroy another Space's data.

#### Scenario: Space deletion requires exact confirmation
- **WHEN** a user attempts to delete a Space without typing the exact Space name
- **THEN** the Space SHALL remain available and its records SHALL remain intact.

### Requirement: No implicit collaboration claim
Unsupported team/collaboration semantics SHALL not be presented as implemented functionality.

#### Scenario: Space settings are shown
- **WHEN** the Space lifecycle UI presents settings or account scope
- **THEN** it SHALL describe the Space as local/personal unless collaboration is implemented by another change.
