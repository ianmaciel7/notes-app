## Context

Capacities documents native Task status, priority, scheduling, deadline, context, recurring tasks, occurrence history, dashboards, and Kanban/list views. Primary references: `https://docs.capacities.io/reference/task-management` and `https://docs.capacities.io/reference/task-actions`.

The reference also documents important limits: native Task remains a fixed specialized type; arbitrary custom task properties/collections/reminders are not assumed in this parity slice.

## Goals / Non-Goals

**Goals:** first-class task metadata, context links, recurrence/history, dashboards, list/Kanban interactions.

**Non-Goals:** reminders, arbitrary native Task schema extension, or external task-manager actions.

## Decisions

- Native Task remains a protected specialized lifecycle over the common object model.
- Scheduled date and deadline are distinct values.
- Recurrence advances one logical Task identity while occurrence records preserve completion/skip/excuse history.
- Dashboards are QueryDefinition/ViewDefinition presets rather than separate hardcoded data stores.

## Risks / Trade-offs

- Recurrence requires DST/month-end/timezone fixtures.
- Kanban drag must dispatch one typed status mutation and rollback on failure.

## Migration Plan

1. Define expanded Task and TaskOccurrence records.
2. Migrate current completion/due-date fields conservatively.
3. Add recurrence engine/history/stat selectors.
4. Build dashboard queries and list/Kanban views.
5. Update capture/edit/mobile interactions and run acceptance.

## Open Questions

None for planning.
