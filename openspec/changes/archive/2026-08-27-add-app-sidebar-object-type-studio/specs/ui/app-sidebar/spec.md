## MODIFIED Requirements

### Requirement: Composable app-sidebar content
The system SHALL provide a reusable app-sidebar that preserves the controlled workspace selector and supports additional sidebar feature surfaces beneath the primary actions without changing the app-shell contract.

#### Scenario: Object-type studio is composed into the sidebar demo
- **WHEN** the enhanced app-sidebar demo is rendered inside `AppShellSidebar`
- **THEN** the workspace selector and primary navigation actions SHALL remain available
- **AND** an object-type studio trigger SHALL be available as secondary sidebar content
- **AND** the app-shell geometry, resize behavior, and workspace selection behavior SHALL remain unchanged.

### Requirement: Object-type studio dialog
The system SHALL provide a large object-type studio dialog using the existing shadcn/Base UI Dialog primitive.

#### Scenario: User opens the object-type studio
- **WHEN** the user activates the object-type studio trigger
- **THEN** a modal dialog SHALL open within viewport-relative outer margins
- **AND** the dialog SHALL cap its desktop width at `max-w-6xl`
- **AND** the dialog SHALL use a viewport-bounded height so its body can scroll independently
- **AND** the dialog SHALL preserve the native Dialog primitive's backdrop and Escape dismissal behavior.

#### Scenario: User dismisses the object-type studio
- **WHEN** the user clicks the dialog backdrop or presses Escape
- **THEN** the existing Dialog primitive SHALL close the object-type studio
- **AND** the implementation SHALL NOT require document-level outside-click or keyboard listeners.

### Requirement: Fixed studio header and scrollable body
The object-type studio SHALL keep its title area fixed while only its content body scrolls.

#### Scenario: Object-type content exceeds available height
- **WHEN** the combined suggested and basic object-type cards are taller than the dialog body
- **THEN** the header SHALL remain visible at the top of the dialog
- **AND** the body SHALL scroll using the existing `ScrollArea` primitive
- **AND** the scrollable region SHALL use flex sizing that can shrink below its content height.

### Requirement: Responsive object-type grid
The object-type studio SHALL adapt its preset grid to available width using source-inspired breakpoints.

#### Scenario: Grid responds to viewport width
- **WHEN** the dialog width crosses the project Tailwind breakpoints
- **THEN** preset cards SHALL render in 2 columns by default
- **AND** SHALL render in 3 columns at `sm`
- **AND** SHALL render in 4 columns at `md`
- **AND** SHALL render in 5 columns at `lg` and above.

### Requirement: Compact object-type preset cards
The object-type studio SHALL render suggested and basic object types using compact cards composed from existing project primitives.

#### Scenario: Object-type presets render
- **WHEN** the studio is open
- **THEN** suggested presets SHALL render before the basic-types section
- **AND** each preset SHALL use the existing `Item` primitive
- **AND** each preset icon container SHALL use approximately 32px geometry
- **AND** selecting a preset SHALL invoke the caller-provided selection callback with the selected preset identifier.
