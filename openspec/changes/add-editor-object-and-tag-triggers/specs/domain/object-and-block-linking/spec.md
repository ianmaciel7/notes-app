## ADDED Requirements

### Requirement: Quick-created object references use canonical identity

An object created from an editor suggestion SHALL be created by the canonical Space-scoped object lifecycle and linked by stable object identity only after successful creation.

#### Scenario: Object creation fails
- **WHEN** validation, authorization, storage, or creation fails
- **THEN** no dangling reference SHALL be inserted
- **AND** derived backlinks, graph, search, and persistence SHALL remain unchanged.

### Requirement: Tag suggestions reuse canonical tags

Tag lookup and creation SHALL resolve to one canonical Space-local tag identity and SHALL reject cross-Space targets and duplicate normalized labels.

#### Scenario: Equivalent tag already exists
- **WHEN** a create-tag query normalizes to an existing eligible tag
- **THEN** the existing tag SHALL be reused instead of creating another identity.
