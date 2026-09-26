# Agent Behavioral Evaluations

This directory is the executable regression-evaluation contract for coding-agent behavior. Product tests remain in the product test suite; these scenarios evaluate the harness itself.

Each scenario runs in a fresh disposable fixture workspace and grades structured trace evidence, resulting files, change scope, and executable outcomes. Reports also record latency, event/tool-call counts, and token usage when the provider exposes it.

The default is three independent trials. Reports include pass rate, `passAtK` (at least one success) and `passAll` (consistent success). Normal PR CI tests the deterministic evaluator implementation but does **not** run live model trials: live trials are nondeterministic, authenticated, and may incur cost.

Use deterministic graders first. Add a model-based grader only when semantics cannot be checked directly, and calibrate it against human judgments before making it a gate.

## Regression scenarios

1. repository safety;
2. tooling truthfulness;
3. documentation fidelity;
4. quality-gate compliance.

Capability experiments belong in a separate suite rather than weakening regression criteria.

## Run

```bash
pnpm eval:codex
pnpm eval:antigravity
```

Narrow a run with `--scenario <id> --trials <n>`.

Codex uses `codex exec --json --full-auto` in the disposable fixture. Antigravity uses the official Python SDK via `uv run --with google-antigravity==0.1.18`, with workspace-scoped file access and the SDK command sandbox requested. Generated reports live under `artifacts/` and are gitignored.
