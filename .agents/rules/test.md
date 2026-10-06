# Rule: Testing Standards & Verification Discipline

## Description
Enforce automated testing discipline, test design quality, and verification hierarchy across the repository in accordance with [TESTING.md](../../TESTING.md).

## Mandatory Guidelines

1. **Test Layering & Technology Matrix**:
   - **Pure Domain Logic & Utility Functions**: Test using Vitest (`pnpm test` / `src/**/*.{test,spec}.ts`).
   - **React Components & Integration Seams**: Test using Vitest + `@testing-library/react` in Happy DOM.
   - **Application Routes, End-to-End & Browser Flows**: Test using Playwright in Chromium (`tests/e2e/**/*.spec.ts`).
   - **Accessibility Audits**: Use Playwright + `@axe-core/playwright` on representative client flows. Never claim WCAG compliance without automated or manual audits.
   - **Security Boundaries**: Test Server Actions and Route Handlers with isolated server tests and targeted E2E request assertions.

2. **Test Design & Integrity**:
   - **Test Observable Behavior**: Assert on public API outputs, DOM semantics, and user interactions, not private state or transient implementation details.
   - **Avoid Over-Mocking**: Never mock Next.js or React runtime internals when a real integration seam can be exercised.
   - **Exclusion of Owned Registry Layer**: Do not write unit tests targeting `src/components/ui/**`. That directory is the owned shadcn/Base UI implementation layer.
   - **Determinism**: Keep tests strictly deterministic; eliminate timing race conditions, arbitrary delays, and test-order dependencies.

3. **Regression & Bugfix Discipline (TDD)**:
   - For any reported bug or regression, implement a reproducible failing test before applying the fix.
   - Verify that the test passes once the fix is implemented and remains part of the regression test suite.

4. **Verification Progression**:
   - **Fast Iteration**: Run `pnpm run verify:changed` or `pnpm run test:changed` while developing.
   - **Pre-Completion / Gate**: Run `pnpm run verify:fast` before concluding tasks to validate lint, types, unit tests, dependency constraints, and spelling.
   - **No Fictitious Coverage**: Never describe planned tests or unverified coverage as already implemented.
