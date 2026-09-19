# Instruction Scoping Guidelines

Use these rules to decide where new agent instructions, conventions, and guidelines belong to prevent context bloat.

## 1. When to put in `AGENTS.md` (Root / Universal)
`AGENTS.md` is the universal entry point loaded on every coding session. It must stay concise (target < 60 lines, max 100).
- **Core project commands**: package manager (`pnpm`), dev, test, lint, build.
- **High-level architecture & stack boundaries**: framework (Next.js App Router), persistence, client/server separation, language boundaries.
- **Cross-cutting conventions**: strict TypeScript, English code, no-index barrel files, path portability.
- **Pointers**: links to narrower rule files, custom agents, skills, and documentation.

Do NOT include in `AGENTS.md`:
- Detailed checklists (>10-15 lines) for specific libraries or sub-features.
- Path-scoped rules or component-specific contracts.

## 2. When to create a Rule (`.agents/rules/<name>.md`)
Rules provide targeted, deep technical guidance and are activated conditionally based on file paths or domains.
- **Path-specific or domain-specific**: instructions that only apply when modifying certain files (e.g., `src/components/**/*.tsx`, `src/data/**/*.ts`, `**/*.test.ts`).
- **Context optimization**: technical contracts and checklists that would needlessly bloat the context window if loaded for unrelated tasks.

## 3. When to create a Skill (`.agents/skills/<name>/SKILL.md`)
Create a skill under `.agents/skills/<name>/SKILL.md` when:
- The guidance describes a **repeatable, multi-step interactive workflow or capability** (e.g., creating custom agents, authoring new skills).
- The task requires custom scripts, executable tools, or specialized sub-agent workflows.
