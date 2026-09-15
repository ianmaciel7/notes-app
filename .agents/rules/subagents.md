# Antigravity Subagents Orchestration & Standards

This rule establishes official Google Antigravity standards and best practices for configuring, orchestrating, and delegating work across subagents in this repository.

## Subagent Architecture & Configuration

In Google Antigravity, subagents are independent, concurrent agent sessions that operate with their own isolated context windows to execute complex tasks without polluting or overflowing the primary conversation.

### Agent Definition Standard

Every custom workspace agent is defined in `.agents/agents/<name>/agent.md` (or `.agents/agents/<name>.md`) using YAML frontmatter:

```markdown
---
name: agent-name
description: A concise description of the agent's role and when it should be invoked.
subagent: true
---

# Agent Name
Role guidelines, repository contract, and execution standards...
```

- **`name`**: Unique lowercase hyphenated identifier matching the directory name.
- **`description`**: Semantic summary used by the primary orchestrator to discover and select the agent.
- **`subagent: true`**: Explicitly registers the agent as an invocable subagent for `invoke_subagent`.

## Orchestrator Pattern & Delegation Workflow

The primary agent operates as a **Lead Orchestrator**:

1. **Triage & Decompose**: Deconstruct complex, domain-specific, or multi-step tasks into isolated subtasks.
2. **Dispatch Concurrently**: Invoke specialized subagents using `invoke_subagent` with clear, actionable prompts.
3. **Reactive Coordination**: Do NOT poll in a loop; Antigravity's reactive message delivery will notify the orchestrator upon subagent completion or updates.
4. **Synthesize & Validate**: Combine results, verify outputs against repository invariants, and present unified solutions.

## Subagent Delegation Matrix

| Domain | Subagent | Primary Scope |
| :--- | :--- | :--- |
| **Research & Exploration** | `search` | Codebase exploration, file search sweeps, and web/API documentation retrieval. |
| **Architecture & System Design** | `architect` | System boundaries (RSC vs Client), component hierarchy, refactoring strategy, and ADRs. |
| **Code Review & Quality** | `code-reviewer` | Auditing git diffs, checking strict TypeScript, enforcing Biome styles, and verifying contracts. |
| **Testing & Verification** | `test-engineer` | Designing test plans, authoring tests, running verification commands (`pnpm test`), and emulator tests. |
| **Security & Privacy** | `security-reviewer` | Firebase Auth verification, Firestore security rules (default-deny), secret leakage audits, and threat modeling. |
| **Documentation** | `doc-maintainer` | Maintaining `AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, and markdown guidelines. |
| **Firebase Specialist** | `firebase-developer` | Auth, Firestore data models, Security Rules, Firebase Emulator Suite, and Next.js integration. |
| **Vercel & Next.js** | `vercel-developer` | Next.js App Router, SSR/RSC optimization, caching strategies, Vercel deployment, and shadcn/ui. |

## Subagent Lifecycle & Tooling Best Practices

## Delegation Relationships

Specialists remain independently invocable; delegation describes preferred
coordination, not nested agent registration:

- `architect` delegates Firebase-specific architecture to `firebase-developer`
  and Next.js/Vercel architecture to `vercel-developer`.
- `security-reviewer` delegates Firebase Auth, Firestore, and emulator checks
  to `firebase-developer` when implementation-level expertise is needed.
- `vercel-developer` delegates Firebase integration details to
  `firebase-developer` when a task crosses the Next.js and Firebase boundary.
- `firebase-developer` returns Firebase-specific findings to the delegating
  agent, which remains responsible for synthesizing the result and validating
  the broader task.

- **Independent Context**: Subagents operate in dedicated contexts; pass all critical constraints, file pointers, and requirements directly in the invocation prompt.
- **Agent Manager**: In the Antigravity CLI or Desktop UI, track subagent states (*running*, *done*, *error*, *killed*) using the `/agents` panel.
- **Skill Reuse**: Subagents leverage reusable skills defined in `.agents/skills/` or `~/.gemini/config/skills/` through progressive disclosure.
