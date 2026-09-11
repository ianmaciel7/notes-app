# ADR-0002: Biome as Unified Linter & Formatter

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

## Context and Problem Statement

The initial project template included ESLint and Prettier setups, which introduced slower linting execution and duplicate configuration overhead across the repository.

## Decision Drivers

* Execution speed for developer feedback loops and git pre-commit hooks.
* Single tool replacing ESLint, Prettier, and import sorting.
* Native support for TypeScript and Tailwind CSS v4 directives.

## Considered Options

1. **Biome** (`@biomejs/biome`) 2.5
2. ESLint 9 + Prettier
3. Oxlint

## Decision Outcome

Chosen option: **Biome** (`@biomejs/biome`) because it executes in ~50ms across the workspace, provides recommended linting presets out of the box, and handles formatting and CSS parser rules cleanly via `biome.json`.

### Positive Consequences

* Ultra-fast `pnpm run check` execution (sub-100ms).
* Zero configuration friction between linting and formatting rules.
* Single `biome.json` configuration file.

### Negative Consequences

* Requires disabling default ESLint plugins in IDE extensions.
