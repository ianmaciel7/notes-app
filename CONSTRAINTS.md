# Constraints

Last reviewed: 2026-09-23

This file is the non-regression quality contract. Checks may be tightened, but must
not be weakened merely to make a change pass.

## Floor (always enforced)

- No new checker suppressions such as `@ts-ignore`, `eslint-disable`, or
  `biome-ignore` merely to silence a finding.
- No unimplemented stubs, empty catches, or TODO placeholders in production source.
- No skipped or deleted tests, and no removed assertions, merely to obtain a pass.
- No secrets in source.
- No new exception without a documented owner, reason, and expiry.

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
| --- | --- | --- | --- |
| Types | Zero type errors | `pnpm run check:types` | task end |
| Lint | Zero Biome errors in the targets covered by `check:lint` | `pnpm run check:lint` | task end |
| Architecture | Zero dependency-cruiser violations | `pnpm run deps:check` | task end |
| Duplication | At most 10% by configured jscpd threshold | `pnpm run check:duplication` | task end |
| Dependency audit | No high/critical package-manager advisories | `pnpm run check:security` | dependency/security review |
| Dependency vulnerability regression | No newly introduced known vulnerability | OSV-Scanner differential workflow | PR |
| Accessibility | Lighthouse accessibility score at least 0.90 | `pnpm run lighthouse` | relevant UI changes |
| Diff floor | Zero floor-guard findings | `pnpm run check:floor` | every task end |
| Coverage | ≥ 80% lines, functions, branches, and statements | `pnpm run test:coverage` | CI |
| Control-doc drift | Zero verifier failures | `pnpm run check:docs` | CI |
| Harness evaluator | Deterministic evaluator tests pass | `pnpm run test:harness` | CI |
| Guard implementation | Deterministic floor-guard tests pass | `pnpm run test:guards` | CI |

## Measured, not yet enforced

| Metric | Current state | Direction | Measured by |
| --- | --- | --- | --- |
| Existing OSV baseline | Full scan reports existing known vulnerabilities without blocking | reduce the baseline and document explicit exceptions | `pnpm run check:osv` |
| Browser performance | Lighthouse performance is warning-only at 0.90 | measure before adopting a blocking target | `pnpm run lighthouse` |
| Browser best practices | Lighthouse best-practices is warning-only at 0.90 | preserve or improve before enforcing | `pnpm run lighthouse` |
| SEO | Lighthouse SEO is warning-only at 0.90 | informational until product surfaces exist | `pnpm run lighthouse` |

Behavioral agent success rates are measured by live eval runs but are not yet a blocking PR threshold. Establish a provider/model baseline before adopting a numeric regression floor.

## Exceptions

None.
