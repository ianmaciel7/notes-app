# Deployment

## Build

Production builds use:

```powershell
pnpm build
```

The CI workflow also runs formatting, linting, `pnpm typegen`, `pnpm typecheck`, tests with coverage, and Graphify artifact validation before the production build.

## Environments

Firebase App Hosting configuration lives in:

- `apphosting.yaml` for production.
- `apphosting.staging.yaml` for staging.

Current run configuration:

- Production allows 0 to 2 instances.
- Staging allows up to 1 instance.

## CI/CD Boundary

GitHub Actions CI is defined in `.github/workflows/ci.yml` and runs on pull requests targeting `main` or `stag`. Security validation is defined in `.github/workflows/security.yml`.

The repository Git workflow routes normal development changes through pull requests into `stag`. Production promotion should use a pull request from `stag` to `main`.

CI success means the source tree passed repository checks. It does not prove that deployment succeeded.

## Deployment Triggers

No project-specific deployment trigger is currently documented in repository files.

Repository evidence shows:

- Firebase App Hosting run configuration exists for staging and production.
- CI validates pull requests targeting `main` and `stag`.
- No release workflow exists under `.github/workflows/`.

Do not assume that merging to `main`, creating a Git tag, or creating a GitHub Release automatically deploys production until the trigger is verified and documented.

## Recommended Delivery Flow

Use this model unless the hosting integration proves a different trigger:

```text
feature branch -> PR -> stag -> staging deployment -> smoke checks
stag -> promotion PR -> main -> production deployment -> health/smoke checks
```

Staging should be the final realistic validation environment before production. Production should use GitHub Environments with required reviewers, restricted deployment branches, and environment-scoped secrets where practical.

## Cloud Authentication

If GitHub Actions deploys to Firebase or Google Cloud, prefer:

```text
GitHub Actions -> OIDC -> Workload Identity Federation -> short-lived credentials
```

Do not add long-lived service-account JSON keys unless there is no supported alternative and the trade-off is explicitly reviewed.

## Smoke And Health Checks

Deployment workflows, when added, should verify more than a successful deploy command. Start with inexpensive checks:

- deployed homepage returns a successful response;
- static assets load;
- any future health endpoint returns ready status;
- critical auth or data dependencies are reachable when applicable.

## Rollback

No project-specific automated rollback procedure is documented yet. Until one is added, use the hosting provider's release history and Git history to identify the last known-good deployment.

Do not delete or move release tags as a rollback shortcut.
