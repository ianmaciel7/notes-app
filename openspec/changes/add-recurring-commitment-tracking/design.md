## Context

The existing study planning concept answers how many questions remain before a deadline. The broader product also needs recurring quantitative commitments whose performance can be understood within the current period and across historical periods.

The model must keep closely related terms distinct. In particular, current remaining work is not an ended-period deficit, and a cumulative balance is not the same as an amount carried into the next period.

## Goals / Non-Goals

**Goals:**

- Establish unambiguous product meanings for target, actual, progress, remaining, deficit, surplus, balance, cumulative balance, expected progress, pace, carryover, consistency, and history.
- Support daily, weekly, monthly, and other explicitly bounded recurring periods.
- Make active-period status and completed-period outcomes understandable without reducing them to a binary completion state.
- Keep cumulative calculations meaningful when carryover is enabled.
- Support different measurable activities without assuming a study-specific unit.

**Non-Goals:**

- Prescribe a persistence model, application architecture, interface layout, or calculation library.
- Combine balances expressed in incompatible units.
- Interpret qualitative goals that have no quantitative target.
- Add rewards, streaks, social comparison, penalties, or motivational scoring.
- Treat a commitment as a simple checklist or binary habit.

## Decisions

### Separate the regular target from the effective commitment

The regular target is the planned amount for each ordinary period. The effective commitment is the amount currently required after an enabled carryover policy applies prior deficit or surplus credit.

This distinction lets a person see both the recurring expectation and any recovery obligation. Treating the adjusted amount as the only target would hide the original plan and make historical comparisons harder to interpret.

### Use different reference amounts for balance and carryover outcome

Period balance is actual minus the regular target. Cumulative balance is the sum of those period balances across comparable completed periods.

Deficit and surplus are evaluated against the effective commitment. This prevents a carried deficit from being counted repeatedly in cumulative balance. For example, a deficit of two followed by completing twelve against a regular target of ten produces balances of minus two and plus two, returning cumulative balance to zero.

### Keep active-period and completed-period concepts separate

Remaining, expected progress, ahead or behind, and required pace describe an active period. Deficit and surplus describe a completed period. Historical periods retain their concluded outcome even after later performance compensates for it.

### Make carryover explicit

Carryover is a policy, not an implied consequence of a negative balance. It can be disabled, carry deficits only, or carry both deficits and surplus credit. A policy may limit or expire carried amounts, but its effect must remain visible as a breakdown of the effective commitment.

### Preserve comparable historical meaning

Completed periods retain the regular target, effective commitment, actual, balance, deficit, surplus, and completion status that applied when they ended. Later target changes affect current or future periods and do not rewrite completed history.

Cumulative balance and consistency include only comparable completed periods with the same commitment and unit. Partial periods are identified separately and excluded from default consistency and carryover interpretations unless explicitly included.

### Compare progress with both the endpoint and the current expected position

Overall progress compares actual with the effective commitment. Expected progress represents where performance should be at the current point in the period. Ahead or behind is actual minus expected progress.

Expected progress follows the commitment's defined distribution across eligible portions of the period. When no custom distribution exists, it advances proportionally across the eligible portions.

### Treat required pace as a recovery-oriented active-period measure

Required pace divides current remaining work by the remaining eligible time or opportunities. It is zero after the effective commitment is met and unavailable when no eligible opportunity remains. The system must not present an impossible or undefined pace as an ordinary zero value.

### Keep consistency transparent

Consistency is based on the proportion of eligible completed periods in which the effective commitment was achieved. The underlying achieved-period and eligible-period counts remain visible. Historical direction is represented from the period series rather than replacing it with an unexplained score.

## Risks / Trade-offs

- **Carryover terminology may confuse regular target and effective commitment** → Always present the regular target, carryover adjustment, and resulting effective commitment together.
- **Repeated carryover can appear to duplicate debt** → Compute cumulative balance from regular targets while computing deficit against the effective commitment.
- **Target changes can make history look inconsistent** → Freeze completed-period terms and expose active-period revisions without rewriting history.
- **A single consistency percentage can hide volatility** → Keep period counts and chronological history visible alongside the percentage.
- **Partial or missing periods can distort conclusions** → Distinguish partial periods and treat a completed period with no activity as zero actual rather than silently omitting it.
- **Different units can create meaningless totals** → Never combine balances across incompatible units.

## Open Questions

- Which carryover policies should be offered initially beyond disabled, deficit-only, and deficit-plus-surplus?
- Should surplus credit expire after a configurable number of periods?
- Which historical interval should be the default for consistency and direction summaries?
