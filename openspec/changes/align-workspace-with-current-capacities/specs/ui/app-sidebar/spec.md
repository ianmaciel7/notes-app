## MODIFIED Requirements

### Requirement: AppShell retains layout ownership
The system SHALL use the existing AppShell for width, resize persistence, collapse, trigger positioning, gutters, and mobile shell behavior, and SHALL compare width only against a matched current-reference state.

#### Scenario: Desktop sidebar is rendered, resized, or collapsed
- **WHEN** the viewport is at least 768px wide
- **THEN** AppShell's clean default and any persisted resized width SHALL be distinguishable in test setup
- **AND** the matched August 26, 2026 reference state at 1153x912 SHALL measure approximately 288px while the current 224px localhost default SHALL be treated as a parity gap
- **AND** the sidebar MAY remain resizable up to the existing `24rem` maximum
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
The expanded sidebar SHALL match the width, gutter, and resize state of a timestamped authenticated reference observation instead of enforcing one fixed width across unrelated states.

#### Scenario: Expanded sidebar is measured
- **WHEN** the workspace and authenticated reference render at the same viewport with navigation expanded and the resize state recorded
- **THEN** their sidebar widths SHALL match within 1px
- **AND** at the audited 1153x912 reference state the sidebar SHALL measure approximately 288px and the adjacent workspace surface SHALL begin at approximately x=298 after a 10px gutter
- **AND** the page SHALL satisfy `scrollWidth === clientWidth`.

