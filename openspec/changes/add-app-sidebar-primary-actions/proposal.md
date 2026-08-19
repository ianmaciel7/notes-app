## Why

The left application sidebar now has a stable workspace selector, but it still lacks the primary navigation actions visible in the Capacities reference. Adding these actions as a reusable layer lets the starter shell match the reference more closely without changing the existing app-shell or workspace-selector contracts.

## What Changes

- Add enabled `New`, `Search`, `Explore`, and `Calendar` primary sidebar actions below the workspace selector.
- Implement the actions as a reusable data-driven component composed from the existing shadcn/Base UI `Button`, `HoverCard`, and `Kbd` primitives.
- Show a hover-only hint for every primary action after an approximately 200ms delay, including the reference shortcut content.
- Keep the buttons enabled and expose action callbacks instead of implementing feature routing or dialogs in this change.
- Preserve the existing app-shell geometry, resize behavior, workspace selector, and responsive behavior.
- Update the starter sidebar demo to render the new primary actions.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `ui/app-sidebar`: Add enabled primary navigation actions with reference-inspired hover hints and shortcut presentation.

## Impact

- Adds a focused sidebar-primary-actions component under `src/components`.
- Updates the locale starter page to use the enhanced sidebar demo.
- Extends the existing `ui/app-sidebar` specification without adding dependencies or changing global styles.