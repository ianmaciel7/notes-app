# task-management Specification

## Purpose
Defines native task metadata, independent scheduled and deadline dates, recurrence modes, auditable occurrence actions, query-backed dashboards, and accessible task mutations.

## Requirements

### Requirement: Native task metadata
The built-in Task SHALL support validated status, priority, scheduled date, optional deadline, context object links, tags, notes, and completion state.

#### Scenario: Task metadata is written
- **WHEN** a Task receives status, priority, scheduled date, deadline, context links, tags, notes, or completion values
- **THEN** each value SHALL validate against the native Task metadata contract before it is persisted.

### Requirement: Scheduled date and deadline are independent
Both values SHALL persist distinctly and remain independently queryable/sortable.

#### Scenario: Scheduled date changes without changing deadline
- **WHEN** a task's scheduled date is rescheduled
- **THEN** its deadline SHALL remain unchanged and both values SHALL remain independently queryable.

### Requirement: Recurring task lifecycle supports explicit modes
A recurring Task SHALL retain one task identity, record occurrence actions, and SHALL distinguish schedule-driven recurrence from completion-driven recurrence.

#### Scenario: Schedule-driven occurrence completes late
- **WHEN** a schedule-driven recurring occurrence is completed after its scheduled date
- **THEN** the next schedule SHALL follow the configured schedule rule rather than silently switching to completion-relative behavior.

#### Scenario: Completion-driven occurrence completes
- **WHEN** a completion-driven recurring occurrence is completed
- **THEN** the next occurrence SHALL be calculated relative to completion according to the configured rule and one occurrence record SHALL be appended.

### Requirement: Occurrence actions remain auditable
Complete, skip, and excuse actions SHALL append explicit occurrence/history records without creating duplicate Task identities.

#### Scenario: Occurrence is skipped or excused
- **WHEN** a user skips or excuses a recurring occurrence
- **THEN** the Task SHALL keep one identity and append an auditable occurrence record for the action.

### Requirement: Query-backed task dashboards
Inbox, Today, Scheduled, Context, Tags, Open, Completed, and user-saved task views SHALL derive from shared query/view infrastructure.

#### Scenario: Task dashboard is opened
- **WHEN** a native task dashboard is displayed
- **THEN** its membership SHALL derive from shared query/view definitions rather than a separate task-only store.

### Requirement: Accessible task view mutations
List/Kanban interactions SHALL mutate the canonical Task through typed commands exactly once.

#### Scenario: Task card moves between statuses
- **WHEN** a user changes a task status from a list or Kanban view
- **THEN** one typed task command SHALL update the canonical Task and all projections SHALL reflect that single mutation.
