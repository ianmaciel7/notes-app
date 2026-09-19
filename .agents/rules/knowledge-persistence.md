# Knowledge Retention & Persistence Rule

## Core Directive
Whenever important information, architectural decisions, recurring investigation findings, or reusable patterns are discovered—or when the user prompts to "save" findings—never leave that knowledge ephemeral in chat conversation logs. Always persist it to the correct canonical repository location for long-term reuse.

## Canonical Locations for Reuse

1. **Codebase Knowledge Graph (`graphify-out/`)**:
   - For relationship models, community clusters, and structural maps: keep the Graphify knowledge graph synchronized.
   - Always run `graphify update .` after adding or changing code, documentation, or rules to ensure graph queries (`graphify query`, `graphify path`) reflect the latest context.

2. **Research & Investigations (`docs/research/`)**:
   - For multi-file audits, performance investigations, library evaluations, or worktree comparisons, write a dedicated Markdown document: `docs/research/<topic>.md`.
   - Cite primary sources: exact file paths, commit hashes, line numbers, or official documentation URLs.

3. **System Architecture & Core Patterns (`ARCHITECTURE.md`)**:
   - For major system boundaries, data access layers (DAL), authentication strategies, and project-wide conventions.

4. **Agent Rules & Conventions (`.agents/rules/` & `AGENTS.md`)**:
   - For engineering policies, code standards, or subagent behaviors, create `.agents/rules/<rule-name>.md` and register the rule in `AGENTS.md`.

5. **Reusable Developer Skills (`.agents/skills/`)**:
   - For operational recipes, procedural workflows, or automated tools, create a dedicated skill folder with `SKILL.md` under `.agents/skills/<skill-name>/`.

## Quality & Traceability Checklist
- Use repository-relative paths (`docs/...`, `src/...`) to ensure portability.
- Format with clear Markdown headings, code blocks, and bullet points.
- Run `graphify update .` immediately after persisting new knowledge files so future agents and queries index the newly added knowledge.
