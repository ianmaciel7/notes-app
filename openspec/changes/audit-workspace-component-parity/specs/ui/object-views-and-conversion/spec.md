## ADDED Requirements

### Requirement: Object-type listing exposes a complete control contract
The Pages object-type listing SHALL expose a type icon and heading, search, collapse, overflow, split create action, Overview and All tabs, result count, query controls, layout controls, entity cards or rows, and a new-object entry with stable named targets.

#### Scenario: Pages listing baseline renders
- **WHEN** the Pages listing is the selected workspace surface
- **THEN** its heading and controls SHALL remain visible in the main surface
- **AND** the result count and entity content MAY differ from the reference while geometry and interaction contracts remain comparable.

#### Scenario: Split create action is inspected without mutation
- **WHEN** the disclosure portion of the split create action is activated during an audit
- **THEN** its available creation and import choices SHALL be inspectable without invoking the primary create command
- **AND** closing the menu with Escape or outside click SHALL leave entities and counts unchanged.

### Requirement: Listing view and layout state is explicit
The listing SHALL expose selected state for Overview or All and pressed or selected state for the active layout, with post-action content that agrees with those states.

#### Scenario: User changes a reversible listing presentation
- **WHEN** the user selects a supported view tab or layout control
- **THEN** the corresponding selected or pressed state and rendered presentation SHALL update together
- **AND** a later reopen or reload SHALL be checked when that presentation is promised to persist.

### Requirement: Pages creation disclosures match the reference command model
The Pages listing SHALL keep the primary create action separate from its disclosure and SHALL expose only the reference-supported secondary commands for that disclosure: `New Page` and `Import file(s)`.

#### Scenario: User opens the split New disclosure
- **WHEN** the disclosure portion of New is activated
- **THEN** it SHALL show a new-Page command and an import-files command
- **AND** query, collection, and template commands SHALL remain in the listing overflow rather than being duplicated in the split disclosure.

### Requirement: Listing overflow exposes the complete Pages command set
The Pages listing overflow SHALL expose template creation, query creation, collection creation, sidebar pinning, object-type settings, export, and import as distinct localized actions with visible grouping equivalent to the reference.

#### Scenario: User inspects the Pages overflow
- **WHEN** the listing overflow opens
- **THEN** all seven reference command families SHALL be present
- **AND** Escape or outside click SHALL close the menu without changing the selected view, layout, or entity count.

### Requirement: Query controls use composable rule builders
Filter, sort, and group SHALL open composable rule-builder surfaces rather than fixed preset menus.

#### Scenario: User opens a query rule control
- **WHEN** filter, sort, or group is activated
- **THEN** filter SHALL expose condition and filter-group additions, sort SHALL expose an add-sort action, and group SHALL expose an add-group action
- **AND** activating the same trigger again SHALL close any builder whose reference behavior is trigger-toggled.

### Requirement: Layout selection exposes the reference presentation families
The layout menu SHALL expose List, Board, Kanban, Gallery, Table, and Embed presentation families, and SHALL identify the active layout visibly and semantically.

#### Scenario: User inspects available layouts
- **WHEN** the layout menu opens on the Pages All view
- **THEN** the six reference presentation families SHALL be available in reference order
- **AND** selecting a reversible supported layout SHALL update both the rendered presentation and selected layout state.

### Requirement: Listing view controls match reference geometry and motion
Overview and All controls SHALL use the shared 12px selected pill geometry and SHALL not introduce one-off widths, radii, or transition durations that diverge from the reference component family.

#### Scenario: User switches between Overview and All
- **WHEN** either view control is activated
- **THEN** selected state and content family SHALL update together
- **AND** returning to All SHALL restore its last supported layout when persistence is promised.

### Requirement: Unsafe reference mutations remain explicit audit gaps
An audit SHALL NOT create, import, delete, link, embed, or otherwise mutate authenticated reference entities merely to satisfy interaction coverage.

#### Scenario: A visible action would mutate authenticated data
- **WHEN** exercising a control would create, modify, upload, or delete reference data
- **THEN** the action SHALL be recorded as `not tested` unless separately authorized and safely reversible
- **AND** the menu, disabled, cancel, or pre-commit state SHALL still be inspected when possible.

### Requirement: Entity navigation preserves a reliable listing return path
Opening an entity from a Pages card or row SHALL select or open that entity without mutating it, and the workspace Back control SHALL return to the originating Pages listing when the reference does.

#### Scenario: User opens the first visible Page and returns
- **WHEN** a Page card or row is activated and the user then activates Back
- **THEN** the Page editor SHALL be replaced by the prior Pages listing state
- **AND** the prior view and layout SHALL be restored without requiring a separate sidebar re-navigation.

### Requirement: Listing actions adapt without horizontal clipping
The result count, filter, sort, group, and active-layout controls SHALL remain usable at every supported breakpoint through compact reference controls or a bounded overflow menu.

#### Scenario: Compact Pages listing renders at 390px
- **WHEN** horizontal space cannot contain separate local layout shortcuts
- **THEN** the reference-aligned compact control strip SHALL keep all visible controls inside the main surface
- **AND** redundant direct layout buttons SHALL collapse into the layout menu before they cross the viewport edge.

### Requirement: Gallery cards expose isolated object actions
Each Gallery card SHALL keep the primary open target separate from a named contextual-action target that reveals on hover or focus and opens the reference object command menu.

#### Scenario: User reveals a card action
- **WHEN** a Gallery card receives hover or focus-within
- **THEN** its 22px contextual-action target SHALL become visible without shifting the card title, metadata, or neighboring cards
- **AND** the target SHALL be keyboard reachable through a named focus stop
- **AND** it SHALL not remain an unexplained pointer-active region while visually hidden.

#### Scenario: User opens and cancels the card menu
- **WHEN** the card contextual action is activated
- **THEN** the menu SHALL expose Select multiple, Open, Edit collections, Pin to sidebar, Change type, Object type settings, Share, Present, Export, Copy, Duplicate, and Delete object command families
- **AND** Escape SHALL close the menu without invoking a command, changing the route, or mutating the entity.

### Requirement: Table presentation exposes the reference Page property columns
The Pages Table presentation SHALL render Page rows against the reference property schema rather than a reduced generic object table.

#### Scenario: User selects Table and returns to Gallery
- **WHEN** Table is selected from the Pages layout controls
- **THEN** the table SHALL expose Title, Aliases, Tags, Cover image, Icon, Description, Content, Last updated, Created at, and Collections property families
- **AND** returning to Gallery SHALL restore cards and active-layout state without changing entity data.
