## Why

The app sidebar overview is structurally present, but several interactions and visual contracts still diverge from the archived Capacities reference. The real repository should refine the existing overview and object-type studio without changing the established AppShell or workspace-selector behavior.

## What Changes

- Refine the `Fixados` and `Tipos de objeto` sections to match the source-inspired 32px desktop section header and compact object-row geometry.
- Keep section count, caret, menu, and add affordances hover-revealed on desktop while preserving touch-friendly mobile behavior.
- Add an existing-entity picker for pinned content using the existing Popover, Input, Item, and ScrollArea primitives.
- Add source-inspired section sorting controls and custom-section creation/edit/delete behavior.
- Expand object context menus with the distinct actions used by pinned objects and object types, including nested open/template/copy submenus where applicable.
- Refine the object-type studio to use native Base UI Dialog dismissal, a fixed header, an independently scrollable body, source-inspired responsive sizing, a `2 → 3 → 4 → 5` preset grid, selectable preset cards, and a right-side detail panel before creation.
- Replace runtime-generated Tailwind tone class strings with static tone mappings.
- Preserve `app-shell.tsx`, the existing workspace selector contract, primary-action behavior, dependencies, and `global.css`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `ui/app-sidebar`: Refine sidebar overview sections, context menus, pinned-content picker, custom sections, and object-type studio behavior to more closely match the archived reference.

## Impact

- Updates focused components under `src/components` only.
- Reuses the repository's configured shadcn/Base UI primitives and Lucide icon library.
- Does not modify app-shell geometry, workspace-switcher behavior, dependencies, or global CSS.
