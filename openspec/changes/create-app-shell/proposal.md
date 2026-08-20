## Why

The app needs a reusable desktop application shell before feature-specific navigation and content are added. The shell must match the Capacities-inspired three-pane geometry already selected for the product while still following native shadcn composition patterns so future headers, navigation, menus, hover cards, tabs, and richer components can be passed as children instead of being hardcoded into the layout.

## What Changes

- Add a reusable app-shell primitive built from the project's existing shadcn `Resizable`, `Button`, `Card`, and `Sheet` components.
- Support a resizable/collapsible left sidebar, resizable/collapsible right side panel, and flexible main workspace.
- Preserve the selected desktop geometry: 18rem left sidebar (14rem–24rem), 45% right panel (10%–90%), 46px headers, 12px surfaces, and approximately 10px outer/gutter spacing.
- Expose named shadcn-style subcomponents (`AppShell`, `AppShellSidebar`, `AppShellMain`, `AppShellSidePanel`, `AppShellHeader`, `AppShellContent`, `AppShellSurface`, triggers) that accept `children`, `className`, and native element props.
- Keep collapse triggers stable during transitions and keep resize behavior delegated to the native shadcn `Resizable` primitives.
- Use the existing Nova theme tokens without modifying `globals.css`.
- Provide a responsive mobile presentation using existing shadcn `Sheet` primitives rather than compressing the desktop three-pane layout.

## Capabilities

### New Capabilities

- `ui/app-shell`: Reusable, composable, responsive application shell with native shadcn resize/collapse primitives and Capacities-inspired geometry.

### Modified Capabilities

- none

## Impact

- Adds a new reusable component under `src/components/ui`.
- Updates the starter page to demonstrate composition with arbitrary child content.
- Reuses existing project dependencies (`react-resizable-panels`, shadcn components, CVA, Lucide) and does not require a new package.
- Establishes the shell contract that future navigation and content features can build on without changing the shell implementation.
