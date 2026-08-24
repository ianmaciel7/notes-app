## ADDED Requirements

### Requirement: Stable tag and collection identity
Tags and collections SHALL have stable ids that survive rename and SHALL be referenced by id from objects.

#### Scenario: Tag or collection is renamed
- **WHEN** a referenced tag or collection changes its display name
- **THEN** every existing membership SHALL remain valid without rewriting references by name.

### Requirement: Canonical entity relations
Entity property values SHALL reference target objects by stable id and SHALL enforce the property's allowed target Structures.

#### Scenario: Invalid relation target is selected
- **WHEN** a target object's Structure is outside the property definition's allowed set
- **THEN** the relation write SHALL fail without partial changes.

### Requirement: Guarded deletion and reverse projection
The workspace SHALL derive reverse membership/relation projections and SHALL never silently orphan references during deletion.

#### Scenario: Referenced identity deletion is requested
- **WHEN** a tag, collection, or related object still has dependents
- **THEN** deletion SHALL require an explicit safe policy and SHALL leave data unchanged if cancelled.
