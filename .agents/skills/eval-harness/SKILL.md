---
name: eval-harness
description: Run and compare multi-agent evaluations across Codex and Antigravity. Compares eval results, tracks metrics, and surfaces regressions.
metadata:
  category: AI Tooling
  triggers: ["eval", "multi-agent", "regression detection"]
---

## Overview

Your notes-app evaluates Codex and Antigravity against key architectural tasks using custom evals in `.agents/evals/`. This skill orchestrates comparative eval runs and captures baseline metrics.

## Available Evals

Run evals with:

```bash
pnpm eval:codex        # Run Codex evals
pnpm eval:antigravity  # Run Antigravity evals
pnpm run test:harness  # Run eval infrastructure tests
```

## Workflow

### Run Targeted Evals

Evaluate specific code modules or patterns:

```bash
# Run evals on Auth components only
pnpm eval:codex -- --pattern "src/components/Auth*"

# Compare both providers on same pattern
pnpm eval:codex && pnpm eval:antigravity
```

### Capture Baseline Metrics

Before making architectural changes (auth refactor, component restructure), establish a baseline:

1. Run evals on current state: `pnpm eval:codex && pnpm eval:antigravity`
2. Save results to `.agents/evals/baselines/[date].json`
3. Make your changes
4. Re-run evals and compare against baseline

### Detect Regressions

After changes, flag unexpected performance drops:

- **Correctness regression**: Eval passes drop vs. baseline
- **Token efficiency regression**: Same task uses more tokens
- **Guard compliance regression**: Dependency-cruiser or RSC boundary violations introduced

## Related Docs

- `.agents/evals/` — Eval test cases and runner
- `.agents/evals/lib.test.mjs` — Eval harness tests
- `check:floor` script in `package.json` — Quality floor validation

## Next Steps

- **Set up automated eval runs** in CI using GitHub Actions workflow
- **Create baseline snapshots** before major refactors
- **Compare tool performance** on architecture-heavy tasks (dependency updates, guard enforcement)
