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
The system SHALL provide a mobile-appropriate workspace-selector presentation using existing shadcn Sheet primitives.

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

### Requirement: Source-derived primary navigation
The system SHALL render New, Search, Explore, and Calendar as compact full-width navigation rows below the workspace header using the captured Capacities iconography and the repository sidebar theme tokens.

#### Scenario: Primary navigation is rendered
- **WHEN** the app sidebar is visible
- **THEN** each navigation row SHALL use the compact 32px interaction height, a left-aligned icon and label, and semantic `sidebar-accent` hover treatment
- **AND** the active navigation row SHALL retain the selected background and approximately `0.965` brightness treatment
- **AND** the rows SHALL remain aligned to the source-derived left inset instead of using large card-style padding.

### Requirement: Persistent pinned region
The system SHALL keep the Pinned heading and its pinned entities outside the main overview scroll area so they remain visible while lower sidebar content scrolls.

#### Scenario: User scrolls the sidebar overview
- **WHEN** object types, custom sections, Trash, or Help/resources overflow vertically and the user scrolls them
- **THEN** the workspace header, primary navigation, Pinned region, and footer SHALL remain visible
- **AND** only the overview region below Pinned SHALL scroll.

### Requirement: Pinned entities use a dedicated row contract
The system SHALL render pinned content using a pinned-entity row distinct from object-type rows.

#### Scenario: Pinned entity is rendered
- **WHEN** a pinned entity is visible on desktop
- **THEN** its row SHALL use the source-derived 29px height with approximately 3px left inset and 1.5 spacing units at the right
- **AND** its compact type label SHALL use the source-derived label padding and icon wrapper geometry
- **AND** it SHALL NOT show an object-count badge.

#### Scenario: Pinned entity is selected
- **WHEN** a pinned entity is active
- **THEN** it SHALL retain the sidebar-accent selected background and approximately `0.965` brightness treatment
- **AND** its label SHALL use medium font weight.

#### Scenario: Pointer hovers a pinned entity
- **WHEN** the row is hovered
- **THEN** its action rail SHALL expand from zero to approximately 80px over approximately 300ms
- **AND** its context-menu action SHALL fade from hidden to visible without moving the entity label vertically.

### Requirement: Object types use source-derived rows
The system SHALL render object types with their own row contract and hover metadata.

#### Scenario: Object type is rendered
- **WHEN** an object type is visible on desktop
- **THEN** its row SHALL use the source-derived 29px height, approximately 3px left inset, and compact type label geometry
- **AND** its type label SHALL use approximately `0.49em` horizontal padding, `0.2em` vertical padding, a `0.33em` icon radius, `0.4em` icon-to-label spacing, and the negative icon-leading inset from the captured source.

#### Scenario: Pointer hovers an object type
- **WHEN** the row is hovered
- **THEN** an approximately 80px action rail SHALL expand over approximately 300ms
- **AND** the object count SHALL appear before the context-menu action
- **AND** the context-menu action SHALL become fully opaque when hovered directly.

### Requirement: Section affordances match source interaction
The system SHALL render overview section headings, sort controls, add controls, and Add section using source-derived hover visibility without permanent layout shifts.

#### Scenario: Pointer hovers a section header
- **WHEN** the pointer enters the section header
- **THEN** the chevron, count, sort action, and add action SHALL become visible using approximately 200ms transitions
- **AND** hidden actions SHALL keep their intended alignment without pushing the section label.

#### Scenario: Pointer enters the section container
- **WHEN** the pointer is over the overview section container
- **THEN** `Add section` SHALL become visible at approximately 60% opacity
- **AND** direct hover on `Add section` SHALL raise it to full opacity and apply the normal sidebar-accent hover background.

### Requirement: Lower utility navigation
The system SHALL render Trash and Help/resources using the full-row source-derived interaction pattern.

#### Scenario: Lower utility row is hovered
- **WHEN** the pointer hovers Trash, a Help/resources child, or another utility row
- **THEN** the entire 32px row SHALL receive the sidebar-accent hover treatment
- **AND** the icon and label SHALL remain aligned with a compact `gap-x-1.5` and `px-2` geometry.

#### Scenario: External help action is hovered
- **WHEN** the pointer hovers Ask, Documentation, or Feedback
- **THEN** an external-link affordance SHALL transition from zero to full opacity over approximately 200ms
- **AND** it SHALL NOT reserve distracting visible decoration when the row is idle.

#### Scenario: Ask action tooltip is shown
- **WHEN** the Ask row triggers its help tooltip
- **THEN** the tooltip SHALL use the captured text `Faça perguntas sobre o Capacities`.

### Requirement: Fixed source-derived footer
The system SHALL keep the sidebar footer fixed below the scroll region and reproduce the reference control spacing using shadcn interactions.

#### Scenario: Footer is rendered
- **WHEN** the sidebar is visible
- **THEN** the footer SHALL use approximately `px-2.5`, `pr-1`, `py-1.5`, and `gap-x-0.5`
- **AND** Settings and theme SHALL use independent 32px hover targets
- **AND** account and `Pro` SHALL render as one combined control
- **AND** a flexible spacer SHALL keep Share aligned to the far right.

#### Scenario: Settings is rendered
- **WHEN** the footer is displayed
- **THEN** Settings SHALL use an outline gear appearance rather than a visually filled blob.

### Requirement: AppShell retains layout ownership
The system SHALL rely on the existing AppShell for sidebar width, resize, collapse, and mobile shell behavior.

#### Scenario: Desktop sidebar is resized or collapsed
- **WHEN** the user resizes or collapses the left sidebar
- **THEN** the existing AppShell `18rem` default, `14rem` minimum, `24rem` maximum, resizable rail, collapse transition, and sidebar trigger SHALL remain authoritative
- **AND** the app-sidebar feature SHALL NOT instantiate a second resizable panel, SidebarProvider, or offcanvas implementation.

### Requirement: Shadcn-first styling and theme ownership
The system SHALL compose existing project shadcn/Base UI primitives and semantic global theme tokens without modifying shared primitives or adding sidebar-specific global CSS.

#### Scenario: Sidebar feature is implemented
- **WHEN** feature components are added or updated
- **THEN** reusable component roots and meaningful subcomponents SHALL expose stable `data-slot` attributes
- **AND** buttons, popovers, dropdowns, collapsibles, dialogs, scroll areas, badges, and tooltips SHALL reuse project primitives where applicable
- **AND** colors SHALL come from semantic tokens such as `sidebar`, `sidebar-accent`, `muted`, `popover`, `border`, and their foreground tokens
- **AND** `src/components/ui/*` and the native `src/app/globals.css` SHALL NOT be modified solely to achieve sidebar fidelity.
