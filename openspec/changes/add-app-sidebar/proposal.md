## Why

The existing application shell needs the primary left-sidebar workspace selector so feature navigation can be built on top of a stable, reusable sidebar foundation.

## What Changes

- Add a reusable app-sidebar workspace selector composed from existing shadcn/Base UI primitives.
- Support controlled space selection, search, search clearing, empty results, and a disabled `Create space` action.
- Support left-handle reordering with a 200ms visual transition while keeping the combobox open after reordering.
- Keep focus on the search field while the popup is open and avoid visible focus/flicker artifacts on empty results and outside clicks.
- Match the selected Capacities-inspired desktop constraints: `18rem` menu width, `27rem` maximum scroll-body height, `right-start` placement, small offsets, no horizontal scrolling, and viewport collision safety.
- Make the `Change space` hint hover-only.
- Use the project 768px mobile breakpoint and a bottom-sheet presentation on narrow viewports.
- Integrate the new component into `AppShellSidebar` without changing the app-shell contract.

## Capabilities

### New Capabilities

- `ui/app-sidebar`: Reusable workspace selector for the application sidebar with search, reorder interaction, responsive presentation, and Base UI/shadcn composition.

### Modified Capabilities

- none

## Impact

- Adds a new component under `src/components`.
- Updates the starter locale page to render it inside the existing application shell.
- Reuses existing dependencies and theme tokens; no new package or global CSS change is required.
