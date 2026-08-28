## Context

Capacities documents separate Object Views and Data Views, plus contextual Graph View, custom type dashboards/templates, page layouts, and object conversion. Notes App treats these as presentation/configuration over canonical data rather than claims about vendor-private view storage.

## Goals / Non-Goals

**Goals:** explicit Object View contracts, explicit Data View contracts, contextual graph as a separate surface, page-layout configuration, query-backed projections, Structure dashboards/templates, and safe conversion.

**Non-Goals:** calendar/Kanban semantics before P7, global workspace graph parity, or silent data-dropping conversion.

## Decisions

- Object Views and Data Views are different type families.
- Object Views cover inline/link-block/small-card/wide-card/embed/page-style representations over one canonical object.
- Data Views cover list/table/gallery/wall/embed-style result projections backed by QueryDefinition; `grid` is not used as an ambiguous umbrella term.
- Contextual Graph View remains a separate linking-derived surface rather than a generic Data View layout.
- Custom-type page layout/presentation settings are modeled independently from data-list layouts.
- Templates instantiate fresh object/block ids.
- Conversion uses a schema-aware planner and commits atomically only after incompatible/unmapped values are explicitly resolved.

## Risks / Trade-offs

- View option growth -> small typed cores plus layout-specific option records.
- Large data views may require virtualization after measurement.
- Existing `StructurePresentation` is simplified -> migrate without pretending `grid`/`calendar` are equivalent to the documented view taxonomy.

## Migration Plan

1. Define ObjectViewKind, DataViewKind, page-layout configuration, and shared projection contracts.
2. Build list/table/gallery/wall/embed Data Views over QueryDefinition.
3. Add object representations and contextual graph integration from P4.
4. Add Structure dashboards/templates.
5. Replace unsafe type swapping with conversion planning/mapping.

## Open Questions

None for planning.
