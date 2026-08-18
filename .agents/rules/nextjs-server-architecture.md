# Next.js Server Architecture Rule

Use Next.js App Router as the primary application architecture. Do not impose Clean Architecture, NestJS-style dependency injection, runtime IoC containers, or repository/use-case layers unless the current feature has a concrete need.

## Default Architecture

Prefer this progression by default:

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

## Explicitly Avoid By Default

- `InversifyJS`
- `TSyringe`
- `reflect-metadata`
- `@Inject`
- `@Injectable`
- runtime IoC containers
- service locators
- NestJS-style providers
