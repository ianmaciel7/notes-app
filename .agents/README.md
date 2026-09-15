# Antigravity Agent Customizations

This directory defines workspace customizations discovered and indexed by Google Antigravity.

## Discovery Structure

- **Workspace Subagents**: Located in `.agents/agents/<name>/agent.md`
- **Workspace Rules**: Located in `.agents/rules/*.md`
- **Workspace Skills**: Located in `.agents/skills/<name>/SKILL.md`

> [!NOTE]
> The root [AGENTS.md](../AGENTS.md) is the canonical project instruction file. `GEMINI.md` acts as a lightweight platform adapter referencing `AGENTS.md`. Do not create or mirror configurations into `.codex` or other non-standard directories.

## Workspace Subagents Catalog

Each subagent is configured with standard YAML frontmatter (`subagent: true`) and isolated context:

1. **`architect`**: Architecture & System Design specialist for boundaries, component modeling, and ADRs.
2. **`code-reviewer`**: Quality & compliance specialist for auditing git diffs, TypeScript strictness, and Biome styles.
3. **`test-engineer`**: Testing specialist for unit/integration tests, test plans, and verification commands.
4. **`security-reviewer`**: Security specialist for Firebase Auth verification, Firestore security rules, and secrets auditing.
5. **`doc-maintainer`**: Documentation specialist for keeping `AGENTS.md`, `ARCHITECTURE.md`, and specs updated.
6. **`firebase-developer`**: Firebase specialist for Authentication, Firestore data models, security rules, and emulators.
7. **`vercel-developer`**: Next.js & Vercel specialist for App Router, server actions, caching, and deployment.

## Workspace Rules

- [rules/agents.md](./rules/agents.md): Shared principles, safety, precedence, and completing checklists across agents.
- [rules/subagents.md](./rules/subagents.md): Orchestration workflow, delegation matrix, and subagent lifecycle best practices.

## Inspection & Management

- In the Antigravity CLI or Desktop UI, type `/agents` to inspect running background subagents, review logs, and manage agent processes.
