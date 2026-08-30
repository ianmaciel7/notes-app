## 1. Status, Priority, and Migration

- [ ] 1.1 Add failing tests for Space-scoped status definitions, optional status, custom order, completion semantics, and invalid references.
- [ ] 1.2 Implement the status registry and migrate legacy inbox/open/in-progress/completed values.
- [ ] 1.3 Remove `urgent` from the canonical priority model and migrate it to high with snapshot compatibility tests.

## 2. Dashboard Semantics

- [ ] 2.1 Add failing tests for Inbox, Today, Scheduled, Context, Tags, Open, Completed, and All membership.
- [ ] 2.2 Implement shared query-backed projections and deterministic deadline/priority ordering.
- [ ] 2.3 Add separate calendar-Today aggregation tests for overdue, in-progress, and completed-today tasks.

## 3. Recurrence

- [ ] 3.1 Add failing rule-validation and next-date tests for day/week/month/year, weekdays, multiple weekdays, ordinal/last monthly rules, yearly rules, leap years, and end dates.
- [ ] 3.2 Implement scheduled-date and completion-date recurrence without changing task identity.
- [ ] 3.3 Implement deadline-offset advancement and clamping.
- [ ] 3.4 Implement advance-one and catch-up actions plus complete, skip, and excuse occurrence records.
- [ ] 3.5 Implement streak, best streak, completion count/rate, heatmap projection, and recurring-query filters.

## 4. UI and Acceptance

- [ ] 4.1 Add status customization, recurrence editor, occurrence log, statistics, and truthful empty/error states.
- [ ] 4.2 Verify keyboard, accessibility, responsive, offline, sync, persistence, and migration behavior.
- [ ] 4.3 Run repository verification and `openspec validate align-task-management-with-current-capacities --strict`.
