## Why

OpenSpec archive operations move completed changes out of `openspec/changes/<name>` and into `openspec/changes/archive/<date>-<name>`. Tests or tooling that hard-code only the active path can fail immediately after a valid archive, even when the archived artifact is still present.

## What Changes

- Update the OpenSpec-first rule to require active-or-archived artifact lookups when tests or tooling depend on change artifacts.
- Add regression coverage so governance tests detect future rules that allow active-only OpenSpec artifact paths.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `developer-workflows/openspec-enforcement`: OpenSpec governance must prevent tests and tooling from depending only on active change artifact paths.

## Impact

- Affected files: `.agents/rules/openspec-first.md`, `tests/rules-compliance-contract.test.mjs`, and this OpenSpec change.
- No runtime product behavior changes.
