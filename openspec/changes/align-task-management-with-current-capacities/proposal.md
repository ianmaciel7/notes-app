## Why

The current task domain treats Inbox as a persisted status, includes an unsupported `urgent` priority, supports only daily/weekly/monthly intervals, and defines Today as `scheduledDate == today`. Current documentation describes optional customizable statuses, four priority levels, richer dashboard membership, scheduled- and completion-relative recurrence, custom weekly/monthly/yearly patterns, deadlines that advance with recurrence, catch-up, occurrence history, and statistics.

## What Changes

- Replace closed task status values with a Space-scoped status registry and optional `statusId`.
- Make Inbox a derived dashboard state rather than a persisted status.
- Normalize priority to none, low, medium, and high and migrate `urgent` safely.
- Expand recurrence to day/week/month/year patterns, weekdays, multiple weekdays, ordinal/last-day monthly rules, yearly rules, and optional end dates.
- Correct Inbox, Today, Scheduled, Open, Completed, Context, Tags, and All dashboard membership and ordering.
- Preserve one recurring task identity while advancing scheduled date and relative deadline and recording complete/skip/excuse history.
- Add catch-up choices, streak/completion statistics, heatmap projection, and recurring-query filters.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `domain/task-management`: Align task identity, status, priority, dashboards, recurrence, history, statistics, migration, and query integration with the current documented behavior.

## Impact

- Task metadata, migrations, query projections, calendar aggregation, UI, localization, tests, and stored snapshots.
- Existing task IDs and occurrence history must be preserved.
