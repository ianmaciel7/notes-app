# developer-workflows/openspec-enforcement Specification

## Purpose
Defines required repository governance for OpenSpec usage and documentation language so contributors have consistent behavior before starting implementation, reducing ambiguity and process drift.

## Requirements

### Requirement: OpenSpec-first behavior changes
The system SHALL require that any requested change affecting behavior, architecture, documentation scope, implementation scope, or repository governance is planned through OpenSpec, including proposal, specs, design, and task artifacts before code implementation begins. Tests and tooling that inspect OpenSpec change artifacts SHALL resolve artifacts from the active change path or the latest matching archived change path so valid archive operations do not break verification.

#### Scenario: Behavioral change request
- **WHEN** a contributor submits a change that modifies behavior, architecture, policies, APIs, tests, or docs scope,
- **THEN** the OpenSpec workflow SHALL be started and artifacts for proposal/specs/design/tasks SHALL be produced before implementation starts.

#### Scenario: Archived change artifact verification
- **WHEN** a test or tool needs to inspect an OpenSpec artifact for a change that may already be archived
- **THEN** it SHALL first check the active `openspec/changes/<change>` path and then the latest matching `openspec/changes/archive/*-<change>` path before failing for a missing artifact.

### Requirement: English-first repository artifacts
The system SHALL require that repository-facing documentation, code-facing text, PR content, and OpenSpec artifacts are authored in English, unless a product requirement explicitly asks for localization.

#### Scenario: Non-English contribution attempt
- **WHEN** a contributor attempts to add repository-facing text in another language without localization approval,
- **THEN** the contribution SHALL be corrected to English before merging.

### Requirement: Skill-use clarity
The system SHALL map change types to the appropriate OpenSpec skills so contributors know when to use `openspec-explore`, `openspec-propose`, `openspec-apply-change`, `openspec-update-change`, `openspec-sync-specs`, and `openspec-archive-change`.

#### Scenario: Ambiguous request
- **WHEN** a request contains unclear, risky, or high-impact requirements,
- **THEN** `openspec-explore` SHALL be used before implementation decisions are finalized.
