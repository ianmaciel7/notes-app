# Architecture

This repository is a Next.js application using the App Router, React, and TypeScript.

## Structure

- `src/app/`: application routes, layout, global CSS, and favicon.
- `src/components/ui/`: shared UI components and primitives.
- `src/hooks/`: reusable React hooks.
- `src/lib/`: shared utilities.
- `public/`: static assets.

## Configuration

- `package.json`: scripts, dependencies, and package manager declaration.
- `components.json`: shadcn/ui configuration and path aliases.
- `biome.json`: formatter, linter, and import-organization configuration.
- `tsconfig.json`: TypeScript compiler options and `@/*` alias to `src/*`.
- `next.config.ts`: Next.js configuration, including the React Compiler.
