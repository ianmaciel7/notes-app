<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Setup commands
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Build: `pnpm build`

## Code style
- Biome is the only linter/formatter (no ESLint/Prettier). TypeScript strict mode. Named exports only in `src/components/ui/` — no `export default` outside Next.js route entrypoints.
- See `CONVENTIONS.md` for full naming/import rules and `DESIGN.md` for the UI primitive/token catalog.

## Testing instructions
- No test suite is configured yet — there is no `pnpm test` script. `pnpm lint` and `pnpm build` are the only automated checks; run both before considering a task done.
- See `TESTING.md` for current coverage status (Ladle stories only, 1 of 60 components covered).

## PR instructions
- See `CONTRIBUTING.md` for branch naming, commit format (Conventional Commits), and the pre-flight checklist.
