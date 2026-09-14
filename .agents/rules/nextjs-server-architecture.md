---
trigger: model_decision
description: Next.js 16 App Router architectural progression, Server Components, Server Actions, Route Handlers, and server/client boundary enforcement.
---

# Next.js Server Architecture Rule

Use Next.js App Router as the primary application architecture. Do not impose NestJS-style dependency injection, runtime IoC containers, or heavy repository layers unless the feature has a concrete need.

## 1. Architectural Progression

Prefer this progression by default:

1. **Next.js App Router**:
   - **Server Components (RSC)** for data retrieval, initial page rendering, and metadata.
   - **Server Actions / Server Functions** for user-triggered mutations and form submissions.
   - **Route Handlers (`/api/*`)** strictly when an external HTTP endpoint, webhook, AI gateway proxy, or streaming API is required.

2. **Server-Only Data Access Layer**:
   - Authentication & server-side token validation (`firebase-admin`).
   - Private secrets, Google Cloud Secret Manager access.
   - Minimal returned data shapes—never return whole database records when the caller needs only a subset.

3. **Infrastructure**:
   - Database / Firebase / Dexie / external AI services.

## 2. Required Practices

- Read installed Next.js docs in `node_modules/next/dist/docs/` before changing App Router APIs, caching, or Server Actions.
- Prefer Server Components for server-rendered data consumption.
- Prefer direct server-side function calls from Server Components instead of HTTP calls to this app's own Route Handlers.
- Add `import "server-only"` to modules that must never enter a Client Component bundle.
- Keep Client Components (`'use client'`) lean, limited to browser APIs, event handlers, client state/hooks, and local-first Dexie reactivity.
- Keep authorization close to the data access or mutation being performed; middleware and page-level checks alone are not sufficient.

## 3. Explicitly Avoid

- Runtime IoC containers (`InversifyJS`, `TSyringe`, `reflect-metadata`, `@Inject`, `@Injectable`).
- Calling internal Route Handlers via `fetch()` from Server Components.
- Leaking server credentials or `firebase-admin` into `'use client'` files.
