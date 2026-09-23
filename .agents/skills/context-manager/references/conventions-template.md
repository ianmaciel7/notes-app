# CONVENTIONS.md Template

## Document Purpose
`CONVENTIONS.md` establishes repository-wide coding standards, naming rules, formatting/linting configurations, structural patterns, and code smells to avoid.

---

## Canonical Structure

```markdown
# Coding Conventions & Standards

## 1. Tooling & Enforcement
- Formatter & Linter: Tool name and config file (e.g., Biome via `biome.json`).
- Strict Mode: TypeScript strict configuration, no implicit any.
- Commands:
  - Lint: `pnpm lint`
  - Format: `pnpm format`

## 2. Naming Conventions
- **Files & Folders**: `kebab-case.ts` / `kebab-case.tsx` (e.g., `user-profile.tsx`, `use-mobile.ts`).
- **Components**: `PascalCase` (e.g., `UserProfile`, `Button`).
- **Functions & Hooks**: `camelCase` (e.g., `calculateTotal`, `useNotes`).
- **Constants**: `UPPER_SNAKE_CASE` or `camelCase` config objects.
- **Types & Interfaces**: `PascalCase` without Hungarian prefixes (prefer `Note` over `INote`).

## 3. Component & File Anatomy
- Preferred export style: Named exports or default exports (document repository rule).
- Import ordering:
  1. External packages (`react`, `next`, `@base-ui/...`)
  2. Workspace aliases (`@/components/...`, `@/lib/...`)
  3. Relative imports (`./sub-component`)
  4. Styles / CSS

## 4. State & React Best Practices
- Server vs. Client Components: Explicit `"use client"` directives only when required for event handlers or state.
- Separation of UI and business logic (use custom hooks for complex state).
- Pure utility functions with zero side-effects in `lib/`.

## 5. Anti-Patterns & Code Smells
- Direct DOM manipulation outside React lifecycles.
- Hardcoded magic strings and numbers.
- Unhandled async promise rejections.
- Bypassing lint/type checks with `@ts-ignore` or `any`.
```
