# App Sidebar Specification

## Purpose

Defines the reusable application sidebar contract: workspace switching, source-derived Capacities navigation and overview geometry, persistent pinned content, scrollable object sections, lower utility navigation, fixed footer controls, and integration with the existing AppShell using project shadcn/Base UI primitives.

## Requirements

### Requirement: Composable app-sidebar workspace selector
The system SHALL provide a reusable app-sidebar workspace selector that composes existing project shadcn/Base UI primitives and exposes controlled selection and reorder behavior without modifying the app-shell contract.

#### Scenario: Sidebar selector is composed into the shell
- **WHEN** a caller renders the app sidebar inside `AppShellSidebar`
- **THEN** the selector SHALL render the selected workspace icon, name, and change affordance
- **AND** it SHALL accept controlled space data, selected value, selection callback, and reorder callback.

### Requirement: Search and stable workspace popup behavior
The system SHALL let users filter available spaces while preserving stable popup focus, close behavior, empty state, and reorder interactions.

#### Scenario: User filters spaces
- **WHEN** the user types into the search field
- **THEN** only matching spaces SHALL be shown
- **AND** the search field SHALL retain focus
- **AND** a clear control SHALL clear only the query while keeping the popup open.

#### Scenario: Search returns no spaces
- **WHEN** zero spaces match
- **THEN** the popup SHALL show `No options found.`
- **AND** the list focus structure SHALL remain mounted
- **AND** the disabled create-space footer SHALL be omitted.

#### Scenario: User reorders spaces
- **WHEN** the user drags from the dedicated reorder handle
- **THEN** rows SHALL reorder as the pointer crosses their midpoint
- **AND** row movement SHALL animate for approximately 200ms
- **AND** `onReorder` SHALL receive the new order
- **AND** the workspace popup SHALL remain open with search focus restored.

### Requirement: Workspace selector responsive geometry
The system SHALL preserve the selected workspace-selector geometry on desktop and use a bottom-sheet presentation below the repository 768px breakpoint.

#### Scenario: Desktop workspace popup is rendered
- **WHEN** the viewport is at least 768px wide
- **THEN** the popup SHALL use an `18rem` desktop width
- **AND** its scroll body SHALL be capped at `27rem` and available viewport height
- **AND** horizontal overflow SHALL be clipped while vertical overflow remains scrollable.

#### Scenario: Narrow workspace selector is opened
- **WHEN** the viewport is below 768px
- **THEN** search, space list, empty state, and disabled create-space semantics SHALL be presented in the existing shadcn Sheet flow.

### Requirement: Source-derived primary navigation
The system SHALL render New, Search, Explore, and Calendar as compact full-width navigation rows using captured Capacities iconography and repository sidebar theme tokens.

#### Scenario: Primary navigation is rendered
- **WHEN** the sidebar is visible
- **THEN** each navigation row SHALL use a compact 32px interaction height, left-aligned icon and label, and semantic sidebar-accent hover treatment
- **AND** the selected row SHALL retain the sidebar-accent background with approximately `0.965` brightness.

### Requirement: Persistent pinned region
The system SHALL keep Pinned outside the main overview scroll region.

#### Scenario: Lower sidebar content scrolls
- **WHEN** object types or lower utility content overflows vertically
- **THEN** the workspace header, primary navigation, Pinned region, and footer SHALL remain visible
- **AND** only the overview region below Pinned SHALL scroll.

### Requirement: Pinned entities use a dedicated row contract
Pinned entities SHALL not reuse the object-type metadata row contract.

#### Scenario: Pinned entity is rendered
- **WHEN** a pinned entity is visible on desktop
- **THEN** it SHALL use the source-derived 29px row height and approximately 3px leading inset
- **AND** its type label SHALL use the compact source-derived padding and icon geometry
- **AND** it SHALL NOT render an object-count badge.

#### Scenario: Pinned entity is active or hovered
- **WHEN** a pinned entity is selected
- **THEN** the selected label SHALL use medium font weight and the persistent selected background treatment
- **AND WHEN** the row is hovered
- **THEN** an approximately 80px action rail SHALL expand over approximately 300ms without changing the row height.

### Requirement: Object types use source-derived rows
Object-type rows SHALL preserve source-derived geometry and hover metadata.

#### Scenario: Object type is rendered
- **WHEN** an object type is visible on desktop
- **THEN** its row SHALL use the source-derived 29px height and approximately 3px leading inset
- **AND** its label SHALL use approximately `0.49em` horizontal padding, `0.2em` vertical padding, `0.33em` icon radius, `0.4em` icon-to-label spacing, and the negative icon-leading inset.

#### Scenario: Object type is hovered
- **WHEN** the row is hovered
- **THEN** an approximately 80px action rail SHALL expand over approximately 300ms
- **AND** the object count SHALL appear before the context menu action.

### Requirement: Section affordances match source interaction
The system SHALL keep section controls visually quiet until hover while preserving alignment.

#### Scenario: Section heading is hovered
- **WHEN** the pointer enters a section heading
- **THEN** its chevron, count, sort action, and add action SHALL appear using approximately 200ms transitions
- **AND** the section label SHALL not shift because hidden actions become visible.

#### Scenario: Overview container is hovered
- **WHEN** the pointer is over the scrollable section container
- **THEN** `Add section` SHALL become visible at approximately 60% opacity
- **AND** direct hover SHALL raise it to full opacity with sidebar-accent hover treatment.

### Requirement: Lower utility navigation
The system SHALL render Trash and Help/resources as full-row compact interactions.

#### Scenario: Lower utility row is hovered
- **WHEN** the pointer hovers Trash or a Help/resources row
- **THEN** the entire 32px row SHALL receive sidebar-accent hover treatment
- **AND** icon and label SHALL remain aligned with compact `gap-x-1.5` and `px-2` geometry.

#### Scenario: External help action is hovered
- **WHEN** the pointer hovers Ask, Documentation, or Feedback
- **THEN** the external-link affordance SHALL transition from hidden to visible over approximately 200ms.

#### Scenario: Ask tooltip is shown
- **WHEN** Ask triggers its tooltip
- **THEN** it SHALL show `Faça perguntas sobre o Capacities`.

### Requirement: Fixed source-derived footer
The system SHALL keep the footer fixed below the overview scroll region.

#### Scenario: Footer is rendered
- **WHEN** the sidebar is visible
- **THEN** the footer SHALL use approximately `px-2.5`, `pr-1`, `py-1.5`, and `gap-x-0.5`
- **AND** Settings and theme SHALL use independent 32px interaction targets
- **AND** account and `Pro` SHALL be one combined control
- **AND** a flexible spacer SHALL keep Share aligned to the far right.

#### Scenario: Settings icon is rendered
- **WHEN** Settings is visible
- **THEN** it SHALL use an outline gear appearance rather than a filled glyph.

### Requirement: AppShell retains layout ownership
The system SHALL use the existing AppShell for width, resize, collapse, trigger positioning, and mobile shell behavior.

#### Scenario: Desktop sidebar is resized or collapsed
- **WHEN** the user resizes or collapses the sidebar
- **THEN** AppShell's `18rem` default, `14rem` minimum, `24rem` maximum, resizable rail, transition, and trigger SHALL remain authoritative
- **AND** app-sidebar SHALL NOT create a second ResizablePanel, SidebarProvider, or offcanvas implementation.

### Requirement: Shadcn-first styling and theme ownership
The system SHALL compose existing project shadcn/Base UI primitives and native semantic theme tokens.

#### Scenario: Sidebar feature is implemented
- **WHEN** reusable sidebar components are created or updated
- **THEN** their roots and meaningful subcomponents SHALL expose stable `data-slot` attributes
- **AND** project Button, Popover, DropdownMenu, Collapsible, Dialog, ScrollArea, Badge, Tooltip, and related primitives SHALL be reused where applicable
- **AND** visual theme values SHALL come from semantic tokens such as `sidebar`, `sidebar-accent`, `muted`, `popover`, and `border`
- **AND** `src/components/ui/*` and `src/app/globals.css` SHALL NOT be modified solely for sidebar fidelity.
