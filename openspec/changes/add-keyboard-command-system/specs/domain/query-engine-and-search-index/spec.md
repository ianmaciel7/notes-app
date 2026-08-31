## ADDED Requirements

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
