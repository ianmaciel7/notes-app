## Context

Installed package evidence shows the project uses Next.js `16.3.0`, React `19.2.8`, TypeScript, Tailwind CSS, shadcn components, and the App Router under `src/app/`. The current app has no `src/server` data layer, auth module, database client, Firebase Admin module, or internal HTTP API surface. Therefore the right action is to define the architecture contract and avoid creating empty layers.

Official installed Next.js docs consulted:

- `node_modules/next/dist/docs/01-app/02-guides/data-security.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`

Context7 also confirmed the same official guidance from `/vercel/next.js`: Data Access Layers should be server-only, perform authorization, return minimal DTO-like data, Server Actions should delegate to DAL logic, Server Components should fetch directly from sources/server functions instead of this app's own Route Handlers, and Client Components should be limited to browser-side needs.

## Decisions

### Use Next.js as the primary architecture

The framework boundary is App Router. Pages and layouts are Server Components by default. Client Components are introduced only for event handlers, state, effects, browser APIs, and interactive hooks.

### Add server-only DAL when protected data appears

Protected database/API/Firebase/Admin/secret-dependent operations belong in `server-only` modules, normally under a future `src/server/dal/` or nearby server-owned module. DAL functions authenticate, authorize the resource, validate input, access infrastructure, and return minimal data.

### Keep Server Actions thin

Server Actions coordinate input, validation handoff, DAL/use-case calls, revalidation, and redirects. They should not accumulate unrelated infrastructure or business logic.

### Avoid own-API round trips from Server Components

Server Components should call server functions or DAL functions directly. Route Handlers are for external clients, webhooks, non-UI responses, file/JSON/XML responses, or real HTTP integration boundaries.

### Use optional abstractions only after need appears

Use cases, ports, repositories, explicit dependency injection, and composition roots are allowed only when they improve testability, replaceable infrastructure, multi-provider support, transactions, cross-service workflows, or business-rule clarity.

## Risks / Trade-offs

- Too little structure can scatter authorization; the DAL requirement prevents that for protected data.
- Too much structure can turn a Next.js app into a ceremony-heavy mini NestJS app; optional patterns require justification.
- Server Actions are reachable directly and must not rely on UI visibility or page-level checks.
- Returning full database records can leak sensitive fields to Client Components.
- Route Handlers are public HTTP endpoints and should not be treated as private internal services.
