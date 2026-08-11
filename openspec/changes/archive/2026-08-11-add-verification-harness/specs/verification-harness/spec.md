## ADDED Requirements

### Requirement: Canonical verification command

The repository SHALL provide one canonical local verification command that runs the checks required to consider ordinary changes healthy.

#### Scenario: Human or agent verifies a change

- **WHEN** a contributor runs the canonical verification command
- **THEN** linting, Next.js type generation, TypeScript checking, tests, and the production build are executed in one deterministic sequence

### Requirement: CI uses canonical verification

The pull request CI workflow SHALL use the same canonical verification command as local development while preserving the required `Quality` check name.

#### Scenario: Pull request targets a protected branch

- **WHEN** a pull request targets `main` or `staging`
- **THEN** the `Quality` job runs the canonical verification command after installing dependencies

### Requirement: Automated component testing

The repository SHALL include a configured test command for unit or component tests and at least one real test covering current observable UI behavior.

#### Scenario: Current home page behavior is tested

- **WHEN** the test command runs
- **THEN** it verifies that the notes workspace page renders its primary heading, navigation, note cards, workspace landmark, and progress statuses

### Requirement: Risk-proportional evidence

The repository SHALL document that completion requires task-appropriate evidence, not only an agent assertion.

#### Scenario: Contributor finishes work

- **WHEN** a contributor reports a task as complete
- **THEN** the report names the relevant verification evidence, such as lint, typecheck, tests, build, screenshots, browser checks, OpenSpec acceptance criteria, or security review as appropriate

### Requirement: E2E remains deferred until justified

The repository SHALL avoid adding E2E infrastructure until critical user flows exist that justify the maintenance cost.

#### Scenario: Product behavior gains critical flows

- **WHEN** the app adds authentication, persistent note creation or editing, important navigation, deployment smoke checks, or another critical user flow
- **THEN** E2E coverage such as Playwright is reconsidered and documented before being added

### Requirement: Cross-platform text normalization

The repository SHALL define line-ending behavior so local formatting checks do not fail solely because of Windows or Linux checkout defaults.

#### Scenario: Contributor runs lint on a supported checkout

- **WHEN** repository text files are checked out according to the repository policy
- **THEN** formatting checks use deterministic line endings across local and CI environments
