## Why

The current Task entity has only minimal completion/body/date state. Native task parity needs a protected specialized Task model with status, priority, scheduled date, deadline, context links, recurrence, occurrence history, and query-backed dashboards.

## What Changes

- Expand native Task metadata and context relations.
- Add recurring tasks with scheduled-date and completion-relative recurrence plus occurrence history/statistics.
- Add Inbox/Today/Scheduled/Context/Tags/Open/Completed projections and list/status-Kanban views using the shared query/view engine.

## Capabilities

### New Capabilities

- `domain/task-management`: Native Task metadata, recurrence, occurrence history, dashboards, and task interactions.

### Modified Capabilities

- None.

## Impact

- Priority: **P7**.
- Depends on typed properties, identities/relations, query engine, and object views.
- External task actions are deferred to `add-input-integrations`.
