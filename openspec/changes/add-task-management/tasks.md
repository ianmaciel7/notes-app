## 0. Evidence and dependency gate

- [ ] 0.1 Complete typed properties, identities, query engine, and object-view prerequisites before apply.
- [ ] 0.2 Re-confirm Task Management/Task Actions sources and documented limitations.

## 1. Task domain

- [ ] 1.1 Define native task metadata, recurrence rules, TaskOccurrence records, validation, migration, and failing-first edge-case tests.

## 2. Dashboards and UI

- [ ] 2.1 Add query-backed native sections, list/Kanban views, occurrence log/stat selectors, and capture/editor flows.
- [ ] 2.2 Keep reminders/custom native Task properties/collections explicitly unsupported unless separately specified.

## 3. Acceptance

- [ ] 3.1 Browser-test create/edit/complete/recur/skip/drag/reload and cross-projection updates with no duplicate task identities.
- [ ] 3.2 Run `pnpm verify`, date/query/view regressions, Playwright, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
