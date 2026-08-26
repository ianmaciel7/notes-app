## ADDED Requirements

### Requirement: Stable tag and collection identity
Tags and collections SHALL have stable ids that survive rename and SHALL be referenced by id from objects.

#### Scenario: Tag or collection is renamed
- **WHEN** its display name changes
- **THEN** existing memberships SHALL remain valid without rewriting references by name.

### Requirement: Collection scope is Structure-bound
A collection SHALL belong to one owning Structure while an object of that Structure MAY belong to multiple collections.

#### Scenario: Collection membership is scoped to one Structure
- **WHEN** a collection is created for a Structure
- **THEN** only objects of that Structure SHALL be valid members while those objects MAY belong to multiple collections.

### Requirement: Canonical Object Select relations
Entity/Object Select property values SHALL reference target objects by stable id and SHALL enforce allowed target Structures, single/multiple cardinality, and optional fixed candidate sets.

#### Scenario: Invalid relation target or cardinality is selected
- **WHEN** a target is outside the allowed set or exceeds the property's cardinality
- **THEN** the write SHALL fail without partial changes.

### Requirement: Optional two-way linked properties
A supported Object Select property MAY declare one compatible inverse property and both sides SHALL update atomically.

#### Scenario: Linked relation is added
- **WHEN** the user adds a relation through one side of a valid two-way pair
- **THEN** the inverse value SHALL update exactly once without recursive duplicate writes.

#### Scenario: Inverse schema is incompatible
- **WHEN** the declared inverse property has an incompatible target/cardinality contract
- **THEN** schema validation SHALL reject the pairing.

### Requirement: Backlinks remain distinct from relation properties
Derived backlinks SHALL NOT be treated as editable two-way property values unless a schema explicitly declares the paired Object Select properties.

#### Scenario: Derived backlink is displayed beside explicit relation properties
- **WHEN** an object has incoming references without a paired Object Select inverse property
- **THEN** those backlinks SHALL remain derived projections and SHALL NOT appear as editable inverse property values.

### Requirement: Guarded deletion and reverse projection
The workspace SHALL derive reverse membership/relation projections and SHALL never silently orphan references during deletion.

#### Scenario: Referenced object deletion is requested
- **WHEN** an object is still referenced by membership or relation projections
- **THEN** deletion SHALL be rejected until the references are removed or explicitly migrated.
