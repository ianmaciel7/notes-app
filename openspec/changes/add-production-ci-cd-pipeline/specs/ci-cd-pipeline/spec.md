## ADDED Requirements

### Requirement: Pull Request Quality Gates
Pull requests targeting `staging` or `main` SHALL run deterministic quality gates for formatting, linting, TypeScript checking, tests, coverage signal, and production build.

#### Scenario: Pull request validation
- **WHEN** a pull request targets `staging` or `main`
- **THEN** CI SHALL install dependencies with `pnpm install --frozen-lockfile`
- **AND** CI SHALL run formatting, linting, Next.js type generation, TypeScript checking, unit tests, coverage generation, and production build validation

#### Scenario: Required status context stability
- **WHEN** branch protection requires stable check names
- **THEN** CI SHALL preserve an aggregate `Quality` check
- **AND** individual job names SHALL still make failures easy to identify

### Requirement: Security Validation
The repository SHALL use GitHub-native security checks where they provide high signal with low maintenance overhead and are supported by current repository settings.

#### Scenario: Code scanning
- **WHEN** a pull request targets `staging` or `main`, or a scheduled/manual security scan runs
- **THEN** CodeQL SHALL analyze JavaScript and TypeScript sources
- **AND** the workflow SHALL use least-privilege permissions required for code scanning upload

#### Scenario: Code scanning is not yet confirmed as a required branch gate
- **WHEN** repository code scanning support has not been confirmed stable
- **THEN** versioned branch rulesets SHALL NOT require the aggregate `Security` check
- **AND** documentation SHALL identify `Security` as a candidate required check after CodeQL upload behavior is confirmed

#### Scenario: Dependency review prerequisites are missing
- **WHEN** GitHub Dependency Graph is not enabled for the repository
- **THEN** the repository SHALL document Dependency Review as a recommended next control
- **AND** CI SHALL NOT include a permanently failing Dependency Review job

#### Scenario: Dependency review prerequisites are enabled
- **WHEN** GitHub Dependency Graph and Dependabot alerts are enabled for the repository
- **THEN** Dependency Review SHOULD be added as a pull request check
- **AND** it SHOULD fail for newly introduced high or critical vulnerabilities
- **AND** it SHOULD avoid license policy blocking until the project defines an explicit license policy

### Requirement: Dependency Maintenance
The repository SHALL keep dependency and GitHub Action update automation configured through Dependabot.

#### Scenario: Scheduled dependency updates
- **WHEN** Dependabot runs on its schedule
- **THEN** it SHALL check npm/pnpm manifests and GitHub Actions workflow references
- **AND** it SHALL open bounded pull requests rather than silently changing the lockfile

### Requirement: Deployment Boundary
CI validation and deployment responsibilities SHALL remain separate until a deployment trigger and authentication model are explicitly configured.

#### Scenario: Deployment workflow is absent
- **WHEN** no repository deployment workflow exists
- **THEN** documentation SHALL describe the intended staging and production flow
- **AND** it SHALL not imply that CI success alone proves deployment success

#### Scenario: Cloud deployment is added
- **WHEN** GitHub Actions deploys to Firebase, GCP, or another cloud provider
- **THEN** it SHALL prefer OIDC or workload identity federation over long-lived service-account JSON credentials
- **AND** it SHALL include smoke or health verification appropriate to the deployed application
