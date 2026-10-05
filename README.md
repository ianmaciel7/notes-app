# note

<!-- agents:project-docs:start -->
## Using agents in this repository

This repository uses @agents-dev/cli to keep MCP servers, skills, and instructions aligned across AI tools.

### Quick commands

`ash
agents status
agents mcp add <url-or-name>
agents mcp test --runtime
agents sync
agents sync --check
`

### One MCP setup for all tools

Add a server once in .agents/agents.json, then run gents sync to materialize it for enabled integrations.

### References

- MCP Protocol Docs: https://modelcontextprotocol.io
- MCP servers catalog: https://mcpservers.org
- Project examples: docs/EXAMPLES.md
<!-- agents:project-docs:end -->

## Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with:
`ash
pnpm create next-app . --ts --tailwind --biome --app --src-dir --react-compiler
`

### Getting Started

Run the development server:

`ash
pnpm dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
