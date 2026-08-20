## ADDED Requirements

### Requirement: Composable application shell primitives
The system SHALL provide a reusable application shell implemented as named shadcn-style React component exports that accept children and native element props so feature-specific controls and content can be composed without modifying the shell.

#### Scenario: Feature content is supplied by children
- **WHEN** a caller renders the application shell
- **THEN** it SHALL be able to provide arbitrary children to the sidebar, headers, content regions, main surface, and side-panel surface
- **AND** the shell SHALL NOT require feature-specific props for navigation items, tabs, menus, explorer actions, or page content.

#### Scenario: Components follow shadcn source conventions
- **WHEN** the shell primitives are imported
- **THEN** they SHALL be exposed as named exports such as `AppShell`, `AppShellProvider`, `AppShellSidebar`, `AppShellWorkspace`, `AppShellMain`, `AppShellSidePanel`, `AppShellHeader`, `AppShellContent`, `AppShellSurface`, and trigger components
- **AND** DOM primitives SHALL support `className`, native props, and `data-slot` attributes
- **AND** CVA SHALL be used only where the component exposes a genuine visual or positional variant.

### Requirement: Desktop three-pane geometry
The system SHALL provide a desktop three-pane layout matching the selected Capacities-inspired shell geometry.

#### Scenario: Default desktop layout is rendered
- **WHEN** the viewport is desktop-sized
- **THEN** the left sidebar SHALL default to `18rem`
- **AND** the left sidebar SHALL be resizable between `14rem` and `24rem`
- **AND** the right side panel SHALL default to `45%` of the workspace
- **AND** the right side panel SHALL be resizable between `10%` and `90%`
- **AND** shell headers SHALL use a height of `46px`
- **AND** main and side-panel surfaces SHALL use approximately `10px` outer/gutter spacing and `rounded-xl` corners.

### Requirement: Native shadcn resize behavior
The system SHALL delegate panel resizing and separator accessibility to the existing shadcn `Resizable` primitives.

#### Scenario: User resizes a panel
- **WHEN** the user drags or keyboard-operates a shell separator
- **THEN** the corresponding `ResizablePanel` SHALL update within its configured constraints
- **AND** the separator SHALL remain the native `ResizableHandle` so ARIA and keyboard behavior are preserved
- **AND** no custom pointer-drag resize implementation SHALL be required.

### Requirement: Stable collapse triggers
The system SHALL keep collapse controls stable and visible through panel collapse and expansion transitions.

#### Scenario: Left sidebar collapses or expands
- **WHEN** the left trigger is activated
- **THEN** the same trigger instance SHALL remain mounted outside the collapsing panel
- **AND** its horizontal position SHALL follow the actual rendered width of the left panel during resize/collapse/expand
- **AND** the trigger SHALL settle near the left edge when the sidebar is fully collapsed
- **AND** it SHALL NOT disappear, remount, or visibly flicker during the transition.

#### Scenario: Right side panel collapses or expands
- **WHEN** the right trigger is activated
- **THEN** the same trigger instance SHALL remain mounted at a stable right-side coordinate
- **AND** the panel SHALL collapse or expand without moving, remounting, or flickering the trigger.

### Requirement: Existing Nova theme is preserved
The system SHALL use the project's existing shadcn Nova theme tokens without modifying global theme definitions.

#### Scenario: Shell surfaces are styled
- **WHEN** the shell renders in the existing project theme
- **THEN** the outer shell and sidebar SHALL use the existing `bg-sidebar` token
- **AND** primary content surfaces SHALL use the existing `bg-background`/border tokens
- **AND** no `globals.css` theme-token changes SHALL be required.

### Requirement: Responsive narrow-screen behavior
The system SHALL switch from the desktop three-pane layout to a mobile-appropriate composition on narrow viewports.

#### Scenario: Viewport is below the mobile breakpoint
- **WHEN** the viewport is narrower than the project's shadcn mobile breakpoint
- **THEN** the main content SHALL remain the primary visible surface
- **AND** left navigation and right side-panel content SHALL be presented through existing shadcn `Sheet` primitives
- **AND** the desktop 18rem/55%/45% split SHALL NOT be compressed into the narrow viewport.
