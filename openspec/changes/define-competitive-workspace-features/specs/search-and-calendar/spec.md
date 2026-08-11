## ADDED Requirements

### Requirement: Global Content and Action Palette
The system SHALL search authorized objects and executable actions in one keyboard-navigable palette with type badges and current-space context.

#### Scenario: User executes a search result
- **WHEN** the user selects a result normally, in a new tab, or in a side panel
- **THEN** the requested open mode is honored and the palette closes without losing navigation history

### Requirement: Extended Search
The system SHALL provide a dedicated search view with query, count, filters, sorting, result view controls, loading, empty, and error states.

#### Scenario: Query returns no objects
- **WHEN** no authorized object matches the active query and filters
- **THEN** a concise empty state is shown without suggesting that unrelated content be created

### Requirement: In-Page Find
The object page SHALL provide a keyboard-accessible Find in Page action that searches within the active object's visible editable content without changing the global search context.

#### Scenario: User finds text inside an object
- **WHEN** the user invokes Find in Page from the keyboard shortcut or object action menu and enters a query
- **THEN** matches in the active object are highlighted, the active match is navigable forward and backward, no unrelated workspace results are shown, and closing find restores focus to the documented object location

### Requirement: Calendar and Daily Notes
The calendar SHALL provide month, week, three-day, and day views, Today navigation, date selection, one daily note per space/date, and date-based object collections.

#### Scenario: User opens a date
- **WHEN** a date is selected
- **THEN** its daily note and objects created or scheduled for that date are displayed without duplicate daily notes
