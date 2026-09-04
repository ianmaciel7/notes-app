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
