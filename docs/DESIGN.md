# Design Principles

## Accessibility

- Prioritize clear semantic structure and keyboard-friendly components.

## Coding Standards

- Follow English-first documentation and code-facing artifacts.
- Keep UI behavior intentional and predictable.

## Component Style Contracts

- Shared floating UI such as tooltips, hover cards, popovers, menus, selects,
  comboboxes, and command items must use the centralized primitives in
  `src/components/ui/shared-styles.ts`.
- Floating surfaces use one visual recipe: popover background and foreground,
  8px radius, `shadow-md`, and `ring-foreground/10`.
- Control icons and menu/list items must use the shared icon and item classes
  instead of redefining SVG sizing, pointer events, radius, hover, or selected
  states in each component.
- Object icons must come from `src/components/object-icons.tsx` so a Page,
  Quote, Atomic note, Task, Table, or other object keeps the same glyph in every
  location.
