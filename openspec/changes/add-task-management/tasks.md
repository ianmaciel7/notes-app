## 0. Evidence and dependency gate

- [x] 0.1 Complete typed properties, identities, query engine, and object-view prerequisites before apply.
- [x] 0.2 Re-confirm Task Management/Task Actions sources and documented limitations.

## 1. Task domain

- [x] 1.1 Define native task metadata, distinct scheduled/deadline values, schedule-driven/completion-driven recurrence modes, TaskOccurrence records, validation, migration, and failing-first edge-case tests.
- [x] 1.2 Cover DST, month-end, late completion, skip/excuse, and recurrence-mode transitions explicitly.

## 2. Dashboards and UI

- [x] 2.1 Add query-backed native sections, list/Kanban views, occurrence log/stat selectors, and capture/editor flows.
- [x] 2.2 Keep reminders/custom native Task properties/unsupported collections explicitly out of scope unless separately specified.

## 3. Acceptance

- [x] 3.1 Browser-test create/edit/complete, both recurrence modes, skip/excuse, drag/reload, occurrence history, and cross-projection updates with no duplicate Task identities.
- [x] 3.2 Run `pnpm verify`, date/query/view regressions, Playwright, build, and strict OpenSpec validation.

## 4. Completion

- [x] 4.1 Sync canonical specs and archive only after evidence is complete.
