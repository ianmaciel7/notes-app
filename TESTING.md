# Testing Strategy & Guidelines

This file owns **how behavior is verified**. Blocking thresholds belong to
`CONSTRAINTS.md`; security scanning policy belongs to `SECURITY.md`.

## 1. Verification Model

The repository follows a dual-track testing strategy with a clear division of testing responsibilities:

- **Unit Tests & Scoped Coverage (Vitest >=80%)**: Enforced on business logic, data transformers, custom hooks, and state management (`src/lib/**/*.ts`, `src/hooks/**/*.ts`).
- **Component Workbench & Visual Verification (Ladle)**: Declarative UI primitives under `src/components/ui/` are developed, previewed, and tested for accessibility and themes via isolated Ladle stories (`*.stories.tsx`).
- **Quality Floors & Automated Guards**: Enforced via `scripts/floor-guard.mjs` and `scripts/hooks.test.mjs` (merge-base non-regression, path protection, and Biome auto-formatting hooks).
- **Audits & Mutation Verification**: Lighthouse CI for production-browser accessibility/performance auditing; StrykerJS mutation testing for focused production logic.

Integration and end-to-end product suites are not configured yet. Agent behavioral evaluations are configured separately under `.agents/evals/`.

## 2. Toolchain

- **Vitest**: unit test runner and scoped V8 coverage reporter.
- **Ladle**: component story workbench.
- **StrykerJS**: mutation testing.
- **Lighthouse CI**: production-browser audit.
- **Automated Guards**: custom floor guard and hook regression test suite (`scripts/floor-guard.mjs`, `scripts/hooks.test.mjs`).
- **E2E runner**: none configured for product flows.
- **Harness eval runner**: provider-neutral Node runner with Codex and Antigravity adapters.

Exact versions are owned by `package.json`.

## 3. Commands

```bash
rtk pnpm test
rtk pnpm test:watch
rtk pnpm test:coverage
rtk pnpm test:mutation
rtk pnpm ladle
rtk pnpm ladle:build
rtk pnpm lighthouse
rtk pnpm test:harness
rtk pnpm test:guards
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
- Component stories are colocated under `src/components/ui/` as `*.stories.tsx`.
- The current unit-test foundation includes `src/lib/utils.test.ts`.
- Declarative UI primitives under `src/components/ui/` should add or update a Ladle story when visual or interaction behavior needs verification.

## 5. Test Design

- Test observable behavior rather than implementation details.
- Keep unit tests deterministic and isolated.
- Add integration tests when multiple application boundaries must be verified
  together rather than forcing that behavior into unit mocks.
- Add E2E coverage only when real critical user flows exist.
- Avoid over-mocking; there is currently no product network/database layer to mock.

## 6. Automation Status

`.github/workflows/quality.yml` runs the deterministic repository gate (`pnpm check:ci`) on pull requests and the main development branches. It includes types, lint, architecture, the diff floor, unit tests, duplication, agent-config drift, control-doc verifiers, evaluator unit tests, floor-guard unit tests, coverage, and a production build.

Ladle visual review, Lighthouse, mutation testing, and live model behavioral trials remain risk/cadence-based rather than every-PR gates. Agent-behavior evaluations live under `.agents/evals/`; they use multiple independent trials and score traces plus workspace outcomes rather than final prose alone.
