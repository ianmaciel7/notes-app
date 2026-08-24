## Context

Capacities documents one Daily Note per day, date links, calendar/timeline navigation, dated objects/tasks, and external calendar integrations as a separate layer. Primary references: `https://docs.capacities.io/reference/dates-and-daily-notes` and `https://docs.capacities.io/reference/calendar-integrations`.

## Goals / Non-Goals

**Goals:** timezone-safe date values, one Daily Note per date, derived local calendar, date links, local create/reschedule.

**Non-Goals:** provider OAuth/sync or full external-calendar replacement.

## Decisions

- Date values store start, optional end, allDay, and timezone semantics explicitly; date-only values are not accidental UTC instants.
- Daily Note uniqueness is a domain invariant keyed by Space/date.
- Calendar entries are projections of canonical object date properties/tasks/Daily Notes; dragging changes the source date property.
- External event adapters are deferred and provider-neutral interfaces may be prepared only as extension points.

## Risks / Trade-offs

- DST/local date boundaries require explicit fixtures.
- Structures with multiple dates require the view to select its driving property.

## Migration Plan

1. Define date/range/timezone helpers and tests.
2. Add Daily Note identity/create-or-get/append/template behavior.
3. Build date indexes and local calendar/timeline projections.
4. Add date links and accessible create/reschedule interactions.
5. Verify task integration and timezone/mobile behavior.

## Open Questions

None for planning.
