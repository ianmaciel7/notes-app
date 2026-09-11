---
trigger: always_on
description: Core architectural rules, tooling guidelines, package manager, and local-first database rules for the Notes App project.
---

# Core Project Architecture & Guidelines

## 1. Tooling & Commands
- **Package Manager**: Use `pnpm` exclusively (`pnpm add`, `pnpm run dev`, `pnpm build`, `pnpm check`). Never use `npm` or `yarn`.
- **Linter & Formatter**: Biome is the sole linter and formatter (`pnpm check --write .`, `pnpm lint`, `pnpm format`). Do NOT create, configure, or install ESLint or Prettier.
- **Styling**: Tailwind CSS v4 CSS-first configuration (`@theme` in `src/app/globals.css`). Do NOT create `tailwind.config.js` or `tailwind.config.ts`. Never create `.module.css` files or per-component CSS stylesheets; use Tailwind v4 utility classes and arbitrary descendant selectors.
- **TypeScript & React**: Next.js 16 App Router with React 19. Keep client component boundaries lean (`'use client'`). Consult `node_modules/next/dist/docs/` for breaking changes.

## 2. Database & Data Architecture
- **Single Source of Truth**: Dexie.js (IndexedDB at `src/lib/db.ts`) with database name `KnowledgeOS_DB`. Every user read and write immediately hits Dexie with `_syncStatus = 'pending'`.
- **Entity Schema**: All entities must implement `BaseEntity` (`id`, `type`, `title`, `blocks`, `tags`, `relations`, `properties`) defined in `SPEC.md`.
- **State Management**:
  - UI state: Zustand (`zustand`) for transient split-pane, drawer, and search state.
  - Database queries: Dexie `useLiveQuery` for reactive component state updates.

## 3. Reference Specifications
- Always adhere to architectural decisions in `DECISIONS.md` and detailed entity schemas in `SPEC.md`.

## 4. Directory Layout & Tooling Isolation
- **`src/` Application Isolation**: `src/` is strictly reserved for web application runtime code (App Router pages, components, API routes, hooks, lib). Never place CLI automation scripts or dev tooling inside `src/`.
- **`scripts/` Centralized Tooling**: All developer scripts, CLI utilities, browser launchers (`scripts/open_browser.py`), code quality checkers (`scripts/quality/`), and tooling modules (`scripts/tooling/`) live in `scripts/`.

## 5. Next.js App Router Colocation
- **Global design system only in `src/components/ui/`**: shadcn/Base UI primitives and project-wide UI primitives live here. Do not place product/domain components directly under `src/components/`.
- **Product UI in private App Router folders**: colocate application-specific UI under `src/app/_components/` or the nearest route-local `_components/` folder. Prefer shallow, stable domain groupings over visual-anatomy trees.
- **Root providers in `src/app/_providers/`**: keep root-layout client providers and browser synchronization helpers private to the App Router.
- **Dependency direction**: `src/lib/` and globally reusable `src/hooks/` must not import from `src/app/_components/`. Workspace-specific hooks belong with the workspace components that own them.
- **No broad barrels**: use direct imports to concrete files instead of catch-all `index.ts` re-export layers.
- **Colocate verification**: stories and focused tests should move with the component family they verify unless they are repository-wide tooling checks under `scripts/tooling/`.
