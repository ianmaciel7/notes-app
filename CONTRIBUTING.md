# Contributing

This document is the canonical workflow for local development, Git, commits, pull requests, CI, merges, versioning, tags, and release preparation.

## Local Development

Use pnpm 11.20.0, as declared in `package.json`.

| Task | Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production server | `pnpm start` |
| Generate Next.js types | `pnpm typegen` |
| Check Biome in CI mode | `pnpm biome:ci` |
| Apply safe Biome fixes | `pnpm biome:fix` |
| Apply safe Biome fixes to staged files | `pnpm biome:staged` |
| Check files changed from Biome's default branch | `pnpm biome:changed` |
| Check repo | `pnpm lint` |
| Check formatting | `pnpm format:check` |
| Format repo | `pnpm format` |
| Check cyclomatic complexity | `pnpm complexity` |
| Typecheck | `pnpm typecheck` |
| Test | `pnpm test` |
| Test with coverage | `pnpm test:coverage` |
| Check Graphify artifacts | `pnpm graphify:check` |
| Update Graphify artifacts | `pnpm graphify:update` |
| Verify repo | `pnpm verify` |

Use `pnpm verify` as the canonical local health check before opening or updating pull requests unless the task has a narrower, explicitly justified verification path. `pnpm biome:ci` is the canonical Biome validation command and must not write changes in CI. Follow `docs/TESTING.md` for testing strategy and Definition of Done expectations.

## Git Workflow

Use this flow for ordinary repository changes:

```text
dev -> working branch -> commits -> push -> Pull Request -> required CI checks -> squash merge -> dev -> Pull Request -> stag -> Pull Request -> main
```

Rules:

- Never push directly to `main`.
- Never push directly to `stag`.
- Never push directly to `dev`.
- Create a dedicated branch for each logical task.
- Branch ordinary feature work from an updated `dev`; branch emergency hotfixes from an updated `stag` only when the change intentionally bypasses `dev`.
- Review changed files before committing.
- Keep unrelated changes out of the branch.
- Pull requests should target the next branch in the delivery path unless explicitly specified otherwise.
- Required CI checks must pass before merge.
- CODEOWNERS documents sensitive areas, but this solo-maintained repository does not require approval by default.
- Use squash merge.
- Do not bypass branch protection unless explicitly requested.
- Investigate unexpectedly large diffs before pushing or merging.
- Prefer safe and non-destructive Git commands.
- The primary local shell is Windows PowerShell; do not use Bash-style line continuation in PowerShell examples.

## Branch Naming

Use one dedicated branch per logical task.

Branch names must use a conventional change-type prefix, a short English description, lowercase letters, numbers, and hyphen-separated words. Do not use personal, agent, language-specific, localized, or vague prefixes for repository work.

Recommended prefixes:

```text
feat/<short-description>
fix/<short-description>
chore/<short-description>
refactor/<short-description>
docs/<short-description>
test/<short-description>
ci/<short-description>
perf/<short-description>
```

## Start Work

```powershell
git fetch origin
git switch stag
git pull --ff-only origin stag
git switch -c <task-branch>
```

## Review Changes

Before committing or pushing:

```powershell
git status --short --branch
git diff --stat
git diff
```

If the diff includes unrelated files or is unexpectedly large, stop and resolve the scope before continuing.

## Commit

Use Conventional Commits.

```text
<type>(optional-scope): <short imperative description>
```

Each commit should represent one meaningful logical change, avoid unrelated files, and leave the repository in a reasonable state whenever practical.

Before committing, inspect:

```powershell
git status --short --branch
git diff --stat
git diff --name-only
git diff
```

Prefer intentional staging:

```powershell
git add <specific-path>
```

Use `git add .` only after carefully reviewing the working tree.

## Pull Request

Before opening a new pull request, check whether one already exists for the branch:

```powershell
gh pr list --head <task-branch> --base <base-branch>
```

Open a pull request targeting the intended base branch:

```powershell
gh pr create --base <base-branch> --head <task-branch> --title "<title>" --body "<summary>"
```

Pull requests should contain one logical task, explain the relevant change, pass required CI checks, and be reviewed for unexpected files before merge.

## Required Checks

The intended required protected-branch check is:

| Check | Purpose |
| --- | --- |
| `Quality` | Aggregate CI gate preserving a stable required status context. |

`Quality` depends on `Format`, `Lint`, `Complexity`, `Typecheck`, `Tests`, `Build`, and `Graphify`. Keeping the required branch-protection context aggregate avoids brittle required-check configuration when individual jobs are skipped by dependencies or renamed.

The separate `Security` workflow should be treated as a merge signal and may become a required check after CodeQL/code scanning support is confirmed for the repository.

## CI And Merge

The CI workflow lives in `.github/workflows/ci.yml` and runs on pull requests targeting `main`, `stag`, or `dev`.

Required checks must pass before merge:

```powershell
gh pr checks
```

Merge only after required checks pass:

```powershell
gh pr merge --squash
```

Branch cleanup must be explicit and separate from merge. Never delete protected branches or branches containing unmerged work.

## Stag To Dev Back-Sync

When a hotfix lands in `stag` before `dev`, `.github/workflows/sync-stag-to-dev.yml` checks whether `stag` contains non-equivalent patches missing from `dev`. If so, it opens a manual PR from `stag` into `dev`.

The back-sync workflow never pushes, force-pushes, or merges directly into `dev`. If a sync PR already exists, it leaves that PR in place. If conflicts are likely, the PR remains open for manual resolution through the normal review and CI path.

## Production Promotion

Production promotion should use the same protected-branch model:

```text
stag -> promotion Pull Request -> required CI checks -> squash merge -> main
```

`main`, `stag`, and `dev` are protected by repository rulesets in `.github/rulesets/`.

## Versioning

Use Semantic Versioning unless the repository later documents a different standard. Tags use `vMAJOR.MINOR.PATCH` and should normally point to the exact production commit on `main`.

Do not execute release commands unless explicitly requested.
