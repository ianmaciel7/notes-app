## Why

The repository currently has a useful single `Quality` CI job, but it does not expose separate failure signals for formatting, linting, type checking, tests, coverage, build, or security review. It also lacks repository-level dependency update configuration and documented CI/CD security boundaries.

## What Changes

- Split pull request CI into clear correctness gates while preserving a stable aggregate `Quality` check.
- Add a coverage command as a regression signal without introducing arbitrary percentage gates.
- Add GitHub-native CodeQL security scanning.
- Add Dependabot configuration for npm/pnpm dependencies and GitHub Actions.
- Add CODEOWNERS coverage for CI/CD, security, deployment, and dependency control files.
- Update branch ruleset source files to preserve a stable aggregate required check while documenting when to promote security checks to required.
- Document the resulting CI/CD model, local commands, deployment boundaries, secret scanning expectations, and rollback guidance.

## Capabilities

### New Capabilities

- `ci-cd-pipeline`: Defines pull request CI, security checks, supply-chain maintenance, branch protection expectations, and deployment boundaries.

### Modified Capabilities

- `verification-harness`: Adds coverage and split CI checks while keeping `pnpm verify` as the canonical local completion command.

## Non-Goals

- Add Playwright before critical browser workflows exist.
- Add SonarCloud, Lighthouse, DAST, SBOM, artifact attestations, container scanning, or canary deployment without a concrete platform need.
- Require CodeQL as a protected-branch gate before code scanning availability is confirmed for the repository.
- Add Dependency Review before Dependency Graph support is enabled for the repository.
- Add deployment workflows before the Firebase/App Hosting trigger and required OIDC identity are verified.
