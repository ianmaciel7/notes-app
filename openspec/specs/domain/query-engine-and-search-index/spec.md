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

### Requirement: Shared search modes preserve one canonical index
Palette search, object-reference suggestions, and block-reference suggestions SHALL consume the canonical rebuildable workspace search index while selecting only the result kinds and presentation required by each mode.

#### Scenario: Same object is searched from two consumers
- **WHEN** the palette and an object-reference suggestion query the same normalized title or alias
- **THEN** both SHALL resolve the same canonical object identity from the shared index
- **AND** neither consumer SHALL maintain a second persisted search corpus.

#### Scenario: Block reference mode searches blocks
- **WHEN** block-reference mode receives a query
- **THEN** it SHALL return stable block identity, owning object identity, block text, and sufficient owning-object context without converting block text into identity.

### Requirement: Palette query syntax has deterministic ranking
The search engine SHALL support plain normalized queries, a leading `^` mode that prioritizes relevant content beginning with the remaining query, and a quoted exact-phrase mode that treats the quoted value as one phrase. Results SHALL rank deterministic exact, title-leading, strong token, partial, approximate, relevance, and recency signals without duplicate canonical identities.

#### Scenario: Leading-content query is evaluated
- **WHEN** the user searches for `^Project Alpha`
- **THEN** results whose relevant searchable value begins with `Project Alpha` SHALL rank ahead of results that contain the phrase only later.

#### Scenario: Exact phrase is evaluated
- **WHEN** the user searches for `"Project Alpha"`
- **THEN** results containing the normalized phrase `Project Alpha` SHALL match as one phrase rather than as independent unordered terms.

#### Scenario: Equivalent aliases match one object
- **WHEN** a title and multiple aliases of one object match the same query
- **THEN** the result set SHALL contain one object result with deterministic ranking rather than one row per matching field.

### Requirement: Search projections follow canonical workspace changes
Searchable title, alias, property, tag, and stable block content SHALL update from current workspace state without per-keystroke global persistence and without retaining deleted or ineligible identities.

#### Scenario: Buffered object content commits
- **WHEN** an editor draft is committed after idle, blur, navigation, submit, or unmount
- **THEN** the canonical search projection SHALL update once for that commit and subsequent searches SHALL reflect the committed value.
