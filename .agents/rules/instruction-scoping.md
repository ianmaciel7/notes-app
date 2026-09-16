---
trigger: glob
globs:
  - "AGENTS.md"
  - ".agents/**/*.md"
  - ".cursor/rules/*.md"
  - "CLAUDE.md"
description: >-
  Decision criteria and scoping guidelines for AGENTS.md versus dedicated rule files (.agents/rules/*.md) and skills (.agents/skills/*).
---

# Instruction Scoping Guidelines

Use these rules to decide where new agent instructions, conventions, and guidelines belong.

## 1. When to put in `AGENTS.md` (Root / Universal)

`AGENTS.md` is the universal entry point loaded on every coding session. It must stay concise (target < 60 lines, max 100).

Include in `AGENTS.md`:
- **Core project commands**: package manager (`pnpm`), dev, test, lint, typecheck, build.
- **High-level architecture & stack boundaries**: framework (Next.js App Router), persistence (IndexedDB/Dexie), client/server separation, language boundaries (pt-BR product copy vs. English code).
- **Cross-cutting coding conventions**: strict TypeScript, 2-space indentation, kebab-case filenames.
- **Pointers & external reference tables**: links to narrower rule files, custom agents, skills, and documentation.

Do NOT include in `AGENTS.md`:
- Detailed checklists (>10-15 lines) for specific libraries or sub-features.
- Path-scoped rules or component-specific contracts.
- Ephemeral task notes or temporary instructions.

## 2. When to create a Rule (`.agents/rules/<name>.md`)

Rules provide targeted, deep technical guidance and are activated conditionally based on file paths or domains.

Create a rule in `.agents/rules/<name>.md` when:
- **Path-specific or glob-triggered**: instructions that only apply when modifying certain files (e.g., `src/components/**/*.tsx`, `src/data/**/*.ts`, `**/*.test.ts`).
- **Exhaustive technical contracts**: detailed checklists, component accessibility (ARIA), slot naming conventions, third-party library lifecycle patterns (e.g., `shadcn-first.md`).
- **Domain/subsystem policies**: database indexing/mutation constraints, migration guides, specific integration contracts.
- **Context optimization**: instructions that would needlessly bloat the context window if loaded for unrelated tasks.

## 3. When to create a Skill (`.agents/skills/<name>/SKILL.md`)

Create a skill under `.agents/skills/<name>/SKILL.md` when:
- The guidance describes a **repeatable, multi-step interactive workflow or capability** (e.g., creating custom agents, authoring new skills, searching across worktrees).
- The task requires custom scripts, executable tools, or specialized sub-agent workflows.

## Decision Matrix

| Question | Destination |
| :--- | :--- |
| Does this apply to every single task across the entire repository? | `AGENTS.md` |
| Is it a detailed technical checklist or specific to certain file paths (`globs`)? | `.agents/rules/<name>.md` (add 1-line pointer in `AGENTS.md` if relevant) |
| Is it a step-by-step repeatable workflow, tool, or interactive process? | `.agents/skills/<name>/SKILL.md` |
