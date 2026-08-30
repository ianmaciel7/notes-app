## ADDED Requirements

### Requirement: Reference-evidence claims preserve provenance and confidence

Every fidelity claim SHALL identify whether it comes from current official documentation, authenticated product observation, sanitized archive evidence, local implementation observation, or inference.

#### Scenario: A local test is used in a parity report
- **WHEN** a local unit, source, or browser test is cited in a Capacities parity report
- **THEN** it SHALL be labeled as local evidence
- **AND** it SHALL NOT upgrade an unknown reference interaction to confirmed.

### Requirement: Stale or unknown reference behavior remains explicit

Evidence indexes and manifests SHALL preserve timestamps, viewport or environment when relevant, limitations, mutation boundaries, and unknown private behavior.

#### Scenario: Evidence predates the implemented behavior
- **WHEN** an evidence manifest describes a pre-implementation state but a later local matrix contains post-implementation results
- **THEN** the current index SHALL distinguish both snapshots
- **AND** the pre-implementation manifest SHALL NOT be presented as the current acceptance verdict.
