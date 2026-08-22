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

- Shared floating UI such as tooltips, hover cards, popovers, menus, selects,
  comboboxes, and command items must use the centralized primitives in
  `src/components/ui/shared-styles.ts`.
- Floating surfaces use one visual recipe: popover background and foreground,
  12px radius, `shadow-md`, and `ring-foreground/10`.
- Control icons and menu/list items must use the shared icon and item classes
  instead of redefining SVG sizing, pointer events, radius, hover, or selected
  states in each component.
- Object icons must come from `src/components/object-icons.tsx` so a Page,
  Quote, Atomic note, Task, Table, or other object keeps the same glyph in every
  location.
