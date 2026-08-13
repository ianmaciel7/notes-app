# Contributing

This document describes the current workflow for this branch. It intentionally reflects the present starter app state, not the fuller historical setup from `origin/old`.

## Local Development

Use pnpm 11.20.0, as declared in `package.json`.

| Task | Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production server | `pnpm start` |
| Check repo | `pnpm lint` |
| Format repo | `pnpm format` |

There is currently no `pnpm verify`, `pnpm typecheck`, `pnpm typegen`, `pnpm test`, or `pnpm test:coverage` script in `package.json`. Add those scripts before documenting them as required checks.

## Git Workflow

Use this flow for repository changes:

```text
stag -> working branch -> commits -> push -> Pull Request -> review/checks -> squash merge -> stag
```

Rules:

- Never push directly to `main`.
- Never push directly to `stag`.
- Create a dedicated branch for each logical task.
- Branch from an updated `stag`.
- Pull requests should target `stag` unless explicitly specified otherwise.
- Keep unrelated changes out of the branch.
- Review changed files before committing.
- Do not bypass branch protection unless explicitly requested.
- Use safe, non-destructive Git commands by default.
- The primary local shell is Windows PowerShell; do not use Bash-style `\` line continuation in PowerShell examples.

## Branch Naming

Use one dedicated branch per logical task.

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

Format:

```text
<type>(optional-scope): <short imperative description>
```

Examples:

```text
docs: restore current project documentation
chore: initialize agent governance
fix: correct branch workflow docs
```

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

## Push And Pull Request

Push only the dedicated working branch:

```powershell
git push -u origin <task-branch>
```

Do not push `HEAD:main` or `HEAD:stag`.

Before opening a new pull request, check whether one already exists for the branch:

```powershell
gh pr list --head <task-branch> --base stag
```

Open a pull request targeting `stag`:

```powershell
gh pr create --base stag --head <task-branch> --title "<title>" --body "<summary>"
```

## CI And Required Checks

No `.github/workflows/` directory is present in the current branch, so repository CI is not configured here yet.

Until CI is restored, local evidence should match the changed surface:

- documentation-only changes: inspect rendered Markdown/diff and links;
- app changes: run `pnpm lint` and `pnpm build` when dependencies are installed;
- tooling changes: run the narrow command that exercises the changed tool.

Do not claim `Quality`, CodeQL, coverage, or branch-ruleset enforcement until the corresponding files and GitHub settings are restored and verified.

## Production Promotion

Production promotion is not configured in this branch. Do not assume that merging to `main`, creating a Git tag, or creating a GitHub Release deploys production.

## Versioning And Tags

Use Semantic Versioning if release tags are introduced later.

Do not create, delete, move, or force-update release tags unless explicitly requested.

## Changelog

`CHANGELOG.md` is optional and not currently present.
