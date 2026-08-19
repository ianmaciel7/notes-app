## MODIFIED Requirements

### Requirement: Composable app-sidebar workspace selector
The system SHALL provide a reusable app-sidebar that preserves the existing controlled workspace selector and allows primary sidebar actions to be composed beneath it without modifying the app-shell contract.

#### Scenario: Sidebar selector and primary actions are composed into the shell
- **WHEN** a caller renders the app sidebar inside `AppShellSidebar`
- **THEN** the selected workspace icon, name, and change affordance SHALL remain available
- **AND** the sidebar content area SHALL support the primary actions beneath the workspace selector
- **AND** the app-shell geometry and resize behavior SHALL remain unchanged.

### Requirement: Enabled primary sidebar actions
The system SHALL provide enabled `New`, `Search`, `Explore`, and `Calendar` primary actions using existing shadcn/Base UI primitives.

#### Scenario: Primary actions render
- **WHEN** the primary-actions component is rendered
- **THEN** it SHALL show `New`, `Search`, `Explore`, and `Calendar` in that order
- **AND** every action SHALL use the existing ghost Button primitive with native project sizing
- **AND** every action SHALL remain enabled
- **AND** activating an action SHALL invoke the caller-provided action callback with the corresponding action identifier.

#### Scenario: Active navigation action is supplied
- **WHEN** the caller supplies `search`, `explore`, or `calendar` as the active action
- **THEN** the matching row SHALL use the project muted active surface
- **AND** `New` SHALL NOT be treated as a selected navigation route.

### Requirement: Primary-action hover hints
The system SHALL show reference-inspired hover-only hint content for every primary sidebar action.

#### Scenario: Pointer rests on a primary action
- **WHEN** the pointer remains over `New`, `Search`, `Explore`, or `Calendar` for approximately 200ms
- **THEN** a HoverCard SHALL open using a bottom/start placement
- **AND** the hint SHALL display the configured description and shortcut chips
- **AND** the hint SHALL NOT require click or focus to open.

#### Scenario: Pointer leaves or action is pressed
- **WHEN** the pointer leaves a primary action or the action is pressed
- **THEN** its HoverCard SHALL close immediately
- **AND** pressing the action SHALL still invoke the action callback.

#### Scenario: Action has multiple hint entries
- **WHEN** an action such as `Search` or `Explore` defines multiple hint entries
- **THEN** the HoverCard SHALL render each description with its associated shortcut group in order.

### Requirement: Primary-action shortcut presentation
The system SHALL use the existing `Kbd` and `KbdGroup` primitives for shortcut presentation.

#### Scenario: Shortcut metadata is rendered
- **WHEN** a hover hint includes shortcut metadata
- **THEN** each key SHALL render using `Kbd`
- **AND** platform-appropriate Windows or macOS key tokens SHALL be shown
- **AND** no keyboard shortcut registration SHALL be required by this component.