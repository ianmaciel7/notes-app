# Git Workflow

Use this workflow for any operation involving branches, commits, pushes, pull requests, or merges.

## Rules

- Never push directly to `main` or `staging`.
- Create a dedicated working branch from the latest `staging`.
- Keep each branch limited to one logical task.
- Review changed files before committing or pushing.
- Reuse an existing pull request when one already exists for the branch.
- Pull requests must target `staging` unless explicitly instructed otherwise.
- Required CI checks must pass before merge.
- Use squash merge.
- Never bypass branch protection unless explicitly instructed.
- Stop and investigate if the change set is unexpectedly large or contains unrelated files.
- Prefer safe, non-destructive Git commands.
- The local shell is Windows PowerShell; do not use Bash `\` line continuation.

## Start Work

```powershell
git fetch origin
git switch staging
git pull --ff-only origin staging
git switch -c <task-branch>
```

Use branch names that describe one task, for example:

```powershell
git switch -c docs/git-workflow
```

## Review Changes

Before committing or pushing:

```powershell
git status --short --branch
git diff --stat
git diff
```

If the diff includes unrelated files, stop and resolve the scope before continuing.

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

Check CI status:

```powershell
gh pr checks
```

Merge only after required checks pass:

```powershell
gh pr merge --squash
```

Do not bypass branch protection unless the user explicitly instructs it.
