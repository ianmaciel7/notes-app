# ADR-0005: Ladle Component Workbench and Documentation Viewer

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

## Context and Problem Statement

The repository relies on Ladle for fast, zero-config component rendering and documentation visualization. Previously, Ladle served primarily as an interactive viewer for markdown documentation and architectural specs under `docs/`. However, component development and visual testing suffered because isolated UI stories originally located in `.worktrees/old-5` were missing from `src/`.

We needed to establish a unified strategy that supports both interactive architectural documentation rendering and isolated UI component development without overhead or starting a full Next.js server.

## Decision Drivers

* **Dual Functionality**: Serve as both an interactive architectural documentation viewer (`docs/**/*.stories.tsx`) and an isolated UI component workbench (`src/**/*.stories.tsx`).
* **Developer Experience**: Provide near-instant HMR (Hot Module Replacement) powered by Vite without requiring Next.js server startup.
* **Component Isolation**: Restore UI component stories from `.worktrees/old-5` into `src/` to enable isolated visual testing for UI elements (e.g., shadcn components in `src/components/ui/`).
* **Zero-Config Scanning**: Leverage `.ladle/config.mjs` pattern matching (`src/**/*.stories.@(js|jsx|ts|tsx|mdx)` and `docs/**/*.stories.@(js|jsx|ts|tsx|mdx)`) for unified story detection.

## Considered Options

1. **Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories**
2. **Single-purpose Storybook setup for UI components with a separate static documentation generator**
3. **Documentation-only Ladle setup without component stories in `src/`**

## Decision Outcome

Chosen option: **Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories** because Ladle provides extremely fast startup and HMR via Vite, handles both Markdown/MDX specs and React component stories seamlessly, and consolidating component isolation and documentation viewing into a single tool eliminates unnecessary tooling complexity.

### Positive Consequences

* Restores UI component stories from `.worktrees/old-5` into `src/` (e.g., `src/components/ui/button.stories.tsx`), enabling isolated visual verification.
* Developers can inspect both system architecture diagrams/specs and UI component states within a single Ladle workbench interface.
* Fast Vite-backed build and dev cycles reduce feedback loops during component iteration.

### Negative Consequences

* Component stories in `src/` must be maintained alongside component code updates.
* Ladle configuration must maintain multi-glob patterns (`src/**` and `docs/**`).

## Pros and Cons of the Options

### Dual-Role Ladle setup with restored UI component stories in `src/` alongside `docs/` documentation stories

* Good, because it provides rapid startup and HMR for both documentation and component state testing.
* Good, because it unifies architecture specs and UI component libraries into one viewer.
* Bad, because developers must keep component story files synchronized with component prop changes.

### Single-purpose Storybook setup for UI components with a separate static documentation generator

* Good, because Storybook has a large plugin ecosystem.
* Bad, because Storybook introduces heavy dependencies, slower build times, and requires managing separate tools for docs vs. components.
* **Rejected because**: The build overhead and complexity conflict with repository performance requirements and lightweight tooling design.

### Documentation-only Ladle setup without component stories in `src/`

* Good, because fewer story files need maintenance in `src/`.
* Bad, because UI components can only be tested inside full Next.js page layouts, hindering isolated component testing.
* **Rejected because**: Testing components solely in page contexts leads to slower iteration loops and unverified edge states.
