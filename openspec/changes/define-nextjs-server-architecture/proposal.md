## Why

The project is a Next.js 16 App Router application. Future server features will involve protected workspace data, Firebase/API access, authentication, authorization, Server Actions, and potentially Route Handlers. The repository needs a durable architecture rule that follows official Next.js guidance without introducing Clean Architecture or NestJS-style ceremony by default.

## What Changes

- Define Next.js App Router as the primary architecture.
- Require server-only Data Access Layer modules for protected data access.
- Require authentication, authorization, validation, and minimal returned data close to data access.
- Prefer Server Components for server-side data consumption and Server Actions / Server Functions for mutations.
- Restrict Route Handlers to real HTTP/API surfaces.
- Keep Client Components minimal and browser-only.
- Permit dependency injection, ports, repositories, use cases, and composition roots only when they solve concrete problems.
- Add `.agents/rules/nextjs-server-architecture.md` as the durable agent rule for future architecture work.

## Non-Goals

- Rewrite the current app into Clean Architecture.
- Create empty `src/server`, `domain`, `application`, `repositories`, or composition-root folders before the app has protected data operations that need them.
- Introduce runtime dependency injection containers or NestJS-style providers.
- Refactor shadcn/generated UI components.
- Implement Firebase, auth, database, or API providers in this spec-only change.

## Impact

- Adds a repository architecture contract for future Next.js server work.
- No runtime behavior change is expected from this planning/rule update.
- Future implementation changes should comply with this contract when adding protected data access, mutations, APIs, auth, or external services.
