## Context

Capacities documents object links, block references, source-backed embeds/transclusion, backlinks, local/contextual graph navigation, reference counters, Objects Inside-style nested object projections, and unlinked mentions. Property relations are a separate concept owned by P2.

The archive supports UI/source evidence but does not disclose private link encoding or graph storage, so Notes App uses a clean-room id-based graph model.

## Goals / Non-Goals

**Goals:** rename-safe object links, durable BlockId references, reference counters, derived backlinks, source-backed embeds, Objects Inside projection, contextual per-object graph, and explicit mention conversion.

**Non-Goals:** semantic Related Content, collaboration, property-linked inverse relations, global workspace graph parity, or claims about private token format.

## Decisions

- Forward references are canonical; backlinks, counters, Objects Inside, and graph edges are derived.
- Object Select relations from P2 and content links/backlinks from P4 remain separate indexes even when they can be shown together in UI.
- Embeds store target identity and render current source instead of copied content; editable transclusion writes to the canonical source.
- Graph view is contextual to the focused object/subgraph; a global Obsidian-style graph is not a parity requirement.
- Unlinked mentions are advisory title/alias candidates and require explicit conversion.
- Missing/deleted targets remain repairable explicit states.

## Risks / Trade-offs

- Full rescans are expensive -> incremental but rebuildable indexes.
- Editable embeds can recurse -> cycle detection and nesting limits.
- Reference counters can drift -> derive from the same canonical forward-reference index.

## Migration Plan

1. Define object/block reference records and extraction rules.
2. Add editor object/block reference nodes and pickers.
3. Add backlink/reference-count/Objects-Inside selectors and contextual graph.
4. Add embeds/transclusion and missing-target handling.
5. Add unlinked-mention review/conversion and acceptance tests.

## Open Questions

None for planning.
