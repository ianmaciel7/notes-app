<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Setup commands
- Install deps: `rtk pnpm install`
- Start dev server: `rtk pnpm dev`
- Build: `rtk pnpm build`

Use `rtk` before shell commands so command output stays compact. Run RTK's own
commands directly, for example `rtk gain` and `rtk init --codex`.

## Agent tooling

Always use the project-configured `@agents-dev/cli` (`agents`) for MCP servers, skills, integrations, profiles, and generated tool configuration. Treat `.agents/agents.json` and `.agents/skills/` as the source of truth; do not edit generated tool files directly. Run `rtk agents sync` after source changes and `rtk agents sync --check` to verify drift. Use `rtk agents status` or `rtk agents doctor` before troubleshooting. Keep secrets in `.agents/local.json`, never in committed configuration.

Serena is enabled as the project MCP server for Codex. Use it for semantic code navigation, symbol-aware retrieval, and edits when those operations are useful; it starts with `--context=codex --project-from-cwd` and selects this repository from the current working directory. Project-specific Serena settings live in `.serena/project.yml`; use `.serena/project.local.yml` for local-only overrides. Keep the Serena server definition in `.agents/agents.json` and regenerate tool configuration with `rtk agents sync` rather than editing `.codex/config.toml` directly.

When a code search depends on syntax or code structure, prefer `ast-grep` structural search over text-only search. Use `ast-grep outline` to get a compact map of unfamiliar source files before reading or editing them; use `rg` for plain-text searches.

Creating, installing, removing, or updating a skill always requires updating and committing the legacy `skills-lock.json` with `rtk npx skills update -p -y`. Even when the command produces only reordered entries or refreshed hashes, include its result and verify the lock file before finishing.

If PowerShell blocks the global `agents` script shim, invoke the equivalent `agents.cmd` command.

## Code style
- Biome is the only linter/formatter (no ESLint/Prettier). TypeScript strict setting. Named exports only in `src/components/ui/` — no `export default` outside Next.js route entrypoints.
- Build reusable UI through composition: prefer compound components and `children` over boolean flag props or `renderX` customization props. Lift shared state into providers with an explicit `state`/`actions`/`meta` context contract.
- For React 19, pass `ref` as a regular prop and use `use()` for context where appropriate; do not introduce `forwardRef` or `useContext` in new code.
- For shadcn/Base UI primitives, use existing components and variants first, semantic theme tokens, `cn()` for conditional classes, `gap-*` rather than `space-*`, and the project’s `render` slot API rather than assuming Radix `asChild`.
- See `CONVENTIONS.md` for full naming/import rules and `DESIGN.md` for the UI primitive/token catalog.

## Testing instructions
- No test suite is configured yet — there is no `pnpm test` script. `rtk pnpm lint` and `rtk pnpm build` are the only automated checks; run both before considering a task done.
- See `TESTING.md` for current coverage status (Ladle stories only, 1 of 61 components covered).

## PR instructions
- See `CONTRIBUTING.md` for branch naming, commit format (Conventional Commits), and the pre-flight checklist.

<!-- context7 -->
Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Resolve library: `rtk npx ctx7@latest library <name> "<what to look up>"` — use the official library name with proper punctuation (e.g., "Next.js" not "nextjs", "Customer.io" not "customerio", "Three.js" not "threejs")
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question)
3. Fetch docs: `rtk npx ctx7@latest docs <libraryId> "<what to look up>"` — run a separate `docs` command per distinct concept if the question spans multiple topics, unless it's about how they interact
4. Answer using the fetched documentation

You MUST call `library` first to get a valid ID unless the user provides one directly in `/org/project` format. Be specific about what to look up in the library's documentation — specific and detailed queries return better results than vague single words, but keep each query to a single concept unless the question is about how concepts interact; combined multi-topic queries dilute ranking and return shallow results for each topic. Do not run more than 3 commands per question. Do not include sensitive information (API keys, passwords, credentials) in queries.

For version-specific docs, use `/org/project/version` from the `library` output (e.g., `/vercel/next.js/v14.3.0`).

If a command fails with a quota error, inform the user and suggest `rtk npx ctx7@latest login` or setting `CONTEXT7_API_KEY` env var for higher limits. Do not silently fall back to training data.
Run Context7 CLI requests outside Codex's default sandbox. If a Context7 CLI command fails with DNS or network errors such as ENOTFOUND, host resolution failures, or fetch failed, rerun it outside the sandbox instead of retrying inside the sandbox.
<!-- context7 -->

@RTK.md

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
