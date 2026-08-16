## Why

The sidebar exposes 13 object-type destinations, but every destination currently renders the daily calendar content. The route appears selected without providing the object list that the user requested or the visible behavior observed in the authenticated Capacities reference.

## What Changes

- Add a shared, typed object-type route contract for all 13 sidebar destinations.
- Render the matching title, controls, count, object cards, and empty state in the central workspace panel.
- Keep the current context panel and responsive shell geometry intact.
- Seed the view from the existing local audit fixture while leaving persistence and editing for later changes.

## Capabilities

### New Capabilities

- `object-list-surface`: Provides route-aware object-type overview/list surfaces for the Portuguese workspace.

### Modified Capabilities

None.

## Dependencies And Sequencing

- Depends on the shared tokens in `define-minimalist-ui-foundation` and the route/sidebar contract in `implement-workspace-sidebar`.
- Implements the object-list checkpoint already named in `openspec/README.md` without adding editor or persistence behavior.
- Browser parity is measured against the rendered authenticated reference, not copied proprietary CSS or JavaScript.

## Non-Goals

- Copy or redistribute Capacities source code, private assets, or bundled JavaScript.
- Implement object creation, editing, deletion, synchronization, authentication, or network persistence.
- Complete search, filtering, sorting, and view-mode behavior beyond accessible controls.
- Claim parity for primary navigation, help, trash, editor, graph, or settings surfaces.

## Impact

- `/tipos/tabelas` and the other object-type URLs render route-specific content instead of the calendar.
- `src/lib/workspace-navigation.ts` becomes the canonical object-type route contract.
- Graphify can index the new route-to-surface relationship after the source change is refreshed.
