# Deployment

## Current State

Deployment is not configured in the current branch.

The repository currently has:

- `next.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `src/app/`
- `public/`

The repository currently does not have:

- `.github/workflows/`
- `apphosting.yaml`
- `apphosting.staging.yaml`
- Firebase App Hosting configuration
- deployment scripts
- release workflow

## Build

The available production build command is:

```powershell
pnpm build
```

Run this after installing dependencies with:

```powershell
pnpm install
```

## Environments

No staging or production hosting environment is defined in repository files on this branch.

The Git branch named `stag` is the current integration branch. Do not confuse that branch name with a configured staging deployment environment.

## CI/CD Boundary

No GitHub Actions CI/CD workflow is present in this branch. Do not claim deployment, security scanning, or aggregate quality gates until `.github/workflows/` is restored and verified.

## Recommended Future Flow

When CI and hosting are added, use a protected flow such as:

```text
feature branch -> PR -> stag -> deployment candidate -> smoke checks
stag -> promotion PR -> main -> production deployment
```

Document the actual hosting trigger only after it is implemented and verified.

## Configuration

- Keep real environment secrets out of Git.
- Use `.env.example` for non-sensitive local configuration names.
- Follow `SECURITY.md` for secrets and sensitive configuration.

## Rollback

No project-specific rollback procedure is configured yet. Add one when deployment is introduced.
