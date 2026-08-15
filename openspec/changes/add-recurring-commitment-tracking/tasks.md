> **Sequence:** Sections 1-5 implement the independent commitment model. Section 6 integrates that model into product surfaces; task 6.3 follows the Objective relationship contract from `add-generic-objectives`.

## 1. Commitment And Period Foundations

- [ ] 1.1 Add quantitative commitments with regular target, unit, bounded period, recurrence, and eligible portions.
- [ ] 1.2 Create active and completed period records that preserve regular target, effective commitment, actual, and period status.
- [ ] 1.3 Treat a completed period with no activity as zero actual while retaining it in history.
- [ ] 1.4 Identify partial periods separately from ordinary eligible completed periods.

## 2. Current Progress And Period Outcomes

- [ ] 2.1 Calculate active-period progress and non-negative remaining work against the effective commitment.
- [ ] 2.2 Calculate completed-period deficit and surplus against the effective commitment.
- [ ] 2.3 Calculate signed period balance against the regular target.
- [ ] 2.4 Keep remaining, deficit, surplus, and balance visibly distinct in goal status and period summaries.

## 3. Expected Progress And Required Pace

- [ ] 3.1 Calculate expected progress from elapsed eligible portions and an optional defined distribution.
- [ ] 3.2 Calculate ahead or behind as actual performance minus expected progress.
- [ ] 3.3 Calculate required pace from remaining work and remaining eligible portions.
- [ ] 3.4 Represent an unrecoverable active period distinctly when work remains but no eligible opportunity remains.

## 4. Carryover And Target Revisions

- [ ] 4.1 Support disabled, deficit-only, and deficit-plus-surplus carryover policies.
- [ ] 4.2 Expose the regular target, carryover adjustment, and effective commitment as separate values.
- [ ] 4.3 Prevent surplus credit from reducing an effective commitment below zero.
- [ ] 4.4 Preserve unresolved carried deficit without duplicating it in cumulative balance.
- [ ] 4.5 Apply target revisions prospectively while preserving completed-period terms and outcomes.

## 5. History, Balance, And Consistency

- [ ] 5.1 Calculate cumulative balance only across comparable completed periods with the same unit.
- [ ] 5.2 Present chronological period history with target, effective commitment, actual, balance, deficit, surplus, and outcome.
- [ ] 5.3 Calculate consistency from achieved and eligible completed-period counts and expose both counts.
- [ ] 5.4 Exclude partial periods from default consistency and carryover interpretations unless explicitly included.
- [ ] 5.5 Make improvement, decline, and volatility observable from the period history without replacing the history with an opaque score.

## 6. Product Integration

- [ ] 6.1 Add commitment summaries that answer planned, actual, remaining, ahead or behind, and required-pace questions.
- [ ] 6.2 Add completed-period summaries that distinguish deficit, surplus, period balance, and cumulative balance.
- [ ] 6.3 Allow the study-goal workflow to adopt recurring commitment semantics without making the capability study-specific.
- [ ] 6.4 Provide Portuguese-first labels and explanations for every quantitative concept.

## 7. Verification

- [ ] 7.1 Test exact-target, below-target, above-target, zero-activity, and active-period calculations.
- [ ] 7.2 Test cumulative balance across multiple periods and reject aggregation across incompatible units.
- [ ] 7.3 Test carryover recovery, unresolved deficit, surplus credit, disabled carryover, and zero-floor behavior.
- [ ] 7.4 Test expected progress, ahead or behind, required pace, and unrecoverable-period behavior.
- [ ] 7.5 Test target revisions, completed-history integrity, partial-period exclusion, consistency, and historical direction.
- [ ] 7.6 Verify observable commitment summaries and history at desktop, tablet, and mobile viewports.
- [ ] 7.7 Run focused product tests and repository verification separately from strict OpenSpec validation.
- [ ] 7.8 Run `openspec validate add-recurring-commitment-tracking --strict` and resolve every validation error.
