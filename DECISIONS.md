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
| [ADR-0005](#adr-0005-ladle-component-workbench-and-documentation-viewer) | Ladle Component Workbench and Documentation Viewer | Accepted | 2026-09-12 |
| [ADR-0006](#adr-0006-historical-reference-architecture-synthesis-baseline-specifications) | Historical Reference Architecture Synthesis & Baseline Specifications | Accepted | 2026-09-12 |
| [ADR-0007](#adr-0007-blocknote-rich-text-editor-integration-and-ladle-story-workbench) | BlockNote Rich-Text Editor Integration and Ladle Story Workbench | Accepted | 2026-09-12 |

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

---

## ADR-0005: Ladle Component Workbench and Documentation Viewer

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

### Context and Problem Statement

The repository relies on Ladle for fast, zero-config component rendering and documentation visualization. Previously, Ladle served primarily as an interactive viewer for markdown documentation and architectural specs under `docs/`. However, component development and visual testing suffered because isolated UI stories originally located in `.worktrees/old-5` were missing from `src/`.

We needed to establish a unified strategy that supports both interactive architectural documentation rendering and isolated UI component development without overhead or starting a full Next.js server.

### Decision Drivers

* **Dual Functionality**: Serve as both an interactive architectural documentation viewer (`docs/**/*.stories.tsx`) and an isolated UI component workbench (`src/**/*.stories.tsx`).
* **Developer Experience**: Provide near-instant HMR (Hot Module Replacement) powered by Vite without requiring Next.js server startup.
* **Component Isolation**: Restore UI component stories from `.worktrees/old-5` into `src/` to enable isolated visual testing for UI elements (e.g., shadcn components in `src/components/ui/`).
* **Zero-Config Scanning**: Leverage `.ladle/config.mjs` pattern matching (`src/**/*.stories.@(js|jsx|ts|tsx|mdx)` and `docs/**/*.stories.@(js|jsx|ts|tsx|mdx)`) for unified story detection.

### Considered Options

1. **Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories**
2. **Single-purpose Storybook setup for UI components with a separate static documentation generator**
3. **Documentation-only Ladle setup without component stories in `src/`**

### Decision Outcome

Chosen option: **Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories** because Ladle provides extremely fast startup and HMR via Vite, handles both Markdown/MDX specs and React component stories seamlessly, and consolidating component isolation and documentation viewing into a single tool eliminates unnecessary tooling complexity.

#### Positive Consequences

* Restores UI component stories from `.worktrees/old-5` into `src/` (e.g., `src/components/ui/button.stories.tsx`), enabling isolated visual verification.
* Developers can inspect both system architecture diagrams/specs and UI component states within a single Ladle workbench interface.
* Fast Vite-backed build and dev cycles reduce feedback loops during component iteration.

#### Negative Consequences

* Component stories in `src/` must be maintained alongside component code updates.
* Ladle configuration must maintain multi-glob patterns (`src/**` and `docs/**`).

### Pros and Cons of the Options

#### Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories

* Good, because it provides rapid startup and HMR for both documentation and component state testing.
* Good, because it unifies architecture specs and UI component libraries into one viewer.
* Bad, because developers must keep component story files synchronized with component prop changes.

#### Single-purpose Storybook setup for UI components with a separate static documentation generator

* Good, because Storybook has a large plugin ecosystem.
* Bad, because Storybook introduces heavy dependencies, slower build times, and requires managing separate tools for docs vs. components.
* **Rejected because**: The build overhead and complexity conflict with repository performance requirements and lightweight tooling design.

#### Documentation-only Ladle setup without component stories in `src/`

* Good, because fewer story files need maintenance in `src/`.
* Bad, because UI components can only be tested inside full Next.js page layouts, hindering isolated component testing.
* **Rejected because**: Testing components solely in page contexts leads to slower iteration loops and unverified edge states.

---

## ADR-0006: Historical Reference Architecture Synthesis & Baseline Specifications

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

### Context and Problem Statement

The repository contains multiple historical reference implementations in read-only worktrees (`.worktrees/old`, `.worktrees/old-2`, `.worktrees/old-3`, `.worktrees/old-4`, and `.worktrees/old-5`). These worktrees contain evolving iterations of four core architectural sub-systems:
1. **Entity Evolution**: Migration from domain-specific study entities (`StudyGoal`, `Question`, `Flashcard`) to generic `WorkspaceStructure` object models and space-scoped multi-tenant entities (`SpaceEntityRecord`).
2. **Capacities Parity Object Models**: Object studio design with typed property definitions, 13 Capacities-native object presets, icon/tone color system, and Datatable/Gallery/List presentation views.
3. **SRS Burndown Schemas**: Mathematical FSRS spaced repetition engine with retrievability decay math and exam goal pacing burndown calculations (`dailyNewCardQuota`).
4. **Sync Protocol Structures**: Offline-first outbox operation queue (`WorkspaceOperation`), sequence-based push/pull replication (`WorkspaceRemoteChange`, `WorkspaceSyncCursor`), optimistic concurrency control (`WorkspaceConflict`), tombstone tracking (`WorkspaceTombstone`), and media binary sync states.

We needed to synthesize these historical findings into authoritative architecture documentation and establish a formal reference spec in `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` for current and future development.

### Decision Drivers

* **Specification Integrity**: Consolidate dispersed architectural knowledge across historical worktrees into a single, authoritative reference spec.
* **Feature Parity Alignment**: Clarify object studio schemas and Capacities visual parity requirements.
* **Algorithmic Accuracy**: Formally document the exact FSRS memory decay equations and exam goal burndown math.
* **Replication Standards**: Document the offline-first sync outbox pattern, conflict resolution candidates, and tombstone mechanisms.

### Considered Options

1. **Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006**
2. **Leave historical reference code scattered in `.worktrees/` without centralized architectural documentation**
3. **Re-implement features from scratch without documenting historical specifications**

### Decision Outcome

Chosen option: **Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006** because establishing an explicit comparative specification prevents reinventing past designs, ensures mathematical consistency in SRS calculations, and provides clear blueprints for space-scoped entities and sync protocols.

#### Positive Consequences

* Centralizes entity evolution, Capacities object model parity, FSRS math, and sync protocols in [`docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md`](docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md).
* Serves as an unambiguous blueprint for active feature implementation in `src/`.
* Synchronizes architecture specs and decision logs across `DECISIONS.md`, `docs/decisions/README.md`, and `ARCHITECTURE.md`.

#### Negative Consequences

* Documentation must be updated if future sync protocol payloads or FSRS default parameters are modified.

### Pros and Cons of the Options

#### Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006

* Good, because it provides clear mathematical and structural specifications derived from empirically validated reference code.
* Good, because it aligns AI agents and developers on established system invariants.
* Bad, because maintaining documentation requires synchronization when schemas change.

#### Leave historical reference code scattered in `.worktrees/` without centralized architectural documentation

* Good, requires zero immediate documentation writing.
* Bad, leads to lost context, inconsistent algorithms, and duplicated work across worktrees.
* **Rejected because**: Relying on unindexed worktree code creates friction and risks regressions.

#### Re-implement features from scratch without documenting historical specifications

* Good, gives total freedom to redesign models arbitrarily.
* Bad, discards proven FSRS pacing math, offline sync outbox designs, and Capacities parity contracts.
* **Rejected because**: Abandoning validated worktree implementations increases bug risk and breaks visual/functional parity.

---

## ADR-0007: BlockNote Rich-Text Editor Integration and Ladle Story Workbench

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

### Context and Problem Statement

In `notes-app`, achieving feature parity with modern block-oriented knowledge management tools (specifically Capacities-like object and block interaction models, as synthesized from the historical reference codebase in `.worktrees/old-5`) requires a modular, rich-text block editor. Users require intuitive Notion/Capacities-style block manipulation, including headings, paragraphs, bullet and numbered lists, callouts, block drag-and-drop handles, inline formatting, slash command menus, floating formatting toolbars, and custom object embed blocks.

At the same time, the technical environment imposes explicit architectural constraints:
1. **React 19 & Next.js 16 Compatibility**: The editor must run smoothly inside the Next.js 16 App Router. Rich-text editors rely heavily on browser DOM APIs (`window`, `document`, DOM selection APIs, contentEditable), which fail during Server-Side Rendering (SSR). They require dynamic client-side loading with `ssr: false` or strict client component boundaries (`"use client"`).
2. **Design System & Styling Alignment**: The editor must seamlessly integrate with our shadcn/ui component library, Base UI primitives, and Tailwind CSS v4 design tokens (`@blocknote/shadcn`, `@source "../../node_modules/@blocknote/shadcn"`).
3. **Isolated Workbench & Visual Verification**: Under ADR-0005, all core UI components and documentation are verified in isolation using Ladle without the startup latency or routing constraints of the Next.js server. The editor must be renderable and testable in Ladle stories with mock states, slash menu interactions, and dark/light mode themes.

### Decision Drivers

* **Block-Based Hierarchy**: Native block schema (blocks as first-class JSON entities with IDs, types, content, and props) allowing modular block manipulation, drag-and-drop reordering, and bi-directional serialization compatible with space-scoped entity schemas.
* **ProseMirror Foundation & Reliability**: Powered by ProseMirror/TipTap under the hood, ensuring rock-solid collaborative text editing primitives, robust transaction undo/redo history, and cross-browser selection handling.
* **First-Class shadcn/ui & Tailwind v4 Theme Integration**: Support for `@blocknote/shadcn` providing pre-built, themeable slash menus, formatting toolbars, side menus, and suggestion items that conform directly to the application's CSS design tokens.
* **Isolated Story Workbench (Ladle)**: The ability to develop, stress test, and visually inspect editor states, custom block extensions, and slash commands inside Ladle stories without Next.js server overhead.
* **Clean SSR Isolation**: Predictable client component boundaries using dynamic imports (`next/dynamic` with `ssr: false`) and Next.js 16 / React 19 client lifecycle hooks.

### Considered Options

1. **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench**
2. **Custom TipTap / Slate / Plate Framework**
3. **Lexical (`@lexical/react`)**

### Decision Outcome

Chosen option: **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench**.

BlockNote provides an optimal balance between high-level block abstractions and low-level extensibility:
* It abstracts ProseMirror's complex transaction and schema APIs into an intuitive block tree model (`editor.document`, `editor.insertBlocks`, `editor.updateBlock`).
* The `@blocknote/shadcn` package cleanly aligns with our design system tokens and Tailwind CSS v4 configuration (`@source "../../node_modules/@blocknote/shadcn"` in `globals.css`).
* Next.js 16 SSR hazards are resolved cleanly by encapsulating the editor in a client component loaded via dynamic import (`dynamic(() => import('./blocknote-editor'), { ssr: false })`).
* Visual testing and interaction design are accelerated by creating dedicated Ladle stories to verify block manipulation, theme switching, and slash menu interactions independently.

#### Positive Consequences

* **Accelerated Development**: Out-of-the-box slash commands (`/heading`, `/bullet`, `/code`, `/table`), floating formatting bars, drag handles, and block nesting eliminate hundreds of hours of custom editor development.
* **Design Consistency**: Standardizes the editor UI on shadcn primitives (menus, dialogs, tooltips, popovers) and Tailwind v4 theme variables in both light and dark modes.
* **Capacities-Like Parity**: Directly addresses the block editing requirements established in historical reference `.worktrees/old-5`, enabling custom blocks (e.g. object mentions, flashcard embeds, database queries) via BlockNote's custom schema API.
* **Zero-Friction Visual Testing**: Ladle stories allow rapid testing of editor variants, readonly states, initial document states, and theme changes with instant Vite HMR.
* **Clean Architectural Boundaries**: Pure client-side dynamic loading protects Next.js 16 Server Components from DOM-dependent ProseMirror/BlockNote crashes during SSR.

#### Negative Consequences

* **Bundle Size**: BlockNote packages (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) bring ProseMirror dependencies into client bundles; dynamic code-splitting is mandatory to avoid increasing initial page load size.
* **Abstraction Constraints**: Customizing core ProseMirror schema rules or lower-level DOM events requires working through BlockNote's plugin and block specification APIs rather than raw ProseMirror transforms.
* **SSR Incompatibility**: The editor cannot render full static HTML directly on the server without headless parser utilities; fallback skeleton or placeholder loaders must be provided during dynamic mounting.

### Pros and Cons of the Options

#### BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench

* Good, because it provides a native block model, slash menu, drag-and-drop handles, and block schema out of the box.
* Good, because `@blocknote/shadcn` seamlessly adopts our theme variables and Tailwind CSS v4 styles.
* Good, because it isolates cleanly into Ladle stories for rapid UI iteration without Next.js server overhead.
* Bad, because ProseMirror dependencies contribute significant bundle weight.
* Bad, because advanced custom block layouts must conform to BlockNote's custom block specification API.

#### Custom TipTap / Slate / Plate Framework

* Good, because it provides lower-level control over every editor node, command, and schema definition.
* Bad, because building robust block-level Notion-style interactions (side drag handles, multi-block selection, hierarchical nesting, slash command menus) requires large amounts of complex bespoke code.
* Bad, because maintaining custom block selection and drag-drop logic creates a substantial maintenance burden.
* **Rejected because**: Building a block engine from scratch duplicates substantial engineering effort already solved by BlockNote and slows feature delivery for Capacities parity.

#### Lexical (`@lexical/react`)

* Good, because it is maintained by Meta with high performance and strong typing.
* Bad, because Lexical is fundamentally a document tree editor rather than an opinionated block editor; turning it into a Capacities/Notion-like block editor requires custom node transforms, decorator blocks, and custom UI for slash commands and side handles.
* Bad, because historical prototyping in `.worktrees/old-5` showed high complexity when attempting to wire Lexical nodes into modular space-scoped entity cards and block menus.
* **Rejected because**: Lexical requires excessive boilerplate and custom plugin engineering to achieve block-based UI parity compared to BlockNote.
