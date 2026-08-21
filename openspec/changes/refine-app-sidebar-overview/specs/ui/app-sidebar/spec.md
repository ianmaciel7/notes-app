## MODIFIED Requirements

### Requirement: Composable app-sidebar overview
The system SHALL provide reusable sidebar overview sections beneath the existing workspace selector and primary actions without modifying the AppShell contract.

#### Scenario: Overview renders
- **WHEN** the app sidebar overview is rendered
- **THEN** it SHALL support pinned-content and object-type sections
- **AND** the sections SHALL remain inside the existing sidebar content region
- **AND** AppShell sizing, resize behavior, and workspace switching SHALL remain unchanged.

### Requirement: Compact responsive section presentation
The system SHALL render source-inspired compact section headers and rows while remaining usable on touch devices.

#### Scenario: Desktop section is idle
- **WHEN** a section is rendered on a desktop viewport and is not hovered
- **THEN** its header SHALL use compact 32px geometry with a muted 12px label
- **AND** count, caret, menu, and add affordances SHALL not dominate the idle presentation.

#### Scenario: Desktop section is hovered
- **WHEN** the pointer rests on a section header
- **THEN** the section SHALL reveal its caret, count, overflow menu, and configured add action with a short transition.

#### Scenario: Narrow viewport renders a section
- **WHEN** the overview is rendered below the project mobile breakpoint
- **THEN** the section SHALL use touch-friendly controls
- **AND** core section actions SHALL remain reachable without requiring hover.

### Requirement: Pinned-content picker
The system SHALL provide a searchable pinned-content picker from the pinned section add affordance.

#### Scenario: User opens the pinned picker
- **WHEN** the user activates the pinned section add affordance
- **THEN** a Popover SHALL open with a search input and scrollable results
- **AND** already pinned entities SHALL be excluded
- **AND** selecting a result SHALL invoke the configured pick action and close the picker.

### Requirement: Context-specific object menus
The system SHALL expose distinct context menus for pinned objects and object types using the existing DropdownMenu primitives.

#### Scenario: Pinned object menu opens
- **WHEN** the user opens a pinned object's overflow menu
- **THEN** the menu SHALL expose source-inspired open, unpin, type/settings, share/presentation/export/import, copy, duplicate, and delete actions where available
- **AND** nested actions SHALL use DropdownMenu submenus.

#### Scenario: Object-type menu opens
- **WHEN** the user opens an object type's overflow menu
- **THEN** the menu SHALL expose source-inspired open/create/template/query/collection/pin/settings/import actions
- **AND** the open action SHALL be conditional on whether that object type is already the active destination.

### Requirement: Custom sidebar sections
The system SHALL allow local creation and management of custom overview sections through callback-driven state.

#### Scenario: User creates a custom section
- **WHEN** the user activates `Add section`, enters a non-empty name, and confirms
- **THEN** the demo SHALL create a new custom section
- **AND** that section SHALL support rename, sort-mode selection, and deletion controls.

### Requirement: Source-inspired object-type studio
The system SHALL provide an object-type studio that uses the existing Base UI Dialog, ScrollArea, Item, and Button primitives.

#### Scenario: Studio opens
- **WHEN** the user activates the object-type section add action
- **THEN** a viewport-bounded dialog SHALL open
- **AND** the header SHALL remain fixed
- **AND** only the body SHALL scroll
- **AND** backdrop interaction and Escape SHALL close the dialog through native Dialog semantics.

#### Scenario: Studio grid responds to viewport width
- **WHEN** the dialog width changes
- **THEN** preset cards SHALL use a `2 → 3 → 4 → 5` column progression
- **AND** cards SHALL use compact 32px icon containers and source-inspired spacing.

#### Scenario: User selects a preset
- **WHEN** the user selects an object-type preset
- **THEN** the dialog SHALL remain open
- **AND** the selected card SHALL show a selected state
- **AND** a detail panel SHALL open from the right
- **AND** creation SHALL occur only after the detail panel's confirmation action.

### Requirement: Local styling and static tone mappings
The system SHALL avoid global CSS and runtime-generated Tailwind class names for this sidebar refinement.

#### Scenario: Colored object icon is rendered
- **WHEN** an object or preset icon uses a tone
- **THEN** the component SHALL resolve that tone through a static class mapping
- **AND** no `text-${runtime}-...` class construction SHALL be required.
