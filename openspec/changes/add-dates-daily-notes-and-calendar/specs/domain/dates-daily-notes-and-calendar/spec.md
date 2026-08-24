## ADDED Requirements

### Requirement: Canonical date semantics
Date properties SHALL distinguish all-day/date-only values from timed instants and SHALL support optional ranges without timezone-induced day drift.

#### Scenario: All-day date reloads
- **WHEN** an all-day value is serialized and reopened
- **THEN** the intended local calendar day SHALL remain unchanged.

### Requirement: One Daily Note per date
Each Space SHALL contain at most one canonical Daily Note for a given local calendar date.

#### Scenario: Daily Note is requested repeatedly
- **WHEN** creation/capture runs twice for the same date
- **THEN** the same Daily Note SHALL be returned/appended rather than duplicated.

### Requirement: Derived local calendar
Calendar/timeline views SHALL derive entries from Daily Notes, selected object date properties, and Task schedule data.

#### Scenario: Object is rescheduled
- **WHEN** its driving date property changes
- **THEN** its calendar projection SHALL move without creating another object.

### Requirement: Date navigation and creation
Users SHALL be able to navigate date contexts and create/reschedule compatible objects through accessible calendar interactions.

#### Scenario: Object is created in a calendar slot
- **WHEN** the user chooses a compatible Structure/date property
- **THEN** one object SHALL be created with that date initialized exactly once.
