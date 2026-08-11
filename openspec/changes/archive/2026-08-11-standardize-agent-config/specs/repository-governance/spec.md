## MODIFIED Requirements

### Requirement: Pointer File Consistency
Agent instruction entrypoints SHALL avoid duplicating project instructions and SHALL preserve `AGENTS.md` as the canonical repository instruction file.

#### Scenario: Updating agent instructions
- **WHEN** project-wide agent instructions change
- **THEN** `AGENTS.md` SHALL remain the canonical project instruction file
- **AND** vendor-specific repository instruction files such as `GEMINI.md` SHALL NOT duplicate those instructions

#### Scenario: Vendor-specific entrypoint is redundant
- **WHEN** a vendor-specific repository instruction file only duplicates or points to `AGENTS.md`
- **THEN** the file SHALL be removed from the repository

## ADDED Requirements

### Requirement: Agent-Agnostic Configuration Ownership
Repository agent configuration SHALL use `AGENTS.md` and `.agents/` as the canonical vendor-neutral source of truth.

#### Scenario: Storing reusable agent behavior
- **WHEN** project instructions, skills, rules, reusable workflows, subagent definitions, or portable MCP recommendations are stored in the repository
- **THEN** they SHALL live under `AGENTS.md` or `.agents/`
- **AND** they SHALL NOT be duplicated under vendor-specific project directories

#### Scenario: Retaining project skills
- **WHEN** a reusable project skill is retained in the repository
- **THEN** it SHALL have exactly one canonical copy under `.agents/skills/<skill-name>/SKILL.md`

#### Scenario: Vendor-specific project directories are generated
- **WHEN** tools generate project-local `.agent/`, `.codex/`, or `.gemini/` directories
- **THEN** those directories SHALL be treated as local tool configuration
- **AND** they SHALL remain ignored and untracked

#### Scenario: Vendor-specific settings are unavoidable
- **WHEN** a coding agent requires vendor-specific settings to operate
- **THEN** those settings SHALL NOT duplicate project instructions, skills, architecture knowledge, workflows, coding standards, or reusable agent behavior
- **AND** supported user-level or global tool configuration SHALL be preferred over repository-local vendor configuration

### Requirement: OpenSpec Responsibility Boundary
Repository agent configuration SHALL reference OpenSpec without replacing or duplicating it.

#### Scenario: Durable requirements are needed
- **WHEN** work needs durable requirements, behavior, acceptance criteria, design rationale, alternatives, or change lifecycle artifacts
- **THEN** the agent SHALL use OpenSpec under `openspec/`
- **AND** `AGENTS.md` or `.agents/` SHALL reference OpenSpec rather than duplicating specs
