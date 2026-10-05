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

## MCP & Skills
- MCP server definitions: .agents/agents.json
- Local MCP overrides/secrets: .agents/local.json
- Project skills: .agents/skills/*/SKILL.md
- Skill Lockfile: skills-lock.json (maintained via 
px skills)

## MCP & Skills workflow
1. Add or update MCP entries in .agents/agents.json.
2. Manage third-party skills using 
px skills (dd, update, emove) and keep skills-lock.json synchronized.
3. Keep reusable instructions in .agents/skills/*/SKILL.md.
4. Always run 
px skills update when modifying/updating skills and ensure changes to skills-lock.json are committed.
5. Run gents sync after adding, editing, or updating skills/MCP configurations.
6. Use gents sync --check in CI or before opening a PR to verify lockfile and skills synchronization.
7. Use gents mcp test --runtime when introducing new servers.

## Workflow
1. Plan briefly.
2. Implement minimal viable change.
3. Validate (lint/tests/build/smoke as needed).
4. Report results and residual risks.
