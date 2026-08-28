## ADDED Requirements

### Requirement: Matched workspace panels remain visible and contained
At a matched desktop viewport, every expanded workspace panel SHALL have positive visible dimensions within the application viewport, and the main surface, contextual panel, separators, and their header controls SHALL remain non-overlapping and operable.

#### Scenario: Contextual panel is expanded on the matched Pages listing
- **WHEN** the reference and localhost render the Pages listing with the contextual panel expanded
- **THEN** the contextual panel SHALL occupy a visible bounded region beside the main surface
- **AND** its tabs, create action, hide action, menu action, body, and resize boundary SHALL remain inside the viewport.

#### Scenario: A persisted panel state differs between environments
- **WHEN** only one environment restores an expanded, collapsed, or resized panel state
- **THEN** the audit SHALL record the persisted-state difference before judging rail or content geometry
- **AND** it SHALL align or separately test the two panel states.

#### Scenario: User resizes and restores the contextual panel
- **WHEN** the divider is dragged and then returned to its recorded start position
- **THEN** main and contextual widths SHALL update continuously without overlap or horizontal overflow
- **AND** the restored width SHALL match the initial width within one rendered CSS pixel
- **AND** the divider SHALL expose a non-zero discoverable interaction target instead of depending only on a zero-width semantic element or pseudo-element hit area.

### Requirement: Shell containment is measured from rendered geometry
The shell acceptance check SHALL measure client width, scroll width, rail rectangles, panel rectangles, separators, and visible controls after each panel transition.

#### Scenario: A control renders outside the document client width
- **WHEN** an expanded-panel control has a bounding rectangle outside the document client width or is clipped from the visible capture
- **THEN** the shell SHALL fail containment even if the control remains present in the DOM.

### Requirement: Collapsing a panel cannot strand focus off-screen
When a focused control belongs to a panel that is hidden, focus SHALL move to a visible stable control or a neutral visible document target, and hidden panel controls SHALL be removed from keyboard interaction until the panel reopens.

#### Scenario: User hides the contextual panel from its header
- **WHEN** the hide action removes the contextual panel from the viewport
- **THEN** focus SHALL NOT remain on the now off-screen hide control
- **AND** the visible reopen action SHALL remain keyboard-reachable without traversing hidden panel descendants.

### Requirement: Empty contextual graph state matches the reference composition
When the selected Pages surface does not provide a graph center, the contextual Graph body SHALL preserve the reference empty composition and SHALL not expose a contradictory local-only control cluster.

#### Scenario: Graph has no selected center object
- **WHEN** Pages is selected and the Graph panel has no center object
- **THEN** the panel body SHALL remain visually empty as in the reference state
- **AND** canvas controls and explanatory copy SHALL remain hidden until graph content makes those controls applicable
- **AND** controls that become applicable later SHALL retain the verified reversible hover, settings, zoom, center, and drag behavior.

### Requirement: Responsive shell composition follows the reference breakpoints
The workspace SHALL keep the expanded 288px navigation and contextual panel only while the remaining main surface is usable, SHALL move navigation off-canvas by the 768px reference checkpoint, and SHALL use the dedicated mobile composition at 480px and below.

#### Scenario: Viewport reaches 768px
- **WHEN** the Pages listing renders at `768x900`
- **THEN** the 288px navigation SHALL be off-canvas in the closed state as it is in the reference
- **AND** the main surface SHALL not be permanently reduced by a still-expanded desktop sidebar.

#### Scenario: Viewport reaches 480px or 390px
- **WHEN** the mobile Pages composition renders closed
- **THEN** the main surface SHALL retain approximately 10px outer spacing, positive dimensions, and no horizontal page overflow
- **AND** navigation and contextual content SHALL open as bounded transient surfaces rather than simultaneous desktop columns.

### Requirement: Containment includes individual controls, not only document scroll width
A responsive state SHALL fail containment when any required visible action is clipped beyond the viewport, even if `documentElement.scrollWidth === clientWidth`.

#### Scenario: Listing actions render at 390px
- **WHEN** the query and layout action row renders at `390x844`
- **THEN** every visible direct action SHALL end within x=390 or move into a visible overflow surface
- **AND** Grade, Table, or any other action SHALL not remain focusable at an off-screen x coordinate.
