# CONSTRAINTS.md Template

Use this template for the repository's measurable non-regression quality contract.
Every enforced threshold needs a real checker. Aspirational metrics belong in the
measured table until the repository can actually enforce them.

```markdown
# Constraints

Last reviewed: YYYY-MM-DD

This file is the non-regression quality contract. Checks may be tightened, but must
not be weakened merely to make a change pass.

## Floor (always enforced)

- No new checker suppressions merely to silence findings.
- No unfinished production stubs/placeholders.
- No weakened/deleted tests merely to obtain a pass.
- No secrets in source.
- No exception without owner, reason, and expiry.

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
| --- | --- | --- | --- |
| Types | [real threshold] | `pnpm run check:types` | task end |

## Measured, not yet enforced

| Metric | Current state | Direction | Measured by |
| --- | --- | --- | --- |
| [metric] | [measured baseline/status] | [desired trend] | [real command/tool] |

## Exceptions

None.
```

## Governance Rules

1. Inspect package scripts, configs, workflows, and current measurements first.
2. Do not invent a threshold because it sounds standard.
3. A warning is not an enforced floor.
4. Keep transient scan findings out of the contract; record the policy/threshold.
5. Exceptions are temporary and require owner, reason, and expiry.
