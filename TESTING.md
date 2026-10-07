# Testing

This document describes both the tests that exist today and the testing
expectations for future features.

## Current automated coverage

### Vitest

Current source smoke coverage:

- `tests/unit/smoke.test.ts`
- `tests/unit/firebase-reference.test.ts` (guards `src/components/firebase/`
  against any change; see ADR 0004)

Vitest runs in Happy DOM and scans `src/**/*.{test,spec}.{ts,tsx}` and `tests/**/*.{test,spec}.{ts,tsx}` (excluding `tests/e2e/**`).
`src/components/ui/**` is excluded from project unit tests because that
directory is the owned shadcn implementation layer.

Run:

```bash
pnpm test
```

Coverage:

```bash
pnpm run test:coverage
```

### Playwright

Current E2E smoke coverage:

- `tests/e2e/home.spec.ts`

The configured project is Chromium. CI installs Chromium and runs the E2E suite
after a successful production build and Size Limit check.

Run:

```bash
pnpm run test:e2e
```

### Mutation testing

Stryker is installed and available through:

```bash
pnpm run test:mutation
```

Mutation testing is not currently part of the default CI gates.

## Required testing strategy for new features

- Pure domain logic: Vitest.
- React behavior and integration seams: Vitest + Testing Library when useful.
- Route/navigation/browser behavior: Playwright.
- Accessibility behavior that requires a browser: Playwright + axe.
- Security-sensitive Server Actions and Route Handlers: focused server tests
  plus E2E where the browser boundary matters.
- Regressions: add a test that fails before the fix and passes after it.

## Accessibility

`@axe-core/playwright` is installed, but the current smoke test does not yet
run an axe audit. New user-facing feature flows should add accessibility checks
where they provide meaningful signal.

Do not claim WCAG conformance based only on installed tooling.

## Verification commands

| Purpose | Command |
| --- | --- |
| Unit tests | `pnpm test` |
| Changed tests | `pnpm run test:changed` |
| Coverage | `pnpm run test:coverage` |
| E2E | `pnpm run test:e2e` |
| Mutation | `pnpm run test:mutation` |
| Fast local gate | `pnpm run verify:fast` |
| Production build | `pnpm run build` |
| Bundle budgets | `pnpm run check:size` |

## Git hooks and CI split

Local Git hooks stay light so they do not overload developer machines:

| Hook | Runs |
| --- | --- |
| `pre-commit` | `lint-staged` (Biome on staged files) and gitleaks |
| `commit-msg` | commitlint |
| `pre-push` | `pnpm run verify:changed` |

`pnpm run verify:fast` is not run by a Git hook. Run it manually before
delivery. CI (`.github/workflows/ci.yml`) is the authoritative gate and runs
the full unit suite, dependency rules, spelling, Knip, jscpd, Fallow, audit,
secret scan, build, Size Limit, and E2E on every push and pull request to
`dev` and `main`.

## Test design

- Test observable behavior, not internal implementation details.
- Avoid mocking framework internals when a real seam can be exercised.
- Keep browser tests deterministic and focused on user-visible outcomes.
- Treat the framework build as part of verification for App Router changes.
