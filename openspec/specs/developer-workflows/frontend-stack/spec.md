## Purpose

This capability defines a standardized workflow for bootstrapping a modern Next.js
frontend with consistent defaults for TypeScript, App Router, Tailwind, pnpm,
ESLint, shadcn/ui, and quality checks so projects start from a reproducible,
team-wide baseline.

## Requirements

### Requirement: Frontend stack bootstrap command contract
The system SHALL include next-intl internationalization baseline as part of the Next.js bootstrap so the app ships with a locale-aware routing and message-loading flow.

#### Scenario: Deterministic project initialization
- **WHEN** a contributor runs the documented bootstrap commands
- **THEN** the created project SHALL include a working Next.js App Router template
  configured with TypeScript and Tailwind
- **AND** package manager metadata and lint configuration SHALL match a standard
  baseline
- **AND** `shadcn/ui` SHALL be initialized using the Next.js template.

#### Scenario: Locale-aware bootstrap is available by default
- **WHEN** a contributor runs the project and opens the app
- **THEN** the application SHALL expose locale-scoped routes using one of the configured locales
- **AND** the default locale SHALL resolve to English (`en`) when the root URL is requested
- **AND** translation loading SHALL come from typed, locale-keyed message files.

#### Scenario: Unsupported locales are rejected
- **WHEN** a request is made with an unsupported locale
- **THEN** the application SHALL return a 404-style locale miss response and not silently render fallback content from an unsupported locale.

#### Scenario: I18n setup is visible in contributor workflow
- **WHEN** a contributor follows the bootstrap documentation
- **THEN** it SHALL describe locale bootstrap commands and files required to enable next-intl correctly in this repository.

### Requirement: Quality tooling alignment
The system SHALL require Biome and ESLint quality gates to be available after
bootstrap.

#### Scenario: Quality checks are runnable
- **WHEN** setup is complete
- **THEN** `pnpm run lint` and `pnpm run typecheck` SHALL be executable without
  missing configuration errors.
- **AND** `pnpm dlx @biomejs/biome@latest init` SHALL be available for
  formatting and diagnostics alignment.

### Requirement: Contributor documentation for startup and recovery
The system SHALL include clear terminal-first documentation covering create, verify,
and recovery commands, including how to proceed when dependency initialization
conflicts with existing files.

#### Scenario: Contributor guidance is present
- **WHEN** a contributor opens the bootstrap guidance
- **THEN** it SHALL list command sequence, required flags, expected outputs, and
  recovery actions for conflicting directories.
