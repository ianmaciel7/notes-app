## ADDED Requirements

### Requirement: Object deletion is recoverable for 30 days

Deleting an eligible object SHALL transition it to Space-scoped Trash with stable identity, `trashedAt`, and a purge boundary 30 days later.

#### Scenario: Object is trashed
- **WHEN** an eligible active object is deleted
- **THEN** it SHALL disappear from normal workspace projections
- **AND** it SHALL remain restorable with its canonical content and identity until permanent purge.

### Requirement: Trashed objects are isolated from normal projections

Search, queries, links, graph, dashboards, calendar, tasks, and integrations SHALL exclude trashed objects while preserving explicit recoverable missing-target information for active references.

#### Scenario: Active object links to a trashed target
- **WHEN** the target enters Trash
- **THEN** the source link SHALL become a recoverable missing-target state
- **AND** the source document SHALL not be silently rewritten.

### Requirement: Restore is canonical and idempotent

Restoring a recoverable object SHALL reactivate the same canonical identity and update all derived projections exactly once.

#### Scenario: Restore is retried
- **WHEN** the same restore command is delivered more than once
- **THEN** the final object SHALL be active exactly once without duplicate entities, links, or media references.

### Requirement: Permanent purge is explicit or retention-driven

An individual permanent delete, Empty Trash, or automatic cleanup after 30 days SHALL irreversibly purge eligible records and create the permanent deletion/tombstone state.

#### Scenario: Trash reaches retention boundary
- **WHEN** `purgeAfter` is reached
- **THEN** cleanup SHALL permanently remove the object idempotently
- **AND** media bytes MAY be collected only after all live references are checked.

### Requirement: Structure and Space deletion remain separate

Object Trash SHALL NOT silently replace guarded Structure deletion or deleted-Space retention.

#### Scenario: User deletes an object type
- **WHEN** a Structure deletion command is invoked
- **THEN** its existing dependency and irreversibility rules SHALL apply rather than moving the Structure into object Trash.
