## Context

The brand position is not "productivity dashboard"; it is a studio for thought. The UI should make ideas feel like connected semantic objects instead of files buried in folders.

## Decisions

### Keep hierarchy light

Relationship cues, backlinks, graph context, object type, collections, and semantic grouping carry structure. Heavy dashboard chrome, KPI framing, and nested-folder metaphors are not the primary model.

### Make connected objects visible

Object surfaces should visually imply identity and connection through type badges, relationship chips, backlinks, graph cues, semantic grouping, hover/focus states, and contextual panels. The design should fail review if it feels like files inside folders.

### Use effects only for meaning

Motion, hover, depth, blur, transparency, and shadows should clarify state, relationship, layer, or available action. Decorative effects that compete with thinking are out of scope.

### Preserve accessibility parity

Hover-only affordances must have keyboard and assistive-technology equivalents, and motion must respect reduced-motion preferences.

## Risks / Trade-offs

- Subjective aesthetics can become untestable; requirements here keep them tied to observable UI states.
- Excessive glass or motion can harm readability and accessibility.
