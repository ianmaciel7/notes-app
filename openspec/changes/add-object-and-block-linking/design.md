## Context

Capacities documents object links, block references, transclusion, backlinks, contextual graph navigation, and unlinked mentions. Primary references: `https://docs.capacities.io/reference/block-based-linking`, `https://docs.capacities.io/reference/unlinked-mentions`, and `https://docs.capacities.io/reference/views`.

The project archive supports captured UI/source evidence but does not disclose the private link encoding or graph storage. Notes App will therefore use a clean-room id-based graph model.

## Goals / Non-Goals

**Goals:** rename-safe links, durable BlockId references, derived backlinks, source-backed embeds, contextual graph, explicit mention conversion.

**Non-Goals:** semantic Related Content, collaboration, or claims about Capacities' private token format.

## Decisions

- Forward references are canonical; backlinks and graph edges are derived.
- Embeds store target identity and render the current source rather than copied content.
- Unlinked mentions are advisory and require user confirmation before mutation.
- Missing/deleted targets remain explicit repairable states instead of silently degrading to plain text.

## Risks / Trade-offs

- Full rescans can be expensive, so indexes are incrementally updated but deterministically rebuildable.
- Editable embeds can recurse; cycle detection and nesting limits are mandatory.

## Migration Plan

1. Define reference/link records and extraction rules.
2. Add editor object/block reference nodes and pickers.
3. Add derived backlinks/local graph.
4. Add embeds/transclusion and missing-target handling.
5. Add unlinked-mention review/conversion and acceptance tests.

## Open Questions

None for planning.
