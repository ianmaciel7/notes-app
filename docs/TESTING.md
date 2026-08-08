# Testing

## Current State

Vitest and React Testing Library are configured for unit and component tests. The current test suite protects the observable home page workspace behavior.

End-to-end testing is not configured yet. Add E2E only when the app has behavior that justifies browser-level coverage, such as authentication, persistent note creation or editing, important navigation, deployment smoke checks, or another critical user flow.

## Local Verification

| Task | Command |
| --- | --- |
| Verify repo | `pnpm verify` |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Generate Next.js types | `pnpm exec next typegen` |
| Typecheck | `pnpm typecheck` |
| Run tests once | `pnpm test` |
| Build | `pnpm build` |

Use `pnpm verify` before opening or updating a pull request unless the task has a narrower, explicitly justified verification path.

## CI

The `Quality` job in `.github/workflows/ci.yml` runs on pull requests targeting `main` or `staging`.

It installs dependencies with `pnpm install --frozen-lockfile` and then runs:

```powershell
pnpm verify
```

Keep local verification and CI aligned unless there is a documented reason to diverge.

## Test Strategy

- Prefer deterministic unit or component tests for synchronous components, pure logic, formatting, state transitions, and accessible rendering behavior.
- Prefer E2E tests only for critical browser workflows that need routing, real rendering, persistence, authentication, or deployment behavior.
- Keep tests focused on observable behavior. Avoid testing implementation details that can change without changing user-visible behavior.
- Add regression tests when a bug reveals an important durable requirement.
- Update or create OpenSpec when a meaningful behavior, contract, acceptance criterion, or architectural expectation changes.

## Definition Of Done

An agent or contributor saying a task is complete is not evidence of completion. Completion requires task-appropriate verification evidence.

Examples of appropriate evidence include:

- `pnpm verify` output for ordinary code changes.
- Focused `pnpm exec biome check path/to/file` output for narrow formatting or lint-only edits.
- Test results for behavior changes.
- Build output for app or configuration changes.
- Screenshots or browser checks for meaningful visual changes.
- OpenSpec acceptance criteria for spec-driven changes.
- Security review for auth, secrets, dependencies, deployment, or external integrations.

Do not require every evidence type for every task. Match verification to risk and changed behavior.

Use `.agents/agents/test-engineer/agent.md` for test strategy and regression coverage review.
