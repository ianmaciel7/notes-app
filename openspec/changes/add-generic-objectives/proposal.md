## Why

The product needs one reusable concept for concrete outcomes instead of separate core models for certifications, exams, competitions, interviews, courses, and similar pursuits. A generic Objective can provide that shared context while allowing each real-world case to retain its classification, requirements, preparation, assessments, progress, and results.

## What Changes

- Introduce Objective as the generic term for a concrete outcome a person is preparing for or trying to achieve.
- Treat certification, exam, competitive exam, assessment, interview, admission test, course completion, skill milestone, and custom goal as Objective classifications rather than separate core concepts.
- Define the Objective lifecycle independently from its assessment results.
- Connect an Objective to requirements, topics, supporting quantitative goals, activities, study sessions, questions, reviews, assessments, weak areas, progress evidence, and results.
- Distinguish the desired outcome from recurring commitments and measurements used to pursue it.
- Represent preparation progress without equating activity completion with probability of success.
- Allow custom classifications and outcome descriptions without requiring a new product concept.

## Capabilities

### New Capabilities

- `objectives`: Defines generic outcomes, classifications, lifecycle, requirements, preparation context, progress evidence, assessments, and results.

### Modified Capabilities

None.

## Dependencies And Sequencing

- The Objective foundation has no hard dependency on recurring commitments and can be implemented first.
- The relationship from an Objective to supporting quantitative commitments defines an integration boundary; it does not pull recurring-period calculations into the `objectives` capability.
- Objective lifecycle, requirements, assessments, progress evidence, and results should be established before Objective views embed recurring-commitment summaries.

## Non-Goals

- Define recurrence, period balance, carryover, required pace, or consistency calculations; those belong to `recurring-commitments`.
- Turn every supporting goal, activity, assessment, or topic into an Objective.
- Collapse preparation progress, assessment evidence, lifecycle status, and final result into one score.

## Impact

- Establishes Objective as the central product context for outcome-oriented preparation.
- Gives study and non-study workflows a shared vocabulary for what a person ultimately wants to achieve.
- Clarifies that recurring quantitative commitments support an Objective but do not replace it.
- Requires future Objective experiences and analytics to preserve the distinctions among preparation, goal performance, assessment evidence, status, and final result.
