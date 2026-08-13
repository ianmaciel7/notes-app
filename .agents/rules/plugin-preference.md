# Plugin Preference Rule

When a requested tool, integration, MCP server, or workflow has an equivalent official or trusted plugin, prefer the plugin over raw MCP configuration.

- Prefer official vendor plugins first.
- Prefer trusted marketplace plugins over direct `npx` MCP server entries when capabilities match.
- Keep direct MCP configuration when no plugin exists, the plugin lacks required capabilities, or the user explicitly asks for raw MCP setup.
- Do not install plugins automatically during discovery; install only when the user asks for installation.
- Verify plugin provenance and compatibility before recommending replacement of an existing MCP entry.
