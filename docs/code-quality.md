# Code Quality Policy

This project uses deterministic tools as quality gates. Agent instructions guide behavior, but tool output is the source of truth for configured checks.

## Prerequisites

- Node.js 22.x.
- pnpm 11.20.0 from `packageManager`.
- Dependencies installed with `pnpm install`.
- Next.js generated route types available through `next typegen`; `pnpm typecheck` runs this before `tsc --noEmit`.
- Playwright browsers installed for E2E runs.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm format:check` | Non-mutating Biome formatting check. |
| `pnpm lint` | Biome lint. Biome remains the general linter and formatter. |
| `pnpm typecheck` | `next typegen` followed by TypeScript strict checking. |
| `pnpm complexity:check` | Dedicated cyclomatic complexity measurement through `typhonjs-escomplex`. |
| `pnpm deps:check` | dependency-cruiser architecture rules. |
| `pnpm unused:check` | Knip unused files, exports, and dependencies check. |
| `pnpm test:unit` | Vitest unit/integration tests without watch. |
| `pnpm test:coverage` | Vitest with V8 coverage and thresholds. |
| `pnpm test:e2e` | Playwright smoke/parity suite against `pnpm start`. Run `pnpm build` first. |
| `pnpm hooks:test` | Tests for shared agent hook behavior. |
| `pnpm quality:fast` | Format check, lint, typecheck, and cyclomatic complexity. |
| `pnpm quality` | Fast gate plus architecture, unused-code, coverage, and hook tests. |
| `pnpm verify` | Full quality gate, production build, and E2E. |

## Metrics

| Metric | Tool | Scope | Threshold |
| --- | --- | --- | --- |
| Cognitive complexity | Biome `noExcessiveCognitiveComplexity` | Files included by `biome.json` | 15, blocking. |
| Parameter count | Biome `useMaxParams` | Files included by `biome.json` | 4, warning. |
| Cyclomatic complexity | `typhonjs-escomplex` | Production `src/**/*.ts(x)` excluding tests, stories, generated UI registry components, and build artifacts | 10, blocking. |
| Coverage | Vitest V8 | `src/**/*.{ts,tsx}` excluding stories, route shell files, generated UI registry components, test files, and type declarations | 80% lines, statements, functions, and branches. |
| Architecture | dependency-cruiser | `src` imports | No cycles; no production imports from tests; no client-side Firebase Admin imports. |
| Unused code/dependencies | Knip | Configured Next, source, tests, scripts, and config entrypoints | No unreviewed findings. |

Biome is the only general linter and formatter. Cyclomatic complexity is measured by a dedicated script using `typhonjs-escomplex`, because Biome covers cognitive complexity but does not currently expose a cyclomatic complexity gate. The script transpiles TS/TSX with the local TypeScript compiler before measurement so modern TypeScript syntax is accepted, then fails if it analyzes zero files and reports file, function, location, and measured value for violations.

`typhonjs-escomplex` currently brings `core-js@2` transitively. Its lifecycle script is explicitly denied in `pnpm-workspace.yaml` with `allowBuilds.core-js: false`; do not approve it without a separate supply-chain review.

## Hooks

Cursor project hooks live in `.cursor/hooks.json`.

- `afterFileEdit` adds lightweight context for quality-relevant edits.
- `stop` runs `pnpm quality:fast` when Git reports relevant tracked, staged, or new files. It can return a `followup_message` up to two times.

Antigravity workspace hooks live in `.agents/hooks.json`.

- `PostToolUse` is lightweight for edit tools.
- `Stop` runs `pnpm quality:fast` when Git reports relevant changes. It returns `decision: "continue"` with a reason only for idle `model_stop` terminations and only while the execution number leaves room for two continuations.

The hooks are feedback automation, not proof of completion. Agents still must run `pnpm verify` before declaring implementation complete.

## Git Hooks

Husky installs hooks through `pnpm prepare`.

- `pre-commit` runs `pnpm lint-staged`, which checks staged files with Biome without mutating them.
- `pre-push` runs `pnpm quality:fast`.

These hooks are local convenience gates. CI and repository branch protection must enforce merge policy remotely.

## CI

The `Quality` workflow runs on pushes to `main` and pull requests. It installs with the lockfile, runs `pnpm quality`, builds the production app, installs Chromium, runs Playwright, and uploads coverage/Playwright artifacts when present.

Administrative follow-up: require the `Quality` check in branch protection and review bypass permissions in the hosting provider. This repository change does not alter remote protections.

## Troubleshooting

- If `pnpm test:unit` fails in a restricted sandbox with an esbuild access error before loading `vitest.config.ts`, rerun it in a normal project shell. That is an environment failure, not a test failure.
- If `pnpm test:e2e` reports that production files are missing, run `pnpm build` first.
- If Knip reports a candidate unused file or dependency, review the entrypoint configuration before deleting anything.
- If dependency-cruiser reports a cycle, prefer moving shared pure logic downward or splitting contracts from implementation rather than adding broad ignores.
