## ADDED Requirements

### Requirement: Provider-owned external event projection
Connected external events SHALL appear in local calendar views without becoming canonical Notes App objects automatically.

#### Scenario: New provider event syncs
- **WHEN** an event is received
- **THEN** its normalized provider projection SHALL appear while object counts remain unchanged.

### Requirement: Explicit event-object linking
Users SHALL explicitly create/link a compatible local object and selected date property to a stable provider event identity.

#### Scenario: Object is created from event
- **WHEN** a target Structure/date property is chosen
- **THEN** one object and one stable CalendarEventLink SHALL be created.

### Requirement: Capability-aware provider writes
Calendar mutations SHALL respect adapter/calendar/event capabilities and SHALL not attempt unsupported/read-only operations.

#### Scenario: Read-only event is edited
- **WHEN** the provider marks the target read-only
- **THEN** remote write SHALL be prevented and the limitation SHALL be visible.

### Requirement: Timezone/conflict safety
Concurrent local/remote changes SHALL preserve candidates for explicit policy resolution and SHALL use shared date/timezone normalization.

#### Scenario: Both sides changed schedule
- **WHEN** local and remote diverge from their last common state
- **THEN** neither candidate SHALL be silently discarded.
