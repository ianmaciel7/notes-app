## Why

Goals and recurring commitments need more than a completed/not-completed state. A person should be able to compare planned and actual performance continuously, understand whether they are ahead or behind the expected pace, and see how deficits or surpluses accumulate over time.

## What Changes

- Define quantitative commitments with a target, unit, active period, and recurrence.
- Distinguish current-period remaining work from an ended period's deficit or surplus.
- Define signed period balance and cumulative balance across comparable periods.
- Compare actual progress with expected progress at the current point in an active period.
- Express the pace required over the remaining time to meet the effective commitment.
- Support explicit carryover policies in which prior deficits, and optionally prior surpluses, affect a later period.
- Represent consistency and historical direction across completed periods.
- Make the concepts reusable for study, exercise, reading, creative work, or any other measurable commitment rather than limiting them to habits or checklists.
- Define how target changes, partial periods, missing activity, and incompatible units affect interpretation.

## Capabilities

### New Capabilities

- `recurring-commitments`: Defines quantitative targets, actual performance, period status, balances, carryover, expected progress, required pace, consistency, and history.

### Modified Capabilities

None.

## Dependencies And Sequencing

- Recurring commitment calculations are independently useful and do not require an Objective.
- Objective integration depends on the relationship contract defined by `add-generic-objectives`, but it does not make recurring commitments subordinate to study or another workflow.
- Implement commitment and period semantics before adding Objective summaries or adapting the packaged study workflow.

## Non-Goals

- Define the desired outcome, lifecycle, requirements, assessments, or final result of an Objective.
- Treat every Objective as recurring or require every recurring commitment to support an Objective.
- Introduce study-specific units or calculations into the generic commitment capability.

## Impact

- Expands the product vocabulary for goals from deadline progress to recurring quantitative commitments.
- Establishes behavior that goal summaries, Today views, histories, and analytics can present consistently.
- Allows the packaged study workflow to adopt the same concepts later without making the capability study-specific.
- Requires acceptance coverage for active, completed, overachieved, carried-over, changed-target, and historical-period scenarios when implemented.
