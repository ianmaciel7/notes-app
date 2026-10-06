# Notes Application

An object-based knowledge management system designed for capturing, organizing, and synthesizing interconnected thoughts and multimedia content.

<!-- agents:project-docs:start -->
## Using Agents in this Repository

This repository uses `@agents-dev/cli` to keep MCP servers, skills, and instructions aligned across AI tools.

### Quick Commands

```bash
agents status
agents mcp add <url-or-name>
agents mcp test --runtime
agents sync
agents sync --check
```

### One MCP Setup for All Tools

Add a server once in `.agents/agents.json`, then run `agents sync` to materialize it for enabled integrations.

### Agent References

- MCP Protocol Docs: https://modelcontextprotocol.io
- MCP Servers Catalog: https://mcpservers.org
- Agent Workflows: [docs/guides/workflows.md](./docs/guides/workflows.md)
<!-- agents:project-docs:end -->

---

## Architecture & Documentation

- [Architecture Guide](./ARCHITECTURE.md): Deep module interfaces, clean storage seams, and layer isolation rules.
- [Entity-Relationship Model (DER)](./DER.md): Canonical Firestore schemas, relations, cards, and attempts.
- [Coding Standards](./CODING_STANDARDS.md): Strict TypeScript, React Compiler invariants, and Tailwind CSS guidelines.
- [Testing Guidelines](./TESTING.md): Testing pyramid, Vitest, Playwright, and Stryker mutation testing.
- [Security Policy](./SECURITY.md): Vulnerability reporting and security invariants.
- [Contributing Guide](./CONTRIBUTING.md): Setup instructions, conventional commits, and pull request workflow.
- [Domain Glossary](./GLOSSARY.md): Ubiquitous language and domain terms.

---

## Getting Started

### Prerequisites

- Node.js v22+
- pnpm v12+

### Development

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the application.

### Verification

```bash
pnpm run verify:fast
```
