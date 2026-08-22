## MODIFIED Requirements

### Requirement: AppShell retains layout ownership
The system SHALL use the existing AppShell for width, resize, collapse, trigger positioning, and mobile shell behavior, with the current live-reference expanded width as its default.

#### Scenario: Desktop sidebar is rendered, resized, or collapsed
- **WHEN** the viewport is at least 768px wide
- **THEN** AppShell's expanded sidebar SHALL default to `14rem` (224px)
- **AND** the sidebar MAY remain resizable up to the existing `24rem` maximum without changing the 224px acceptance baseline
- **AND** the resizable rail, collapse transition, and trigger SHALL remain authoritative
- **AND** app-sidebar SHALL NOT create a second ResizablePanel, SidebarProvider, or offcanvas implementation.

#### Scenario: Mobile navigation state is rendered
- **WHEN** the viewport is below 768px
- **THEN** AppShell SHALL own whether navigation is closed off-canvas or open as an overlay
- **AND** both states SHALL preserve a usable main surface without horizontal page overflow
- **AND** app-sidebar SHALL use the existing Sheet composition rather than compressing the desktop columns.

## ADDED Requirements

### Requirement: Full-row sidebar interaction states
The system SHALL make the complete visible sidebar row the primary activation target while revealing contextual metadata and actions without layout shift.

#### Scenario: Sidebar row is idle, hovered, focused, or selected
- **WHEN** a primary, pinned, object-type, section, or utility row changes between idle, hover, focus-visible, and selected states
- **THEN** its label and icon alignment SHALL remain stable
- **AND** contextual counts and actions SHALL transition over approximately 200ms
- **AND** the selected state SHALL remain perceivable without requiring hover
- **AND** revealing actions SHALL NOT reduce or relocate the row's primary activation target.

#### Scenario: User activates the row or a nested action
- **WHEN** the user activates the row surface outside a nested contextual action
- **THEN** the row's primary navigation or selection action SHALL run exactly once
- **AND WHEN** the user activates a nested menu, sort, add, or overflow action
- **THEN** only that nested action SHALL run and the row SHALL NOT navigate accidentally.

### Requirement: Current-reference sidebar geometry
The expanded sidebar SHALL match the current authenticated reference instead of the historical 288px baseline.

#### Scenario: Expanded sidebar is measured
- **WHEN** the workspace renders at 1536px, 1280px, 1024px, or 768px with navigation expanded
- **THEN** the sidebar SHALL measure 224px
- **AND** the adjacent workspace surface SHALL begin after the 224px sidebar plus a 10px gutter
- **AND** the page SHALL satisfy `scrollWidth === clientWidth`.

