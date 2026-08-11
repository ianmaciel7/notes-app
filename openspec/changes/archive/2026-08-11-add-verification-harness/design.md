## Overview

The highest-value harness improvement is verification engineering. The existing context, docs, skills, agents, Git workflow, and CI are substantial enough that adding more instructions or tools would mostly increase noise. The selected design makes completion evidence objective with the smallest useful test setup and a single verification command.

## Decisions

- Use Vitest with React Testing Library because the current Next.js 16 docs describe that setup for synchronous App Router components.
- Keep tests component-level for now because the app has no auth, persistence, mutation flow, or critical navigation that warrants Playwright.
- Add `pnpm verify` as the shared local and CI command to avoid divergent verification paths.
- Keep the CI job named `Quality` because both branch rulesets require that check context.
- Add line-ending normalization because baseline `pnpm lint` currently fails on Windows due CRLF formatting drift.
- Document Definition of Done in `docs/TESTING.md` instead of creating a new harness document.

## Alternatives Deferred

- Playwright E2E: useful later, premature before durable user flows exist.
- Harness eval platform: useful later after repeatable comparable agent tasks exist.
- New MCPs or skills: not justified because the current gap is verification, not missing context.
- Hooks: deferred because CI and package scripts are simpler and cross-agent.
- Architecture linting: deferred because current architecture has too few boundaries to enforce mechanically.

## Verification Strategy

- `pnpm install --frozen-lockfile`
- `pnpm verify`
- `git diff --check`
- `openspec status --change add-verification-harness`
- `openspec` verification against the requirements in `specs/verification-harness/spec.md`
