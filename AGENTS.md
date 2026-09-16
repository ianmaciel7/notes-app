<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context

- Next.js 16 with React 19 and TypeScript.
- pnpm is the package manager (`pnpm@11.20.0`).
- Application code lives under `src/`; the main route is `src/app/page.tsx`.
- Shared UI primitives live in `src/components/ui/`; utilities live in `src/lib/`; hooks live in `src/hooks/`.
- UI configuration is in `components.json`; Biome configuration is in `biome.json`.
- A Graphify knowledge graph is available under `graphify-out/`.

## Documentation and agent resources

- Architecture: `ARCHITECTURE.md`
- Rules: `.agents/rules/`
- Skills: `.agents/skills/`
- Project overview and commands: `README.md`
