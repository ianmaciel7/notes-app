# developer-workflows/openspec-enforcement Specification

## Purpose
Defines required repository governance for OpenSpec usage and documentation language so contributors have consistent behavior before starting implementation, reducing ambiguity and process drift.

## Requirements

### Requirement: OpenSpec-first behavior changes
The system SHALL require that any requested change affecting behavior, architecture, documentation scope, or implementation scope is planned through OpenSpec, including proposal, specs, design, and task artifacts before code implementation begins.

#### Scenario: Behavioral change request
- **WHEN** a contributor submits a change that modifies behavior, architecture, policies, APIs, tests, or docs scope,
- **THEN** the OpenSpec workflow SHALL be started and artifacts for proposal/specs/design/tasks SHALL be produced before implementation starts.

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
