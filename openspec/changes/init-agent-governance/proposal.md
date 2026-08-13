## Why

The `stag` baseline only contains the generated Next.js `AGENTS.md` block and empty OpenSpec folders. The richer historical branch contains a useful `.agents/` system, but it also includes assumptions that should not be copied blindly into this Windows-first worktree.

This change initializes a vendor-neutral agent governance surface for the repository while preserving OpenSpec as the durable requirements owner.

## What Changes

- Restore the `.agents/` structure for reusable project skills, rules, workflows, specialist agents, and MCP recommendations.
- Replace the top-level `AGENTS.md` with a current entrypoint that keeps the generated Next.js block, points to `.agents/`, and records Windows/PowerShell defaults for `ianma`.
- Configure OpenSpec context for the current `stag` baseline and agent-governance workflow.
- Document the first governance requirements in an active OpenSpec change before restoring the broader docs and CI stack.

## Non-Goals

- Do not restore all historical docs, CI, GitHub rulesets, Graphify output, or product OpenSpec changes in this first slice.
- Do not claim Graphify, MCP, CI, or plugin parity from historical files alone.
- Do not add secrets or repository-local vendor-specific configuration.

## Impact

- Affected repository configuration: `AGENTS.md`, `.agents/`, `openspec/config.yaml`.
- Affected specs: `openspec/changes/init-agent-governance/specs/repository-governance/spec.md`, `openspec/changes/init-agent-governance/specs/agent-loop-engineering/spec.md`.
- No runtime application code changes.
