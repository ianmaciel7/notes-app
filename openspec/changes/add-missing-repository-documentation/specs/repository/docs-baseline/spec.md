## Purpose

Defines minimum repository documentation baseline requirements and ensures new or updated process guidance stays synchronized across practical docs.

## ADDED Requirements

### Requirement: Documentation baseline presence
The system SHALL provide the baseline documentation files `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/TESTING.md`, and `docs/DEPLOYMENT.md`.

#### Scenario: New setup
- **WHEN** the repository is checked out for contribution or automation work,
- **THEN** the baseline files SHALL be present and readable in their expected paths.

### Requirement: Practical docs synchronization
When practical process or governance rules change, the update SHALL include refresh of all affected baseline files in the same change.

#### Scenario: Process rule update
- **WHEN** OpenSpec adds or changes workflow/governance requirements,
- **THEN** at least one baseline document that references the same guidance SHALL be updated in that same change.

### Requirement: English-first docs baseline
Baseline practical docs SHALL be authored in English and remain aligned with `.agents/rules/english-first.md`.

#### Scenario: Baseline updates
- **WHEN** a baseline document is created or modified,
- **THEN** repository-facing and code-facing text SHALL be in English.

### Requirement: Contributor entry point consistency
`AGENTS.md` SHALL remain the canonical practical entry point for agent instructions, with references to OpenSpec workflow artifacts where applicable.

#### Scenario: Agent onboarding
- **WHEN** contributors or agents start a task,
- **THEN** `AGENTS.md` SHALL direct them to the active workflow docs and OpenSpec rules for non-trivial changes.