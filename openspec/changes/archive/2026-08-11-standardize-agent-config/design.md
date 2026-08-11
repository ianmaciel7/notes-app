## Context

The repository already has the intended canonical `.agents/` tree with skills, rules, agents, workflows, and `mcp-servers.json`. Legacy `.agent/` and `.gemini/` trees contain overlapping OpenSpec skills/workflows, while `.codex/` is an empty generated directory. `GEMINI.md` is a one-line pointer to `AGENTS.md`, and `.geminiignore` duplicates ignore behavior for a single vendor.

## Decisions

- Keep `AGENTS.md` concise and update it to state the vendor-neutral ownership model directly.
- Keep `.agents/` as the only repository-owned agent configuration directory.
- Preserve portable workflow content that only exists in legacy `.agent/workflows/` by migrating it into `.agents/workflows/`.
- Treat `.gemini/commands/` TOML files as vendor-specific wrappers rather than canonical portable workflows; do not migrate them.
- Remove `GEMINI.md` and `.geminiignore` because they are vendor-specific project files and the repository goal is a single canonical layer.
- Keep `CLAUDE.md` unchanged as an existing pointer because the request did not ask to remove it and the existing spec only needs to forbid redundant vendor-specific instruction files. It can be removed in a later change if the repository chooses to eliminate all vendor entrypoint pointers.

## Risks

- Some tools may regenerate vendor-specific project directories. `.gitignore` will keep those local and untracked.
- Removing Gemini command wrappers may reduce convenience for that CLI, but avoids maintaining duplicate workflow contracts. Compatible agents should consume `.agents/` or user-level tool configuration instead.

## Verification

- Compare legacy trees against `.agents/` before deletion.
- Search repository references to removed paths and update or preserve historical references only when clearly archival.
- Validate the OpenSpec change.
- Verify the final filesystem has no `.agent/`, `.codex/`, or `.gemini/` directories and no duplicate `SKILL.md` copies outside `.agents/skills/`.
