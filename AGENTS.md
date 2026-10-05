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
