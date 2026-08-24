## ADDED Requirements

### Requirement: Canonical typed QueryDefinition
Every saved query SHALL persist a validated declarative definition including its query/source kind, typed filters, ordered sorts, optional grouping/limit, result kind, variables, and explicit result-selection mode.

### Requirement: Supported query families are explicit
The engine SHALL represent Object Type, Search, Tag, and Variable query semantics explicitly when their valid inputs/result behavior differ.

### Requirement: Backlink and relation filters are first-class
Filters SHALL be able to target canonical backlink/content-link and Object Select relation indexes without conflating them.

### Requirement: Deterministic live evaluation
Query results SHALL derive from canonical workspace state and update when referenced values, identities, links, relations, or blocks change.

### Requirement: Controlled randomized result selection
A query MAY request randomized result selection, but the behavior SHALL be explicit and testable rather than relying on unstable incidental ordering.

### Requirement: Local object and block search indexes
The workspace SHALL expose rebuildable title/alias and full-text search over searchable properties and stable block content.

### Requirement: Contextual variable queries
A query SHALL resolve explicit host-object/property variables and SHALL expose an unresolved state when required context is absent.
