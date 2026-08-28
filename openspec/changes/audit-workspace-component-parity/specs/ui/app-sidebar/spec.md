## ADDED Requirements

### Requirement: Sidebar affordances expose distinct semantic targets
The expanded sidebar SHALL expose named, keyboard-operable targets for the space switcher, primary navigation, section disclosures, sort/add actions, object-type rows, nested collection rows, nested overflow actions, help entries, footer controls, and sidebar collapse action.

#### Scenario: An object-type row contains nested controls
- **WHEN** an object-type row exposes a disclosure, collection row, or overflow action
- **THEN** activating the nested target SHALL NOT activate the primary object-type row
- **AND** every target SHALL retain a distinct accessible name and focus state.

#### Scenario: A contextual action is visually hidden
- **WHEN** a sidebar action is hidden until row hover or focus-within
- **THEN** it SHALL NOT create an unexplained keyboard stop while visually hidden
- **AND** it SHALL be removed from pointer hit testing while hidden
- **AND** revealing it SHALL NOT shift the row label, count, or neighboring targets.

### Requirement: Sidebar section controls preserve reversible state and reference commands
The Fixados and Tipos de objeto section disclosures SHALL hide and restore only their owned rows, while section sorting and add-type actions SHALL expose the reference command contracts without committing changes during inspection.

#### Scenario: User collapses and reopens a sidebar section
- **WHEN** the user activates the Fixados or Tipos de objeto disclosure twice
- **THEN** its owned rows or empty state SHALL first become hidden and then return
- **AND** the disclosure's expanded state SHALL remain programmatically truthful
- **AND** the selected workspace destination SHALL remain unchanged.

#### Scenario: User inspects section sorting
- **WHEN** the Tipos de objeto sort action opens
- **THEN** the surface SHALL expose `Ordenar manualmente` and `Ordenar alfabeticamente` as distinct named commands
- **AND** closing the surface without selection SHALL preserve the existing order.

#### Scenario: User searches for pinned content and cancels
- **WHEN** the add-pinned-content action opens and the user presses Escape without choosing a result
- **THEN** a focused search surface SHALL expose applicable objects and collections as selectable results
- **AND** no item SHALL be added to Fixados
- **AND** the prior expanded section state SHALL remain unchanged.

#### Scenario: User inspects add-object-type choices and cancels
- **WHEN** the add-object-type action opens and the user closes it without choosing a type
- **THEN** the surface SHALL expose the reference suggested and basic type families in a named dialog
- **AND** no object type SHALL be created
- **AND** the explanatory documentation target SHALL resolve to the canonical object-type guidance rather than a divergent local-only path.

### Requirement: Sidebar comparisons record semantic and persisted state
The audit SHALL record sidebar width, expanded sections, scroll position, visible rows, counts, nested rows, and persisted resize state before comparing geometry.

#### Scenario: Expanded desktop sidebar is measured
- **WHEN** both environments use the captured expanded desktop state
- **THEN** the audit SHALL compare the same 288px persisted-width state or explicitly label a different local clean default
- **AND** content or count differences SHALL remain separate from row geometry and interaction verdicts.

### Requirement: Primary workspace navigation includes Tasks
The expanded sidebar SHALL expose New, Search, Explore, Calendar, and Tasks as distinct primary navigation actions in reference order.

#### Scenario: User traverses primary navigation
- **WHEN** focus moves through the expanded primary navigation group
- **THEN** Tasks SHALL be reachable after Calendar with a localized accessible name
- **AND** it SHALL not be substituted by an object-type row elsewhere in the sidebar.

### Requirement: Space switcher matches the reference selection surface
The space switcher SHALL open a searchable, scrollable 12px-radius selection surface, mark the current space, and close without changing space on Escape.

#### Scenario: User inspects spaces and cancels
- **WHEN** the current-space control opens and the user presses Escape without selecting another space
- **THEN** the current space SHALL remain selected
- **AND** the workspace route and entity selection SHALL remain unchanged.

### Requirement: Global command surfaces match reference scope without rewriting the workspace
The sidebar Search and New actions SHALL open transient command surfaces over the current workspace. Search SHALL cover recent objects, global actions, object creation, spaces, and help destinations; New SHALL cover every object type available in the current space.

#### Scenario: User opens and cancels global Search
- **WHEN** Search opens and the user presses Escape without selecting a result
- **THEN** the overlay SHALL close and the prior workspace route, selected object-type view, and layout SHALL remain unchanged
- **AND** focus SHALL return to a visible stable trigger.

#### Scenario: User opens and cancels global New
- **WHEN** New opens and the user presses Escape without selecting an object type
- **THEN** the searchable object-type menu SHALL close without creating an entity
- **AND** every supported object-type family SHALL remain discoverable, including types beyond the currently implemented local subset.

### Requirement: Footer controls preserve truthful identity and theme behavior
Settings, theme, profile, and other footer actions SHALL be distinct named controls whose transient surfaces reflect the current environment without exposing a misleading account or workspace model.

#### Scenario: User opens and closes Settings
- **WHEN** the footer Settings control is activated
- **THEN** a visible settings surface SHALL open with the applicable general, current-space, resource, and integration destinations
- **AND** the control SHALL NOT merely enter an active visual state without exposing settings content
- **AND** closing the surface SHALL restore the prior workspace route and selection.

#### Scenario: User opens and cancels the shortcuts reference
- **WHEN** the reference trailing footer action is activated
- **THEN** a searchable shortcuts surface SHALL open with the current workspace command bindings
- **AND** Escape SHALL close it and restore focus to a visible stable control
- **AND** an inactive or unimplemented Share control SHALL NOT substitute for the reference shortcuts action.

#### Scenario: User opens and closes the profile menu
- **WHEN** the profile control is activated
- **THEN** the menu SHALL identify the active account or local-workspace context, subscription state, and sign-out action truthfully
- **AND** closing it without selecting sign out SHALL leave the session and workspace unchanged.

#### Scenario: User toggles theme twice
- **WHEN** the user switches from light to dark and back to light
- **THEN** the shell color scheme SHALL change on each activation
- **AND** the second activation SHALL restore the original light scheme without altering the selected workspace surface.

### Requirement: Help resources preserve disclosure and destination semantics
The Help and resources section SHALL expose Getting started, Ask a question, Documentation, What's new, and Feedback as distinct destinations under one reversible disclosure.

#### Scenario: User collapses and reopens Help and resources
- **WHEN** the disclosure is activated twice
- **THEN** all five owned destinations SHALL first become hidden and then return
- **AND** the disclosure's expanded state SHALL remain programmatically truthful.

#### Scenario: User inspects Documentation
- **WHEN** the Documentation destination is rendered
- **THEN** it SHALL retain link semantics and the canonical external documentation target
- **AND** it SHALL not be represented as a button with no discoverable destination.

### Requirement: Sidebar utilities expose functional pre-commit surfaces
Add section and Trash SHALL open visible, keyboard-operable surfaces rather than merely changing trigger styling, and their destructive or creating commands SHALL remain guarded until the user supplies valid intent.

#### Scenario: User inspects Add section and cancels
- **WHEN** Add section opens with an empty name and the user presses Escape
- **THEN** the surface SHALL explain the section purpose and expose icon, name, and Create controls
- **AND** Create SHALL be visually and programmatically disabled until required input is valid
- **AND** Escape SHALL close the surface without creating a section.

#### Scenario: User opens Trash and cancels
- **WHEN** Trash is activated
- **THEN** a searchable trash surface SHALL appear with the Empty trash command and applicable result rows
- **AND** the trigger SHALL NOT merely enter an active visual state without exposing content
- **AND** Escape SHALL close the surface without deleting or restoring an entity.

### Requirement: Mobile navigation is a bounded reference-width surface
At the supported mobile breakpoints, opening navigation SHALL reveal the same 288px reference-width navigation content above the main surface and SHALL retain the primary New, Search, Explore, Calendar, and Tasks actions.

#### Scenario: User opens and closes navigation at 390px
- **WHEN** the mobile navigation trigger is activated at `390x844`
- **THEN** a bounded navigation surface SHALL open from x=0 with the reference 288px width
- **AND** closing it SHALL restore the same Pages surface without selecting a sidebar destination.

### Requirement: Primary destinations render their reference content contracts
Explore, Calendar, and Tasks SHALL be first-class primary destinations rather than generic menus or object-type substitutes, and each SHALL render a route-specific main surface.

#### Scenario: User opens Explore
- **WHEN** Explore is selected from primary navigation
- **THEN** the main surface SHALL provide the reference conversational prompt, starter suggestions, input composer, and truthful graph-unavailable state
- **AND** it SHALL not duplicate the contextual-panel destination menu in both main and side surfaces.

#### Scenario: User opens Calendar in Day view
- **WHEN** Calendar is selected and the Day presentation is active
- **THEN** the surface SHALL expose the active date, Day/Today context, daily-note and task sections, and created-today content families
- **AND** persisted Week state SHALL be recorded and aligned before a Day-view parity verdict.

#### Scenario: User opens Tasks
- **WHEN** Tasks is selected from primary navigation
- **THEN** the dedicated task workspace SHALL expose Inbox, Today, Scheduled, Status, Context, Tags, Open, Due, Recurring, Completed, and All views
- **AND** the object-type Tasks row SHALL not substitute for this primary workspace.
