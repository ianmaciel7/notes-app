## Why

The repository currently only has a partial set of `.agents/skills` and no canonical MCP manifest import from the previous baseline, which causes divergence in agent capabilities and configuration workflow across environments.

Restoring the `origin/old` skill and MCP assets re-establishes a consistent agent tooling baseline and avoids manual, drift-prone setup for the Codex, Graphify, and other agent integrations.

## What Changes

- Restore `.agents/skills` from `origin/old` so all legacy skill definitions are available locally.
- Restore `.agents/mcp-servers.json` from `origin/old` as the MCP manifest reference for this repository.
- Ensure repository documentation references remain aligned with these restored assets.
- Register/setup Graphify skill installation/configuration steps (docs + manifest alignment).

## Capabilities

### New Capabilities

### Modified Capabilities

- `ops/agent-assets` (tooling baseline): restore and synchronize agent skill and MCP definitions from the `old` branch baseline.

## Impact

- `.agents/skills/*`
- `.agents/mcp-servers.json`
- `README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` (reference alignment)
