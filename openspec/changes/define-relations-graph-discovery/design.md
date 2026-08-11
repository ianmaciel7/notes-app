## Context

The workspace should make ideas feel connected. Explicit relationships, derived backlinks, related-content suggestions, and graph views are the primary semantic connection surfaces.

## Decisions

### Keep explicit links separate from derived suggestions

Backlinks and typed relations are durable relationship data. Related-content and discovery suggestions are derived and need visible rationale.

### Keep graph deterministic and accessible

Graph layout may be visual, but selected state, depth controls, keyboard access, and fallback behavior must be deterministic.

## Risks / Trade-offs

- Semantic suggestions can be mistaken for explicit links if labels are unclear.
- Graphs can become decorative unless interaction and accessibility rules are explicit.
