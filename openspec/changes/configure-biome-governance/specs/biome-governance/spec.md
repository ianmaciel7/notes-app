## ADDED Requirements

### Requirement: Biome Configuration Baseline
The repository SHALL keep Biome configured as the primary formatter, linter, import organizer, and static-analysis tool.

#### Scenario: Biome configuration is reviewed
- **WHEN** `biome.json` is changed
- **THEN** it SHALL target the installed Biome schema version
- **AND** it SHALL use Biome's stable recommended lint preset in the shape accepted by the installed Biome version
- **AND** it SHALL enable stable React and Next.js domains for the current application
- **AND** it SHALL avoid repository-wide line-ending rewrites for existing files
- **AND** it SHALL avoid `preset: "all"` and broad nursery activation

#### Scenario: Tailwind CSS is parsed
- **WHEN** Biome parses project CSS
- **THEN** it SHALL support Tailwind CSS directive syntax
- **AND** it SHALL not enable Tailwind nursery-only rules as required CI errors

### Requirement: Generated File Scanning
Biome SHALL avoid scanning generated, dependency, cache, coverage, and build-output directories.

#### Scenario: Biome runs locally or in CI
- **WHEN** Biome scans repository files
- **THEN** dependency, build-output, generated, coverage, and cache folders SHALL be scanner-ignored instead of merely lint-suppressed
- **AND** legitimate source files SHALL remain included

### Requirement: Deterministic Biome Commands
The repository SHALL expose deterministic local and CI commands that use the repository-local Biome dependency.

#### Scenario: CI validates Biome
- **WHEN** CI validates formatting, linting, and Assist actions
- **THEN** it SHALL run `pnpm biome:ci`
- **AND** `pnpm biome:ci` SHALL invoke `biome ci .`
- **AND** CI SHALL not run write or unsafe-fix commands

#### Scenario: Developer fixes safe Biome issues
- **WHEN** a developer wants Biome to apply safe fixes
- **THEN** the repository SHALL provide a script that uses Biome's write mode
- **AND** unsafe fixes SHALL require separate deliberate action outside CI
