## ADDED Requirements

### Requirement: Composable app-sidebar workspace selector
The system SHALL provide a reusable app-sidebar workspace selector that composes existing project shadcn/Base UI primitives and exposes controlled selection and reorder behavior without modifying the app-shell contract.

#### Scenario: Sidebar selector is composed into the shell
- **WHEN** a caller renders the app sidebar inside `AppShellSidebar`
- **THEN** the selector SHALL render the selected workspace icon, name, and change affordance
- **AND** it SHALL accept controlled space data, selected value, selection callback, and reorder callback.

### Requirement: Search and empty-state behavior
The system SHALL let users filter available spaces from a search field inside the workspace popup.

#### Scenario: User types a matching query
- **WHEN** the user types into the search field
- **THEN** the list SHALL show only matching spaces
- **AND** the search field SHALL retain DOM focus.

#### Scenario: User clears search
- **WHEN** the search field contains text
- **THEN** a clear control SHALL be available inside the input
- **AND** activating it SHALL clear only the query, keep the selected space unchanged, keep the popup open, and return focus to the search field.

#### Scenario: Search returns no spaces
- **WHEN** filtering produces zero results
- **THEN** the popup SHALL show `No options found.`
- **AND** the list structure SHALL remain mounted for stable focus behavior
- **AND** the create-space footer and separator SHALL NOT be shown.

### Requirement: Stable popup focus and closing
The system SHALL keep popup focus and closing behavior visually stable.

#### Scenario: Popup opens
- **WHEN** the user opens the workspace selector
- **THEN** the search field SHALL receive focus
- **AND** the trigger SHALL NOT display a competing focus treatment while the popup is open.

#### Scenario: User clicks outside
- **WHEN** the popup is open and the user clicks outside it
- **THEN** the popup SHALL close without rebuilding its filtered content during the close interaction
- **AND** focus SHALL NOT visibly jump back to the trigger
- **AND** the popup SHALL NOT flash or flicker.

### Requirement: Hover-only workspace hint
The system SHALL show the change-space hint only as a pointer-hover affordance.

#### Scenario: Pointer rests over the selector
- **WHEN** the pointer remains over the selector for the configured hover delay and the popup is closed
- **THEN** a `Change space` hover card SHALL appear beside the selector.

#### Scenario: User clicks or selects a workspace
- **WHEN** the selector is clicked or a space is selected
- **THEN** the hover card SHALL be hidden immediately
- **AND** it SHALL NOT reopen because of focus or selection events.

### Requirement: Reorder spaces from a dedicated handle
The system SHALL allow spaces to be reordered from a dedicated left-side drag handle.

#### Scenario: User hovers a space row
- **WHEN** the pointer hovers a reorderable space row with no active search query
- **THEN** the normal space icon SHALL be replaced by a grab handle
- **AND** the row itself SHALL NOT become the drag initiation surface.

#### Scenario: User drags a space
- **WHEN** the user drags from the grab handle
- **THEN** neighboring spaces SHALL reorder as the pointer crosses their vertical midpoint
- **AND** reordered rows SHALL animate for approximately 200ms
- **AND** selection SHALL be suppressed while sorting.

#### Scenario: User releases the drag
- **WHEN** a reorder drag completes
- **THEN** the component SHALL call `onReorder` with the new order
- **AND** the workspace combobox SHALL remain open
- **AND** the search field SHALL regain focus.

### Requirement: Desktop workspace-menu geometry
The system SHALL preserve the selected Capacities-inspired desktop popup geometry without horizontal scrolling.

#### Scenario: Desktop popup is rendered
- **WHEN** the viewport is at least 768px wide
- **THEN** the popup SHALL use an `18rem` desktop width
- **AND** its scroll body SHALL be capped at `27rem` and the currently available popup height
- **AND** it SHALL prefer a right/start placement with approximately 4px side and alignment offsets
- **AND** horizontal overflow SHALL be clipped while vertical overflow remains scrollable
- **AND** the search field SHALL remain outside the vertically scrolling body.

### Requirement: Narrow-screen presentation
The system SHALL provide a mobile-appropriate presentation using existing shadcn Sheet primitives.

#### Scenario: Viewport is below 768px
- **WHEN** the workspace selector is opened
- **THEN** its content SHALL be presented in a bottom sheet
- **AND** the search, empty state, space list, and disabled create-space action SHALL preserve the same interaction semantics as desktop.

### Requirement: Disabled create-space affordance
The system SHALL display the create-space action only when the filtered list has at least one item and SHALL keep that action disabled until the create-space flow is implemented.

#### Scenario: Spaces are available
- **WHEN** one or more spaces are visible
- **THEN** the footer SHALL show a disabled `Create space` button separated from the list.

#### Scenario: No spaces match the query
- **WHEN** zero spaces are visible
- **THEN** the footer and its separator SHALL be omitted.
