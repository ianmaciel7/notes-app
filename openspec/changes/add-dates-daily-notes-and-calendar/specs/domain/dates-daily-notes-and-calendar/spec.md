## ADDED Requirements

### Requirement: Canonical date semantics
Date properties SHALL distinguish all-day/date-only values from timed instants, support optional ranges, and preserve the intended local day across reload/timezone conversion.

### Requirement: One Daily Note per Space/date
Each Space SHALL contain at most one canonical Daily Note for a given local calendar date; repeated create/capture SHALL return/append to the same identity.

### Requirement: Explicit calendar projections
Month, Week, Three-Day, and Day views SHALL derive entries from canonical Daily Notes, selected object date properties, Task schedule data, and date-reference indexes rather than persisting duplicate calendar records.

### Requirement: Driving date property is explicit
When a Structure has multiple date properties, a calendar projection SHALL identify which property drives placement.

### Requirement: Day context aggregates date knowledge
The Day context SHALL be able to present that date's Daily Note, dated objects/tasks, references to the date, and timeline projection from canonical indexes.

### Requirement: Date navigation and creation
Users SHALL be able to navigate date contexts and create/reschedule compatible objects through accessible interactions; a reschedule SHALL mutate the source date value without duplicating the object.
