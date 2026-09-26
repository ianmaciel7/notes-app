# Subagents Registry (`.agents/agents/`)

This directory contains the canonical specifications for specialized subagents used in multi-agent orchestration.

## Subagent Delegation Matrix

The primary orchestrator delegates tasks according to this matrix:

| Subagent | Role | Capabilities | Spec File |
| :--- | :--- | :--- | :--- |
| **`research`** | Codebase & documentation exploration | Read + Write + Tools | [`research.md`](./research.md) |
| **`architect`** | System boundaries, component modeling & ADRs | Read + Write + Tools | [`architect.md`](./architect.md) |
| **`code-reviewer`** | Diff auditing, regression checks & quality | Read + Write + Tools | [`code-reviewer.md`](./code-reviewer.md) |
| **`test-engineer`** | Unit/integration tests & test execution | Read + Write + Tools | [`test-engineer.md`](./test-engineer.md) |
| **`security-reviewer`** | Auth, secrets scanning & threat modeling | Read + Write + Tools | [`security-reviewer.md`](./security-reviewer.md) |
| **`doc-maintainer`** | Control docs & documentation synchronization | Read + Write + Tools | [`doc-maintainer.md`](./doc-maintainer.md) |

## Specification Standard

Each agent file defines:
- **YAML Frontmatter**: `name`, `role`, `description` (with trigger examples), `model`, and tool capability flags.
- **System Prompt**: Expert persona, core responsibilities, analysis process, quality standards, and output contracts.

## Runtime Registration

The orchestrator registers subagents dynamically in sessions via `define_subagent` and dispatches them via `invoke_subagent`.
