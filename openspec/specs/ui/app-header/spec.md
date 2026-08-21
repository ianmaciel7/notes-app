## Requirements

### Requirement: Reusable application header
The system SHALL provide a reusable 46px application header matching the compact Capacities-inspired desktop reference.

#### Scenario: Header renders
- **WHEN** a caller renders `AppHeader`
- **THEN** the header SHALL use a 46px height
- **AND** history controls SHALL occupy the left action region
- **AND** a flexible center region SHALL host the main space tabs
- **AND** focus mode SHALL occupy the right action region
- **AND** the create-new-tab control SHALL belong to the center tab strip rather than the history group.

### Requirement: Header navigation actions
The system SHALL provide back and forward navigation actions using the existing ghost icon button primitive.

#### Scenario: History controls render
- **WHEN** the header is rendered
- **THEN** back and forward actions SHALL appear as compact icon buttons
- **AND** each action SHALL invoke its corresponding caller-provided callback when activated
- **AND** callers SHALL be able to disable each history action independently.

### Requirement: Main space tab visual states
The system SHALL provide a reusable main header tab primitive matching the captured Capacities tab geometry and states.

#### Scenario: Main tab renders
- **WHEN** a main tab is rendered in a multi-tab strip
- **THEN** it SHALL use a 32px height, 13px label, 0.5px border, 6px left padding, 1px right padding, and compact entity icon chip
- **AND** an inactive tab SHALL use a transparent border and muted/subtle text
- **AND** hovering an inactive tab SHALL reveal the hover background and secondary text state
- **AND** the active tab SHALL use the base surface, visible border, foreground text, and medium font weight.

#### Scenario: Single main tab renders
- **WHEN** only one main tab remains
- **THEN** the tab SHALL use the neutral fit-content state
- **AND** it SHALL have a maximum width of 500px
- **AND** it SHALL not render a close action
- **AND** its unpinned pin action SHALL appear only on tab hover.

### Requirement: Main tab pin behavior
The system SHALL implement the captured main-tab pin behavior without using pin state to reorder or anchor the tab.

#### Scenario: Unpinned main tab is idle
- **WHEN** a main tab is unpinned and not hovered
- **THEN** its pin action SHALL not be visible unless another rule keeps the action region visible
- **AND** an active closable tab SHALL still keep its close action visible.

#### Scenario: Unpinned main tab is hovered
- **WHEN** an unpinned main tab is hovered
- **THEN** its pin action SHALL become available
- **AND** its close action SHALL become available when the tab is closable.

#### Scenario: Main tab is pinned
- **WHEN** a main tab is pinned
- **THEN** the pin action SHALL remain visible without hover
- **AND** the pin visual SHALL indicate the pinned state
- **AND** pinning SHALL NOT reorder the tab
- **AND** pinning SHALL NOT force the tab to become active
- **AND** pinning SHALL NOT change overflow-window selection.

#### Scenario: Pinned main tab close is requested
- **WHEN** a close request targets a pinned main tab
- **THEN** the owning state SHALL reject the close request
- **AND** the user SHALL receive feedback indicating the tab must be unpinned first.

### Requirement: Main tab responsive sizing and overflow
The system SHALL reproduce the captured main `SpaceHeader` responsive sizing behavior.

#### Scenario: Tabs fit in available width
- **WHEN** the main tab strip has enough width
- **THEN** each tab SHALL have a maximum width of 200px
- **AND** adjacent tabs SHALL use a 5px gap
- **AND** all tabs SHALL remain visible while the computed width is at least 60px.

#### Scenario: Tabs no longer fit at minimum width
- **WHEN** the computed tab width would fall below 60px
- **THEN** the component SHALL keep a contiguous visible window containing the active tab
- **AND** the visible-window calculation SHALL be independent of pin state
- **AND** a tab-list control SHALL expose the full collection.

#### Scenario: Header becomes cramped
- **WHEN** the header enters the cramped sizing state
- **THEN** the create-new-tab action SHALL move out of the inline tab row to the controls area after the tab-list control
- **AND** the transition SHALL preserve the reference 150ms tab-width behavior.

### Requirement: Main tab drag reorder
The system SHALL allow main tabs to be reordered through a controlled drag interaction.

#### Scenario: Main tab is dragged across another tab
- **WHEN** a draggable main tab is dropped before or after another main tab
- **THEN** the caller SHALL receive the reordered collection
- **AND** the UI SHALL show a compact insertion indicator during the valid drop interaction.

### Requirement: Main tab list
The system SHALL provide an overflow/tab-list control for cramped or hidden main tabs.

#### Scenario: Tab list is opened
- **WHEN** the tab-list control is activated
- **THEN** the full main-tab collection SHALL be available for selection
- **AND** closable tabs SHALL expose their close action
- **AND** pinned tabs SHALL visibly communicate their pinned state.

### Requirement: Main create action
The system SHALL expose a create-new-tab action from the main space header.

#### Scenario: Create action is activated
- **WHEN** the main create control is activated
- **THEN** the caller-provided create callback SHALL be invoked
- **AND** the reusable component SHALL NOT own routing, persistence, or global-search implementation.

### Requirement: Side-panel tab header
The system SHALL provide a reusable side-panel header using the same tab visual primitive with side-panel-specific layout rules.

#### Scenario: Side-panel tabs render
- **WHEN** the side-panel tab collection is rendered
- **THEN** the header SHALL use a 46px height
- **AND** side-panel tabs SHALL use a maximum width of 160px
- **AND** side-panel tabs SHALL use a minimum responsive target of 44px
- **AND** adjacent side-panel tabs SHALL use a 4px gap
- **AND** the active/inactive visual states SHALL match the generic tab states.

#### Scenario: Single side-panel tab renders
- **WHEN** only one side-panel tab is present
- **THEN** it SHALL use a neutral fit-content state with a maximum width of 400px.

#### Scenario: Explore side-panel entry renders
- **WHEN** the `explore` entry is present
- **THEN** it SHALL remain selectable and closable
- **AND** it SHALL be non-draggable.

#### Scenario: Side-panel controls render
- **WHEN** side-panel tabs are visible
- **THEN** the tab row SHALL occupy the flexible grid column
- **AND** the tab-list/create controls SHALL occupy the adjacent fit-content column
- **AND** the create action SHALL appear after the tab-list control
- **AND** main-tab pin actions SHALL NOT be rendered in side-panel tabs.

### Requirement: Inactive tab preview
The system SHALL support delayed preview content for eligible inactive tabs using the existing project preview/hover primitive.

#### Scenario: Inactive eligible tab is hovered
- **WHEN** an eligible inactive tab remains hovered for the preview delay
- **THEN** its preview SHALL become visible
- **AND** active or currently dragged tabs SHALL NOT open a hover preview.

### Requirement: Focus mode header controls
The system SHALL provide focus-mode controls matching the captured header transition behavior.

#### Scenario: Focus mode is entered
- **WHEN** focus mode becomes active
- **THEN** the normal application header SHALL no longer render in its normal location
- **AND** a floating exit action SHALL be rendered near the top center.

#### Scenario: Focus control group is hovered
- **WHEN** the user hovers the floating focus control group
- **THEN** back and forward secondary actions SHALL expand horizontally beside the primary exit action
- **AND** the expansion SHALL use a 300ms transition with the reference delayed-hover behavior.

### Requirement: shadcn-style composition
The system SHALL implement the header and tab components as application components composed from existing project primitives.

#### Scenario: Component implementation is reviewed
- **WHEN** the component source is inspected
- **THEN** it SHALL reuse existing `Button`, `Tooltip`, `Popover`, `HoverCard`, and input primitives where applicable
- **AND** it SHALL use the repository-configured Lucide icon library
- **AND** it SHALL expose stable `data-slot` attributes on exported component roots and meaningful subcomponents
- **AND** it SHALL use `cn()` for caller class merging
- **AND** it SHALL NOT add new dependencies or global CSS.

### Requirement: Existing app-shell integration
The system SHALL integrate the expanded header into the current desktop app shell without changing the shell's resize or mobile contracts.

#### Scenario: Header demo is composed into the shell
- **WHEN** the locale starter page renders the desktop app shell
- **THEN** the main panel SHALL render the application header and all representative main-tab states before the main surface
- **AND** the side panel SHALL render the side-panel tab header before the side-panel surface
- **AND** the existing shell resize behavior SHALL remain unchanged
- **AND** the existing mobile shell composition SHALL remain unchanged.
