## Context

The workspace should make ideas feel connected. Explicit relationships, derived backlinks, related-content suggestions, and graph views are the primary semantic connection surfaces.

## Decisions

### Keep explicit links separate from derived suggestions

Backlinks and typed relations are durable relationship data. Related-content and discovery suggestions are derived and need visible rationale.

### Use visual graph primitives for semantic structure

Graph views represent objects as nodes and typed relationships as edges. Backlink panels and semantic suggestions use separate visual sections so explicit and inferred connections do not blur together.

### Keep graph deterministic and accessible

Graph layout may be visual, but selected state, depth controls, keyboard access, and fallback behavior must be deterministic.

### Treat graph data as indexed derived state

Backlinks, related content, and graph projections are derived from object and relationship data. Rebuild and degraded states must be explicit when indexes are stale or too large to render fully.

## Risks / Trade-offs

- Semantic suggestions can be mistaken for explicit links if labels are unclear.
- Graphs can become decorative unless interaction and accessibility rules are explicit.
- Large graph renders can degrade performance unless thresholds and fallback behavior are defined.
