## ADDED Requirements

### Requirement: Main agent controls the execution loop

The repository SHALL define the primary coding agent as the loop controller responsible for discovery, OpenSpec routing, focused delegation, implementation, verification, review selection, terminal-state reporting, and safe pull-request handoff.

#### Scenario: Agent starts a task

- **WHEN** a coding agent begins a repository task
- **THEN** it discovers relevant repository context, determines whether OpenSpec is required, selects only justified subagents, and avoids creating duplicate harness or specification systems

### Requirement: OpenSpec remains the durable requirements authority

The repository SHALL use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, tasks, verification, and archive history when a change needs a lasting development contract.

#### Scenario: Durable behavior changes

- **WHEN** a task introduces or changes durable behavior, acceptance criteria, architecture, or agent-development contracts
- **THEN** the agent uses the installed OpenSpec workflow and keeps transient loop progress out of separate plan, memory, or task files

### Requirement: Software verification is distinct from OpenSpec verification

The repository SHALL keep software verification and OpenSpec verification as separate completion evidence.

#### Scenario: Meaningful OpenSpec-driven change completes

- **WHEN** implementation is ready for a meaningful OpenSpec-driven change
- **THEN** the agent runs task-appropriate software verification and separately validates the relevant OpenSpec artifacts or requirements before claiming completion

### Requirement: Subagent delegation is focused and shallow

The repository SHALL prefer one level of subagent delegation using existing specialized agents, with compact delegation packets and least-privileged capabilities.

#### Scenario: Specialist help is useful

- **WHEN** specialist analysis is justified
- **THEN** the main agent delegates only the objective, relevant files or search scope, constraints, allowed tools, and expected output to an existing specialist agent

### Requirement: Subagent definitions match supported runtime tools

Repository subagent definitions SHALL use tool names and capability settings supported by the intended runtime and SHALL avoid stale repository facts.

#### Scenario: Runtime-specific subagent configuration is updated

- **WHEN** subagent frontmatter is changed for a specific runtime
- **THEN** the agent checks current runtime documentation or installed runtime evidence and removes unsupported or stale tool declarations

### Requirement: Verification failures trigger diagnosis

The repository SHALL require verification failures to be classified and addressed through targeted diagnosis rather than blind retries.

#### Scenario: Verification fails

- **WHEN** a verification command fails
- **THEN** the agent identifies the failing check, classifies the likely root cause, makes a targeted change if appropriate, and reruns the narrowest useful verification before broader verification

### Requirement: Retries are bounded and no-progress is detected

The repository SHALL define bounded retry behavior and require the agent to stop, change strategy, delegate, or escalate when repeated attempts do not reduce the same failure.

#### Scenario: Same failure repeats

- **WHEN** the same root cause recurs without meaningful progress after targeted attempts
- **THEN** the agent reports the evidence and chooses a strategy change, specialist review, BLOCKED state, or ESCALATE state instead of continuing indefinitely

### Requirement: Terminal states are explicit

The repository SHALL require meaningful agent tasks to end in DONE, BLOCKED, or ESCALATE with supporting evidence.

#### Scenario: Agent reports terminal state

- **WHEN** a task reaches a stopping point
- **THEN** the agent reports DONE with verification evidence, BLOCKED with the external dependency and attempted steps, or ESCALATE with the human decision or authorization required

### Requirement: Human gates protect high-impact actions

The repository SHALL keep high-impact actions under explicit human authorization and mechanical protections where practical.

#### Scenario: High-impact action is encountered

- **WHEN** a task would require protected-branch bypass, production deployment, destructive data or cloud operations, credential changes, force updates, tag changes, or merge authorization
- **THEN** the agent stops for explicit human authorization and does not proceed autonomously

### Requirement: Review rigor is proportional to risk

The repository SHALL use independent review proportionally to change risk and complexity.

#### Scenario: Meaningful implementation is complete

- **WHEN** a change affects multiple files, user-visible behavior, important logic, architecture, security, dependencies, or deployment exposure
- **THEN** the agent requests the appropriate existing reviewer agent or records why independent review was not justified
