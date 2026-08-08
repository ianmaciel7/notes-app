# Contributing

This document is the canonical workflow for local development, Git, pull requests, CI, and merges.

## Local Development

Use pnpm 11.20.0, as declared in `package.json`.

| Task | Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production server | `pnpm start` |
| Generate Next.js types | `pnpm exec next typegen` |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Format repo | `pnpm format` |
| Format file | `pnpm exec biome format --write path/to/file` |
| Typecheck | `pnpm exec tsc --noEmit` |

There is no test script configured yet. Follow `docs/TESTING.md` before adding or documenting test commands.

## Git Workflow

Use this flow for repository changes:

```text
staging -> working branch -> commit -> push -> Pull Request -> required CI checks -> squash merge -> staging
```

Rules:

- Never push directly to `main`.
- Never push directly to `staging`.
- Create a dedicated branch for each logical task.
- Branch from an updated `staging`.
- Review changed files before committing.
- Keep unrelated changes out of the branch.
- Reuse an existing pull request when one already exists for the branch.
- Pull requests should target `staging` unless explicitly specified otherwise.
- Required CI checks must pass before merge.
- Use squash merge.
- Do not bypass branch protection unless explicitly requested.
- Investigate unexpectedly large diffs before pushing or merging.
- Prefer safe and non-destructive Git commands.
- The primary local shell is Windows PowerShell; do not use Bash-style `\` line continuation in PowerShell examples.

## Start Work

```powershell
git fetch origin
git switch staging
git pull --ff-only origin staging
git switch -c <task-branch>
```

Use branch names that describe one task, for example:

```powershell
git switch -c docs/consolidate-documentation
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

```powershell
git add <changed-files>
git diff --cached --stat
git diff --cached
git commit -m "<type>: <summary>"
```

## Push

Push only the dedicated working branch:

```powershell
git push -u origin <task-branch>
```

Do not push `HEAD:main` or `HEAD:staging`.

## Pull Request

Before opening a new pull request, check whether one already exists for the branch:

```powershell
gh pr list --head <task-branch> --base staging
```

Open a pull request targeting `staging`:

```powershell
gh pr create --base staging --head <task-branch> --title "<title>" --body "<summary>"
```

## CI And Merge

The CI workflow lives in `.github/workflows/ci.yml` and runs on pull requests targeting `main` or `staging`.

Required checks must pass before merge:

```powershell
gh pr checks
```

Merge only after required checks pass:

```powershell
gh pr merge --squash
```

Do not bypass branch protection unless the user explicitly instructs it.
