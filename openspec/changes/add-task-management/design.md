## Context

Capacities documents native Task status, priority, scheduled date, deadline, context, recurring tasks, occurrence history, dashboards, and list/Kanban views. Recurrence distinguishes schedule-driven behavior from completion-driven behavior; Task remains a specialized built-in type in this parity slice.

## Goals / Non-Goals

**Goals:** first-class task metadata, context links, scheduled-date vs deadline semantics, schedule-driven and completion-driven recurrence, occurrence history, dashboards, list/Kanban interactions.

**Non-Goals:** reminders, arbitrary native Task schema extension, collections on native Task unless separately evidenced, or external task-manager actions.

## Decisions

- Native Task remains a protected specialized lifecycle over the common object model.
- Scheduled date and deadline are distinct values.
- Recurrence stores an explicit mode: schedule-based recurrence advances from its schedule rule, while completion-based recurrence computes the next occurrence relative to completion according to the configured rule.
- One logical Task identity is retained while occurrence records preserve complete/skip/excuse history.
- Dashboards are QueryDefinition/ViewDefinition presets rather than hardcoded stores.

## Risks / Trade-offs

- Recurrence requires DST/month-end/timezone fixtures.
- Completion-driven recurrence can be ambiguous around late completion -> the configured rule/mode must be explicit and tested.
- Kanban drag must dispatch one typed status mutation and rollback on failure.

## Migration Plan

1. Define expanded Task, recurrence mode/rules, and TaskOccurrence records.
2. Migrate current completion/due-date fields conservatively.
3. Add recurrence engine/history/stat selectors.
4. Build dashboard queries and list/Kanban views.
5. Update capture/edit/mobile interactions and acceptance.

## Open Questions

None for planning.
