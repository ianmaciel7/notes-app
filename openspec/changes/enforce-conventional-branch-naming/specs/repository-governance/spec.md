## ADDED Requirements

### Requirement: Conventional Branch Names
The repository SHALL use conventional, descriptive branch names for all non-protected working branches.

#### Scenario: Contributor creates a working branch
- **WHEN** a contributor creates or renames a branch for repository work
- **THEN** the branch name SHALL use one of the documented change-type prefixes from `CONTRIBUTING.md`
- **AND** the branch description SHALL be short, English, lowercase, and hyphen-separated
- **AND** the branch name SHALL avoid personal, agent-specific, language-specific, or vague prefixes

#### Scenario: Agent starts Git work
- **WHEN** an agent creates or renames a branch
- **THEN** it SHALL check the canonical branch naming guidance in `CONTRIBUTING.md`
- **AND** it SHALL choose a branch name that matches the documented pattern before making repository changes

### Requirement: Agent Workflow Entrypoint
The repository SHALL keep `AGENTS.md` as a concise operational entrypoint for automated contributors.

#### Scenario: Agent starts repository work
- **WHEN** an agent reads `AGENTS.md`
- **THEN** it SHALL find pointers to the canonical Git workflow, branch naming rules, OpenSpec governance, local shell expectation, and verification command
- **AND** `AGENTS.md` SHALL avoid duplicating the full contributor workflow already maintained in `CONTRIBUTING.md`
