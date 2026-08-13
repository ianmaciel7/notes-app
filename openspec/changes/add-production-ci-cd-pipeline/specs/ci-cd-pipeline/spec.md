## ADDED Requirements

### Requirement: Pull Request Quality Gates
Pull requests targeting `stag` or `main` SHALL run deterministic quality gates for formatting, linting, TypeScript checking, tests with coverage, Graphify freshness, and production build validation.

#### Scenario: Pull request validation
- **WHEN** a pull request targets `stag` or `main`
- **THEN** CI SHALL install dependencies with `pnpm install --frozen-lockfile`
- **AND** CI SHALL run formatting, linting, Next.js type generation, TypeScript checking, unit tests, coverage generation, Graphify artifact validation, and production build validation

#### Scenario: Required status context stability
- **WHEN** branch protection requires stable check names
- **THEN** CI SHALL preserve an aggregate `Quality` check
- **AND** individual job names SHALL still make failures easy to identify

#### Scenario: Graphify freshness validation
- **WHEN** CI runs Graphify validation
- **THEN** it SHALL validate that committed Graphify artifacts are fresh for the source tree
- **AND** it SHALL reject empty, missing, machine-specific, or secret-like Graphify artifacts

### Requirement: Security Validation
The repository SHALL use GitHub-native security checks where they provide high signal with low maintenance overhead and are supported by current repository settings.

#### Scenario: Code scanning
- **WHEN** a pull request targets `stag` or `main`, or a scheduled/manual security scan runs
- **THEN** CodeQL SHALL analyze JavaScript and TypeScript sources
- **AND** the workflow SHALL use least-privilege permissions required for code scanning upload

#### Scenario: Code scanning branch gate promotion
- **WHEN** repository code scanning support has been confirmed stable
- **THEN** the aggregate `Security` check SHOULD be promoted to a required protected-branch check

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
- **THEN** CI SHALL not imply that validation success proves deployment success

#### Scenario: Hosting run configuration exists
- **WHEN** Firebase App Hosting run configuration is committed
- **THEN** `apphosting.yaml` and `apphosting.staging.yaml` SHALL define explicit `runConfig` values for CPU, memory, instance bounds, and concurrency
- **AND** documentation SHALL distinguish run configuration from an automated deployment trigger

#### Scenario: Page test harness runs
- **WHEN** CI runs the Tests job
- **THEN** Vitest SHALL use `vitest.config.mts` and `vitest.setup.ts`
- **AND** `__tests__/page.test.tsx` SHALL render the current app page and assert its observable links and heading

### Requirement: Branch Protection Source Files
The repository SHALL keep versioned ruleset source files that express the intended protected-branch policy for `main` and `stag`.

#### Scenario: Protected branch rules are reviewed
- **WHEN** branch protection policy changes are reviewed
- **THEN** `.github/rulesets/main.json` and `.github/rulesets/stag.json` SHALL require pull requests, linear history, non-fast-forward protection, deletion protection, resolved review threads, squash merges, and the aggregate `Quality` check

#### Scenario: Cloud deployment is added
- **WHEN** GitHub Actions deploys to Firebase, GCP, or another cloud provider
- **THEN** it SHALL prefer OIDC or workload identity federation over long-lived service-account JSON credentials
- **AND** it SHALL include smoke or health verification appropriate to the deployed application
