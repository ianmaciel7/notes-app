## ADDED Requirements

### Requirement: Canonical date semantics
Date properties SHALL distinguish all-day/date-only values from timed instants, support optional ranges, and preserve the intended local day across reload/timezone conversion.

#### Scenario: All-day value crosses timezone boundaries
- **WHEN** an all-day date value is saved and reloaded in the workspace timezone
- **THEN** it SHALL preserve the intended local day instead of shifting as an accidental UTC instant.

### Requirement: One Daily Note per Space/date
Each Space SHALL contain at most one canonical Daily Note for a given local calendar date; repeated create/capture SHALL return/append to the same identity.

#### Scenario: Daily Note is requested twice
- **WHEN** the user creates or captures into the same Space/date more than once
- **THEN** the existing Daily Note identity SHALL be returned or appended to rather than creating a duplicate.

### Requirement: Explicit calendar projections
Month, Week, Three-Day, and Day views SHALL derive entries from canonical Daily Notes, selected object date properties, Task schedule data, and date-reference indexes rather than persisting duplicate calendar records.

#### Scenario: Calendar span is rendered
- **WHEN** Month, Week, Three-Day, or Day view is rendered
- **THEN** entries SHALL be derived from canonical dated objects, tasks, Daily Notes, and date references.

### Requirement: Driving date property is explicit
When a Structure has multiple date properties, a calendar projection SHALL identify which property drives placement.

#### Scenario: Structure has multiple date properties
- **WHEN** a calendar projection includes a Structure with more than one date property
- **THEN** the projection SHALL use the configured driving date property for placement.

### Requirement: Day context aggregates date knowledge
The Day context SHALL be able to present that date's Daily Note, dated objects/tasks, references to the date, and timeline projection from canonical indexes.

#### Scenario: Day context is opened
- **WHEN** a user opens a date's Day context
- **THEN** it SHALL aggregate the Daily Note, dated objects or tasks, incoming date references, and timeline data for that date.

### Requirement: Date navigation and creation
Users SHALL be able to navigate date contexts and create/reschedule compatible objects through accessible interactions; a reschedule SHALL mutate the source date value without duplicating the object.

#### Scenario: Object is rescheduled
- **WHEN** a compatible object is moved to a different date through a calendar interaction
- **THEN** the source date value SHALL change and the object SHALL NOT be duplicated.
