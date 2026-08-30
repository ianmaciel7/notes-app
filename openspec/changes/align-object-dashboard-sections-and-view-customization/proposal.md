## Why

The current dashboard model represents generic recent, data-view, and template sections but does not fully distinguish sidebar pin sections from object-type dashboard sections or preserve the documented customization contracts for built-in/collection/query tabs, small cards, and table columns.

## What Changes

- Separate sidebar custom sections from object-type dashboard sections in identity, storage, commands, and copy.
- Support immutable All, built-in sections, collections, queries, ordering, hide/remove, and rename-through-source semantics.
- Add per-Structure small-card property visibility/order reused by gallery, wall, and embedded small cards.
- Add table-view column visibility, wrapping, order, width, and persistence.
- Preserve view truthfulness across reload, responsive layouts, and object conversion.
- Do not delete underlying objects, queries, or collections when a section/tab is removed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/object-views-and-conversion`: Complete dashboard section identity and small-card/table-view customization.

## Impact

- View state, Structure settings, object-type dashboard, sidebar separation, cards, tables, persistence, localization, tests, and migrations.
