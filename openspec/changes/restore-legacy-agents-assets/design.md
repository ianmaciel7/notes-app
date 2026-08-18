## Purpose

Provide a safe, traceable implementation plan for restoring legacy agent skills and MCP configuration with minimal behavioral impact.

## Decisions

- Use `origin/old` as the source of record for the legacy skill catalog and MCP manifest.
- Keep the change within repository configuration; no runtime or application code changes are required.
- Set `.openspec.yaml` `skip_specs: true` because behavior-level requirements are not changing.

## Implementation Plan

1. Update `.openspec.yaml` to mark docs/tooling-only scope (`skip_specs: true`).
2. Restore `.agents/mcp-servers.json` from `origin/old`.
3. Restore `.agents/skills` from `origin/old` while preserving project-local, valid skills already added for this repository.
4. Reconcile docs references (`README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) to mention the restored Graphify and MCP assets.
5. Validate by listing restored files and checking manifest/parsing health.

## Verification

- Run `git status` to confirm expected tracked changes are in scope.
- Verify `.agents/mcp-servers.json` exists and contains required top-level fields (`version`, `purpose`, `servers`).
- Verify `.agents/skills` contains the expected migrated legacy skill tree.
