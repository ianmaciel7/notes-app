## ADDED Requirements

### Requirement: Command-system acceptance is internally consistent

A keyboard-command delivery SHALL NOT be reported as fully accepted or archived while its task list, implementation notes, executable verification results, and evidence manifests disagree about pass, fail, blocked, or not-tested states.

#### Scenario: Verification artifact disagrees with checked tasks
- **WHEN** a checked acceptance task claims repository verification passed but the associated implementation record reports failed or blocked commands
- **THEN** the delivery SHALL remain open until the discrepancy is resolved or a test-specific approved baseline exception is recorded
- **AND** the exception SHALL identify the exact command, failure, owner, rationale, and follow-up.

### Requirement: Local acceptance and reference parity are independent verdicts

Command, palette, shortcut, and editor-trigger evidence SHALL record local implementation status separately from matched reference status.

#### Scenario: Local browser behavior passes without matched reference evidence
- **WHEN** localhost demonstrates a command or trigger successfully but the equivalent Capacities behavior was not safely observed
- **THEN** local status MAY be marked passed
- **AND** reference status SHALL remain unknown, not tested, or mutation-prohibited
- **AND** the combined report SHALL NOT call the behavior confirmed parity.

### Requirement: Archived command changes remain immutable

Corrective work SHALL append a new change and evidence bundle rather than editing an archived change to conceal its original acceptance state.

#### Scenario: Archived evidence contains stale claims
- **WHEN** a later audit finds stale or contradictory claims in an archived command change
- **THEN** the archived files SHALL remain intact
- **AND** a corrective change SHALL link the original files and publish the current verdict.
