## Purpose

Define the route-aware object-type overview and list surface for the Portuguese object studio.

## ADDED Requirements

### Requirement: Route-Aware Object Type Surface

Each supported object-type route MUST render content for the active type rather than the daily calendar.

#### Scenario: Open a populated type

- **WHEN** a user opens `/tipos/tabelas`
- **THEN** `Tabelas` MUST be the active sidebar destination
- **AND** the central panel MUST expose a level-one heading named `Tabelas`
- **AND** the central panel MUST render the table objects in the current local inventory
- **AND** the daily date heading MUST NOT remain in the central panel

#### Scenario: Open a zero-count type

- **WHEN** a user opens an object type whose current inventory count is zero
- **THEN** the central panel MUST render the shared empty-state explanation
- **AND** it MUST NOT render transient daily-feed objects as type-list results

### Requirement: Shared Object Type Contract

The sidebar, top tab, and central surface MUST consume one typed route identity for each supported object type.

#### Scenario: Resolve every sidebar type route

- **WHEN** the current path matches one of the 13 object-type destinations
- **THEN** the application MUST resolve its plural label, singular fixture label, icon, tone, count, and creation availability
- **AND** the matching sidebar link MUST expose `aria-current="page"`
- **AND** the top tab and central heading MUST use the resolved plural label

### Requirement: Object List Controls

The object-type surface MUST expose the visible reference controls with accessible names.

#### Scenario: Inspect the type toolbar

- **WHEN** an object-type surface is ready
- **THEN** it MUST expose overview and all-object views
- **AND** it MUST expose search, filter, sort, list, grid, and view-option controls with accessible names
- **AND** creation-capable types MUST expose a `Novo` control

### Requirement: Responsive Object List Geometry

The object-type surface MUST fit within the existing shell without page-level horizontal overflow.

#### Scenario: Render the three-panel desktop workspace

- **WHEN** the sidebar and context panel are visible
- **THEN** the central type header and toolbar MUST shrink within their allocated track
- **AND** object cards MUST remain inside the scrollable central region
- **AND** the document scroll width MUST equal its client width
