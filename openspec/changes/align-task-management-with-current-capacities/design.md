## Context

The built-in Task remains a canonical object. Task-specific metadata is typed but must interoperate with shared properties, query engine, calendar, backlinks, tags, and object links. This change replaces closed enums that encode view state as data.

## Data Model

`TaskStatusDefinition` is Space-scoped with ID, label, color, icon, order, and completion semantics. Defaults are Not started, Next Up, In progress, and Done, but `statusId` may be null. Completion is derived from the selected status's completion semantics or explicit simple-checkbox completion when no status workflow is used.

Priority is `none | low | medium | high`.

Recurrence is a discriminated rule:

- interval and unit: day/week/month/year;
- mode: scheduled-date or completion-date;
- weekly weekdays;
- monthly day-of-month, ordinal weekday, last day, or last weekday;
- yearly month/day or ordinal weekday in month;
- end: never or on-date.

Occurrence records keep action, action time, scheduled date, deadline, completion status used, and catch-up metadata.

## Derived Dashboards

- Inbox: incomplete tasks without scheduled date, deadline, or assigned status.
- Today: tasks scheduled today plus overdue or due-today deadlines.
- Scheduled: all scheduled tasks, with overdue first.
- Context and Tags: shared query projections.
- Open: incomplete tasks.
- Completed: completed tasks.
- All: immutable base section.

Calendar Today additionally includes overdue scheduled tasks, in-progress tasks, and tasks completed today, which is distinct from the task-dashboard Today contract.

Ordering is deterministic: completion/status grouping as configured, priority, relevant deadline/scheduled date, then stable identity.

## Recurrence

Scheduled-date mode stays anchored to the calendar pattern. Completion-date mode advances relative to action date. Deadline offset is preserved and clamped not earlier than the new scheduled date. Catch-up can advance one or absorb missed occurrences. Skip and excuse advance without completion; excuse preserves streak. When no future occurrence exists, the task becomes permanently complete.

## Migration

- `urgent` maps to `high`.
- `inbox` maps to null status with no scheduling/deadline where possible; contradictory legacy data is preserved through a migration warning and derived projection.
- `open`, `in-progress`, and `completed` map to default status IDs.
- daily/weekly/monthly rules map to interval rules.
- all task IDs, links, notes, dates, and occurrence history remain stable.

## Testing

Property-based date tests cover DST-independent date-only calculations, month-end clamping, leap years, ordinal rules, end dates, deadline offsets, catch-up, idempotency, migration, dashboards, calendar distinction, query filters, localization, and accessibility.
