# Deployment

## Build

Production builds use:

```powershell
pnpm build
```

The CI workflow also runs `pnpm exec next typegen` and `pnpm exec tsc --noEmit` before the production build.

## Environments

Firebase App Hosting configuration lives in:

- `apphosting.yaml` for production.
- `apphosting.staging.yaml` for staging.

Current run configuration:

- Production allows 0 to 2 instances.
- Staging allows up to 1 instance.

## CI/CD

GitHub Actions CI is defined in `.github/workflows/ci.yml` and runs on pull requests targeting `main` or `staging`.

The repository Git workflow routes normal development changes through pull requests into `staging`. Production promotion should use a pull request from `staging` to `main`.

Follow `CONTRIBUTING.md` for branch, pull request, CI, merge, versioning, tag, and release preparation rules.

## Deployment Triggers

No project-specific deployment trigger is currently documented in repository files.

Repository evidence shows:

- Firebase App Hosting configuration exists for staging and production.
- CI validates pull requests targeting `main` and `staging`.
- No release workflow exists under `.github/workflows/`.
- No Git tags or GitHub Releases exist yet.

Do not assume that merging to `main`, creating a Git tag, or creating a GitHub Release automatically deploys production until the trigger is verified and documented.

## Release Relationship

The intended release model is:

```text
staging -> promotion Pull Request -> main -> version tag -> GitHub Release if used -> deployment if configured
```

Version tags should point to validated production commits on `main`.

Release commands belong in `CONTRIBUTING.md`; operational deployment behavior belongs here.

## Configuration

- Keep real environment secrets out of Git.
- Use `.env.example` for non-sensitive local configuration examples.
- Follow `SECURITY.md` for secrets and sensitive configuration.

## Rollback

No project-specific rollback procedure is documented yet. Until one is added, use the hosting provider's release history and Git history to identify the last known-good deployment.

Do not delete or move release tags as a rollback shortcut.
