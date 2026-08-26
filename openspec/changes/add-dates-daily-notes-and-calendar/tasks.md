## 0. Evidence and dependency gate

- [x] 0.1 Complete typed-date/query prerequisites and re-confirm Dates/Daily Notes/Calendar references.

## 1. Date and Daily Note domain

- [x] 1.1 Define DatePropertyValue, timezone/range helpers, query operators, and DST/all-day/range tests.
- [x] 1.2 Add Daily Note canonical identity, uniqueness, create-or-get/append commands, templates, and migration policy.
- [x] 1.3 Add date-reference indexes and explicit driving-date-property configuration.

## 2. Calendar UI

- [x] 2.1 Add Month/Week/Three-Day/Day/timeline projections.
- [x] 2.2 Make Day aggregate Daily Note, dated objects/tasks, date references, and timeline data.
- [x] 2.3 Add date links and keyboard-accessible local creation/rescheduling.

## 3. Acceptance

- [ ] 3.1 Browser-test Daily Note idempotency, timezone reload, all four calendar spans, date references, Day aggregation, create/reschedule, task integration, mobile overflow, and clean console.
- [ ] 3.2 Run `pnpm verify`, query/view/date regressions, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
