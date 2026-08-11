## MODIFIED Requirements

### Requirement: Canonical Verification Command
The repository SHALL provide a single canonical local verification command that exercises formatting, linting, Next.js route type generation, TypeScript checking, automated tests, coverage signal generation, and production build validation.

#### Scenario: Local completion verification
- **WHEN** an agent or contributor needs completion evidence for ordinary code changes
- **THEN** they SHALL run `pnpm verify`
- **AND** the command SHALL execute formatting, linting, `next typegen`, `tsc --noEmit`, Vitest tests with coverage, and `next build`

#### Scenario: Narrow verification during diagnosis
- **WHEN** a verification failure is being diagnosed
- **THEN** the agent or contributor MAY run the narrowest relevant command first
- **AND** they SHALL rerun the broader verification command before claiming completion when the change warrants repository-level evidence

### Requirement: CI Verification Alignment
Continuous integration SHALL preserve local command alignment while exposing high-signal job names for pull request review and branch protection.

#### Scenario: Pull request quality check
- **WHEN** CI validates a pull request or protected branch update
- **THEN** CI SHALL run the same commands exposed through package scripts
- **AND** the aggregate `Quality` check SHALL depend on formatting, linting, type checking, tests, coverage, and build jobs
- **AND** protected branch rules SHALL prefer the aggregate `Quality` check over redundant individual CI job requirements
- **AND** contributors SHALL NOT replace required check contexts without updating branch protection intentionally
