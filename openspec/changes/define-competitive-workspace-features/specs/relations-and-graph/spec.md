## ADDED Requirements

### Requirement: Typed Relationships and Backlinks
Objects SHALL support typed directed relationships and derived backlinks with authorization-aware labels and navigation.

#### Scenario: Relationship changes
- **WHEN** a relationship is added or removed
- **THEN** both endpoint context views, related counts, search metadata, and graph data update consistently

### Requirement: Context Panels
Internal Objects and Related Content SHALL open as optional panels with counts, grouped or configurable views, accessible empty states, and object navigation.

#### Scenario: No related content exists
- **WHEN** the semantic-related query returns no authorized objects
- **THEN** the panel reports zero and explains the empty state without fabricating relationships

### Requirement: Interactive Graph
The graph SHALL render authorized object nodes and edges with selected state, depth controls, pan, zoom, fullscreen, keyboard access, and deterministic layout fallback.

#### Scenario: User changes graph depth
- **WHEN** relationship depth is increased or decreased
- **THEN** nodes and edges update while preserving the selected object and a non-color selected indicator
