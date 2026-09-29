# .agents

Project-local source of truth for AGENTS.md, MCP configuration, skills, and editor hooks.

## Quick workflow

- `rtk agents status` inspects enabled integrations and MCP state.
- `rtk agents mcp add <url-or-name>` adds one server to the shared source.
- `rtk agents mcp test --runtime` validates configured servers.
- `rtk pnpm run .agents:sync` materializes tool-specific configuration.
- `rtk pnpm run check:agents` performs the repository's CI-safe sync verification.

## Source files

Commit these project-owned sources:

- `agents.json`: integrations, MCP servers, and workspace behavior.
- `hooks.json`: hook routing.
- `skills/*/SKILL.md`: project and installed skills.
- `../AGENTS.md`: repository instruction entry point.

Machine-local secrets and overrides belong in `local.json`, which is gitignored.

## Editor hooks

Hook wiring lives in `hooks.json`; the implementation lives with repository scripts:

- `scripts/hooks/hook-biome-on-edit.mjs`: PostToolUse formatting/check adapter.
- `scripts/hooks/hook-guard-paths.mjs`: PreToolUse generated/controlled-path guard.
- `scripts/hooks/hooks-lib.mjs`: shared payload and path logic.
- `scripts/hooks/hooks.test.mjs`: deterministic hook tests.

Thin files under `.agents/scripts/` only bridge integrations that expect scripts inside `.agents/`.

## Generated files

`agents sync` materializes tool-specific files such as `.agents/generated/*`, `.codex/config.toml`, `.mcp.json`, and `CLAUDE.md`. In `source-only` mode these are local generated outputs and are not canonical repository sources.
