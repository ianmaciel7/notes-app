# Testing

## Current State

The current branch does not configure a test runner.

There is no `__tests__/` directory, no Vitest dependency, no React Testing Library dependency, and no `pnpm test` script in `package.json`.

## Available Local Checks

| Task | Command |
| --- | --- |
| Check repo | `pnpm lint` |
| Format repo | `pnpm format` |
| Build | `pnpm build` |

The current `lint` script is:

```powershell
pnpm lint
```

which runs:

```text
biome check
```

## Missing Checks

The following commands are documented as future needs but are not currently available:

- `pnpm verify`
- `pnpm typecheck`
- `pnpm typegen`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm format:check`

Add package scripts and dependencies before treating those commands as required verification.

## Verification Loop

Software verification checks whether the application and repository tooling work. OpenSpec verification checks whether an implemented change satisfies agreed requirements and acceptance criteria.

When a verification command fails:

1. Identify the failing command and first meaningful error.
2. Classify the likely root cause before changing code.
3. Make a targeted fix.
4. Rerun the narrowest useful check first.
5. Run broader verification only when the required scripts exist.

## CI

No `.github/workflows/` directory exists in the current branch, so CI is not configured here yet.

## Future Test Strategy

When behavior grows beyond the starter page:

- Add deterministic unit or component tests for logic and accessible rendering.
- Add browser or E2E tests only for critical flows that need real routing, persistence, authentication, or deployment behavior.
- Add regression tests when a bug reveals an important durable requirement.
- Update or create OpenSpec when a meaningful behavior, contract, acceptance criterion, or architectural expectation changes.
