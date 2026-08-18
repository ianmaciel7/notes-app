# Configure CI/CD

## Why

The repository needs deterministic quality, security, branch-governance, and deployment configuration before `dev`, `stag`, and `main` can be safely protected and promoted.

## What changes

- Add a single `Quality` GitHub Actions gate backed by `pnpm verify`.
- Add CodeQL as the `Security` gate.
- Add Dependabot and CODEOWNERS.
- Restore safe `stag` to `dev` back-sync through pull requests only.
- Add branch ruleset templates for `dev`, `stag`, and `main`.
- Add Firebase App Hosting runtime configuration for staging and production.
- Remove tracked local pnpm-store artifacts.
- Document the long-lived branch and release flow.

## Non-goals

- Automatically merge back-sync pull requests.
- Store deployment credentials in the repository.
- Force Graphify to block pull requests before its generated artifacts are made deterministic again.
- Enable GitHub repository settings that require administrator-side configuration outside repository files.
