## ADDED Requirements

### Requirement: Sidebar and dashboard sections have distinct identities

Sidebar custom sections SHALL group pins, while object-type dashboard sections SHALL reference views of one Structure. Commands and persistence SHALL not treat them as interchangeable.

#### Scenario: Dashboard section is removed
- **WHEN** a collection- or query-backed dashboard tab is removed
- **THEN** only the dashboard reference SHALL be removed
- **AND** the underlying collection, query, and objects SHALL remain.

### Requirement: Object-type dashboards support stable section sources

A dashboard SHALL support immutable All, locally supported built-in sections, collection-backed sections, and query-backed sections with stable order and visibility.

#### Scenario: Source title changes
- **WHEN** a linked collection or query is renamed
- **THEN** its dashboard section SHALL reflect the canonical source title without changing source identity.

### Requirement: Small-card configuration is reused consistently

Each Structure SHALL define ordered visible properties for small-card presentation, reused by gallery, wall, and embedded small-card views.

#### Scenario: Configured property is empty
- **WHEN** a configured property has no value
- **THEN** gallery MAY preserve its configured slot while wall MAY omit it according to the documented compactness rule
- **AND** both SHALL preserve the same property order.

### Requirement: Table-view columns are customizable presentation state

Table views SHALL persist column visibility, text wrapping, order, and width independently from property schema.

#### Scenario: User resizes and reorders columns
- **WHEN** table presentation changes
- **THEN** canonical object property values SHALL remain unchanged
- **AND** the presentation SHALL restore after reload.
