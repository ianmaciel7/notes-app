# docs/practical-workflow Specification

## Purpose
Defines a practical documentation workflow for the repository so process and structure decisions in documentation are governed consistently before implementation, reducing ad hoc updates and review uncertainty.

## Requirements

### Requirement: Documentation change classification
The system SHALL classify documentation edits by impact before implementation.

#### Scenario: Governance-impacting docs change
- **WHEN** a documentation update changes contributor workflow, process rules, acceptance criteria, or decision records,
- **THEN** the update SHALL require an OpenSpec change with the planning artifacts defined in the repository schema.

### Requirement: Editorial-only exception
The system SHALL permit editorial-only documentation changes without full OpenSpec planning when they do not alter structure, policy, workflow obligations, acceptance criteria, or cross-document links.

#### Scenario: Editorial-only update
- **WHEN** a documentation change is limited to copyediting, grammar correction, or typo fixes,
- **THEN** the change MAY use a lightweight path and SHALL not be treated as a behavioral spec change.

### Requirement: Documentation freshness
The system SHALL prevent stale documentation by requiring that process-related updates are applied consistently across all practical documentation artifacts before merge.

#### Scenario: Process rule updated
- **WHEN** contributor-facing process rules change in `AGENTS.md`, `docs/project-guidelines`, or another practical workflow source,
- **THEN** all affected documents in the same scope SHALL be updated in the same change before approval.

### Requirement: PR traceability for process docs
The system SHALL require PRs that introduce practical documentation-process changes to reference the active OpenSpec change name.

#### Scenario: Process doc PR
- **WHEN** a PR changes practical process documentation,
- **THEN** the PR summary SHALL include the associated OpenSpec change name and scope.

### Requirement: Documentation sync verification
The system SHALL require a final documentation sync check as part of the workflow for process-impacting changes.

#### Scenario: Sync verification
- **WHEN** implementation or planning artifacts are ready for completion,
- **THEN** the contributor SHALL verify no tracked practical docs reference outdated rules and SHALL update any stale content before merge.
