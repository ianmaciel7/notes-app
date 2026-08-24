## 0. Evidence and dependency gate

- [ ] 0.1 Complete typed properties, identities, query engine, and object-view prerequisites before apply.
- [ ] 0.2 Re-confirm Task Management/Task Actions sources and documented limitations.

## 1. Task domain

- [ ] 1.1 Define native task metadata, distinct scheduled/deadline values, schedule-driven/completion-driven recurrence modes, TaskOccurrence records, validation, migration, and failing-first edge-case tests.
- [ ] 1.2 Cover DST, month-end, late completion, skip/excuse, and recurrence-mode transitions explicitly.

## 2. Dashboards and UI

- [ ] 2.1 Add query-backed native sections, list/Kanban views, occurrence log/stat selectors, and capture/editor flows.
- [ ] 2.2 Keep reminders/custom native Task properties/unsupported collections explicitly out of scope unless separately specified.

## 3. Acceptance

- [ ] 3.1 Browser-test create/edit/complete, both recurrence modes, skip/excuse, drag/reload, occurrence history, and cross-projection updates with no duplicate Task identities.
- [ ] 3.2 Run `pnpm verify`, date/query/view regressions, Playwright, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
