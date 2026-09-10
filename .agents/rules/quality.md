---
trigger: always_on
description: Follow the repository quality policy and report verified results.
---

# Quality Gate

Use `AGENTS.md` and `docs/ai-development-flow.md` to select the workflow.
`docs/code-quality.md` documents supported checks and automation;
`docs/code-quality-metrics.md` documents the local-only Biome metrics flow.

Run focused regression tests for behavior changes, the selected workflow's lint
and metrics checks, and relevant type, build, or browser checks. Report each
actual result and any environment or integration limitation before completion.
Do not invent results, weaken gates, lower thresholds, add suppressions, expand
exclusions, or treat unsupported metrics as measured.
