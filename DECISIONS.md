# Architectural Decision Log (MADR)

> **Note**: Architectural Decision Records (ADRs) are organized under [`docs/decisions/`](docs/decisions/README.md).

All architectural decisions for `notes-app` are documented here using the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) format.

---

## Index of Architectural Decision Records (ADRs)

| ID | Title | Status | Date |
| --- | --- | --- | --- |
| [ADR-0001](#adr-0001-nextjs-16-react-19-app-router-baseline) | Next.js 16 + React 19 App Router Baseline | Accepted | 2026-09-11 |
| [ADR-0002](#adr-0002-biome-as-unified-linter-formatter) | Biome as Unified Linter & Formatter | Accepted | 2026-09-11 |
| [ADR-0003](#adr-0003-automated-knowledge-graph-updates-via-husky) | Automated Knowledge Graph Updates via Husky | Accepted | 2026-09-11 |
| [ADR-0004](#adr-0004-strict-path-configuration-portability-rule) | Strict Path & Configuration Portability Rule | Accepted | 2026-09-11 |

---

## ADR-0001: Next.js 16 + React 19 App Router Baseline

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

### Context and Problem Statement

`notes-app` requires a modern, performant, local-first full-stack web framework capable of handling rich note editing, graph visualization, document reading, and server-side API proxying (AI gateways, parsing).

### Decision Drivers

* Support for React 19 Server Components and App Router navigation.
* First-class TypeScript integration and Tailwind CSS v4 styling support.
* Fast build times and Turbopack support.

### Considered Options

1. **Next.js 16 (App Router)** + React 19 + Tailwind CSS v4
2. Vite + React 19 SPA with separate Node.js backend
3. Next.js Pages Router (legacy)

### Decision Outcome

Chosen option: **Next.js 16 (App Router)** because it provides full-stack Route Handlers for AI/parsing gateways, Server Components for high-performance rendering, and seamless compatibility with Tailwind CSS v4.

#### Positive Consequences

* Clean separation between client components (Dexie offline database) and server handlers.
* First-class route generation and Turbopack build speed.

#### Negative Consequences

* React 19 breaking changes require careful type validation in layout props.

---

## ADR-0002: Biome as Unified Linter & Formatter

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

### Context and Problem Statement

The initial project template included ESLint and Prettier setups, which introduced slower linting execution and duplicate configuration overhead across the repository.

### Decision Drivers

* Execution speed for developer feedback loops and git pre-commit hooks.
* Single tool replacing ESLint, Prettier, and import sorting.
* Native support for TypeScript and Tailwind CSS v4 directives.

### Considered Options

1. **Biome** (`@biomejs/biome`) 2.5
2. ESLint 9 + Prettier
3. Oxlint

### Decision Outcome

Chosen option: **Biome** (`@biomejs/biome`) because it executes in ~50ms across the workspace, provides recommended linting presets out of the box, and handles formatting and CSS parser rules cleanly via `biome.json`.

#### Positive Consequences

* Ultra-fast `pnpm run check` execution (sub-100ms).
* Zero configuration friction between linting and formatting rules.
* Single `biome.json` configuration file.

#### Negative Consequences

* Requires disabling default ESLint plugins in IDE extensions.

---

## ADR-0003: Automated Knowledge Graph Updates via Husky

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

### Context and Problem Statement

The repository relies on `graphify` (`graphify-out/graph.json`) to maintain a structural AST knowledge graph. Manual updates by developers lead to stale graph data over time.

### Decision Drivers

* Keep `graphify-out/graph.json` continuously synchronized after code modifications.
* Zero token cost (AST-only update).
* Non-blocking git hook workflows.

### Considered Options

1. **Husky v9 git hooks** (`post-commit`, `post-merge`, `pre-commit`, `pre-push`)
2. Manual developer execution of `graphify update .`
3. CI-only graph rebuilds

### Decision Outcome

Chosen option: **Husky v9 git hooks** because `post-commit` and `post-merge` automatically run `graphify update .` to update the AST graph locally, while `pre-commit` runs Biome staged checks and `pre-push` runs typechecking.

#### Positive Consequences

* The knowledge graph is always current after developer commits and pulls.
* Code quality errors are caught before pushing code to remote branches.

#### Negative Consequences

* Commits take an additional 1-2 seconds for AST extraction.

---

## ADR-0004: Strict Path & Configuration Portability Rule

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

### Context and Problem Statement

Configuration files such as `.codex/hooks.json` previously contained hardcoded absolute user paths (e.g., `C:/Users/<username>/...`), breaking cross-machine portability and CI environments.

### Decision Drivers

* Repository must build and run seamlessly across different developer environments (Windows, macOS, Linux, CI).
* No user-specific system paths in committed configurations.

### Considered Options

1. **Relative paths & portable command names** in all configuration files + explicit agent rule enforcement in `AGENTS.md` & `.agents/rules/portable-paths.md`.
2. Absolute path resolution scripts.

### Decision Outcome

Chosen option: **Relative paths & portable command names** (e.g., `graphify hook-check`) because it ensures 100% portability across all operating systems and user setups.

#### Positive Consequences

* Configuration files can be committed safely without user environment conflicts.
* Enforced across AI agents via `.agents/rules/portable-paths.md`.

#### Negative Consequences

* CLI commands must be present in the user's environment `PATH` or invoked relatively.
