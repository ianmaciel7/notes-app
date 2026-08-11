## ADDED Requirements

### Requirement: Object-Type Collection Pages
Each object type SHALL expose count, search, New, view selection, object rows/cards, and contextual row actions.

#### Scenario: User opens an object type
- **WHEN** the type route loads
- **THEN** only authorized objects of that type appear and empty or loading states explain the next action

### Requirement: Saved Configurable Views
Users SHALL be able to create and persist List, Wall, Kanban, Gallery, Table, and Embed views with visible properties, filters, sorting, and grouping where each mode supports them.

#### Scenario: User changes view configuration
- **WHEN** filters, sort order, grouping, or visible properties change
- **THEN** results update deterministically and the saved view restores after reload

#### Scenario: User changes the presentation mode
- **WHEN** the user selects List, Wall, Kanban, Gallery, Table, or Embed
- **THEN** the same authorized result set is presented using that mode without losing the saved filter, sort, group, or property configuration

#### Scenario: User compares visual modes
- **WHEN** the user switches between List, Wall, Kanban, Gallery, Table, or Embed
- **THEN** each mode uses a distinct visual layout while preserving the same authorized objects, filters, sort order, grouping, and visible property configuration

### Requirement: Contextual Creation
Collection and empty-state creation SHALL prefill the active type and applicable collection constraints.

#### Scenario: User creates from a filtered collection
- **WHEN** a new object is created from that collection
- **THEN** compatible filter properties are prefilled and the new object appears if it satisfies the view
