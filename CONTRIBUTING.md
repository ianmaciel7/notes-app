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
staging -> working branch -> commits -> push -> Pull Request -> required CI checks -> squash merge -> staging
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

Examples:

```text
feat/add-filtering
fix/handle-empty-value
chore/update-tooling
docs/update-contributing-guide
refactor/simplify-validation
test/add-regression-coverage
```

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

## Commit Strategy

Use Conventional Commits.

Format:

```text
<type>(optional-scope): <short imperative description>
```

Recommended types:

```text
feat
fix
chore
refactor
docs
test
ci
build
perf
revert
```

Examples:

```text
feat: add validation handling
fix: prevent duplicate processing
docs: document release workflow
test: add regression coverage
refactor: simplify error handling
chore: update development tooling
ci: enforce quality checks
```

Each commit should:

- Represent one meaningful logical change.
- Be understandable independently.
- Avoid unrelated files.
- Use an imperative, concise subject.
- Avoid vague subjects such as `update`, `changes`, `fix stuff`, or `wip`.
- Contain only intentionally reviewed files.
- Leave the repository in a reasonable state whenever practical.

Do not artificially create many tiny commits. Do not combine unrelated changes into one large commit.

Use this rule:

```text
one commit = one meaningful logical change
```

Before committing, inspect:

```powershell
git status --short --branch
git diff --stat
git diff --name-only
git diff
```

Confirm:

- Only intended files changed.
- No unrelated repository was copied.
- No secrets are present.
- No generated, cache, or dependency directories were accidentally added.
- The change size matches the task.

Prefer intentional staging:

```powershell
git add <specific-path>
```

Use `git add .` only after carefully reviewing the working tree.

Use amend only for local, unpublished commits when appropriate:

```powershell
git commit --amend
```

Do not rewrite commits that other developers may already depend on without explicit justification.

Prefer safe history operations. Do not force-push protected branches, rewrite `main`, rewrite `staging`, rewrite published release history, rewrite tags, or force-update tags.

If history rewriting is genuinely required on a private working branch, prefer:

```powershell
git push --force-with-lease
```

Do not use plain `git push --force` casually.

## Pull Request

Before opening a new pull request, check whether one already exists for the branch:

```powershell
gh pr list --head <task-branch> --base staging
```

Open a pull request targeting `staging`:

```powershell
gh pr create --base staging --head <task-branch> --title "<title>" --body "<summary>"
```

Pull requests should:

- Target `staging` by default.
- Contain one logical task.
- Use a concise Conventional Commit style title.
- Explain the relevant change.
- Pass required CI checks.
- Be reviewed for unexpected files before merge.

New commits pushed to the branch update the existing pull request automatically.

## Squash Merge

Use squash merge for normal pull requests.

Development branches may contain several useful working commits, while protected branches receive one clean logical commit.

Example:

```text
working branch:
feat: add core behavior
test: add regression coverage
docs: document behavior

squash merge

staging:
feat: add requested behavior
```

Local branch commits should still be meaningful. Do not rely on squash merge as an excuse for poor commit messages.

The final pull request title should be suitable as the squash commit title.

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

## Production Promotion

Production promotion should use the same protected-branch model:

```text
staging -> promotion Pull Request -> required CI checks -> squash merge -> main
```

`main` and `staging` are protected by repository rulesets in `.github/rulesets/`.

Do not push directly to `main` for production promotion.

## Versioning

Use Semantic Versioning unless the repository later documents a different standard.

Format:

```text
MAJOR.MINOR.PATCH
```

Tags use:

```text
vMAJOR.MINOR.PATCH
```

Examples:

```text
v1.0.0
v1.1.0
v1.1.1
v2.0.0
```

Meaning:

- MAJOR: incompatible or breaking changes.
- MINOR: backward-compatible functionality.
- PATCH: backward-compatible fixes.

Do not create arbitrary version tags. Do not create version tags for individual development commits.

## Tags And Releases

Release tags should normally point to the exact production commit on `main`.

Do not:

- Tag feature branches.
- Tag unreviewed commits.
- Reuse version numbers.
- Move published tags.
- Force-update release tags.
- Delete published release tags casually.

Before creating a release tag, verify:

```powershell
git status --short --branch
git fetch origin
git branch --show-current
git log --oneline --decorate -n 10
git tag --list
```

Example only:

```powershell
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

Do not execute release commands unless explicitly requested.

If GitHub Releases are used, they should correspond to:

```text
production commit -> version tag -> GitHub Release -> release notes -> deployment if configured
```

This repository currently has no Git tags, no GitHub Releases, and no dedicated release workflow. Do not assume that creating a GitHub Release deploys production.

## Changelog

`CHANGELOG.md` is optional and not currently needed.

Create it only if the project needs a curated human-readable release history that GitHub Releases and pull request history do not sufficiently provide.
