## 0. Evidence and dependency gate

- [ ] 0.1 Complete the query engine and linking prerequisites before apply.
- [ ] 0.2 Re-confirm Views, Content Types, Page Layouts, and Templates references.

## 1. View contracts

- [ ] 1.1 Define separate ObjectViewKind and DataViewKind contracts, visible-property config, grouping/sorting hooks, page-layout config, and shared projection components.
- [ ] 1.2 Migrate simplified `StructurePresentation` away from ambiguous `grid`/calendar-as-generic-view assumptions.
- [ ] 1.3 Implement list/table/gallery/wall/embed Data Views over QueryDefinition results.
- [ ] 1.4 Implement inline/link-block/small-card/wide-card/embed/page object representations and integrate contextual graph as a separate surface.

## 2. Dashboards, templates, conversion

- [ ] 2.1 Add per-Structure dashboard sections and creation templates with fresh-id instantiation.
- [ ] 2.2 Add conversion planner, compatibility matrix, mapping UI, and atomic commit/rollback.

## 3. Acceptance

- [ ] 3.1 Browser-test live cross-representation updates, Data View switching/reload, page layouts, templates, contextual graph handoff, and conversion with incompatible values.
- [ ] 3.2 Run performance/accessibility/parity checks, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
