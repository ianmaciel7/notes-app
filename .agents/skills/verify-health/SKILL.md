---
name: verify-health
description: Runs the consolidated single-command health check for quality, tests, context engineering, harness engineering, and RTK token savings via verify-health.
---

# Verify Health Skill

Use this skill whenever you need to evaluate the complete health of the repository in a single execution.

## Triggering Keywords
- "verify health"
- "project health"
- "health check"
- "extract metrics"
- "verify tokens and quality"
- "verify:health"

## Workflow

Run the consolidated script via RTK:

```bash
rtk pnpm run verify:health
```

Or execute directly with node:

```bash
rtk node scripts/verify-health.mjs
```

Flags: `--fail-fast` stops at the first failing check; `--json` prints a machine-readable report
(per-step pass, seconds, and the tail of the error). Each step has a 15-minute timeout.

## What it validates (13 Checks in 1 Pass):

1. **Static Quality & Types**:
   - `tsc --noEmit` (Zero type errors)
   - `biome check` (Zero linter/formatting errors)
   - `dependency-cruiser` (Zero circular or architectural violations)
   - `jscpd` (Code duplication under threshold)
   - `floor-guard` (No forbidden suppressions or stubs)

2. **Testing & Coverage**:
   - `vitest run` (100% unit tests passing)
   - `vitest coverage` (Coverage floor compliance)
   - `node --test scripts/*.test.mjs` (Guards and hooks integrity)

3. **Context Engineering**:
   - `verify-control-docs.mjs` (11 control documents verifier)
   - `run-agents-cli.mjs sync --check` (Agents configuration sync)

4. **Harness Engineering & AI Efficiency**:
   - `lib.test.mjs` (Agent eval harness runner unit tests)
   - `verify-ai-tooling.mjs` (RTK enforcement & AI config compliance)
   - `rtk gain` (Token savings and prompt compression telemetry)
