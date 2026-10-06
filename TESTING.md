# Testing Strategy & Guidelines

This document outlines the testing architecture, suites, and invariants for the Notes App.

---

## 1. Testing Philosophy & Test Pyramid

Our testing strategy optimizes for high velocity, high confidence, and deterministic execution:

```
                  ┌────────────────────────┐
                  │    E2E & A11y (10%)    │  ← Playwright + Axe
                  ├────────────────────────┤
                  │ Integration & Seams    │  ← Vitest + Testing Library + Happy DOM
                  │         (30%)          │
                  ├────────────────────────┤
                  │ Unit & Pure Domain     │  ← Vitest (Fast sub-millisecond feedback)
                  │         (60%)          │
                  └────────────────────────┘
```

1. **Unit & Domain Tests**: Focus on pure business logic, domain models, markdown parsers, validation schemas, and utilities in `src/lib/`.
2. **Integration Tests via Architectural Seams**: Exercise components and workflows through defined seams (e.g., repository interfaces) using fast in-memory adapters (`InMemoryNoteAdapter`) rather than brittle external mocks.
3. **End-to-End (E2E) & Accessibility Tests**: Verify complete user journeys in real browser viewports, validating keyboard navigation and accessibility standards (WCAG 2.1 AA via `@axe-core/playwright`).
4. **Mutation Testing**: Evaluate test suite effectiveness using Stryker Mutator to guarantee tests actively catch defects.

---

## 2. Test Execution Commands

| Task | Command | Description |
| ---- | ------- | ----------- |
| **Unit & Integration** | `pnpm test` | Runs the full Vitest suite in single-run mode. |
| **Coverage Report** | `pnpm run test:coverage` | Generates code coverage report via `@vitest/coverage-v8`. |
| **E2E Tests** | `pnpm run test:e2e` | Runs Playwright tests across configured browser environments. |
| **Mutation Testing** | `pnpm run test:mutation` | Executes Stryker mutation testing against domain suites. |
| **Fast Verification** | `pnpm run verify:fast` | Runs linter, typecheck, tests, dependency cruiser, and spellcheck. |

---

## 3. Test-Driven Development (TDD) Workflow

When building new features or resolving bugs, engineers and agents follow the red-green-refactor cycle aligned with the `/tdd` skill:

1. **Red**: Write a focused, failing test that defines the desired behavior or reproduces a bug.
2. **Green**: Write the minimal production code necessary to make the test pass cleanly.
3. **Refactor**: Clean up the implementation, improve abstractions, and ensure full compliance with `CODING_STANDARDS.md` while keeping tests green.

---

## 4. Seam Testing & Avoiding Over-Mocking

To prevent fragile tests that break during internal refactorings:

- **Test Through Interfaces**: Exercise modules through public API boundaries, as codified in `ARCHITECTURE.md`.
- **Use Real or In-Memory Adapters**: Prefer `InMemoryNoteAdapter` over mocking individual storage function calls.
- **Do Not Test Implementation Details**: Avoid checking internal state variables or private helper calls. Assert on observable outputs, rendered DOM nodes, and returned results.

---

## 5. Accessibility Testing Invariants

- All E2E flows tested with Playwright must run automated accessibility audits using `@axe-core/playwright`.
- Standard components must meet WCAG 2.1 AA contrast and screen-reader navigable hierarchy requirements.
