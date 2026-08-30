## MODIFIED Requirements

### Requirement: Native task metadata

The built-in Task SHALL support optional Space-scoped status identity, priority `none | low | medium | high`, independent scheduled date and deadline, context object links, tags, notes, completion timestamps, recurrence, and occurrence history. Inbox SHALL be derived and SHALL NOT be persisted as a task status.

#### Scenario: Legacy task metadata is migrated
- **WHEN** metadata contains legacy inbox/open/in-progress/completed status or urgent priority
- **THEN** it SHALL migrate deterministically to the current status registry and priority model
- **AND** task identity, dates, links, notes, and occurrence history SHALL remain stable.

### Requirement: Query-backed task dashboards

Inbox, Today, Scheduled, Context, Tags, Open, Completed, All, and user-saved task views SHALL derive from shared query/view infrastructure. Inbox SHALL contain incomplete tasks without scheduled date, deadline, or assigned status. Today SHALL contain tasks scheduled today plus tasks with overdue or due-today deadlines.

#### Scenario: Today dashboard is opened
- **WHEN** the task dashboard date is today
- **THEN** it SHALL include scheduled-today tasks and overdue/due-today deadline tasks
- **AND** it SHALL not be implemented as only `scheduledDate == today`.

#### Scenario: Calendar Today is opened
- **WHEN** the calendar projects today's tasks
- **THEN** it SHALL additionally include overdue scheduled tasks, in-progress tasks, and tasks completed today according to the calendar contract.

### Requirement: Recurring task lifecycle supports documented patterns

A recurring Task SHALL retain one identity and support scheduled-date and completion-date modes, interval units day/week/month/year, weekly weekday sets, monthly day/ordinal/last rules, yearly rules, and optional end date.

#### Scenario: Scheduled-date recurrence completes late
- **WHEN** a fixed-rhythm occurrence is completed early or late
- **THEN** the next occurrence SHALL remain anchored to the configured calendar pattern.

#### Scenario: Completion-date recurrence completes
- **WHEN** a completion-relative occurrence is completed
- **THEN** the next occurrence SHALL be calculated from the action date.

### Requirement: Recurrence advances deadlines and preserves history

Complete, skip, excuse, advance-one, and catch-up actions SHALL append auditable occurrence records. A relative deadline SHALL move with the next schedule and SHALL never become earlier than the new scheduled date.

#### Scenario: Overdue recurring task is caught up
- **WHEN** the user chooses catch-up
- **THEN** missed instances SHALL be absorbed according to the chosen boundary
- **AND** the occurrence log and deadline movement SHALL remain auditable.

### Requirement: Recurrence statistics are derived

Current streak, best streak, total completions, completion rate, and applicable heatmap states SHALL be derived from the recurrence rule and occurrence history.

#### Scenario: An occurrence is excused
- **WHEN** an occurrence is excused
- **THEN** it SHALL not count as completion
- **AND** the current streak SHALL be preserved according to the documented excuse semantics.
