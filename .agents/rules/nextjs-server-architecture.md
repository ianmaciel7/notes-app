# Next.js Server Architecture Rule

Use Next.js App Router as the primary application architecture. Do not impose Clean Architecture, NestJS-style dependency injection, runtime IoC containers, or repository/use-case layers unless the current feature has a concrete need.

## Default Architecture

Prefer this progression by default:

```text
Next.js App Router
  Server Components
  Server Actions / Server Functions
  Route Handlers only when an HTTP endpoint is required

Server-only Data Access Layer
  authentication
  authorization
  input validation
  database/API access
  minimal returned data

Infrastructure
  Database / Firebase / APIs / external services
```

## Required Practices

- Read the relevant installed Next.js docs in `node_modules/next/dist/docs/` before changing App Router APIs, routing, caching, Server Actions, Route Handlers, or file conventions.
- Prefer Server Components for server-rendered data consumption.
- Prefer Server Actions / Server Functions for mutations from UI.
- Prefer direct server-side function calls from Server Components instead of HTTP calls to this app's own Route Handlers.
- Use Route Handlers for public HTTP endpoints, webhooks, non-UI responses, or client/API consumers that genuinely need HTTP.
- Put protected data access, Firebase Admin, private APIs, secrets, auth, authorization, and permission checks behind server-only modules.
- Add `import "server-only"` to modules that must never enter a Client Component bundle.
- Keep authorization close to the data access or mutation being performed; middleware, hidden buttons, and page-level checks are not sufficient.
- Return minimal safe data shapes. Do not return whole database records when the caller needs only a subset.
- Keep Client Components limited to browser APIs, event handlers, client state/effects, client hooks, and interactive UI behavior.
- Keep Server Actions focused on input, validation, authorization handoff, server operation, revalidation, and redirect.

## Optional Patterns

Use these only when they solve a real problem:

- explicit dependency injection for testability or replaceable implementations;
- ports/interfaces for meaningful provider or infrastructure boundaries;
- repositories for complex domains or multiple persistence implementations;
- application/use-case functions for workflows, transactions, reusable business rules, or cross-service coordination;
- a composition root when wiring many dependencies centrally is simpler than local explicit composition.

Do not add controllers, managers, providers, factories, DTO classes, service locators, command buses, event buses, abstract base classes, or runtime DI containers just to make the project look architectural.

## Decision Rule

- Level 1: simple feature -> Server Component / Server Action -> DAL -> infrastructure.
- Level 2: meaningful business logic -> Server Component / Action -> use-case function -> DAL.
- Level 3: replaceable infrastructure -> Server Component / Action -> use-case -> port -> implementation.
- Level 4: many dependencies -> add a server-only composition root.

Start at Level 1. Move up only when complexity proves the need.

## Explicitly Avoid By Default

- `InversifyJS`
- `TSyringe`
- `reflect-metadata`
- `@Inject`
- `@Injectable`
- runtime IoC containers
- service locators
- NestJS-style providers
- one-interface-per-trivial-module architecture
- server components fetching this app's own API route without a concrete reason

## Verification Checklist

Before claiming an architecture refactor is complete, verify:

- protected data access lives in server-only modules;
- server-only modules are not imported by Client Components;
- Server Components call server functions directly where appropriate;
- Route Handlers exist only for real HTTP surfaces;
- Server Actions re-authenticate or delegate to DAL functions that do;
- sensitive operations authorize the specific resource being accessed or mutated;
- returned data is minimal and safe for the caller;
- added abstractions have an explicit reason in code, docs, or OpenSpec;
- `pnpm verify` or a justified narrower check passes.

## Sources

- `../../node_modules/next/dist/docs/01-app/02-guides/data-security.md`
- `../../node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `../../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `../../node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`
