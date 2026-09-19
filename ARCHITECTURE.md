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
- `.agents/`: agent configurations, including custom subagents (`.agents/agents/firebase/agent.md`, `.agents/agents/research/agent.md`, `.agents/agents/code-reviewer/agent.md`, `.agents/agents/test-engineer/agent.md`, `.agents/agents/ui-engineer/agent.md`), domain skills (`.agents/skills/`), and rules (`.agents/rules/`).

## Data access and security

Authentication uses FirebaseUI in Client Components, an HttpOnly
`firebase_session` cookie, and Firebase Admin token verification in the
server-only DAL at `src/data/auth.ts`. Client route guards are only a UX layer;
server-rendered pages, Server Actions, Route Handlers, and Firestore rules must
perform their own authorization checks.

With Cache Components enabled, session reads use `use cache: private` and are
placed behind Suspense boundaries. User-specific cached data must derive its
key from a verified UID and must never include tokens or other secrets.

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

## Subagents and agent automation

- **Firebase (`.agents/agents/firebase/agent.md`)**: Supports Firebase capabilities (Authentication, Firestore modeling, Security Rules, App Hosting, Cloud Functions, and Data Connect), aggregating 12 specialized Firebase skills under `.agents/skills/`.
- **Research (`.agents/agents/research/agent.md`)**: Supports codebase topology navigation, documentation retrieval, and component discovery by utilizing `.agents/skills/context7`, `.agents/skills/graphify`, and `.agents/skills/search-registry-items`.
- **Code Reviewer (`.agents/agents/code-reviewer/agent.md`)**: Audits diffs, PRs, and modifications for bugs, regressions, security leaks, Biome linting, and enforces the no-index barrel files rule and repository conventions.
- **Test Engineer (`.agents/agents/test-engineer/agent.md`)**: Designs test strategies, implements unit and component tests with Vitest and React Testing Library, authoring emulator integration tests and verifying test suites pass cleanly.
- **UI Engineer (`.agents/agents/ui-engineer/agent.md`)**: Implements accessible, theme-aware UI primitives and feature components adhering to shadcn/ui base-nova style, `@base-ui/react`, Tailwind CSS v4, and Ladle stories (`*.stories.tsx`).
- **Architect (`.agents/agents/architect/agent.md`)**: Guides system boundaries, React Server Component (RSC) vs Client splits, refactoring strategies, and trade-off analysis before implementation.
- **Security Reviewer (`.agents/agents/security-reviewer/agent.md`)**: Audits authentication flows, default-deny Firestore rules, server-side token validation, and prevents secret exposure.
- **Documentation Maintainer (`.agents/agents/doc-maintainer/agent.md`)**: Manages Architectural Decision Records (ADRs), path portability audits, documentation freshness, and knowledge graph sync.

## Configuration

- `package.json`: scripts, dependencies, and package manager declaration.
- `components.json`: shadcn/ui configuration and path aliases.
- `biome.json`: formatter, linter, and import-organization configuration.
- `tsconfig.json`: TypeScript compiler options and `@/*` alias to `src/*`.
- `next.config.ts`: Next.js configuration, including the React Compiler.
