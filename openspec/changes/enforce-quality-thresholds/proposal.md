## Why

The repository runs tests and static checks, but it needs explicit minimum quality gates before application code grows: coverage thresholds, cyclomatic complexity limits, and a portable way for agent workflows to reuse the same validation commands.

Current 2026 guidance from the project tools supports this shape:

- Vitest exposes native `coverage.thresholds` for global and per-file minimums.
- ESLint documents cyclomatic complexity as a cap on independent paths through a function; this repository keeps Biome as the linter, so the cyclomatic gate is implemented as a local TypeScript AST check instead of adding ESLint.
- Biome exposes `noExcessiveCognitiveComplexity` with a documented default maximum of 15, which complements cyclomatic complexity by catching hard-to-follow nesting.
- Lefthook exposes beta `ai` hooks that generate provider-specific Codex and Claude hook files from `lefthook.yml`.

## What Changes

- Enforce initial Vitest coverage thresholds: 80% statements, 80% lines, 80% functions, and 70% branches.
- Add a repository-local cyclomatic complexity check with a maximum of 10 per function under `src/`.
- Enable Biome's cognitive complexity rule with a maximum score of 15.
- Add a `Complexity` CI job and include it in the aggregate `Quality` gate.
- Add `lefthook.yml` as the committed source of truth for agent Stop-time validation.
- Add Lefthook as a project dev dependency with explicit pnpm build-script approval.
- Update testing and contributor docs to describe the quality gates.

## Capabilities

### New Capabilities

- `quality-thresholds`: Defines coverage, complexity, CI, and agent-hook requirements for the repository.

## Non-Goals

- Mandate 100% test coverage.
- Add ESLint, SonarQube, or a paid analysis service.
- Run generated `.codex/hooks.json` or `.claude/settings.json` files through this change.
- Treat coverage percentages as a substitute for behavior-focused tests or browser verification.
