## ADDED Requirements

### Requirement: Capacities parity uses a dated canonical source inventory

The project SHALL maintain a deduplicated, dated inventory of current official documentation indexes, relevant documentation pages, sanitized authenticated evidence, local repository evidence, and known archive limitations.

#### Scenario: Official documentation inventory changes
- **WHEN** the official machine-readable indexes add, remove, rename, or redirect a page
- **THEN** the canonical inventory SHALL record the new current state without deleting historical provenance
- **AND** the roadmap SHALL be reviewed for affected requirements.

### Requirement: Every parity claim declares its evidence class

Parity documentation SHALL classify supporting material as official documentation, authenticated observation, sanitized archive evidence, local code/test evidence, inference, or unknown.

#### Scenario: Private implementation cannot be observed
- **WHEN** a documented result does not reveal Capacities' private algorithm or storage contract
- **THEN** the project SHALL specify the observable Notes App behavior
- **AND** the private Capacities implementation SHALL remain `UNKNOWN`.

### Requirement: Archive completeness is represented truthfully

The deduplicated JSONL corpus MAY be used as complete captured response-payload evidence only within the published completeness-audit limits.

#### Scenario: A contributor needs request bodies or exact archive reconstruction
- **WHEN** parity work depends on request bodies, selected resource payloads, private headers, revisit resolution, or original WACZ bytes
- **THEN** the JSONL corpus SHALL be treated as insufficient for that claim
- **AND** the missing fidelity SHALL be recorded rather than inferred.

### Requirement: Roadmap state matches repository state

The parity roadmap SHALL distinguish implemented-and-archived, implemented-needing-reconciliation, active, planned, intentional divergence, unknown, and out-of-scope work.

#### Scenario: A change is archived or superseded
- **WHEN** an OpenSpec change is archived, superseded, renamed, or found inconsistent
- **THEN** the roadmap SHALL be updated in the same delivery or a linked corrective change.
