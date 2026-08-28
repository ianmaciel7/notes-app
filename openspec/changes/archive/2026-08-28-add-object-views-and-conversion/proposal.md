## Why

The same object and query result set must support multiple representations without duplicating canonical data. Structure dashboards, templates, saved data views, and safe schema-aware conversion should build on the shared query engine rather than object-specific copies.

## What Changes

- Add inline/link-block/small-card/wide-card/embed/page object representations.
- Add persisted list, table, gallery/grid, and wall data views backed by QueryDefinition.
- Add configurable Structure dashboards/templates and an explicit conversion planner for mapping source to target schemas safely.

## Capabilities

### New Capabilities

- `ui/object-views-and-conversion`: Object/data projections, dashboards, templates, and schema-aware conversion flows.

### Modified Capabilities

- None.

## Impact

- Priority: **P6**.
- Depends on `add-query-engine-and-search-index`.
- Calendar and task Kanban remain later specialized view slices.
