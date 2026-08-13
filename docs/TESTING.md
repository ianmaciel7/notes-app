# Testing

## Current State

Vitest is configured for unit tests. Coverage is generated as a quality signal for pull requests and local verification, but the repository does not enforce an arbitrary global percentage gate yet.

End-to-end testing is not configured yet. Add E2E only when the app has behavior that justifies browser-level coverage, such as authentication, persistent note creation or editing, important navigation, deployment smoke checks, or another critical user flow.

## Local Verification

| Task | Command |
| --- | --- |
| Verify repo | `pnpm verify` |
| Check formatting | `pnpm format:check` |
| Check repo | `pnpm lint` |
| Generate Next.js types | `pnpm typegen` |
| Typecheck | `pnpm typecheck` |
| Run tests once | `pnpm test` |
| Run tests with coverage | `pnpm test:coverage` |
| Check Graphify artifacts | `pnpm graphify:check` |
| Update Graphify artifacts | `pnpm graphify:update` |
| Build | `pnpm build` |

Use `pnpm verify` before opening or updating a pull request unless the task has a narrower, explicitly justified verification path.

## Verification Loop

Software verification checks whether the application and repository tooling work. OpenSpec verification checks whether the implemented change satisfies the agreed requirements and acceptance criteria. Use both for meaningful OpenSpec-driven changes.

When a verification command fails:

1. Identify the failing command and the first meaningful error.
2. Classify the likely root cause before changing code.
3. Make a targeted fix or update the relevant OpenSpec artifact if implementation evidence changed the requirement.
4. Rerun the narrowest useful check first.
5. Run broader verification, usually `pnpm verify`, once the focused failure is resolved.

Do not skip, weaken, or delete a legitimate failing test only to make the suite pass.

## CI

Pull request CI in `.github/workflows/ci.yml` runs on pull requests targeting `main` or `stag`, and also validates pushes to those protected branches.

Each CI job installs dependencies with:

```powershell
pnpm install --frozen-lockfile
```

The workflow exposes separate job names for:

- `Format`
- `Lint`
- `Typecheck`
- `Tests`
- `Build`
- `Graphify`
- `Quality`

`Quality` is an aggregate check used as a stable branch-protection context. Individual job names remain visible so contributors can identify the failing category quickly.

The separate `Security` workflow runs CodeQL as a high-signal merge signal. It is intentionally not required by the versioned rulesets until CodeQL/code scanning availability is confirmed for the repository.

Keep local verification and CI aligned unless there is a documented reason to diverge. `pnpm verify` remains the canonical local completion command and runs formatting, linting, Next.js type generation, TypeScript checking, tests with coverage, Graphify artifact validation, and production build.

## Coverage

Coverage is generated with Vitest's V8 provider and uploaded by CI as a short-retention artifact. It is a regression and review signal, not the definition of quality.

Current policy:

- No 100% coverage mandate.
- No global threshold until the project has enough stable behavior to establish a real baseline.
- Future thresholds should focus on new business logic, validation, auth, authorization, data transformations, destructive operations, and critical state transitions.

## Definition Of Done

Completion requires task-appropriate verification evidence.

Examples of appropriate evidence include:

- `pnpm verify` output for ordinary code changes.
- Test results for behavior changes.
- Build output for app or configuration changes.
- Screenshots or browser checks for meaningful visual changes.
- OpenSpec acceptance criteria for spec-driven changes.
- Security review for auth, secrets, dependencies, deployment, or external integrations.
