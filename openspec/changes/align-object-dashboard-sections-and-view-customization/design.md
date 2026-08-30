## Context

Capacities documentation uses “section” for two different navigation concepts: sidebar groups of pins and object-type dashboard tabs. Notes App needs separate types to avoid accidental deletion or command reuse.

## Model

`SidebarSection` owns ordered pinned object/type references and collapse/order presentation.

`DashboardSection` belongs to a Structure and has one source:

- immutable `all`;
- built-in projection;
- collection identity;
- query identity.

It stores order, visibility/pinned state, and optional presentation override. Removing a dashboard section removes only the tab reference; the underlying collection or query remains.

## Built-in Sections

The implementation starts with documented safe built-ins supported by local data: recently opened, untagged, not in collection, no backlinks, collections, and task-specific sections supplied by task management. Any undocumented or type-specific list remains an extensible registry, not a hard-coded claim of reference completeness.

## Small Card Configuration

Each Structure stores ordered visible property IDs. The same configuration is projected into small cards, gallery, wall, and embedded small-card views. Gallery may show configured empty properties; wall may omit empty values. Direct editing is capability-aware by property type and never implied for unsupported number/content/text fields.

## Table View Configuration

Each data view stores ordered column definitions with property ID, visibility, width, and wrapping. Drag reorder and resize update presentation state only. Columns missing after schema changes enter a recoverable configuration warning and do not crash the view.

## Persistence and Migration

Legacy generic dashboard sections migrate by source identity. Unknown source records remain hidden with diagnostics. Per-Structure default card/table configuration is deterministic. View updates are Space-scoped and versioned.

## Testing

Tests cover source identity, remove-vs-delete, ordering, All immutability, query/collection rename, built-ins, card reuse, empty-value differences, column visibility/wrap/reorder/resize, schema mutation, reload, responsive UI, accessibility, and localization.
