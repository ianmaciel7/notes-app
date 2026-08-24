## ADDED Requirements

### Requirement: Canonical typed QueryDefinition
Every saved query SHALL persist a validated declarative definition with source, filters, sorts, optional grouping/limit, result kind, and variables.

#### Scenario: Invalid typed operator is configured
- **WHEN** an operator is incompatible with its referenced property type
- **THEN** the query SHALL be rejected with a precise validation error.

### Requirement: Deterministic live evaluation
Query results SHALL derive from canonical workspace state and SHALL update when referenced values, identities, links, or blocks change.

#### Scenario: Referenced object value changes
- **WHEN** an active filter/sort input changes
- **THEN** the next result projection SHALL update membership/order without duplicate records.

### Requirement: Local object and block search indexes
The workspace SHALL expose rebuildable title/alias and full-text search over searchable properties and stable block content.

#### Scenario: Block search result is opened
- **WHEN** a block-level result is selected
- **THEN** navigation SHALL resolve the owning object and stable BlockId.

### Requirement: Contextual variable queries
A query SHALL be able to resolve explicit host-object/property variables and SHALL expose an unresolved state when required context is absent.

#### Scenario: Same query is embedded in different hosts
- **WHEN** host property values differ
- **THEN** each evaluation SHALL use that host's context without modifying the saved query definition.
