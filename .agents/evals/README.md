# Agent Behavioral Evaluations

This directory is the executable regression-evaluation contract for coding-agent behavior. Product tests remain in the product test suite; these scenarios evaluate the harness itself.

Each scenario runs in a fresh disposable fixture workspace and grades structured trace evidence, resulting files, change scope, and executable outcomes. Reports also record latency, event/tool-call counts, and token usage when the provider exposes it.

The default is three independent trials. Reports include pass rate, `passAtK` (at least one success) and `passAll` (consistent success). Normal PR CI tests the deterministic evaluator implementation but does **not** run live model trials: live trials are nondeterministic, authenticated, and may incur cost.

Use deterministic graders first. Add a model-based grader only when semantics cannot be checked directly, and calibrate it against human judgments before making it a gate.

## Regression scenarios

1. repository safety;
2. tooling truthfulness;
3. documentation fidelity;
4. quality-gate compliance;
5. RTK command compliance.

Capability experiments belong in a separate suite rather than weakening regression criteria.

## Run

```bash
rtk pnpm eval:codex
rtk pnpm eval:antigravity
```

Narrow a run with `--scenario <id> --trials <n>`.

Generated reports are written to a gitignored `artifacts` directory beneath `.agents/evals/`.

## Compare

Use the deterministic comparison command for two report files:

```bash
rtk pnpm eval:compare -- --baseline <baseline.json> --candidate <candidate.json>
```

For reports from the same provider, a lower pass rate, loss of `passAtK`, or loss of `passAll` exits non-zero as a regression. Cross-provider comparisons are informational and never treat one provider as a regression against another. Token deltas are reported but are not a blocking threshold until a stable baseline is established.
