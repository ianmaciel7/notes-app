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
The system SHALL provide back and forward navigation actions using compact source-matched icon controls.

#### Scenario: History controls render
- **WHEN** the header is rendered
- **THEN** back and forward actions SHALL appear as 28px compact icon buttons
- **AND** each action SHALL invoke its corresponding caller-provided callback when activated
- **AND** callers SHALL be able to disable each history action independently.

### Requirement: Main space tab visual states
The system SHALL provide a reusable main header tab primitive matching the captured Capacities tab geometry and states.

#### Scenario: Main tab renders
- **WHEN** a main tab is rendered in a multi-tab strip
- **THEN** it SHALL use a 32px height, 13px label, 0.5px border, 6px left padding, 1px right padding, and compact entity icon chip
- **AND** an inactive tab SHALL use a transparent border and subtle text
- **AND** hovering an inactive tab SHALL reveal the back-hover surface and secondary text state
- **AND** the active tab SHALL use the base surface, visible front border, primary text, and medium font weight.

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
- **THEN** its outline pin action SHALL become available
- **AND** its close action SHALL become available when the tab is closable.

#### Scenario: Main tab is pinned
- **WHEN** a main tab is pinned
- **THEN** the filled pin action SHALL remain visible without hover
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
The system SHALL provide a reusable side-panel header using the same tab visual primitive with side-panel-specific layout and shell controls.

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

#### Scenario: Side-panel tab controls render
- **WHEN** side-panel tabs are visible
- **THEN** the tab row SHALL occupy the flexible grid column
- **AND** the tab-list/create controls SHALL occupy the adjacent fit-content column
- **AND** the create action SHALL appear after the tab-list control
- **AND** main-tab pin actions SHALL NOT be rendered in side-panel tabs.

#### Scenario: Side-panel shell controls render while the panel is open
- **WHEN** the side panel is expanded
- **THEN** its header SHALL own the 28px hide-sidepanel action followed by the 16px caret menu action
- **AND** the shell SHALL NOT overlay a duplicate panel toggle on top of the open header.

#### Scenario: Side-panel shell controls render while the panel is collapsed
- **WHEN** the side panel is collapsed
- **THEN** the main application header SHALL expose the reopen-sidepanel action and adjacent menu control.

### Requirement: Side-panel special-entry menu
The system SHALL reproduce the captured side-panel special-entry menu behavior.

#### Scenario: Side-panel menu is opened
- **WHEN** the caret control is activated
- **THEN** a bottom-end menu with a 6px offset SHALL expose the available special entries
- **AND** the menu SHALL support Graph View, Backlinks, Objects Inside, Related Content, AI Chat, and Local Search entries with source-matched icons.

#### Scenario: Existing special entry is selected
- **WHEN** a special entry already exists in the side panel
- **THEN** selecting it SHALL activate that existing entry instead of duplicating it.

#### Scenario: Missing special entry is selected
- **WHEN** a supported special entry is not yet present
- **THEN** selecting it SHALL add or create the corresponding side-panel entry and activate it.

### Requirement: Side-panel create action
The system SHALL reproduce the captured `New Sidepanel Tab` action rather than treating the plus as a generic empty-tab creator.

#### Scenario: Plus is activated without Explore open
- **WHEN** the create-sidepanel action is activated and the Explore entry is missing or not active
- **THEN** the owning state SHALL open or activate Explore.

#### Scenario: Plus is activated while Explore is active
- **WHEN** the create-sidepanel action is activated while Explore is already active
- **THEN** the owning state SHALL open search in side-panel mode
- **AND** selecting a search result SHALL open that result in the side panel.

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

### Requirement: Source-matched composition
The system SHALL implement the header and tab components as application components composed from existing project primitives while preserving source-matched Capacities geometry and glyphs.

#### Scenario: Component implementation is reviewed
- **WHEN** the component source is inspected
- **THEN** it SHALL reuse existing `Button`, `Tooltip`, `DropdownMenu`, `HoverCard`, and input primitives where applicable
- **AND** Capacities-specific header controls MAY use local SVG components for the exact captured Phosphor glyphs
- **AND** it SHALL expose stable `data-slot` attributes on exported component roots and meaningful subcomponents
- **AND** it SHALL use `cn()` for caller class merging
- **AND** it SHALL NOT add new dependencies or global CSS.

### Requirement: Existing app-shell integration
The system SHALL integrate the expanded header into the current desktop app shell without changing the shell's resize or mobile contracts.

#### Scenario: Header demo is composed into the shell
- **WHEN** the locale starter page renders the desktop app shell
- **THEN** the main panel SHALL render the application header and all representative main-tab states before the main surface
- **AND** the side panel SHALL render the side-panel tab header before the side-panel surface
- **AND** open side-panel controls SHALL be owned by that header rather than a duplicate absolute shell trigger
- **AND** the existing shell resize behavior SHALL remain unchanged
- **AND** the existing mobile shell composition SHALL remain unchanged.

### Requirement: Reliable main-tab hit targets
The system SHALL keep tab selection and nested pin/close actions as distinct, non-overlapping interaction targets.

#### Scenario: User activates the primary tab surface
- **WHEN** a user clicks the horizontal center of a visible tab or activates its tab role with the keyboard
- **THEN** that tab SHALL become active
- **AND** neither Pin nor Close SHALL run
- **AND** the primary selection region SHALL remain at least 44px by 32px when contextual actions are visible.

#### Scenario: User activates a nested tab action
- **WHEN** a user activates Pin or Close
- **THEN** only the selected nested action SHALL run
- **AND** the accessible names for the tab, Pin, and Close SHALL remain distinct
- **AND** the nested controls SHALL NOT cover the tab's geometric center.

### Requirement: Current tab state timing
The system SHALL reproduce the current reference tab state changes without layout shift.

#### Scenario: Inactive tab is hovered or focused
- **WHEN** an eligible inactive tab receives hover or focus-visible
- **THEN** its surface, text, and border SHALL transition over approximately 150ms
- **AND** eligible contextual actions SHALL reveal over approximately 200ms
- **AND** label width changes SHALL NOT move adjacent tabs.

#### Scenario: Reduced motion is preferred
- **WHEN** the user prefers reduced motion
- **THEN** tab selection, reveal, width, and preview state changes SHALL complete without unnecessary animation.

### Requirement: Cramped tab-strip containment
The system SHALL keep the main tab strip usable when auxiliary panels or narrow viewports reduce its available width.

#### Scenario: Tab strip becomes cramped at 768px
- **WHEN** the visible tab strip cannot provide its safe minimum target width to all tabs
- **THEN** tabs SHALL remain clipped or contained within the tablist rather than escaping with `overflow: visible`
- **AND** the active tab SHALL remain in the visible window
- **AND** hidden tabs SHALL remain available through the tab-list control
- **AND** auxiliary panels SHALL collapse or move to an overlay before the main workspace becomes unusably narrow.
