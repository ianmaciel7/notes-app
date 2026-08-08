# Testing

## Current State

There is no test script configured in `package.json` yet.

Current verification is handled by linting, type generation, type checking, and production build checks.

## Local Verification

| Task | Command |
| --- | --- |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Generate Next.js types | `pnpm exec next typegen` |
| Typecheck | `pnpm exec tsc --noEmit` |
| Build | `pnpm build` |

## CI

The `Quality` job in `.github/workflows/ci.yml` runs on pull requests targeting `main` or `staging`.

It performs:

- Dependency installation with `pnpm install --frozen-lockfile`.
- Biome checks with `pnpm lint`.
- Next.js type generation with `pnpm exec next typegen`.
- TypeScript checking with `pnpm exec tsc --noEmit`.
- Production build with `pnpm build`.

## Adding Tests

When a test runner is added:

- Add a `test` script before documenting or relying on `pnpm test`.
- Document test commands here.
- Keep test strategy focused on the behavior being protected.
- Prefer deterministic tests with clear setup and assertions.
- Update CI if tests become required for pull requests.

Use `.agents/agents/test-engineer/agent.md` for test strategy and regression coverage review.
