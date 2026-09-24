# Constraints

Last reviewed: 2026-09-23

This file is the non-regression quality contract. Checks may be tightened, but must
not be weakened merely to make a change pass.

## Floor (always enforced)

- No new checker suppressions such as `@ts-ignore`, `eslint-disable`, or
  `biome-ignore` merely to silence a finding.
- No unimplemented stubs, empty catches, or TODO placeholders in production source.
- No skipped/deleted tests or removed assertions merely to obtain a pass.
- No secrets in source.
- No new exception without a documented owner, reason, and expiry.

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
| --- | --- | --- | --- |
| Types | Zero type errors | `pnpm run check:types` | task end |
| Lint | Zero configured Biome errors | `pnpm run check:lint` | task end |
| Architecture | Zero dependency-cruiser violations | `pnpm run deps:check` | task end |
| Duplication | At most 10% by configured jscpd threshold | `pnpm run check:duplication` | task end |
| Dependency audit | No high/critical package-manager advisories | `pnpm run check:security` | dependency/security review |
| OSV dependencies | Zero unignored OSV findings | `pnpm run check:osv` | dependency/security review |
| Accessibility | Lighthouse accessibility score at least 0.90 | `pnpm run lighthouse` | relevant UI changes |
| Diff floor | Zero floor-guard findings | `pnpm run check:floor` | every task end |

## Measured, not yet enforced

| Metric | Current state | Direction | Measured by |
| --- | --- | --- | --- |
| Test coverage | Coverage reporting exists; no repository threshold is configured | establish a baseline, then prevent regression | `pnpm run test:coverage` |
| Browser performance | Lighthouse performance is warning-only at 0.90 | measure before adopting a blocking target | `pnpm run lighthouse` |
| Browser best practices | Lighthouse best-practices is warning-only at 0.90 | preserve or improve before enforcing | `pnpm run lighthouse` |
| SEO | Lighthouse SEO is warning-only at 0.90 | informational until product surfaces exist | `pnpm run lighthouse` |

## Exceptions

None.
