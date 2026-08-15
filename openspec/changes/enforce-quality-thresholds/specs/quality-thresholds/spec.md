## ADDED Requirements

### Requirement: Coverage Thresholds
The repository SHALL enforce minimum Vitest coverage thresholds for application source.

#### Scenario: Coverage tests run
- **WHEN** `pnpm test:coverage` runs
- **THEN** it SHALL fail below 80% statements
- **AND** it SHALL fail below 80% lines
- **AND** it SHALL fail below 80% functions
- **AND** it SHALL fail below 70% branches

### Requirement: Function Complexity Gate
Application source SHALL keep individual functions below the configured complexity limits.

#### Scenario: Cyclomatic complexity is checked
- **WHEN** `pnpm complexity` runs
- **THEN** it SHALL scan application source under `src/`
- **AND** it SHALL fail when any function has cyclomatic complexity greater than 10
- **AND** it SHALL report the file, line, function name, observed complexity, and maximum allowed complexity

#### Scenario: Cognitive complexity is checked
- **WHEN** `pnpm biome:ci` runs
- **THEN** Biome SHALL fail when a function exceeds cognitive complexity 15

### Requirement: CI Quality Gate Includes Complexity
The aggregate CI quality gate SHALL include complexity validation.

#### Scenario: Pull request CI runs
- **WHEN** CI evaluates a pull request into `stag` or `main`
- **THEN** it SHALL run a `Complexity` job
- **AND** the aggregate `Quality` job SHALL fail if `Complexity` does not succeed

### Requirement: Agent Validation Hook Source
The repository SHALL keep shared agent hook intent in Lefthook configuration.

#### Scenario: Agent hook tooling is installed
- **WHEN** dependencies are installed with pnpm
- **THEN** the repository SHALL install Lefthook as a project dev dependency
- **AND** pnpm SHALL explicitly allow Lefthook's build script
- **AND** the repository SHALL expose commands to install and run the shared agent validation hook

#### Scenario: Agent hooks are installed locally
- **WHEN** a developer runs `pnpm agent-hooks:install`
- **THEN** Lefthook SHALL generate provider-specific agent hook files from `lefthook.yml`
- **AND** the Codex and Claude Stop event SHALL invoke the shared agent validation hook
- **AND** generated local hook files SHALL not replace the committed `lefthook.yml` source of truth
