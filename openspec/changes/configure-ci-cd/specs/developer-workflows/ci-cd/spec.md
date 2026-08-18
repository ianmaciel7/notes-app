# CI/CD

## ADDED Requirements

### Requirement: Deterministic quality gate
Pull requests targeting `dev`, `stag`, or `main` SHALL run a `Quality` check that installs dependencies with the lockfile frozen and executes the repository verification command.

#### Scenario: Pull request validation
- **WHEN** a pull request targets a long-lived branch
- **THEN** the repository SHALL run `pnpm verify`
- **AND** the check SHALL be reported as `Quality`

### Requirement: Security gate
Pull requests targeting long-lived branches SHALL run CodeQL for JavaScript and TypeScript.

#### Scenario: Security analysis
- **WHEN** a pull request targets `dev`, `stag`, or `main`
- **THEN** CodeQL SHALL analyze the source tree
- **AND** the check SHALL be reported as `Security`

### Requirement: Safe branch promotion
The repository SHALL use `working branch -> dev -> stag -> main` as the long-lived promotion path.

#### Scenario: Hotfix reaches stag first
- **WHEN** `stag` contains non-equivalent patches missing from `dev`
- **THEN** automation SHALL open a pull request from `stag` to `dev`
- **AND** automation SHALL NOT push, force-push, or merge directly into `dev`

### Requirement: Repository hygiene
Local package-manager state SHALL NOT be versioned.

#### Scenario: pnpm local store
- **WHEN** pnpm creates `.pnpm-store`
- **THEN** Git SHALL ignore it

### Requirement: Deployment configuration
The repository SHALL keep staging and production Firebase App Hosting runtime configuration separate.

#### Scenario: Environment-specific rollout
- **WHEN** staging or production is deployed
- **THEN** the hosting backend SHALL consume the corresponding App Hosting configuration
- **AND** credentials SHALL remain outside the repository
