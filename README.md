# Notes App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI-Assisted Development

This repository is configured for AI-assisted development across **Antigravity, Codex, Claude Code, and Cursor**.

The tooling is designed to reduce unnecessary context and token usage while improving codebase navigation and retrieval.

### Tooling

- **Serena** — semantic code navigation, symbol lookup, references, and targeted code editing.
- **Graphify** — persistent repository knowledge graph for architecture and cross-file relationships.
- **RTK** — filters and compresses terminal output to reduce token usage.
- **Context7** — retrieves current framework and library documentation on demand.
- **Repomix** — creates compact repository snapshots for repository-wide analysis.

### Context Strategy

Prefer the smallest useful context:

1. **Serena** for code-level navigation and targeted edits.
2. **Graphify** for architecture and repository relationships.
3. **Context7** for external framework and library documentation.
4. **RTK** for supported terminal commands.
5. **Repomix** only when repository-wide context is necessary.

Shared instructions for coding agents are defined in [`AGENTS.md`](./AGENTS.md).

### AI Configuration

```text
AGENTS.md
└── Shared instructions for AI coding agents

CLAUDE.md
└── Claude Code adapter to AGENTS.md

GEMINI.md
└── Antigravity-specific integration instructions when required

.agents/
└── rules/
    ├── graphify.md
    └── rtk.md

.serena/
└── project.yml

graphify-out/
├── graph.json
├── GRAPH_REPORT.md
└── graph.html

repomix.config.json
└── Repomix configuration
```

Machine-specific state, caches, backups, and temporary generated files are excluded through `.gitignore`.

## Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy this application is with the [Vercel Platform](https://vercel.com/new).

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.