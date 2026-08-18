# Deployment

## Local

- `pnpm install --frozen-lockfile`
- `pnpm dev`

## Branch flow

```text
feature/fix/chore -> dev -> stag -> main
```

- `dev` is the integration branch.
- `stag` is the staging/release-candidate branch.
- `main` is the production branch.
- Changes between long-lived branches must go through pull requests.
- Hotfixes that reach `stag` first are back-synced to `dev` through an automatically opened PR.

## Firebase App Hosting

Repository runtime configuration lives in:

- `apphosting.staging.yaml` for staging.
- `apphosting.yaml` for production.

The repository configuration intentionally does not contain credentials. Firebase/GCP authentication and backend-to-branch bindings must be configured in the hosting platform.

## CI/CD boundary

GitHub Actions validates source changes through:

- `.github/workflows/ci.yml` -> `Quality`
- `.github/workflows/security.yml` -> `Security`

A passing CI run validates the repository source. Deployment success must still be confirmed in Firebase App Hosting.

## Release validation

Before promoting `stag` to `main`:

1. Ensure `Quality` and `Security` pass.
2. Confirm the staging rollout succeeded.
3. Smoke-test the deployed staging application.
4. Promote with a squash PR from `stag` to `main`.
5. Confirm the production rollout and smoke-test production.

## Rollback

Use Firebase App Hosting release history and Git history to identify the last known-good deployment. Do not rewrite protected branch history or force-push as a rollback mechanism.
