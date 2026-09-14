# Agent customizations

Antigravity discovers workspace agents from `.agents/agents/` and workspace
rules from `.agents/rules/`.

The `vercel-developer/agent.md` agent is the Markdown counterpart of
`.codex/agents/vercel-developer.toml`. Keep both definitions aligned in name,
purpose, plugin dependency, skill catalog, and scope when either one changes.

Keep `.agents/skills/` aligned with `.codex/skills/` and `.agents/rules/`
aligned with `.codex/rules/`. The root `AGENTS.md` is the canonical project
instruction file.
