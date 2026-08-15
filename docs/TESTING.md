# Testing

## Current State

Vitest is configured for unit tests. Coverage is generated as a quality gate for pull requests and local verification, with conservative global minimums that should ratchet upward as stable behavior grows.

End-to-end testing is not configured yet. Add E2E only when the app has behavior that justifies browser-level coverage, such as authentication, persistent note creation or editing, important navigation, deployment smoke checks, or another critical user flow.

## Local Verification

| Task | Command |
| --- | --- |
| Verify repo | `pnpm verify` |
| Check formatting | `pnpm format:check` |
| Check repo | `pnpm lint` |
| Check cyclomatic complexity | `pnpm complexity` |
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
- `Complexity`
- `Typecheck`
- `Tests`
- `Build`
- `Graphify`
- `Quality`

`Quality` is an aggregate check used as a stable branch-protection context. Individual job names remain visible so contributors can identify the failing category quickly.

The separate `Security` workflow runs CodeQL as a high-signal merge signal. It is intentionally not required by the versioned rulesets until CodeQL/code scanning availability is confirmed for the repository.

Keep local verification and CI aligned unless there is a documented reason to diverge. `pnpm verify` remains the canonical local completion command and runs formatting, linting, complexity checking, Next.js type generation, TypeScript checking, tests with coverage, Graphify artifact validation, and production build.

Run `pnpm graphify:update` locally before committing source changes that affect the code graph. CI validates committed Graphify artifacts but does not rewrite them, because GitHub checkout timestamps are not stable enough for committed manifest metadata.

## Coverage

Coverage is generated with Vitest's V8 provider and uploaded by CI as a short-retention artifact. It is a regression and review signal, not the full definition of quality.

Current policy:

- No 100% coverage mandate.
- Global minimum thresholds are 80% statements, 80% lines, 80% functions, and 70% branches.
- Thresholds are intentionally conservative while the app has little stable product code.
- Future thresholds should ratchet upward for new business logic, validation, auth, authorization, data transformations, destructive operations, and critical state transitions.

## Complexity

The repository enforces a maximum cyclomatic complexity of 10 per function for application source under `src/`. Biome also enforces cognitive complexity with a maximum score of 15. Prefer extracting named helpers, simplifying branching, or moving decision tables into data before suppressing either check.

## Agent Hooks

`lefthook.yml` defines the shared agent validation hook. Lefthook's AI hook integration is beta, so run `lefthook install` only when a local or CI environment is ready to generate provider-specific files such as `.codex/hooks.json` or `.claude/settings.json`. The committed source of truth is `lefthook.yml`; generated personal hook state should stay out of unrelated diffs.

Use `pnpm agent-hooks:install` to generate provider-specific hook files and `pnpm agent-hooks:validate` to run the shared validation hook directly.

## Definition Of Done

Completion requires task-appropriate verification evidence.

Examples of appropriate evidence include:

- `pnpm verify` output for ordinary code changes.
- Test results for behavior changes.
- Build output for app or configuration changes.
- Screenshots or browser checks for meaningful visual changes.
- OpenSpec acceptance criteria for spec-driven changes.
- Security review for auth, secrets, dependencies, deployment, or external integrations.
