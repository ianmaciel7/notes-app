# Design Principles

## Accessibility

- Prioritize clear semantic structure and keyboard-friendly components.

## Coding Standards

- Follow English-first documentation and code-facing artifacts.
- Keep UI behavior intentional and predictable.

## Component Style Contracts

- The Capacities acceptance shell uses the warm `background`/`sidebar` surface
  (`oklch(0.9856 0.0016 67)`), while application panels and editor cards use
  `card`. Their shared light border is `oklch(0.9163 0.0017 67.07)`; route
  components must consume these semantic tokens instead of duplicating colors.
- At desktop acceptance widths, preserve the current measured shell hierarchy: a 224px
  sidebar, a 46px top rail, a 10px content gutter, and a white editor card with
  a 12px radius. Treat these values as layout contracts, not route-level magic
  numbers. See `docs/references/capacities-workspace-parity.md` for the
  timestamped viewport and interaction matrix.

- Shared floating UI such as tooltips, hover cards, popovers, menus, selects,
  comboboxes, and command items must use the centralized primitives in
  `src/components/ui/shared-styles.ts`.
- Floating surfaces use one visual recipe: popover background and foreground,
  the shared light border, a 12px radius, and the centralized low-opacity,
  multi-layer shadow. Do not replace this reference shadow with a stock
  `shadow-md` utility.
- Dropdowns, selects, command menus, and searchable creation menus use 32px
  rows with 14px labels, 8px item radii, secondary icons, and content-aligned
  separators. A 24px compact row is a deliberate named compact-menu variant
  and must not become the default popup density.
- Context variants may change menu width, row density, or scrolling behavior;
  they must inherit the shared surface color, border, radius, shadow, focus,
  highlighted, and selected-state contracts unless current reference evidence
  demonstrates a real contextual difference.
- Sidebar context menus use the shared 269px width exported by
  `src/components/ui/compact-menu.tsx`. Feature components may choose popup
  placement, but they must not redefine the surface, row, separator, icon, or
  shortcut appearance locally.
- Control icons and menu/list items must use the shared icon and item classes
  instead of redefining SVG sizing, pointer events, radius, hover, or selected
  states in each component.
- Object icons must come from `src/components/object-icons.tsx` so a Page,
  Quote, Atomic note, Task, Table, or other object keeps the same glyph in every
  location.
