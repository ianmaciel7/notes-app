## Context

Capacities documents Google Calendar and Microsoft 365 connections, provider-owned events, object/date links, and important write/recurrence limitations. Primary references: `https://docs.capacities.io/reference/calendar-integrations` and `https://docs.capacities.io/reference/dates-and-daily-notes`.

Notes App defines its own normalized provider adapters; exact vendor/private sync payloads are not inferred.

## Goals / Non-Goals

**Goals:** external event projections, explicit object links, least-privilege connections, capability-aware sync, timezone/conflict safety.

**Non-Goals:** full Google/Outlook replacement, Apple/CalDAV, or unsupported recurrence editing.

## Decisions

- External events remain provider-owned cached projections and do not become Notes App objects automatically.
- CalendarEventLink stores provider/account/calendar/event ids plus the linked local object/date property.
- Adapters expose a capability matrix; unsupported/read-only operations are disabled/explained.
- Concurrent local/remote date changes preserve candidates and follow an explicit conflict policy rather than silent overwrite.

## Risks / Trade-offs

- Recurring instance identifiers are provider-specific and need normalized series/instance handling.
- Timezone/all-day semantics must use the shared date model.

## Migration Plan

1. Define connection/event/link/capability/sync/conflict records and fake-provider conformance tests.
2. Implement Google/Microsoft OAuth/adapter contracts with least scopes.
3. Add read-only external event projection into local calendar.
4. Add explicit create/link-object and supported two-way updates.
5. Add recurrence/read-only/conflict UI and provider acceptance.

## Open Questions

None for planning.
