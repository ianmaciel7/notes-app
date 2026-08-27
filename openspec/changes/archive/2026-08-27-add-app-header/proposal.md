## Why

The application header needs to match the captured Capacities reference in both appearance and interaction behavior, not only the outer 46px shell. The current implementation places the create action beside history controls and leaves the center region empty, while the reference uses a responsive `SpaceHeader` with tabs, pin/close actions, overflow, drag reordering, a create-new-tab action, and a coordinated side-panel tab header.

## What Changes

- Keep `AppHeader` as the reusable 46px application header, with back/forward history controls on the left and focus mode on the right.
- Add a reusable Capacities-inspired main `AppSpaceHeader` tab strip in the center of `AppHeader`.
- Add a reusable side-panel header tab strip using the same tab primitive but the side-panel sizing and behavior from the captured reference.
- Match the captured tab geometry and states: 32px tabs, 13px labels, 0.5px borders, entity icon chips, hover fades, active/neutral states, and action overlays.
- Implement main-tab pin behavior: unpinned pin action appears on hover, pinned pin action stays visible, pinned tabs reject close requests, and pinning does not reorder or force activation.
- Implement responsive main-tab sizing with 200px maximum width, 60px minimum width, 5px gaps, contiguous active-centered overflow, a tab-list control, and create-action relocation when cramped.
- Implement side-panel tab sizing with 160px maximum width, 44px minimum width, 4px gaps, `explore` as non-draggable, plus/tab-list controls, and close behavior without main-tab pinning.
- Add focus-mode controls matching the reference interaction: the normal header is replaced by a floating close action with back/forward secondary actions that expand on hover.
- Keep the feature controlled through typed props and callbacks so routing, search, persistence, and application data remain outside the reusable components.
- Integrate a representative set of all reference tabs into the locale starter page so the branch demonstrates the intended header states without adding dependencies or global CSS.

## Capabilities

### New Capabilities

- `ui/app-header`: Reusable Capacities-inspired application header, main tab strip, side-panel tab header, and focus-mode header controls.

### Modified Capabilities

- none

## Impact

- Updates `src/components/app-header.tsx`.
- Adds `src/components/app-header-tabs.tsx`.
- Adds a small client demo composition for the starter page.
- Updates the locale starter page to render all reference tab states in the desktop shell.
- Updates the active `add-app-header` OpenSpec proposal, design, delta spec, and tasks to reflect the expanded tab behavior.
