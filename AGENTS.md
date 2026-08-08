<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Environment

- Work from WSL2; prefer Linux paths, shell commands, and assumptions unless a task requires native Windows behavior.
- The primary local shell is Windows PowerShell; do not use Bash-style `\` line continuation in PowerShell examples.
- Use pnpm 11.20.0.

## Canonical Docs

| Need | Document |
| --- | --- |
| Setup, commands, Git, commits, PRs, CI, merge, versioning, tags | `CONTRIBUTING.md` |
| Security, secrets, dependency review | `SECURITY.md` |
| Architecture and project structure | `docs/ARCHITECTURE.md` |
| Design principles and accessibility | `docs/DESIGN.md` |
| Testing and verification | `docs/TESTING.md` |
| Build, environments, deployment | `docs/DEPLOYMENT.md` |
| Agent context audit | `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md` |

## Mandatory Conventions

- Follow `CONTRIBUTING.md` for branch, commit, push, pull request, CI, merge, versioning, tag, and release preparation work.
- Follow `docs/DEPLOYMENT.md` for deployment triggers, environment promotion, deployment verification, and rollback behavior.
- Do not push directly to protected branches.
- Do not create, delete, move, or force-update release tags unless explicitly instructed.
- For Next.js API, routing, caching, or file-convention work, read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed.
- Keep `CLAUDE.md` and `GEMINI.md` as pointers to `AGENTS.md`; do not duplicate instructions there.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Use `.agents/workflows/` and OpenSpec for proposals, significant architectural changes, rationale, alternatives, and trade-offs.
- Use `.agents/agents/` only when a specialized role is useful for review or planning.
- Keep generic MCP server recommendations in `.agents/mcp-servers.json`; do not store secrets there.
