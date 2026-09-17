# Architecture

This repository is a Next.js application using the App Router, React, and TypeScript.

## Structure

- `src/app/`: application routes, layout, global CSS, and favicon.
- `src/components/ui/`: shared UI components and primitives.
- `src/hooks/`: reusable React hooks.
- `src/lib/`: shared utilities.
- `src/data/`: server-only Data Access Layer (DAL) modules, when the application
  needs centralized database access, authorization checks, or DTO mapping.
- `public/`: static assets.

## Data access and security

When adding persistent or private data access, prefer a dedicated DAL under
`src/data/` (or `src/lib/data/` when the code is a more general shared utility).
DAL modules should:

- run only on the server;
- perform authentication and authorization checks;
- access secrets and `process.env` values centrally; and
- return minimal, safe Data Transfer Objects (DTOs), never entire database rows.

Use `server-only` in server-only data modules to prevent accidental imports from
Client Components. Treat values passed to Client Components as public and
sanitize them at the server/client boundary. Server Actions must validate their
inputs and re-check authorization because they can be called through direct
POST requests.

These conventions follow the [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security).

## Configuration

- `package.json`: scripts, dependencies, and package manager declaration.
- `components.json`: shadcn/ui configuration and path aliases.
- `biome.json`: formatter, linter, and import-organization configuration.
- `tsconfig.json`: TypeScript compiler options and `@/*` alias to `src/*`.
- `next.config.ts`: Next.js configuration, including the React Compiler.
