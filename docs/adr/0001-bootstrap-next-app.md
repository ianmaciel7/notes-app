# ADR 0001: Bootstrap Project with Next.js, TypeScript, Tailwind CSS, Biome, and React Compiler

## Status

Accepted

## Implementation

Implemented

## Date

2026-10-05

## Current State (2026-10-07)

**Implementation: Implemented (source-confirmed).** The `dev` branch retains
Next.js 16.3.8, React 19.2.8, App Router, TypeScript, Tailwind CSS v4, and
Biome 2.4.2. `next.config.ts` enables `reactCompiler`,
`cacheComponents`, and `partialPrefetching`, and uses
`tsconfig.check.json` for build-time type checking. `package.json`
declares `pnpm@12.8.1`; `biome.json` contains the active lint and
GritQL configuration.

**Follow-up:** use [Tooling](../../TOOLING.md) and
[Next.js guard coverage](../guards/NEXTJS-GUARD-COVERAGE.md) for
current verification responsibilities. These settings were checked in source;
the compiler, test suite, and CI were not rerun as part of this ADR review.
Historical bootstrap commands below remain a record of the original decision.

## Context

The exam-study platform foundation requires a modern, high-performance web foundation capable of delivering responsive client-side interactions, scalable UI component architecture, and optimal developer ergonomics. Key requirements include:

1. **High-Performance Rendering**: Fast initial page loads and smooth client updates for rich note editing and navigation.
2. **Type Safety & Maintainability**: Reliable compile-time checks across data models, application state, and UI components.
3. **Streamlined Tooling & Developer Experience (DX)**: Minimal configuration drift, rapid linting and formatting feedback loops, and automated runtime optimizations.
4. **Clean Codebase Organization**: Explicit separation between top-level project configuration and application source code.

To establish this baseline cleanly and consistently, the project was initialized using Next.js tooling with official flags configured for modern web standards.

## Decision

The application was initialized using the following command:

```bash
pnpm create next-app . --ts --tailwind --biome --app --src-dir --react-compiler
```

Each flag was chosen intentionally to establish the foundational architecture:

- **`pnpm create next-app .`**: Uses [pnpm](https://pnpm.io/) as the package manager, scaffolding directly in the root directory. pnpm enforces a strict dependency tree (preventing phantom dependency bugs) and saves disk space via content-addressable storage while delivering fast installation times.
- **`--ts`**: Configures TypeScript (`tsconfig.json`) across the project, providing static type safety, intelligent IDE completion, and robust refactoring guarantees.
- **`--tailwind`**: Configures Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss`) for utility-first styling, enabling rapid UI development and consistent design tokens without traditional CSS bloat.
- **`--biome`**: Adopts [Biome](https://biomejs.dev/) (`biome.json`) as the all-in-one formatter and linter, replacing ESLint and Prettier. Biome provides sub-millisecond linting and formatting passes along with built-in rules for Next.js and React domains.
- **`--app`**: Enables the Next.js App Router (`src/app`), taking advantage of React Server Components (RSC), streaming server rendering, nested layout hierarchies, and route grouping.
- **`--src-dir`**: Encapsulates application code inside the `src/` directory (`src/app/`, etc.), isolating code from repository-level configuration files (`package.json`, `biome.json`, `tsconfig.json`, `next.config.ts`).
- **`--react-compiler`**: Activates the React Compiler integration (`reactCompiler: true` in `next.config.ts`, powered by `babel-plugin-react-compiler`). The compiler automatically optimizes component renders and hook dependencies at build time, eliminating the cognitive overhead and boilerplate of manual `useMemo` and `useCallback` annotations.

## Consequences

### Positive Outcomes

- **Developer Velocity**: Biome provides instantaneous format and lint checks via `pnpm lint` and `pnpm format`.
- **Automatic React Performance**: Components automatically benefit from fine-grained memoization without fragile manual dependency arrays.
- **Modular Component Design**: Utility-first CSS via Tailwind v4 facilitates rapid design iterations with zero runtime styling overhead.
- **Modern React Paradigm**: Full compatibility with React 19 and Next.js App Router features, allowing server-side data fetching and minimal client bundle sizes.
- **Maintainable Directory Layout**: The `src/` hierarchy cleanly decouples application components, lib utilities, and state from configuration files.

### Trade-offs and Considerations

- **React Compiler Strictness**: Code must adhere strictly to the Rules of React (e.g., pure render functions, immutable data structures). Code violating these invariants may trigger compiler warnings or require explicit opting out via `'use no memo'`.
- **Biome Plugin Compatibility**: Biome does not run arbitrary third-party ESLint plugins. However, core React, Next.js, and TypeScript rules are natively supported and perform orders of magnitude faster.
- **Tailwind CSS v4 Changes**: Tailwind v4 uses CSS-first configuration (`@import "tailwindcss";`) and PostCSS integration rather than a JavaScript-based `tailwind.config.js`. Team members should refer to Tailwind v4 documentation for styling directives.
