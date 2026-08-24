## Why

External calendars should layer onto the completed local date/calendar model. Provider events must remain provider-owned projections by default while users can explicitly create/link Notes App objects and synchronize only provider-supported fields/operations.

## What Changes

- Add Space-scoped Google/Microsoft-style calendar connection adapters with secure OAuth credentials, selected calendars, capabilities, sync cursors, and status.
- Project external events into local calendar views without auto-creating Notes App objects.
- Add explicit event-object/date-property links, supported two-way updates, timezone normalization, read-only/recurrence limitations, and conflicts.

## Capabilities

### New Capabilities

- `domain/calendar-integrations`: Provider event projections, explicit event-object links, capability-aware sync, and conflict/timezone safety.

### Modified Capabilities

- None.

## Impact

- Priority: **P10**.
- Depends on local dates/calendar, Spaces, sync, and generic integration infrastructure.
- Apple Calendar/CalDAV and full calendar replacement are not in scope unless separately specified.
