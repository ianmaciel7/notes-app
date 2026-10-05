## Mission
Deliver correct, maintainable changes with minimal risk.

## Scope
- Respect repository architecture and conventions.
- Keep edits focused; avoid unrelated refactors.
- Never commit secrets.

## Engineering Rules
- Validate changes with relevant checks before final delivery.
- Surface assumptions and edge cases explicitly.
- Prefer reversible changes and deterministic outputs.

## MCP & Skills
- MCP server definitions: `.agents/agents.json`
- Local MCP overrides/secrets: `.agents/local.json`

## MCP & Skills workflow
1. Add or update MCP entries in `.agents/agents.json`.
2. Run `agents sync` after adding, editing, or updating skills/MCP configurations.
3. Use `agents sync --check` in CI or before opening a PR to verify lockfile and skills synchronization.
4. Use `agents mcp test --runtime` when introducing new servers.

## Workflow
1. Plan briefly.
2. Implement minimal viable change.
3. Validate (lint/tests/build/smoke as needed).
4. Report results and residual risks.
