## ADDED Requirements

### Requirement: Main Agent Loop
Coding agents MUST use the main agent as the execution loop controller for meaningful repository work.

#### Scenario: Meaningful code or documentation work
- **WHEN** an agent performs meaningful repository work
- **THEN** the agent MUST follow the loop `discover -> decide OpenSpec need -> delegate if useful -> implement -> verify software -> verify OpenSpec when applicable -> review if justified -> PR -> stop`
- **AND** transient loop state MUST remain in the agent session rather than a parallel planning or memory file

### Requirement: Software and OpenSpec Verification Separation
Agents MUST treat software verification and OpenSpec verification as separate evidence streams.

#### Scenario: Software checks pass
- **WHEN** linting, typechecking, tests, or builds pass
- **THEN** the agent MUST NOT treat that result alone as proof that OpenSpec requirements were satisfied

#### Scenario: OpenSpec artifacts validate
- **WHEN** OpenSpec artifacts validate successfully
- **THEN** the agent MUST NOT treat that result alone as proof that the software works

### Requirement: Focused Subagent Delegation
Agents MUST reuse existing specialized subagents when independent review or focused analysis is justified.

#### Scenario: Delegating work
- **WHEN** a subagent is useful for architecture, tests, code review, security, or comparable focused analysis
- **THEN** the main agent MUST provide a compact packet containing the objective, relevant OpenSpec requirement or change, relevant files or search scope, constraints and allowed tools, and expected output
- **AND** delegation SHOULD remain one level deep by default

### Requirement: Bounded Failure Handling
Agents MUST diagnose verification failures, bound repeated retries, and use explicit terminal states.

#### Scenario: Verification failure
- **WHEN** a verification check fails
- **THEN** the agent MUST identify the failing check, classify the likely root cause, make a targeted change, and rerun the narrowest useful verification before broader verification

#### Scenario: Repeated no-progress failure
- **WHEN** the same root cause repeats without meaningful progress
- **THEN** the agent MUST change strategy, delegate to the right specialist, report `BLOCKED`, or `ESCALATE`

### Requirement: Human Gates
Agents MUST require explicit human authorization for high-impact actions.

#### Scenario: High-impact operation
- **WHEN** an action would bypass branch protection, push directly to protected branches, merge pull requests, deploy or roll back production, perform destructive database/cloud/filesystem operations, change credentials/IAM/billing/release tags, force-push protected history, or delete protected branches
- **THEN** the agent MUST NOT perform the action without explicit authorization
