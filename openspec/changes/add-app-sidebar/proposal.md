## Why

The left application sidebar now needs to move beyond the workspace selector and become a faithful, reusable navigation surface that matches the captured Capacities reference while remaining native to the repository's shadcn/Base UI design system.

The current implementation mixes pinned content and object-type rows, scrolls content that must remain visible, and does not yet reproduce the reference geometry and lower-sidebar hover behavior closely enough.

## What Changes

- Keep the existing workspace selector, search, reorder, focus, and responsive behavior.
- Extend the app sidebar with the primary navigation rows for New, Search, Explore, and Calendar.
- Render `Pinned` as a dedicated fixed region below primary navigation so the heading and pinned entities remain visible while the object-type area scrolls.
- Model pinned entities separately from object types: pinned rows use the selected `font-medium` treatment and hover actions without an object-count badge.
- Render object-type rows using the source-derived 29px desktop geometry, compact type labels, hover count, and an 80px action rail.
- Add section headers, sort/add affordances, custom-section creation, Trash, Help and resources, external-hover indicators, and source-derived tooltip behavior.
- Add the fixed footer with Settings, theme, account/Pro, and Share controls using the reference spacing and hover model.
- Prefer existing shadcn/Base UI primitives for buttons, popovers, dropdown menus, collapsibles, dialogs, scroll areas, badges, tooltips, and the app-shell resizable layout.
- Use the existing `globals.css` semantic tokens (`sidebar`, `sidebar-accent`, `muted`, `popover`, `border`, and related foreground tokens) instead of adding sidebar-specific global CSS variables.
- Keep resize and collapse ownership in `AppShell`; the sidebar must not introduce a second resize/offcanvas layout system.

## Capabilities

### New Capabilities

- `ui/app-sidebar`: Reusable Capacities-inspired application sidebar with workspace switching, primary navigation, persistent pinned content, scrollable object sections, lower utility navigation, footer controls, and source-derived interaction fidelity.

### Modified Capabilities

- none

## Impact

- Updates `src/components/app-sidebar.tsx` and the existing `app-sidebar-*` composition components.
- May add focused `app-sidebar-*` components for reusable lower navigation/footer behavior.
- Updates the locale starter page only as needed to render the completed sidebar demo in the existing `AppShellSidebar` contract.
- Updates the OpenSpec delta and canonical UI spec.
- Does not modify `src/components/ui/*` or add sidebar-specific rules to `src/app/globals.css`.
- Reuses existing dependencies; no new package is required.
