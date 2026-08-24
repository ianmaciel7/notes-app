## ADDED Requirements

### Requirement: Native task metadata
The built-in Task SHALL support validated status, priority, scheduled date, optional deadline, context object links, tags, notes, and completion state.

### Requirement: Scheduled date and deadline are independent
Both values SHALL persist distinctly and remain independently queryable/sortable.

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

### Requirement: Query-backed task dashboards
Inbox, Today, Scheduled, Context, Tags, Open, Completed, and user-saved task views SHALL derive from shared query/view infrastructure.

### Requirement: Accessible task view mutations
List/Kanban interactions SHALL mutate the canonical Task through typed commands exactly once.
