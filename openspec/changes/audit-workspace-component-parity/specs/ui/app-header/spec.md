## ADDED Requirements

### Requirement: Workspace tab selection defines the rendered surface truthfully
The active workspace tab SHALL be the tab with `aria-selected="true"`, and its selected content SHALL agree with the rendered workspace surface and synchronized route.

#### Scenario: User selects an existing Pages tab
- **WHEN** the user activates the Pages workspace tab
- **THEN** Pages SHALL become the only selected main tab
- **AND** the Pages listing SHALL replace the previously restored object surface without deleting or mutating either entity.

#### Scenario: Selected tab exposes nested pin and close actions
- **WHEN** contextual pin or close controls are available for a tab
- **THEN** the tab, pin action, and close action SHALL remain distinct targets
- **AND** nested actions SHALL NOT cover the tab midpoint or activate tab selection incidentally.
- **AND** pin and close actions SHALL use localized accessible names in the active locale.

### Requirement: Header and side-panel controls remain visibly operable
Back, forward, tab-list, create-tab, focus-mode, panel-toggle, and panel-menu controls SHALL remain inside the visible header rail and SHALL expose localized accessible names.

#### Scenario: User traverses workspace history
- **WHEN** a Page is opened from the Pages listing, Back is activated, and Forward is activated
- **THEN** Back SHALL restore the originating Pages listing and Forward SHALL reopen the same Page editor
- **AND** a final Back SHALL restore Pages again
- **AND** neither control SHALL report enabled while acting as a no-op for the current history state.

#### Scenario: Contextual panel is open
- **WHEN** the side-panel header renders its tabs and shell controls
- **THEN** its active tab, create action, hide action, and menu action SHALL be visible, non-overlapping, and keyboard-operable
- **AND** the main header SHALL NOT expose a contradictory duplicate open-state toggle.

### Requirement: Side-panel creation menu is route and state aware
The side-panel creation menu SHALL list only special entries available for the current route and panel state, and SHALL omit the active panel type rather than presenting a duplicate or unavailable destination.

#### Scenario: Graph is the active panel on Pages
- **WHEN** the side-panel menu opens while Graph is active on the Pages listing
- **THEN** the menu SHALL expose AI chat and Search as the available reference entries
- **AND** Graph, Backlinks, Objects inside, Related content, and other unavailable or already-active entries SHALL not appear as actionable choices.

#### Scenario: User opens and closes a secondary side-panel tab
- **WHEN** a supported secondary panel is added and then closed
- **THEN** the prior Graph tab SHALL remain available and become active again
- **AND** closing the secondary tab SHALL not hide or resize the whole contextual surface.

### Requirement: Focus mode uses a dedicated workspace composition
Focus mode SHALL suppress the normal navigation and contextual-panel chrome while keeping the selected main surface and a visible focus-session surface, and SHALL restore the prior shell state when exited.

#### Scenario: User enters and exits focus mode
- **WHEN** focus mode is activated from the workspace header
- **THEN** the expanded sidebar, normal tab strip, and graph-panel chrome SHALL not remain as ordinary visible navigation
- **AND** exiting focus mode SHALL restore the prior Pages selection, sidebar, contextual panel, and layout.

### Requirement: Tab list is searchable and non-mutating on inspection
The tab-list control SHALL open a searchable list of current workspace tabs without changing the active tab until a list entry or dedicated close action is chosen.

#### Scenario: User opens and closes the tab list
- **WHEN** the tab-list control is activated and then closed from its trigger
- **THEN** the search field and current tab entries SHALL be inspectable
- **AND** the prior Pages tab SHALL remain selected and no tab SHALL be closed.

### Requirement: Create-tab opens a destination chooser without changing selection
The workspace create-tab action SHALL open the global destination chooser in new-tab mode, with search, recent destinations, and an explicit `Open in new tab` mode indicator.

#### Scenario: User opens and cancels create-tab
- **WHEN** the create-tab action is activated and then cancelled without selecting a destination
- **THEN** the global chooser SHALL close and Pages SHALL remain selected
- **AND** an existing unrelated tab SHALL not become selected merely because the chooser opened.

### Requirement: Synchronization status opens its dedicated settings surface
The workspace header SHALL expose the current synchronization-status action separately from create-tab and focus mode, and activating it SHALL open the synchronization settings surface without changing the selected workspace tab.

#### Scenario: User inspects synchronization status
- **WHEN** the synchronization-status control is activated
- **THEN** the Settings surface SHALL open directly to Offline & Synchronization
- **AND** closing Settings SHALL restore the prior Pages surface and contextual-panel state.

### Requirement: Workspace rail does not duplicate listing commands
The workspace header SHALL reserve its bounded rail for history, tabs, tab management, synchronization, focus mode, and contextual-panel controls; listing-specific import commands SHALL remain in the Pages creation or overflow surfaces.

#### Scenario: Pages header renders import access
- **WHEN** the Pages listing is selected
- **THEN** Import files SHALL remain discoverable from the reference creation or listing-overflow command surface
- **AND** an extra import action SHALL not consume workspace-tab rail width or displace synchronization and focus controls.
