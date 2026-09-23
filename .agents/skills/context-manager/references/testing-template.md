# TESTING.md Template

## Document Purpose
`TESTING.md` specifies the testing pyramid, test execution commands, mocking strategies, component visual testing, and quality gates for the repository.

---

## Canonical Structure

```markdown
# Testing Strategy & Guidelines

## 1. Testing Pyramid & Philosophy
- **Unit Tests**: Pure functions, calculations, utility logic, domain models. Fast, isolated, deterministic.
- **Component / Visual Stories**: Component UI state permutations rendered in Ladle / Storybook.
- **Integration Tests**: Feature workflows, API routes, Server Actions, form submissions.
- **End-to-End (E2E) Tests**: Critical user flows through browser automation.

## 2. Test Frameworks & Toolchain
- Test runner (e.g., Vitest, Jest, Playwright).
- Component story workbench (e.g., Ladle: `pnpm ladle`).
- Coverage tool (e.g., v8 / c8).

## 3. Test Commands
```bash
pnpm test          # Run automated unit/integration test suite
pnpm test:watch    # Watch mode for TDD
pnpm test:coverage # Generate coverage report
pnpm ladle         # Launch visual component stories
pnpm test:e2e      # Execute end-to-end browser tests
```

## 4. Test File Conventions & Locations
- Unit tests: Colocated `*.test.ts` / `*.spec.ts` or inside `__tests__/`.
- Story files: Colocated `*.stories.tsx` next to components.
- E2E tests: Dedicated `e2e/` or `tests/` directory.

## 5. Mocking & Fixtures
- Rules for network mocking (e.g. MSW / Mock Service Worker).
- Database or state fixtures.
- Anti-pattern: Over-mocking internal implementation details. Test behaviors, not implementation.

## 6. CI Quality Gates & Coverage Requirements
- Mandatory checks before merge (lint, typecheck, tests pass).
- Target coverage thresholds (if enforced).
```
