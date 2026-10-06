# .agents

Project-local configuration for agent instructions, MCP synchronization, and
skills.

## Canonical project instructions

- Root instructions: `../AGENTS.md`
- Architecture: `../ARCHITECTURE.md`
- Coding standards: `../CODING_STANDARDS.md`
- shadcn rule: `rules/shadcn.md`

## Quick workflow

- `agents status`
- `agents mcp add <url-or-name>`
- `agents mcp test --runtime`
- `agents sync`
- `agents sync --check`

## Source files

Commit:

- `agents.json`
- project-owned files in `rules/`
- project skills intentionally managed in `skills/`

Do not commit:

- `local.json`
- machine credentials or secrets

## Third-party skills

Files under `.agents/skills/**` may be installed or synchronized from external
skill sources. Do not bulk-rewrite those files when updating project
documentation. Update them only through their owning skill workflow or when the
project intentionally forks the skill.

## Generated outputs

Generated configuration can include:

- `.codex/config.toml`
- `.gemini/settings.json`
- `.vscode/mcp.json`
- `.cursor/mcp.json`
- `.agents/mcp_config.json`

Run `agents sync --check` when agent configuration changes.
