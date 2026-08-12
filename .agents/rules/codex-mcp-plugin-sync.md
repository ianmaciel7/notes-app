# Codex MCP And Plugin Sync

Treat `.agents/mcp-servers.json` as the repository source of truth for MCP recommendations and required environment-variable names.

- When `.agents/mcp-servers.json` changes, audit the active Codex user-level MCP configuration and installed plugins for equivalent capability coverage.
- Prefer one verified official or trusted plugin when it fully covers a recommendation; do not also configure a duplicate raw MCP server.
- When no suitable plugin covers a recommendation, mirror its server name, transport, command, arguments, or URL in the supported Codex user-level configuration.
- Keep `.codex/` ignored and do not create repository-local Codex configuration as a second source of truth.
- Store secret values only in `.env`, the process environment, or supported credential storage. Record only environment-variable names in `.agents/mcp-servers.json` and never copy secret values into agent, plugin, or MCP configuration.
- After changing Codex MCP or plugin configuration, restart Codex and verify the active server or plugin tools. Configuration parity alone does not prove a healthy connection.
