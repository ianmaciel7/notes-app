## ADDED Requirements

### Requirement: Reusable application header
The system SHALL provide a reusable application header component with the compact geometry used by the Capacities-inspired reference.

#### Scenario: Header renders
- **WHEN** a caller renders `AppHeader`
- **THEN** the header SHALL use a 46px height
- **AND** it SHALL expose a flexible center region for caller content
- **AND** it SHALL preserve native shadcn interaction and focus styling.

### Requirement: Header navigation actions
The system SHALL provide back and forward navigation actions using the existing ghost icon button primitive.

#### Scenario: History controls render
- **WHEN** the header is rendered
- **THEN** back and forward actions SHALL appear as icon buttons
- **AND** each action SHALL invoke its corresponding caller-provided callback when activated
- **AND** callers SHALL be able to disable each history action independently.

### Requirement: Header create action
The system SHALL provide a create action using the existing ghost icon button primitive.

#### Scenario: Create action is activated
- **WHEN** the create control is activated
- **THEN** the caller-provided create callback SHALL be invoked
- **AND** the component SHALL NOT implement creation routing or dialogs itself.

### Requirement: Header focus action
The system SHALL provide a focus-mode action using the existing ghost icon button primitive and dashed-circle visual affordance.

#### Scenario: Focus action is activated
- **WHEN** the focus control is activated
- **THEN** the caller-provided focus callback SHALL be invoked
- **AND** the component SHALL NOT own focus-mode state unless supplied by the caller.

### Requirement: shadcn-style composition
The system SHALL implement the header as an application component composed from existing project primitives.

#### Scenario: Component implementation is reviewed
- **WHEN** the component source is inspected
- **THEN** it SHALL use the existing `Button` primitive and Lucide icons
- **AND** it SHALL expose standard DOM props through `React.ComponentProps`
- **AND** it SHALL provide `data-slot` attributes for stable composition hooks
- **AND** it SHALL NOT add global CSS or new dependencies.

### Requirement: Existing app-shell integration
The system SHALL integrate the application header into the current main app-shell area without changing existing sidebar, side-panel, resize, or mobile contracts.

#### Scenario: Header is composed into the shell
- **WHEN** the locale starter page renders the desktop app shell
- **THEN** the main panel SHALL render `AppHeader` before the main surface
- **AND** the side panel SHALL retain its existing shell header
- **AND** mobile shell composition SHALL remain unchanged.
