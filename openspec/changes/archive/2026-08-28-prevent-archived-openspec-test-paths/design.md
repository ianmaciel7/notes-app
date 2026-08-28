## Context

`pnpm verify` previously failed after a valid OpenSpec archive because a contract test read `openspec/changes/add-block-editor/tasks.md` directly. The archive preserved the artifact under `openspec/changes/archive/2026-08-28-add-block-editor/tasks.md`, but the active-only path no longer existed.

## Decision

Document the active-or-archived lookup policy in `.agents/rules/openspec-first.md` and cover that rule in the governance contract test. The rule is intentionally about tests and tooling that inspect OpenSpec artifacts; production code should not depend on OpenSpec planning paths.

## Alternatives Considered

- Keep active-only paths and avoid archiving referenced changes: rejected because archiving is the normal OpenSpec lifecycle.
- Copy archived artifacts back into active changes for tests: rejected because it would leave completed changes active and blur the source of truth.

## Verification

- `openspec validate prevent-archived-openspec-test-paths --strict`
- `openspec validate --specs`
- `pnpm verify`
