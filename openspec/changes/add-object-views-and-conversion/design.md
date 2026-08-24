## Context

Capacities documents multiple Object Views and Data Views, custom type dashboards/templates, and object conversion. Primary references: `https://docs.capacities.io/reference/views`, `https://docs.capacities.io/reference/content-types`, and `https://docs.capacities.io/reference/templates`.

The implementation treats views as Notes App presentation configuration over canonical data, not as claims about vendor-private view storage.

## Goals / Non-Goals

**Goals:** multiple projections of one object, query-backed data views, Structure dashboards/templates, safe conversion.

**Non-Goals:** calendar/Kanban semantics before P7, or silent data-dropping conversion.

## Decisions

- Views persist query/layout/visible-property/group/sort configuration only; they never copy result objects.
- Object representations share canonical selectors and differ only in presentation/affordances.
- Templates instantiate fresh object/block ids.
- Conversion uses a planner that compares schemas, proposes compatible mappings, flags unmapped values, and commits atomically only after explicit resolution.

## Risks / Trade-offs

- View option growth is constrained by a small typed core plus layout-specific options.
- Large tables/cards may require virtualization after measurement.

## Migration Plan

1. Define ViewDefinition and representation contracts.
2. Build list/table/gallery/wall projections.
3. Add Structure dashboards and templates.
4. Replace unsafe/narrow type swapping with conversion planning/mapping.
5. Add cross-projection and conversion acceptance.

## Open Questions

None for planning.
