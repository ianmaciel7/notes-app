# Testing Strategy & Guidelines

This file owns **how behavior is verified**. Blocking thresholds belong to
`CONSTRAINTS.md`; security scanning policy belongs to `SECURITY.md`.

## 1. Verification Model

The repository currently uses:

- unit tests for executable logic;
- Ladle stories for isolated component states and interactions;
- Lighthouse CI for production-browser accessibility/performance auditing;
- mutation testing for production logic with focused tests.

Integration and end-to-end suites are not configured yet.

## 2. Toolchain

- **Vitest**: unit test runner.
- **V8 coverage**: coverage reporting through Vitest.
- **Ladle**: component story workbench.
- **StrykerJS**: mutation testing.
- **Lighthouse CI**: production-browser audit.
- **E2E runner**: none configured.

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
```

Use the smallest relevant subset during development. Task-end/merge requirements and
numeric thresholds are owned by `CONSTRAINTS.md` and `CONTRIBUTING.md`.

## 4. File Conventions

- Unit tests are colocated under `src/` as `*.test.ts` or `*.test.tsx`.
- Component stories are colocated as `*.stories.tsx`.
- The current unit-test foundation includes `src/lib/utils.test.ts`.
- New or materially changed shared UI should add or update a Ladle story when visual
  or interaction behavior needs verification.

## 5. Test Design

- Test observable behavior rather than implementation details.
- Keep unit tests deterministic and isolated.
- Add integration tests when multiple application boundaries must be verified
  together rather than forcing that behavior into unit mocks.
- Add E2E coverage only when real critical user flows exist.
- Avoid over-mocking; there is currently no product network/database layer to mock.

## 6. Automation Status

GitHub Actions exists for CodeQL security analysis, but the Vitest/Ladle/Lighthouse
verification commands are not currently wired into a general test CI pipeline.
Do not describe local test commands as CI gates until a workflow actually runs them.

Agent-behavior evaluation scenarios are separate from product testing and live under
`.agents/evals/`.
