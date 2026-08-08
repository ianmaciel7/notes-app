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

The repository Git workflow routes changes through pull requests into `staging`. Follow `CONTRIBUTING.md` for branch, pull request, CI, and merge rules.

## Configuration

- Keep real environment secrets out of Git.
- Use `.env.example` for non-sensitive local configuration examples.
- Follow `SECURITY.md` for secrets and sensitive configuration.

## Rollback

No project-specific rollback procedure is documented yet. Until one is added, use the hosting provider's release history and Git history to identify the last known-good deployment.
