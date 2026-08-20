## Why

The app sidebar is progressively matching the Capacities reference, but it still lacks the object-type studio interaction used to add new object types. The current prototype demonstrated that a simple oversized dialog is not enough: the reference keeps the header fixed, scrolls only the body, and adapts the card grid responsively.

## What Changes

- Add an object-type studio entry point to the app sidebar demo.
- Open a large desktop dialog for adding object types using the existing shadcn/Base UI Dialog primitive.
- Keep the dialog header fixed while only the object-type body scrolls.
- Size the dialog against the viewport with consistent outer margins and a `max-w-6xl` cap.
- Render suggested and basic object types in a responsive `2 → 3 → 4 → 5` column grid.
- Use compact object-type cards that match the source-inspired 32px icon geometry.
- Preserve native backdrop click and Escape dismissal behavior from the existing Dialog primitive.
- Keep app-shell geometry, workspace switching, and primary action behavior unchanged.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `ui/app-sidebar`: Add a responsive, internally scrollable object-type studio dialog to the sidebar demo.

## Impact

- Adds a focused object-type studio component under `src/components`.
- Updates the app-sidebar primary-actions demo composition to include the object-type studio trigger.
- Extends the existing `ui/app-sidebar` specification without changing dependencies or global styles.
