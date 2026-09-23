# Constraints

Last reviewed: 2026-09-23

This file is the project quality contract. Checks may be tightened, but must
not be weakened to make a change pass.

## Floor (always enforced)

- No new checker suppressions such as `@ts-ignore`, `eslint-disable`, or `biome-ignore`.
- No unimplemented stubs, empty catches, or TODO placeholders in source code.
- No skipped or deleted tests without a documented reason.
- No secrets in source.
- No new exceptions without an owner and expiry date.

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
|-----------|------|------------|---------|
| Types | Zero type errors | `pnpm run check:types` | task end |
| Lint | Zero Biome errors in changed constraint/tooling files | `pnpm run check:lint` | task end |
| Architecture | Zero dependency violations | `pnpm run deps:check` | task end |
| Dependency security | No high or critical advisories | `pnpm run check:security` | task end / CI |
| Diff floor | Zero weakened-quality findings | `pnpm run check:floor` | every task end |

## Measured, not yet enforced

| Metric | Today | Direction |
|--------|-------|-----------|
| Test coverage | No test runner configured | establish a baseline when tests are added; must not fall |
| Accessibility | No automated browser audit configured | add axe against a preview URL before enforcement |
| Performance | No Lighthouse baseline | measure LCP and CLS before enforcement |

## Exceptions

None.
