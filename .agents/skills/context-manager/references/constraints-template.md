# CONSTRAINTS.md Template

Use this template to record the repository's quality contract. Replace every example with facts from the repository. If a dimension is not yet measurable, put it in the measured table with today's baseline instead of inventing a passing threshold.

```markdown
# Constraints

Last reviewed: YYYY-MM-DD by @owner

This file is the project quality contract. Checks may be tightened, but must
not be weakened to make a change pass.

## Floor (always enforced)

- No new checker suppressions such as `@ts-ignore`, `eslint-disable`, or the project's equivalent.
- No unimplemented stubs, empty catches, or TODO placeholders in source code.
- No skipped or deleted tests without a documented reason.
- No secrets in source.
- No new exceptions without an owner and expiry date.

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
|-----------|------|------------|---------|
| Types | State the measurable threshold | `pnpm run check:types` | task end |
| Lint | State the measurable threshold | `pnpm run lint` | task end |

Every row must name a command that exists in `package.json` or an explicitly
documented external tool, and must state when it runs. A number without a
command is an aspiration, not an enforced constraint.

## Measured, not yet enforced

| Metric | Today | Direction |
|--------|-------|-----------|
| Example baseline | measure it | must not fall |

## Exceptions

None.

<!-- If exceptions exist, each row needs an ID, rule, path, reason, owner, and expiry date. -->
```

## Creation rules

- Read `package.json`, compiler/linter configs, CI workflows, and existing check scripts before filling the tables.
- Keep the floor concrete and repository-appropriate; do not copy tools the repository does not use.
- Prefer a ratchet from today's measured value when an aspirational threshold would fail immediately.
- Give every exception an owner, reason, and expiry date. An exception records a temporary gap; it does not remove the floor.
