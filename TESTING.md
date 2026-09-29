# Testing Strategy & Guidelines

This file owns **how behavior is verified**. Blocking thresholds belong to
`CONSTRAINTS.md`; security scanning policy belongs to `SECURITY.md`.

## 1. Verification Model

The repository follows a multi-track testing strategy with a clear division of testing responsibilities:

- **Unit Tests & Scoped Coverage (Vitest >=80%)**: Enforced on business logic, data transformers, custom hooks, and state management (`src/lib/**/*.ts`, `src/hooks/**/*.ts`).
- **Component Workbench & Visual Verification (Ladle)**: Declarative UI primitives under `src/components/ui/` are developed, previewed, and tested for accessibility and themes via isolated Ladle stories (`*.stories.tsx`).
- **End-to-End Testing (Playwright)**: Full cross-browser user journeys, Next.js App Router navigation, and Firebase Auth local emulator interactions verified under `e2e/`.
- **Quality Floors & Automated Guards**: Enforced via `scripts/guards/floor-guard.mjs` and `scripts/hooks/hooks.test.mjs` (merge-base non-regression, path protection, and Biome auto-formatting hooks).
- **Audits & Mutation Verification**: Lighthouse CI for production-browser accessibility/performance auditing; StrykerJS mutation testing for focused production logic.

Agent behavioral evaluations are configured separately under `.agents/evals/`.

## 2. Toolchain

- **Vitest**: unit test runner and scoped V8 coverage reporter.
- **Ladle**: component story workbench.
- **Playwright**: cross-browser end-to-end (E2E) testing framework with Next.js webServer lifecycle management ([ADR 0012](./docs/adr/0012-adopt-playwright-for-e2e-testing.md)).
- **StrykerJS**: mutation testing.
- **Lighthouse CI**: production-browser audit.
- **Automated Guards**: custom floor, React Server Component boundary, component-prop, and hook regression guards (`scripts/guards/floor-guard.mjs`, `scripts/guards/guard-rsc-boundaries.mjs`, `scripts/guards/guard-component-props.mjs`, `scripts/hooks/hooks.test.mjs`).
- **Documentation verifier**: `scripts/verify/verify-docs.mjs` runs the control-doc verifiers plus repository-wide markdown checks (links and anchors, referenced paths and `pnpm` commands, path portability, English-only text, `AGENTS.md` size and skill routing, skill frontmatter, and the `docs/` tree rules for ADRs, execution plans, and product specs). Its logic is covered by `scripts/verify/verify-docs.test.mjs`.
- **Harness eval runner**: provider-neutral Node runner with Codex and Antigravity adapters.

Exact versions are owned by `package.json`.

## 3. Commands

```bash
rtk pnpm test
rtk pnpm test:watch
rtk pnpm test:coverage
rtk pnpm test:e2e
rtk pnpm test:mutation
rtk pnpm ladle
rtk pnpm ladle:build
rtk pnpm lighthouse
rtk pnpm test:harness
rtk pnpm test:guards
rtk pnpm verify:docs
rtk pnpm check:ci
```

Live model behavioral evals are separate from normal PR CI:

```bash
rtk pnpm eval:codex
rtk pnpm eval:antigravity
```

Use the smallest relevant subset during development. Task-end/merge requirements and
numeric thresholds are owned by `CONSTRAINTS.md` and `CONTRIBUTING.md`.

## 4. File Conventions

- Unit tests are colocated under `src/` as `*.test.ts` or `*.test.tsx`, with scoped coverage enforced on `src/lib/**/*.ts` and `src/hooks/**/*.ts`.
- End-to-end test specifications are located under `e2e/` as `*.spec.ts`.
- Component stories are colocated under `src/components/ui/` as `*.stories.tsx`.
- The current unit-test foundation includes `src/lib/utils.test.ts`, `src/hooks/use-auth.test.ts`, `src/hooks/use-require-auth.test.tsx`, `src/lib/firebase/auth-emulator.test.ts`, and `src/app/(auth)/login/page.test.tsx`.
- Declarative UI primitives under `src/components/ui/` should add or update a Ladle story when visual or interaction behavior needs verification.

## 5. Firebase Authentication Testing Strategy

The repository employs a multi-layered testing strategy for Firebase Authentication:

- **State Observer Lifecycle & Context Hooks**:
  - `AuthProvider` and `AuthContext` (`src/components/notes-app/auth-provider.test.tsx`) verify subscriber initialization, authentication state propagation, and child component rendering under authenticated and unauthenticated states.
  - `useAuth` hook (`src/hooks/use-auth.test.ts`) verifies context boundary enforcement (throwing errors when invoked outside `AuthProvider`).
  - `useRequireAuth` hook (`src/hooks/use-require-auth.test.tsx`) verifies route protection behavior, triggering navigation redirects for unauthenticated sessions while allowing access to authenticated users.

- **Local Emulator Integration**:
  - Integration suite (`src/lib/firebase/auth-emulator.test.ts`) exercises real Firebase Auth SDK methods against a running Firebase Auth emulator daemon on `127.0.0.1:9099`.
  - Verifies anonymous authentication (`signInAnonymously`), user account creation (`createUserWithEmailAndPassword`), credential authentication (`signInWithEmailAndPassword`), and session cleanup (`signOut`).
  - Includes a pre-check ping to gracefully skip execution when the emulator daemon is unreachable in isolated unit environments.

- **Component-Level Login Workflows**:
  - Login page component suite (`src/app/(auth)/login/page.test.tsx`) tests authentication interaction patterns and mode toggling (`signIn` vs `signUp`).
  - Verifies primary popup sign-in flows using `signInWithPopup`.
  - Verifies resilient fallback to `signInWithRedirect` when popup or iframe communication fails (e.g., `popup-blocked`, `No matching frame`, or `popup-closed-by-user`).
  - Verifies guest access via `signInAnonymously`.
  - Verifies post-redirect credential processing via `getRedirectResult` and post-login routing according to the `next` query parameter.

## 6. Test Design

- Test observable behavior rather than implementation details.
- Keep unit tests deterministic and isolated.
- Add integration tests when multiple application boundaries must be verified
  together rather than forcing that behavior into unit mocks.
- Add E2E coverage under `e2e/` with Playwright to verify full browser user flows and emulator interactions.
- Avoid over-mocking; there is currently no product network/database layer to mock.

## 7. Automation Status

`.github/workflows/quality.yml` runs the deterministic repository gate (`pnpm check:ci`) on pull requests and the main development branches. It includes types, lint, architecture, the diff floor, unit tests, duplication, agent-config drift, control-doc verifiers, evaluator unit tests, floor-guard unit tests, coverage, and a production build.

Ladle visual review, Lighthouse, mutation testing, and live model behavioral trials remain risk/cadence-based rather than every-PR gates. Agent-behavior evaluations live under `.agents/evals/`; they use multiple independent trials and score traces plus workspace outcomes rather than final prose alone.
