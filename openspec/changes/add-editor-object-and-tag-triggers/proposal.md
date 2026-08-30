## Why

The editor now supports `/`, `@`, `[[`, and `((`, but reference-aligned quick creation with `+` and tag lookup/creation with `#` are still absent. Implementing them outside the shared suggestion infrastructure would duplicate caret geometry, filtering, keyboard handling, and persistence logic.

## What Changes

- Add a `+` trigger for block actions and new-object creation from runtime Structures.
- Add a `#` trigger for existing-tag lookup and authorized new-tag creation.
- Reuse the shared suggestion controller, search normalization, viewport containment, IME guards, and single-transaction commit behavior.
- Preserve canonical object and tag identities and update links, properties, search, and persistence exactly once.
- Define trigger arbitration with Markdown headings, ordinary punctuation, code/math/table contexts, and existing `/`, `@`, `[[`, and `((` suggestions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/block-editor`: Add shared `+` and `#` suggestion surfaces with correct arbitration and accessibility.
- `domain/object-and-block-linking`: Define canonical quick-created object references and tag references.

## Impact

- Editor suggestion adapters, runtime Structure/tag providers, link/tag commands, localization, tests, and reference evidence.
- Does not add advanced block node types that are planned separately.
