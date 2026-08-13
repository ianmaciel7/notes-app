## Why

The repository already uses Biome as its formatter, linter, import organizer, and static-analysis tool, but the configuration should be aligned with the installed Biome version and the repository's current Next.js, React, TypeScript, Tailwind CSS, pnpm, and CI setup.

The current baseline splits Biome CI behavior across narrower scripts and excludes generated folders with regular negated includes instead of scanner-level ignores. This creates unnecessary drift between local checks, CI checks, and current Biome guidance. The installed `@biomejs/biome@2.4.2` schema rejects `linter.rules.preset`, so this change preserves the installed-version-compatible `linter.rules.recommended` key.

## What Changes

- Keep `biome.json` on the installed-version-compatible recommended lint preset shape.
- Keep stable React and Next.js domains enabled.
- Keep Tailwind CSS v4 directive parsing and explicitly enable CSS formatting.
- Keep generated and dependency directories out of Biome's scanner.
- Use Biome Assist recommended actions instead of manually enabling only import organization.
- Add Biome scripts for full CI validation, safe write fixes, staged checks, and changed-file checks.
- Update CI and `pnpm verify` to use the repository-local `biome ci .` path.
- Document the final Biome workflow in contributor guidance.

## Capabilities

### New Capabilities

- `biome-governance`: Defines repository requirements for Biome configuration, local commands, generated-file scanning, and CI validation.

## Non-Goals

- Enable nursery or experimental rules.
- Add ESLint, Prettier, lint-staged, or another import sorter.
- Enable Tailwind class sorting as a required CI error.
- Remove TypeScript, tests, build, or Graphify validation.
- Add editor settings when the repository does not currently version editor-specific configuration.
