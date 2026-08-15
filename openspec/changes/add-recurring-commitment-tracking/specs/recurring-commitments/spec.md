## Purpose

Define reusable recurring quantitative commitments and the period-based semantics needed to compare planned and actual performance, pace, balances, carryover, consistency, and history.

## ADDED Requirements

### Requirement: Quantitative Commitment Definition
The system SHALL let a person define a quantitative commitment with a positive regular target, a unit, a bounded period, and a recurrence rule.

#### Scenario: Define a recurring commitment
- **WHEN** a person defines a target of 10 units for each week
- **THEN** the system SHALL represent 10 as the regular target, units as the measurement, and each week as a distinct period
- **AND** the commitment SHALL remain quantitative rather than being reduced to a completed or incomplete checkbox

#### Scenario: Use a custom period
- **WHEN** a person defines a bounded recurring period other than a day, week, or month
- **THEN** the system SHALL evaluate the commitment within that explicitly defined period

#### Scenario: Reject incompatible aggregation
- **WHEN** historical results use different measurement units
- **THEN** the system SHALL NOT combine their balances into one cumulative balance

### Requirement: Planned And Actual Performance
The system SHALL preserve the regular target and actual completed amount for every active or completed period.

#### Scenario: Record partial actual performance
- **WHEN** the regular target is 10 units and 7 units have been completed
- **THEN** the system SHALL represent the actual amount as 7 units
- **AND** the regular target SHALL remain 10 units

#### Scenario: Complete a period with no activity
- **WHEN** a period ends without any completed units
- **THEN** the system SHALL treat actual performance as zero
- **AND** the system SHALL retain the period in history rather than silently omitting it

### Requirement: Active Period Progress
The system SHALL distinguish overall progress and remaining work for the current active period.

#### Scenario: Show progress below the commitment
- **WHEN** the effective commitment is 10 units and actual performance is 7 units
- **THEN** the system SHALL show progress as 70 percent
- **AND** the system SHALL show remaining as 3 units

#### Scenario: Show progress beyond the commitment
- **WHEN** the effective commitment is 10 units and actual performance is 12 units
- **THEN** the system SHALL show that the commitment has been exceeded
- **AND** remaining SHALL be zero rather than a negative amount

#### Scenario: Keep remaining active-period specific
- **WHEN** the current period is still active
- **THEN** the system SHALL describe unmet work as remaining
- **AND** the system SHALL NOT describe it as a concluded deficit

### Requirement: Completed Period Outcome
The system SHALL conclude each completed period with a deficit or surplus measured against the effective commitment for that period.

#### Scenario: Conclude with a deficit
- **WHEN** a period ends with an effective commitment of 10 units and actual performance of 7 units
- **THEN** the system SHALL record a deficit of 3 units
- **AND** surplus SHALL be zero

#### Scenario: Conclude with a surplus
- **WHEN** a period ends with an effective commitment of 10 units and actual performance of 12 units
- **THEN** the system SHALL record a surplus of 2 units
- **AND** deficit SHALL be zero

#### Scenario: Conclude exactly on target
- **WHEN** actual performance equals the effective commitment when the period ends
- **THEN** both deficit and surplus SHALL be zero

### Requirement: Period And Cumulative Balance
The system SHALL define period balance as actual performance minus the regular target and SHALL define cumulative balance as the sum of period balances across comparable completed periods.

#### Scenario: Calculate a negative period balance
- **WHEN** the regular target is 10 units and actual performance is 7 units
- **THEN** period balance SHALL be minus 3 units

#### Scenario: Calculate a positive period balance
- **WHEN** the regular target is 10 units and actual performance is 12 units
- **THEN** period balance SHALL be plus 2 units

#### Scenario: Calculate cumulative balance
- **WHEN** three comparable completed periods have balances of minus 3, plus 2, and minus 1 units
- **THEN** cumulative balance SHALL be minus 2 units
- **AND** the system SHALL indicate that actual performance is two units behind the combined regular targets

#### Scenario: Preserve balance meaning with carryover
- **WHEN** a 2-unit deficit is carried into a later period whose regular target remains 10 units and the person completes 12 units
- **THEN** the later period balance SHALL be plus 2 units
- **AND** the combined cumulative balance across the two periods SHALL return to zero

### Requirement: Expected Progress And Pace Status
The system SHALL compare actual performance with expected progress at the current point in an active period.

#### Scenario: Show that performance is behind the expected position
- **WHEN** expected progress is 6 units and actual performance is 4 units
- **THEN** the system SHALL show the person as 2 units behind expected progress
- **AND** the final commitment SHALL remain independently visible

#### Scenario: Show that performance is ahead of the expected position
- **WHEN** expected progress is 6 units and actual performance is 8 units
- **THEN** the system SHALL show the person as 2 units ahead of expected progress

#### Scenario: Advance expected progress
- **WHEN** an active period advances across its eligible portions
- **THEN** expected progress SHALL advance according to the commitment's defined distribution
- **AND** a commitment without a custom distribution SHALL advance proportionally across eligible portions

### Requirement: Required Pace
The system SHALL express the pace required over the remaining eligible time or opportunities to meet the effective commitment.

#### Scenario: Calculate required pace
- **WHEN** 6 units remain and 3 eligible portions of the period remain
- **THEN** required pace SHALL be 2 units per remaining portion

#### Scenario: Commitment already met
- **WHEN** remaining is zero
- **THEN** required pace SHALL be zero

#### Scenario: No eligible opportunity remains
- **WHEN** work remains but no eligible time or opportunity remains in the active period
- **THEN** the system SHALL identify the commitment as no longer recoverable within that period
- **AND** it SHALL NOT present the undefined pace as an ordinary zero value

### Requirement: Explicit Carryover
The system SHALL apply prior deficits or surplus credit to a later period only according to an explicit carryover policy.

#### Scenario: Carry a prior deficit
- **WHEN** the regular target is 10 units, the prior carried deficit is 2 units, and deficit carryover is enabled
- **THEN** the effective commitment SHALL be 12 units
- **AND** the system SHALL expose the 10-unit regular target and 2-unit carryover separately

#### Scenario: Carry surplus credit
- **WHEN** a surplus-credit policy is enabled and eligible prior surplus exists
- **THEN** the system SHALL reduce the later effective commitment by the eligible credit
- **AND** the effective commitment SHALL NOT fall below zero

#### Scenario: Carryover disabled
- **WHEN** carryover is disabled
- **THEN** prior deficit or surplus SHALL NOT change the next period's effective commitment
- **AND** prior balances SHALL remain visible in history and cumulative balance

#### Scenario: Preserve unresolved carried deficit
- **WHEN** a 2-unit deficit is carried into a period with a regular target of 10 units and actual performance is 10 units
- **THEN** the completed period SHALL retain a 2-unit deficit against its 12-unit effective commitment
- **AND** its period balance against the regular target SHALL be zero

### Requirement: Target Revisions And Historical Integrity
The system SHALL preserve the terms and outcomes of completed periods when a commitment target or policy changes.

#### Scenario: Change a future target
- **WHEN** the regular target changes from 10 units to 12 units for future periods
- **THEN** future periods SHALL use 12 units
- **AND** completed periods SHALL retain the targets under which they were evaluated

#### Scenario: Change an active target
- **WHEN** the regular target changes during an active period
- **THEN** the system SHALL make the revised target and its effect on progress, remaining, expected progress, and required pace visible
- **AND** the system SHALL NOT rewrite completed periods

### Requirement: Consistency And History
The system SHALL provide a chronological history of comparable periods and a transparent consistency measure.

#### Scenario: Calculate consistency
- **WHEN** the effective commitment was achieved in 8 of 10 eligible completed periods
- **THEN** consistency SHALL be 80 percent
- **AND** the system SHALL expose the achieved-period count and eligible-period count

#### Scenario: Show historical direction
- **WHEN** a person reviews commitment history
- **THEN** the system SHALL show regular target, effective commitment, actual, balance, deficit, surplus, and completion outcome for each period
- **AND** the system SHALL make changes in performance over time observable

#### Scenario: Treat a partial period separately
- **WHEN** a period covers only part of its normal duration
- **THEN** the system SHALL identify it as partial
- **AND** the partial period SHALL be excluded from default consistency and carryover interpretations unless explicitly included
