<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mission
Deliver correct, maintainable changes with minimal risk.

## Scope
- Respect repository architecture and conventions.
- Keep edits focused; avoid unrelated refactors.
- Never commit secrets.

## Engineering Rules
- Validate changes with relevant checks before final delivery.
- Surface assumptions and edge cases explicitly.
- Prefer reversible changes and deterministic outputs.
- `.worktrees/` is strictly read-only and reserved exclusively for reference; never modify, create, or delete files inside it.

## MCP & Skills
- MCP server definitions: `.agents/agents.json`
- Local MCP overrides/secrets: `.agents/local.json`
- Project skills: `.agents/skills/*/SKILL.md`
- Skill Lockfile: `skills-lock.json` (maintained via `npx skills`)

## MCP & Skills Workflow
1. Add or update MCP entries in `.agents/agents.json`.
2. Manage third-party skills using `npx skills` (`add`, `update`, `remove`) and keep `skills-lock.json` synchronized.
3. Keep reusable instructions in `.agents/skills/*/SKILL.md`.
4. Always run `npx skills update` when modifying/updating skills and ensure changes to `skills-lock.json` are committed.
5. Run `agents sync` after adding, editing, or updating skills/MCP configurations.
6. Use `agents sync --check` in CI or before opening a PR to verify lockfile and skills synchronization.
7. Use `agents mcp test --runtime` when introducing new servers.

## Tool & MCP Selection Matrix

### Native & System Tools
- **Filesystem & Shell (`view_file`, `replace_file_content`, `run_command`)**: Primary tools for targeted file reads/writes, running package manager commands, and quick terminal executions.

### Specialized MCP Servers
- **Serena (`serena`)**: Use for AST-aware symbolic navigation, finding symbols (`find_symbol`), symbol references (`find_referencing_symbols`), type diagnostics, and safe semantic refactorings. Ensure project is activated via `activate_project`.
- **Graphify (`graphify`)**: Use for codebase architecture queries, dependency graphs, god node detection, cross-module relationships, and PR impact analysis (reads `graphify-out/graph.json`).
- **Playwright (`playwright`)**: Use for browser automation, E2E execution, and client-side UI validation.
- **Firebase (`firebase`)**: Use for local Firebase emulator inspection (Firestore, Auth, Storage) and resource management.
- **Git / GitHub (`git`, `github`)**: Use for branch management, commit generation, PRs, issues, and diff reviews.
- **Next.js Dev MCP (`nextjs`)**: Use for Next.js internal diagnostics, route tree inspection, and cache component validation.
- **Context7 (`context7`)**: Use for fetching up-to-date documentation, API syntax, and guides for external libraries and frameworks.

## Verification & Quality Gates
- Fast token-saving iteration check: `pnpm run verify:changed` (Biome on changed files, TypeScript typegen, Vitest on changed tests).
- Pre-commit fast gate: `pnpm run verify:fast` (Biome, TypeScript, Vitest, dependency-cruiser, CSpell).
- Dead code & unused exports: `pnpm run check:unused` (Knip).
- Code duplication: `pnpm run check:duplication` (jscpd).
- Markdown docs check: `pnpm run lint:md` (markdownlint-cli2).

## Agent Skills

### Issue Tracker
Tracked on GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage Labels
Canonical five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain Docs
Single-context domain model and architecture records. See `docs/agents/domain.md`.

## Workflow
1. Plan briefly.
2. Implement minimal viable change.
3. Validate (lint/tests/build/smoke as needed).
4. Report results and residual risks.

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. `resolve-library-id` with the library name and what to look up in the library's documentation. Use the official library name with proper punctuation (e.g., "Next.js" not "nextjs", "Customer.io" not "customerio", "Three.js" not "threejs")
2. Pick the best match by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and what to look up in the library's documentation (not single words), scoped to a single concept. If the question spans multiple distinct concepts (e.g. routing and auth and caching), make a separate `query-docs` call per concept with the same library ID, unless the question is about how the concepts interact — combined queries dilute ranking and return shallow results for each topic
4. Answer using the fetched docs
<!-- context7 -->
