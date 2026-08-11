## ADDED Requirements

### Requirement: Typed Relationships and Backlinks
Objects SHALL support typed directed relationships and derived backlinks with authorization-aware labels and navigation.

#### Scenario: Relationship changes
- **WHEN** a relationship is added or removed
- **THEN** both endpoint context views, related counts, search metadata, and graph data update consistently

### Requirement: Context Panels
Internal Objects, backlinks or incoming links, and Related Content SHALL open as optional panels with counts, grouped or configurable views, accessible empty states, and object navigation.

#### Scenario: No related content exists
- **WHEN** the semantic-related query returns no authorized objects
- **THEN** the panel reports zero and explains the empty state without fabricating relationships

#### Scenario: User opens backlinks
- **WHEN** the user opens Links de entrada, backlinks, or an equivalent incoming-links panel
- **THEN** authorized objects that link to the active object are grouped or listed with labels, counts, and navigation without exposing unauthorized object titles or metadata

#### Scenario: Backlinks and suggestions are shown together
- **WHEN** backlinks and semantic suggestions appear near an object
- **THEN** explicit incoming links and derived suggestions are visually separated by labels, grouping, rationale, or section treatment so the user can distinguish confirmed relationships from discovery hints

#### Scenario: User explores related content
- **WHEN** the user opens Explore, Content Relevante, Encontrar mais, or an equivalent semantic-discovery surface
- **THEN** suggested related objects are marked as derived suggestions, remain authorization-aware, expose enough rationale to distinguish them from explicit links, and provide an empty state when no safe suggestion exists

### Requirement: Interactive Graph
The graph SHALL render authorized object nodes and edges with selected state, depth controls, pan, zoom, fullscreen, keyboard access, and deterministic layout fallback.

#### Scenario: User changes graph depth
- **WHEN** relationship depth is increased or decreased
- **THEN** nodes and edges update while preserving the selected object and a non-color selected indicator

#### Scenario: User explores graph visually
- **WHEN** the graph panel or fullscreen graph opens
- **THEN** objects appear as nodes, relationships appear as edges, and zoom, pan, fullscreen, selection, and keyboard controls are available without hiding authorization-aware context

### Requirement: Relationship and Graph Index Freshness
Relationship, backlink, semantic-discovery, and graph indexes SHALL update after object, relationship, permission, collection, type-schema, and import/export-relevant mutations.

#### Scenario: Relationship index changes
- **WHEN** an object link, typed relation, backlink source, permission, object type, or semantic-discovery input changes
- **THEN** context panels, backlinks, related content, and graph data update or show an explicit rebuilding state without exposing unauthorized nodes, edges, titles, or metadata

#### Scenario: Graph grows large
- **WHEN** the graph exceeds the interactive rendering threshold for a space or query
- **THEN** the system provides bounded depth, filtering, pagination, clustering, or degraded-view behavior rather than freezing the workspace
