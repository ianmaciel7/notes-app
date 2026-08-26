# query-engine-and-search-index Specification

## Purpose
Defines typed local query definitions, deterministic query evaluation, relation and backlink filtering, contextual variables, randomized selection, and rebuildable search indexes.

## Requirements

### Requirement: Canonical typed QueryDefinition
Every saved query SHALL persist a validated declarative definition including its query/source kind, typed filters, ordered sorts, optional grouping/limit, result kind, variables, and explicit result-selection mode.

#### Scenario: Saved query is loaded
- **WHEN** a saved query is loaded from workspace state
- **THEN** its QueryDefinition SHALL validate every persisted filter, sort, grouping, limit, result kind, variable, and selection mode before evaluation.

### Requirement: Supported query families are explicit
The engine SHALL represent Object Type, Search, Tag, and Variable query semantics explicitly when their valid inputs/result behavior differ.

#### Scenario: Query family changes
- **WHEN** a query is configured as Object Type, Search, Tag, or Variable
- **THEN** the persisted definition SHALL record the explicit family instead of relying on free-form text interpretation.

### Requirement: Backlink and relation filters are first-class
Filters SHALL be able to target canonical backlink/content-link and Object Select relation indexes without conflating them.

#### Scenario: Relation and backlink filters target one object
- **WHEN** a query filters by explicit Object Select relations and content backlinks
- **THEN** each filter SHALL evaluate against its own canonical index.

### Requirement: Deterministic live evaluation
Query results SHALL derive from canonical workspace state and update when referenced values, identities, links, relations, or blocks change.

#### Scenario: Referenced value changes
- **WHEN** a value, identity, link, relation, or block referenced by a query changes
- **THEN** re-evaluating the query SHALL produce deterministic results from the updated canonical state.

### Requirement: Controlled randomized result selection
A query MAY request randomized result selection, but the behavior SHALL be explicit and testable rather than relying on unstable incidental ordering.

#### Scenario: Randomized query uses a seed
- **WHEN** a randomized query is evaluated with the same seed and matching inputs
- **THEN** result selection SHALL be stable across evaluations regardless of incidental input order.

### Requirement: Local object and block search indexes
The workspace SHALL expose rebuildable title/alias and full-text search over searchable properties and stable block content.

#### Scenario: Search index is rebuilt
- **WHEN** the local index is rebuilt from canonical objects and stable blocks
- **THEN** title, alias, property text, and block text searches SHALL resolve matching object and block results without duplicate records.

### Requirement: Contextual variable queries
A query SHALL resolve explicit host-object/property variables and SHALL expose an unresolved state when required context is absent.

#### Scenario: Required host context is missing
- **WHEN** a variable query requires a host object or property that is not provided
- **THEN** evaluation SHALL return an explicit unresolved state instead of silently producing misleading results.
