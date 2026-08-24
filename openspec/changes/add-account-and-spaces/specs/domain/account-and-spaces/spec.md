## ADDED Requirements

### Requirement: Hard Space isolation
Every durable workspace aggregate SHALL belong to one Space and SHALL be inaccessible through another active Space context.

#### Scenario: Equal object id exists in two Spaces
- **WHEN** either Space resolves that id
- **THEN** the repository SHALL return only the record scoped to the active Space.

### Requirement: Separate account/session boundary
The application SHALL represent authentication/session state separately from workspace content.

#### Scenario: Online session expires
- **WHEN** remote authorization becomes invalid
- **THEN** future remote operations SHALL require reauthentication without automatically deleting local content.

### Requirement: Guarded Space lifecycle
Users SHALL be able to create, rename, switch, and explicitly delete Spaces without leaking or silently destroying another Space's data.

#### Scenario: Space deletion is confirmed
- **WHEN** a Space with content is deleted
- **THEN** only that Space's scoped data SHALL follow the documented deletion/cache policy.

### Requirement: No implicit collaboration claim
This change SHALL NOT expose collaborative editing/member-role semantics as completed functionality.

#### Scenario: Space settings open
- **WHEN** unsupported team capabilities are not implemented
- **THEN** the UI SHALL not imply that they are available.
