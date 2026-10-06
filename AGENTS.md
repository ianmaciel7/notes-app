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
- MCP server definitions: .agents/agents.json
- Local MCP overrides/secrets: .agents/local.json
- Project skills: .agents/skills/*/SKILL.md
- Skill Lockfile: skills-lock.json (maintained via npx skills)

## MCP & Skills workflow
1. Add or update MCP entries in .agents/agents.json.
2. Manage third-party skills using npx skills (add, update, remove) and keep skills-lock.json synchronized.
3. Keep reusable instructions in .agents/skills/*/SKILL.md.
4. Always run npx skills update when modifying/updating skills and ensure changes to skills-lock.json are committed.
5. Run agents sync after adding, editing, or updating skills/MCP configurations.
6. Use agents sync --check in CI or before opening a PR to verify lockfile and skills synchronization.
7. Use agents mcp test --runtime when introducing new servers.

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

### Verification & Quality Gates
- Fast pre-commit check: `pnpm run verify:fast` (Biome, TypeScript, Vitest, dependency-cruiser, CSpell).
- Dead code & unused exports: `pnpm run check:unused` (Knip).
- Code duplication: `pnpm run check:duplication` (jscpd).
- Markdown docs check: `pnpm run lint:md` (markdownlint-cli2).


## Agent skills

### Issue tracker
Tracked on GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels
Canonical five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs
Single-context domain model and architecture records. See `docs/agents/domain.md`.

## Workflow
1. Plan briefly.
2. Implement minimal viable change.
3. Validate (lint/tests/build/smoke as needed).
4. Report results and residual risks.
