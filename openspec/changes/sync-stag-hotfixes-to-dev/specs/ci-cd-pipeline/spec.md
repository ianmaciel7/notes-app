## MODIFIED Requirements

### Requirement: Pull Request Quality Gates
Pull requests targeting `dev`, `stag`, or `main` SHALL run deterministic quality gates for formatting, linting, complexity, TypeScript checking, tests with coverage, Graphify freshness, and production build validation.

#### Scenario: Pull request validation
- **WHEN** a pull request targets `dev`, `stag`, or `main`
- **THEN** CI SHALL install dependencies with `pnpm install --frozen-lockfile`
- **AND** CI SHALL run formatting, linting, complexity checking, Next.js type generation, TypeScript checking, unit tests, coverage generation, Graphify artifact validation, and production build validation

### Requirement: Branch Protection Source Files
The repository SHALL keep versioned ruleset source files that express the intended protected-branch policy for `dev`, `main`, and `stag`.

#### Scenario: Protected branch rules are reviewed
- **WHEN** branch protection policy changes are reviewed
- **THEN** `.github/rulesets/dev.json`, `.github/rulesets/main.json`, and `.github/rulesets/stag.json` SHALL require pull requests, linear history, non-fast-forward protection, deletion protection, resolved review threads, squash merges, and the aggregate `Quality` check
