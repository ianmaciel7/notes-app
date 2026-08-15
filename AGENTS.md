<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Workflow

- Use native Windows PowerShell commands and paths by default.
- Before creating or renaming a working branch, follow the Branch Naming rules in `CONTRIBUTING.md`.
- Branch from `stag`, keep work focused, and target pull requests back to `stag` unless explicitly told otherwise.
- Use OpenSpec for durable product, behavior, governance, and acceptance-criteria changes.
- Use `pnpm verify` as the canonical local health check before opening or updating pull requests when scope allows.
