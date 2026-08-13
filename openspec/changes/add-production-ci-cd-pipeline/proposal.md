## Why

The `stag` baseline has a minimal Next.js starter and OpenSpec configuration, but it lacks repository-level pull request CI/CD controls. The old branch contains a production CI/CD model with split checks, Dependabot, CodeQL, CODEOWNERS, and stable aggregate gates. This change ports the equivalent delivery controls that fit the current lean baseline without importing unrelated agent, Graphify, or product-surface history.

## What Changes

- Add pull request and protected-branch CI for `main` and `stag`.
- Split CI into readable jobs for formatting, linting, TypeScript checking, tests with coverage, Graphify freshness, production build validation, and a stable aggregate `Quality` check.
- Add GitHub-native CodeQL security scanning with a stable aggregate `Security` check.
- Add Dependabot configuration for npm/pnpm dependencies and GitHub Actions.
- Add CODEOWNERS coverage for CI/CD, dependency, package, deployment, documentation, and OpenSpec governance files.
- Add versioned branch ruleset source files for `main` and `stag`.
- Add CI/CD, security, testing, contribution, and deployment documentation.
- Add Firebase App Hosting run configuration files without adding deployment workflows.
- Configure `vitest.config.mts`, `vitest.setup.ts`, and `__tests__/page.test.tsx` so the Tests gate validates the current page with React Testing Library.
- Add local scripts for CI parity: `format:check`, `typecheck`, `test:coverage`, `graphify:check`, `graphify:update`, and `verify`.

## Capabilities

### New Capabilities

- `ci-cd-pipeline`: Defines pull request CI, security checks, supply-chain maintenance, protected-branch expectations, and deployment boundaries.

### Modified Capabilities

- `verification-harness`: Adds explicit local quality commands while preserving `pnpm verify` as the canonical local completion command.

## Non-Goals

- Import the old branch's broad agent tooling or product-roadmap changes.
- Add Playwright before critical browser workflows exist.
- Add deployment workflows before a real platform trigger and authentication model are chosen.
