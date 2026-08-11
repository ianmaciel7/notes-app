## Why

The repository has a strong harness, but its subagent definitions and shared agent loop guidance drifted behind the verification harness. Coding agents need a small durable contract for using OpenSpec, focused subagents, objective verification, bounded retries, terminal states, and safe pull requests without introducing a parallel orchestration framework.

## What Changes

- Define the minimal main-agent execution loop in existing canonical agent guidance.
- Clarify when OpenSpec is required and keep OpenSpec verification separate from software verification.
- Refresh existing subagent definitions so their repository facts, triggers, and Antigravity tool declarations match the current repository and runtime documentation.
- Document bounded retry, no-progress, DONE, BLOCKED, ESCALATE, human-gate, and proportional review expectations.
- Preserve the existing harness, Git workflow, CI, rulesets, skills, and OpenSpec mechanisms.

## Capabilities

### New Capabilities

- `agent-loop-engineering`: Defines the repository contract for coding-agent execution loops, subagent delegation, verification, retry behavior, terminal states, and safe PR handoff.

### Modified Capabilities

None.

## Impact

- `AGENTS.md`
- `docs/TESTING.md`
- `.agents/agents/*/agent.md`
- OpenSpec change artifacts under `openspec/changes/improve-agent-loop-engineering/`

No application runtime behavior, dependencies, CI jobs, protected-branch rulesets, MCP servers, hooks, or production deployment configuration are changed.
