# note

<!-- agents:project-docs:start -->
## Using agents in this repository

This repository uses `@agents-dev/cli` to keep MCP servers, skills, and instructions aligned across AI tools.

### Quick commands

```bash
agents status
agents mcp add <url-or-name>
agents mcp test --runtime
agents sync
agents sync --check
```

### One MCP setup for all tools

Add a server once in `.agents/agents.json`, then run `agents sync` to materialize it for enabled integrations.

### References

- MCP Protocol Docs: https://modelcontextprotocol.io
- MCP servers catalog: https://mcpservers.org
- Project examples: `docs/EXAMPLES.md`
<!-- agents:project-docs:end -->
