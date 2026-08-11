## Purpose

Define the repository contract for local verification, CI alignment, automated tests, deterministic formatting, and risk-proportional completion evidence.

## Requirements

### Requirement: Canonical Verification Command
The repository SHALL provide a single canonical local verification command that exercises linting, Next.js route type generation, TypeScript checking, automated tests, and production build validation.

#### Scenario: Local completion verification
- **WHEN** an agent or contributor needs completion evidence for ordinary code changes
- **THEN** they SHALL run `pnpm verify`
- **AND** the command SHALL execute linting, `next typegen`, `tsc --noEmit`, Vitest tests, and `next build`

#### Scenario: Narrow verification during diagnosis
- **WHEN** a verification failure is being diagnosed
- **THEN** the agent or contributor MAY run the narrowest relevant command first
- **AND** they SHALL rerun the broader verification command before claiming completion when the change warrants repository-level evidence

### Requirement: Automated Component Test Coverage
The repository SHALL include a configured test command for unit or component tests and at least one real test covering current observable App Router UI behavior.

#### Scenario: Home page renders expected default content
- **WHEN** the home page component is rendered in the test environment
- **THEN** the test SHALL verify the default Next.js starter content and primary documentation/deployment links

### Requirement: CI Verification Alignment
Continuous integration SHALL use the same canonical verification command as local completion evidence while preserving the required protected-branch check context.

#### Scenario: Pull request quality check
- **WHEN** CI validates a pull request or protected branch update
- **THEN** the `Quality` check SHALL run `pnpm verify`
- **AND** contributors SHALL NOT replace that check context without updating branch protection intentionally

### Requirement: Deterministic Text Formatting
The repository SHALL normalize text files so formatting checks behave consistently across Windows and Linux checkouts.

#### Scenario: Cross-platform checkout
- **WHEN** files are checked out or edited on supported development environments
- **THEN** repository text normalization SHALL prevent line-ending drift from causing unrelated formatting failures

### Requirement: Risk-Proportional Verification
The repository SHALL document when lightweight component tests are sufficient and when heavier verification such as E2E tests or harness evals should be introduced.

#### Scenario: Contributor finishes work
- **WHEN** a contributor or agent reports a task as complete
- **THEN** the report SHALL name the relevant verification evidence, such as lint, typecheck, tests, build, screenshots, browser checks, OpenSpec acceptance criteria, or security review as appropriate

#### Scenario: Higher-risk workflow change
- **WHEN** a change introduces auth, persistence, critical navigation, mutation workflows, external integration behavior, or comparable user-visible risk
- **THEN** verification planning SHALL consider broader automated coverage beyond the current component-level test

### Requirement: E2E Deferral
The repository SHALL avoid adding E2E infrastructure until critical user flows exist that justify the maintenance cost.

#### Scenario: Product behavior gains critical flows
- **WHEN** the app adds authentication, persistent note creation or editing, important navigation, deployment smoke checks, or another critical user flow
- **THEN** E2E coverage such as Playwright SHALL be reconsidered and documented before being added
