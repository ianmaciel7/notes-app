## Why

Dates need to become a shared domain primitive rather than task-only strings. The workspace also needs exactly one Daily Note per date plus local calendar/timeline projections over canonical dated objects before external calendar integrations can be safe.

## What Changes

- Add canonical all-day/timed/range date values with timezone semantics.
- Add one idempotent Daily Note per Space/date with templates and date navigation.
- Add derived Month/Week/Three-Day/Day/timeline views and local create/reschedule interactions.

## Capabilities

### New Capabilities

- `domain/dates-daily-notes-and-calendar`: Shared date semantics, Daily Note uniqueness, date navigation, and local calendar projections.

### Modified Capabilities

- None.

## Impact

- Priority: **P7**.
- Depends on typed properties and query engine; integrates with native Task scheduling.
- Google/Microsoft provider sync remains `add-calendar-integrations`.
