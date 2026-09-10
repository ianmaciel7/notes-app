# Code Quality Policy

Executable output is evidence; configuration and agent instructions are not proof
that the application passes its checks. `package.json` defines supported commands.
Use `docs/ai-development-flow.md` to choose verification proportional to the change.

## Prerequisites

Use Node.js 22.16 or newer in the 22.x line and the pnpm version pinned in
`packageManager`. Install dependencies with `pnpm install --frozen-lockfile`.
The native Node agent-hook entry point requires TypeScript stripping support.

## Supported Checks

| Command | Purpose |
| --- | --- |
| `pnpm format:check` | Non-mutating Biome formatting check. |
| `pnpm lint` | General Biome lint using the committed configuration. |
| `pnpm typecheck` | Generate Next.js route types, then run TypeScript without emitting. |
| `pnpm metrics` | Run the selected structural rules locally; warnings also fail. |
| `pnpm metrics:report` | Save validated raw and summarized Biome diagnostics locally. |
| `pnpm test:unit` | Run the configured Vitest unit/integration suite. |
| `node --test scripts/quality/*.test.mjs` | Test the quality CLIs with isolated fixtures. |
| `pnpm build` | Build the production application. |
| `pnpm test:e2e` | Run Playwright after building the production application. |
| `pnpm ladle:build` | Build the component workbench; this does not replace type checking. |

The metrics policy, rule support, and measurement limitations are maintained in
[Code Quality Metrics](./code-quality-metrics.md), not duplicated here. Do not use
removed aggregate scripts or present old multi-tool checks as currently installed.
No threshold, exclusion, or suppression may be changed merely to obtain a pass.

## Agent Hooks

Cursor configuration is in `.cursor/hooks.json`; Antigravity configuration is in
`.agents/hooks.json`. Both use the shared `scripts/quality/agent-hook.ts` entry point
through `node --experimental-strip-types`, with no `tsx` or shell shim dependency.

After-edit hooks remain lightweight. On relevant Git changes, stop hooks run the
installed Biome formatting and lint launchers, Next.js type generation, and the
TypeScript compiler. They share a 120-second execution budget. A failure retains
its command output and exit status; failed Git inspection is not treated as an
empty worktree. Existing continuation and cancellation limits remain in
`src/tooling/quality-hooks.ts`.

The separate metrics CLI is not automatically invoked by these hooks. Hook
feedback does not replace workflow-specific tests or prove implementation complete.

## Git Hooks and CI

The retained `.husky` scripts support existing installations without importing a
removed Husky shim. Pre-commit uses Biome's non-mutating staged-file check; pre-push
runs formatting, lint, and type checking. The staged-file selection does not
provide lint-staged's partial-staging stash behavior. No hook installation or
local Git configuration is changed by these files.

The existing `Quality` workflow remains on pull requests and pushes to `main`.
It runs available formatting, lint, type, unit, tooling, build, and E2E commands.
Structural metrics remain an explicit local command, not a new CI requirement.
Remote branch protection and deployment permissions are not changed here.

Coverage settings in `vitest.config.ts` are not a coverage result. The current
manifest does not include the previously configured V8 coverage provider. The
existing accessibility E2E test also imports `@axe-core/playwright`, which was
removed from the manifest in `8ba2a492`. These integration dependencies need a
separate reproducible dependency/lockfile reconciliation before those checks can
be considered verified. Do not remove assertions or lower coverage thresholds to
hide a missing dependency.

## Reporting

Report each check as passed, failed, not run, or blocked by the environment, with
the command and relevant evidence. Distinguish isolated test doubles from real
Dexie, Firebase, provider, and browser integration. Never infer a green CI result
from a successful local helper test. Document remaining defects and scope limits.
