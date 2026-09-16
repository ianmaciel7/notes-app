# Task 5 Report

## Status

Implemented and committed Task 5.

## Changes

- Added `concurrently` as a development dependency in `package.json`.
- Added the exact `dev:all` script:

  `concurrently --kill-others-on-fail --names next,ladle "pnpm dev" "pnpm ladle"`

- Updated `pnpm-lock.yaml` through pnpm.
- Preserved the existing `dev` and `ladle` scripts.
- Left pre-existing changes in `.gitignore`, `graphify-out`, `pnpm-workspace.yaml`, and `.agents/rules` untouched.

## Validation

- `pnpm add -D concurrently`: dependency installation completed, but pnpm returned `ERR_PNPM_IGNORED_BUILDS` because existing build scripts for `@swc/core`, `esbuild`, and `msw` are blocked by the environment policy.
- `pnpm exec concurrently --version`: attempted as required, but pnpm repeated the same ignored-build policy error before execution.
- Direct installed binary check: `node_modules/.bin/concurrently.cmd --version` returned `10.0.5`.
- Exact script assertion: passed using a PowerShell-safe equivalent of the brief command; the literal command’s escaped quotes were altered by PowerShell parsing.
- `git diff --check -- package.json pnpm-lock.yaml`: passed.

## Commit

`f99a7f6 chore: add combined dev command`

## Concerns

The required pnpm validation commands are affected by the repository/environment build-script approval policy. The installed `concurrently` executable itself is present and reports the expected version.

## Round 1 Fix

Reviewer finding: `concurrently@10.0.5` requires Node `>=22`, conflicting with the project’s Node 20 compatibility requirement.

- Ran `pnpm.cmd add -D concurrently@9.2.1`.
- `package.json` now pins `concurrently` to `9.2.1`.
- `pnpm-lock.yaml` now resolves `concurrently@9.2.1`.
- The exact `dev:all` script was preserved.

### Fix Validation Output

- `pnpm.cmd add -D concurrently@9.2.1`: dependency update completed; pnpm returned `ERR_PNPM_IGNORED_BUILDS` for the pre-existing blocked build scripts (`@swc/core`, `esbuild`, `msw`).
- `node_modules/.bin/concurrently.cmd --version`: `9.2.1`.
- Node assertion for pinned version and exact script: passed.
- `git diff --check -- package.json pnpm-lock.yaml`: passed; only line-ending warnings were emitted.
