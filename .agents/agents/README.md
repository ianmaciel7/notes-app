# Subagents Registry (`.agents/agents/`)

This directory contains the canonical specifications for specialized subagents used in multi-agent orchestration.

## Subagent Delegation Matrix

The primary orchestrator delegates tasks according to this matrix:

| Subagent | Role | Capabilities | Spec File |
| :--- | :--- | :--- | :--- |
| **`research`** | Codebase & documentation exploration | Read + Write + Subagents + Tools | [`research.md`](./research.md) |
| **`architect`** | System boundaries, component modeling & ADRs | Read + Write + Subagents + Tools | [`architect.md`](./architect.md) |
| **`code-reviewer`** | Diff auditing, regression checks & quality | Read + Write + Tools | [`code-reviewer.md`](./code-reviewer.md) |
| **`test-engineer`** | Unit/integration tests & test execution | Read + Write + Subagents + Tools | [`test-engineer.md`](./test-engineer.md) |
| **`security-reviewer`** | Auth, secrets scanning & threat modeling | Read + Write + Tools | [`security-reviewer.md`](./security-reviewer.md) |
| **`doc-maintainer`** | Control docs & documentation synchronization | Read + Write + Tools | [`doc-maintainer.md`](./doc-maintainer.md) |
| **`a11y-reviewer`** | UI accessibility audits (WCAG 2.1 AA, keyboard, contrast) | Read-only + Tools | [`a11y-reviewer.md`](./a11y-reviewer.md) |
| **`firebase-specialist`** | Firebase Auth, Emulators, Seeds, Rules & Client Lifecycle | Read + Write + Subagents + Tools | [`firebase-specialist.md`](./firebase-specialist.md) |

## Specification Standard

Each agent file defines:
- **YAML Frontmatter**: `name`, `role`, `description` (with trigger examples), `model`, and tool capability flags.
- **System Prompt**: Expert persona, core responsibilities, analysis process, quality standards, and output contracts.
- **Context Contract**: The minimum canonical documents the agent must read before acting, plus conditional documents to load only when the task touches that area.

## Context Contracts

Agents must read `AGENTS.md` first for routing and repository invariants, then read
the documents listed in their own Context Contract. Conditional documents are loaded
only when the task enters that area; agents should not preload the entire repository.

| Agent | Required context | Conditional context |
| :--- | :--- | :--- |
| `research` | `AGENTS.md`, `README.md`, `TOOLING.md` | The canonical owner named by the question; `CONTEXT.md`, `ARCHITECTURE.md`, or `docs/` when relevant |
| `architect` | `AGENTS.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md` | `CONTEXT.md`, `CONTEXT-MAP.md`, `DER.md`, `DESIGN.md`, relevant ADRs, and product specs |
| `code-reviewer` | `AGENTS.md`, `CONVENTIONS.md`, `TESTING.md`, `CONSTRAINTS.md` | `ARCHITECTURE.md`, `SECURITY.md`, `DESIGN.md`, and the owning product spec |
| `test-engineer` | `AGENTS.md`, `TESTING.md`, `CONSTRAINTS.md`, `CONVENTIONS.md` | `DESIGN.md`, `SECURITY.md`, relevant product specs, and ADRs |
| `security-reviewer` | `AGENTS.md`, `SECURITY.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md` | `DER.md`, `CONVENTIONS.md`, auth/Firebase ADRs, and relevant product specs |
| `doc-maintainer` | `AGENTS.md`, `.agents/skills/context-manager/SKILL.md` | The canonical owner document, `README.md`, and all directly affected control docs |
| `a11y-reviewer` | `AGENTS.md`, `DESIGN.md`, `CONVENTIONS.md`, `TESTING.md` | Relevant component stories, product specs, and architecture docs |
| `firebase-specialist` | `AGENTS.md`, `ARCHITECTURE.md`, `SECURITY.md`, `TESTING.md` | `DER.md`, Firebase ADRs `0008`–`0013`, `CONVENTIONS.md`, and emulator setup docs |

## Runtime Registration

The orchestrator registers subagents dynamically in sessions via `define_subagent` and dispatches them via `invoke_subagent`.
