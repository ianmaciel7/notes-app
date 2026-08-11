## Purpose

Define the repository contract for coding-agent execution loops, OpenSpec routing, subagent delegation, verification boundaries, bounded failure handling, human gates, and safe pull request handoff.

## Requirements

### Requirement: Main Agent Loop
Coding agents SHALL use the main agent as the execution loop controller for meaningful repository work.

#### Scenario: Meaningful code or documentation work
- **WHEN** an agent performs meaningful repository work
- **THEN** the agent SHALL follow the loop `discover -> decide OpenSpec need -> delegate if useful -> implement -> verify software -> verify OpenSpec when applicable -> review if justified -> PR -> stop`
- **AND** transient loop state SHALL remain in the agent session rather than a parallel planning or memory file

### Requirement: OpenSpec Routing
Agents SHALL use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, alternatives, and trade-offs.

#### Scenario: Proposed product or architectural change
- **WHEN** work introduces a durable product, architectural, or behavioral contract
- **THEN** the agent SHALL use OpenSpec change artifacts under `openspec/changes/`
- **AND** canonical accepted requirements SHALL live under `openspec/specs/`

#### Scenario: Transient implementation planning
- **WHEN** planning details are only useful during the current execution loop
- **THEN** the agent SHALL keep them in session state instead of creating duplicate planning, task, memory, or spec files

### Requirement: Software and OpenSpec Verification Separation
Agents SHALL treat software verification and OpenSpec verification as separate evidence streams.

#### Scenario: Software checks pass
- **WHEN** linting, typechecking, tests, or builds pass
- **THEN** the agent SHALL NOT treat that result alone as proof that OpenSpec requirements were satisfied

#### Scenario: OpenSpec artifacts validate
- **WHEN** OpenSpec artifacts validate successfully
- **THEN** the agent SHALL NOT treat that result alone as proof that the software works

### Requirement: Focused Subagent Delegation
Agents SHALL reuse existing specialized subagents when independent review or focused analysis is justified.

#### Scenario: Delegating work
- **WHEN** a subagent is useful for architecture, tests, code review, security, or comparable focused analysis
- **THEN** the main agent SHALL provide a compact packet containing the objective, relevant OpenSpec requirement or change, relevant files or search scope, constraints and allowed tools, and expected output
- **AND** delegation SHOULD remain one level deep by default

#### Scenario: Parallel analysis
- **WHEN** parallel subagents are used
- **THEN** their work SHALL be independent analysis unless isolated workspaces or Git worktrees and explicit justification are provided for parallel implementation

### Requirement: Runtime-Compatible Subagent Definitions
Repository subagent definitions SHALL use tool names and capability settings supported by the intended runtime and SHALL avoid stale repository facts.

#### Scenario: Runtime-specific subagent configuration is updated
- **WHEN** subagent frontmatter is changed for a specific runtime
- **THEN** the agent SHALL check current runtime documentation or installed runtime evidence
- **AND** unsupported or stale tool declarations SHALL be removed

### Requirement: Bounded Failure Handling
Agents SHALL diagnose verification failures, bound repeated retries, and use explicit terminal states.

#### Scenario: Verification failure
- **WHEN** a verification check fails
- **THEN** the agent SHALL identify the failing check, classify the likely root cause, make a targeted change, and rerun the narrowest useful verification before broader verification

#### Scenario: Repeated no-progress failure
- **WHEN** the same root cause repeats without meaningful progress
- **THEN** the agent SHALL change strategy, delegate to the right specialist, report `BLOCKED`, or `ESCALATE`

#### Scenario: Agent reports terminal state
- **WHEN** a task reaches a stopping point
- **THEN** the agent SHALL report `DONE` with verification evidence, `BLOCKED` with the external dependency and attempted steps, or `ESCALATE` with the human decision or authorization required

### Requirement: Human Gates
Agents SHALL require explicit human authorization for high-impact actions.

#### Scenario: High-impact operation
- **WHEN** an action would bypass branch protection, push directly to protected branches, merge pull requests, deploy or roll back production, perform destructive database/cloud/filesystem operations, change credentials/IAM/billing/release tags, force-push protected history, or delete protected branches
- **THEN** the agent SHALL NOT perform the action without explicit authorization

### Requirement: Safe Pull Request Handoff
Agents SHALL follow the repository contribution workflow for branch, commit, push, pull request, CI, merge, versioning, tag, and release preparation work.

#### Scenario: Preparing repository changes for review
- **WHEN** the agent creates a branch, commit, push, pull request, or CI handoff
- **THEN** it SHALL follow `CONTRIBUTING.md`
- **AND** it SHALL avoid direct pushes to protected branches

### Requirement: Risk-Proportional Review
The repository SHALL use independent review proportionally to change risk and complexity.

#### Scenario: Meaningful implementation is complete
- **WHEN** a change affects multiple files, user-visible behavior, important logic, architecture, security, dependencies, or deployment exposure
- **THEN** the agent SHALL request the appropriate existing reviewer agent or record why independent review was not justified
