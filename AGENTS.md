# AGENT Instructions

This repository uses OpenSpec for significant proposals, workflow changes, and documentation updates.

## Repository entry points

- `CONTRIBUTING.md`
- `SECURITY.md`
- `GEMINI.md`
- `CLAUDE.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
- `docs/GRAPHIFY.md`

## Operational policy
- Use and keep `.agents/rules/*` aligned with contributor and agent workflows, including OpenSpec, English-first, UI, architecture, Git, and Graphify guidance.
- Use English-first for repository documentation and code-facing text.
- Keep practical docs synchronized in the same change when process or contributor rules change.
- When modifying behavior or contributor process, update related docs in the same change.

## Workflow notes

- Practical documentation baseline is maintained under this repo with the change `add-missing-repository-documentation`.
- Prefer small, atomic changes on dedicated branches and include clear verification notes in PRs.
- If this repository has a `CLAUDE.md`, follow instructions there as the top-priority AI agent entrypoint.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
