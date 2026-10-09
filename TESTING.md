# Testing

This document describes both the tests that exist today and the testing
expectations for future features.

## Current automated coverage

### Vitest

Examples of current coverage (not an exhaustive file inventory):

- `tests/unit/smoke.test.ts` for the test runner.
- `tests/unit/firebase-reference.test.ts` for the immutable Firebase UI
  baseline (ADR 0004).
- `tests/unit/i18n-client.test.ts`, `i18n-config.test.ts`, and
  `locale-lang-script.test.ts` for locale negotiation and synchronization in
  `src/lib/i18n/locale-lang-script.ts`.
- `tests/unit/components-layer-structure.test.ts` for the application
  components-layer file-placement guard.
- `tests/unit/component-file-name-guard.test.ts`, backed by
  `component-file-name-guard-lib.ts`, for the guard that matches exported
  PascalCase component names to their kebab-case `.tsx` file names under `src/`.
- `tests/unit/component-primitive-name-guard.test.ts`, backed by
  `component-primitive-name-guard-lib.ts`, for the guard that requires
  application component names to include an imported shadcn root primitive.
- `tests/unit/sign-out-button.test.tsx` for server-session-first sign-out,
  including rejected and unreachable session endpoints.
- `tests/unit/auth-error.test.ts` and `tests/unit/second-factor-panel.test.tsx`
  for the second-factor settings: failure classification, factor listing and
  removal, the verified-e-mail gate, recent-login handling, and session renewal
  or sign-out after a factor change (ADR 0005).
- `tests/unit/locale-preference-actions.test.ts` for authenticated profile
  preference writes, sign-in synchronization, and guest locale handling.
- Server-session Route Handler tests and other authentication tests under
  `tests/unit/` (see ADR 0005).

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

Current authentication E2E coverage:

- `tests/e2e/home.spec.ts`, including password and email-link sign-in,
  phone/SMS, Google Emulator popup (and redirect for embedded Electron browsers), SMS MFA (enrollment, reload
  persistence, assertion, removal), the unverified-e-mail gate on `/settings`,
  server-protected pages, and accessibility audits (see ADR 0005).
- `tests/e2e/locale.spec.ts`, covering the language selector, explicit cookie
  persistence, and a Firestore preference restored in a separate browser
  after re-authentication (ADR 0007).

The configured project is Chromium. The E2E command starts both Auth and
Firestore emulators and requires Java to run the Firestore emulator. CI
installs Chromium and runs the E2E suite after a successful production build
and Size Limit check.

Run:

```bash
pnpm run test:e2e
```

### Firestore security rules

`firestore.rules` is tested against the Firestore Emulator with
`@firebase/rules-unit-testing` (`tests/rules/`, excluded from `pnpm test`).
CI runs it in the extended verification job.

```bash
pnpm run test:rules
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

`tests/e2e/home.spec.ts` runs axe audits on the password-authentication and
protected-route journeys. New user-facing feature flows should add accessibility
checks where they provide meaningful signal.

Do not claim WCAG conformance based only on installed tooling.

## Verification commands

| Purpose | Command |
| --- | --- |
| Unit tests | `pnpm test` |
| Changed tests | `pnpm run test:changed` |
| Coverage | `pnpm run test:coverage` |
| E2E | `pnpm run test:e2e` |
| Firestore rules | `pnpm run test:rules` |
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
