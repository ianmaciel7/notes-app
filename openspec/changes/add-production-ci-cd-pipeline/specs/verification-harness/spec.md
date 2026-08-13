## MODIFIED Requirements

### Requirement: Local Verification Command
The repository SHALL expose one canonical local verification command that mirrors the required CI gates available on the current baseline.

#### Scenario: Developer runs local verification
- **WHEN** a developer runs `pnpm verify`
- **THEN** the command SHALL run format checking, linting, Next.js type generation, TypeScript checking, coverage tests, Graphify artifact validation, and production build validation
- **AND** it SHALL fail if any required local gate fails

#### Scenario: Developer runs page tests
- **WHEN** a developer runs `pnpm test` or `pnpm test:coverage`
- **THEN** Vitest SHALL load the React Testing Library setup file
- **AND** the page test SHALL validate the current page without depending on old-branch-only workspace UI
