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

## Verification Loop

Software verification checks whether the application and repository tooling work. OpenSpec verification checks whether the implemented change satisfies the agreed requirements and acceptance criteria. Use both for meaningful OpenSpec-driven changes.

When a verification command fails:

1. Identify the failing command and the first meaningful error.
2. Classify the likely root cause before changing code.
3. Make a targeted fix or update the relevant OpenSpec artifact if implementation evidence changed the requirement.
4. Rerun the narrowest useful check first.
5. Run broader verification, usually `pnpm verify`, once the focused failure is resolved.

Do not skip, weaken, or delete a legitimate failing test only to make the suite pass. If a test is wrong, prove why from repository behavior or OpenSpec requirements before changing it.

Retries must be bounded. If the same root cause repeats without progress, stop and choose a strategy change, specialist review, BLOCKED state, or ESCALATE state.

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

Meaningful agent tasks should end with one explicit terminal state:

- DONE: requirements and acceptance criteria are satisfied, relevant software verification ran, OpenSpec verification ran when applicable, review is complete when justified, and no high-severity findings remain.
- BLOCKED: an external dependency prevents progress; report the blocker, evidence, attempted steps, and what is required next.
- ESCALATE: human judgment or authorization is required for ambiguous requirements, security tradeoffs, destructive or production-impacting actions, protected workflow bypasses, or repeated no-progress failures.
