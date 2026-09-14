# Codex agent configuration

`.codex/agents/vercel-developer.toml` is the project-scoped Codex agent.
Keep it aligned with `.agents/agents/vercel-developer/agent.md`, which is the
Antigravity counterpart. Both must keep the same name, purpose, plugin
dependency, skill catalog, and scope; only the file format differs.

Project skills and rules are mirrored under `.codex/skills/` and
`.codex/rules/`, respectively. The repository root `AGENTS.md` remains the
canonical project instruction file, and `.codex/rules/agents.md` must not
contradict `.agents/rules/agents.md`.

The global Codex equivalent is `C:\Users\ianma\.codex\agents` and is not
required when the project-scoped agent is used.
