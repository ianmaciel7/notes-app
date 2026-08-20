## Why

The application needs a reusable top header matching the current Capacities-inspired reference: back and forward navigation on the left, a create action, and a focus-mode action on the right. This should be implemented as a small composable project component rather than embedded directly in a page.

## What Changes

- Add a reusable `AppHeader` component under `src/components`.
- Add back, forward, create, and focus actions using the existing shadcn `Button` primitive and Lucide icons.
- Keep the component controlled through callbacks and disabled states instead of coupling it to routing or feature state.
- Use the same 46px header geometry already established by the reference implementation.
- Integrate the header into the starter page without introducing new dependencies or global styles.

## Capabilities

### New Capabilities

- `ui/app-header`: Reusable application header with history, create, and focus actions.

### Modified Capabilities

- none

## Impact

- Adds `src/components/app-header.tsx`.
- Updates the locale starter page to render the new header.
- Adds a focused OpenSpec change describing and tracking the implementation.
