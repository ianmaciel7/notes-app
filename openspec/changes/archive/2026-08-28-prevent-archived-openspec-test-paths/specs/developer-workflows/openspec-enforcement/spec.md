## MODIFIED Requirements

### Requirement: OpenSpec-first behavior changes
The system SHALL require that any requested change affecting behavior, architecture, documentation scope, implementation scope, or repository governance is planned through OpenSpec, including proposal, specs, design, and task artifacts before code implementation begins. Tests and tooling that inspect OpenSpec change artifacts SHALL resolve artifacts from the active change path or the latest matching archived change path so valid archive operations do not break verification.

#### Scenario: Behavioral change request
- **WHEN** a contributor submits a change that modifies behavior, architecture, policies, APIs, tests, or docs scope,
- **THEN** the OpenSpec workflow SHALL be started and artifacts for proposal/specs/design/tasks SHALL be produced before implementation starts.

#### Scenario: Archived change artifact verification
- **WHEN** a test or tool needs to inspect an OpenSpec artifact for a change that may already be archived
- **THEN** it SHALL first check the active `openspec/changes/<change>` path and then the latest matching `openspec/changes/archive/*-<change>` path before failing for a missing artifact.
