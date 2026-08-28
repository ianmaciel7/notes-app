## ADDED Requirements

### Requirement: Reusable Capacities evidence corpus
Capacities fidelity work SHALL reuse a dated, sanitized repository evidence bundle before repeating authenticated live-browser inspection for an already captured component state.

#### Scenario: Existing Capacities bundle covers the comparison
- **WHEN** the bundle matches the target component, viewport, route, persisted resize state, semantic content state, and interaction state
- **THEN** the parity evaluation SHALL use the recorded image, HTML or DOM, computed CSS, and JavaScript behavior evidence
- **AND** SHALL perform live recapture only when freshness or completeness cannot be established.

#### Scenario: Capacities behavior has changed
- **WHEN** live evidence demonstrates that a stored bundle is stale or conflicts with the current reference
- **THEN** the evaluator SHALL preserve the prior capture identity, add or refresh the affected state, update provenance and limitations, and treat the newer confirmed evidence as authoritative.

