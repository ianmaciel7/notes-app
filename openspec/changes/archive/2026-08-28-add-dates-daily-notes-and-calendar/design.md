## Context

Capacities documents one Daily Note per day, date links, Month/Week/Three-Day/Day calendar navigation, dated objects/tasks, and a Day context that brings together the Daily Note, dated objects, references to the date, and timeline-style chronological content. External calendar integrations remain a separate layer.

## Goals / Non-Goals

**Goals:** timezone-safe date values, one Daily Note per Space/date, explicit Month/Week/Three-Day/Day projections, date references, Day aggregation, and local create/reschedule.

**Non-Goals:** provider OAuth/sync or treating calendar views as independent storage.

## Decisions

- Date values store start, optional end, all-day, and timezone semantics explicitly; date-only values are not accidental UTC instants.
- Daily Note uniqueness is keyed by Space/local date.
- Calendar entries are projections of canonical object date properties, tasks, Daily Notes, and date-reference indexes; dragging changes the source date property.
- Each Structure/view with multiple date properties must select its driving date property explicitly.
- Day view aggregates the canonical Daily Note, dated objects/tasks, incoming date references, and timeline data for that date.
- External calendar adapters are deferred.

## Risks / Trade-offs

- DST/local date boundaries require fixtures.
- Multiple date properties require explicit driving-property configuration.

## Migration Plan

1. Define date/range/timezone helpers and tests.
2. Add Daily Note create-or-get/append/template behavior.
3. Build date indexes and Month/Week/Three-Day/Day/timeline projections.
4. Add date-link/reference indexing and Day aggregation.
5. Add accessible create/reschedule interactions and task integration.

## Open Questions

None for planning.
