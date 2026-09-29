---
name: eval-harness
description: Run, compare, and inspect deterministic multi-agent evaluation reports for Codex and Antigravity.
metadata:
  category: AI Tooling
  triggers: ["eval", "multi-agent", "regression detection"]
---

## Overview

Use this skill for behavioral regression evaluation of coding agents. The executable source of truth is `.agents/evals/`; normal product tests remain separate.

## Run evaluations

```bash
rtk pnpm eval:codex
rtk pnpm eval:antigravity
```

Target one configured scenario instead of inventing file-pattern flags:

```bash
rtk pnpm eval:codex -- --scenario repository-safety --trials 1
rtk pnpm eval:antigravity -- --scenario quality-gates --trials 1
```

Valid scenario IDs are defined in `.agents/evals/scenarios.json`.

## Compare reports

Reports are written to the gitignored `artifacts` directory beneath `.agents/evals/`. Compare two concrete reports with:

```bash
rtk pnpm eval:compare -- --baseline <baseline.json> --candidate <candidate.json>
```

Same-provider comparisons fail when correctness consistency regresses. Cross-provider comparisons are informational so the harness does not rank one agent as a regression against another. Token usage is reported as a measured signal, not a blocking floor.

## Verification

```bash
rtk pnpm run test:harness
```

The deterministic evaluator tests must pass before changing scenarios, grading behavior, or comparison rules.

## Related files

- `.agents/evals/run.mjs` — provider runner and report writer.
- `.agents/evals/compare.mjs` — deterministic report comparison.
- `.agents/evals/lib.mjs` — grading, snapshots, metrics, and comparison logic.
- `.agents/evals/scenarios.json` — regression scenarios.
