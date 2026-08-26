## ADDED Requirements

### Requirement: Current workspace rail geometry
The main and contextual workspace rails SHALL match the height and bounded placement of the matched authenticated reference state.

#### Scenario: Desktop rails are measured
- **WHEN** the local workspace and authenticated reference render at the same desktop viewport and panel state
- **THEN** the main and contextual top rails SHALL measure approximately 46px
- **AND** rail controls SHALL remain vertically centered without increasing the content offset or overlapping the first content row.

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

