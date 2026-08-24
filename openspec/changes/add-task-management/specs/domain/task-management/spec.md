## ADDED Requirements

### Requirement: Native task metadata
The built-in Task SHALL support validated status, priority, scheduled date, optional deadline, context object links, tags, notes, and completion state.

#### Scenario: Schedule and deadline coexist
- **WHEN** both values are set
- **THEN** they SHALL persist distinctly and remain independently queryable/sortable.

### Requirement: Recurring task lifecycle
A recurring Task SHALL retain one task identity and SHALL record each occurrence action while advancing according to its recurrence rule.

#### Scenario: Occurrence completes
- **WHEN** a recurring occurrence is completed
- **THEN** one occurrence record SHALL be appended and the task SHALL advance without creating a duplicate Task object.

### Requirement: Query-backed task dashboards
Native Inbox, Today, Scheduled, Context, Tags, Open, Completed, and user-saved task views SHALL derive from the shared query/view engine.

#### Scenario: Task metadata changes
- **WHEN** status/date/context changes
- **THEN** affected dashboard memberships SHALL update without duplicate records.

### Requirement: Accessible task view mutations
List/Kanban interactions SHALL mutate the canonical Task through typed commands.

#### Scenario: Card changes status
- **WHEN** a task card moves between Kanban status columns
- **THEN** exactly one status mutation SHALL commit and all projections SHALL update.
