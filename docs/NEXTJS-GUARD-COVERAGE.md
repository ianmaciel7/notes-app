# Next.js Guard Coverage

This document maps the project's Next.js 16 App Router practices to the layer
that can enforce them most accurately.

A concept is considered covered when it has a real enforcement owner. Coverage
does not imply a dedicated GritQL file.

## Current enforcement stack

| Layer | Responsibility |
| --- | --- |
| Next.js 16.3.8 | App Router conventions, RSC graph, rendering, cache/runtime invariants |
| React Compiler | React component/hook compilation invariants |
| `next typegen` + TypeScript | route-aware types and public signatures |
| Biome 2.4.2 | native Next.js/React/project/types/test rules |
| GritQL | project-specific low-ambiguity AST rules |
| Dependency Cruiser | dependency graph boundaries |
| Vitest | source/runtime behavior |
| Playwright | browser/navigation behavior |
| Size Limit | bundle budgets |
| Code review | semantic architecture/security decisions |

## Active custom GritQL

| Guard | Purpose |
| --- | --- |
| `app-router-legacy-imports.grit` | blocks Pages Router/legacy Next.js module imports |
| `app-router-legacy-data-apis.grit` | blocks Pages Router data lifecycle APIs |

## Next.js practice coverage

### App Router

Covered by Next.js build, typegen, Biome, and the two migration guards.

Includes:

- `app/` routing;
- pages/layouts/templates;
- route groups;
- dynamic/catch-all segments;
- parallel/intercepting routes;
- Route Handlers;
- Proxy;
- special files;
- generated route types.

### Server and Client Components

Framework-owned:

- Server Components by default;
- `"use client"` module graph boundary;
- server-only/client-only compatibility;
- serializable Server-to-Client data constraints;
- async Client Component restrictions.

Project review additionally checks that client boundaries stay as small as
practical.

### Data fetching

TypeScript/build/review own:

- direct server-side access from Server Components;
- avoiding self-fetch through the application's own Route Handler;
- parallelizing independent I/O;
- minimizing client fetching for server-readable data;
- Suspense placement for slow runtime work.

A generic syntax rule cannot reliably know whether two awaits are independent,
so no fake waterfall guard is used.

### Server Actions

Tests/security review own:

- runtime input validation;
- authentication;
- resource-level authorization;
- minimal returned data;
- intentional cache invalidation.

A call named `auth()` does not prove correct authorization, so these are not
GritQL-only rules.

### Route Handlers

Next.js types/build plus tests/review own:

- HTTP method behavior;
- validation;
- authentication/authorization;
- CORS;
- webhook/public endpoint behavior;
- streaming.

Treat every Route Handler as a public HTTP endpoint.

### Cache Components and revalidation

Next.js runtime/build plus focused tests own:

- `"use cache"`;
- private/remote cache variants;
- request API restrictions;
- `cacheLife`;
- `cacheTag`;
- `revalidatePath`;
- `revalidateTag`;
- `updateTag`.

Do not duplicate framework runtime rules with weaker AST heuristics.

### Request APIs

Next.js 16 types/build own current async request API behavior:

- `cookies()`;
- `headers()`;
- `draftMode()`;
- `params`;
- `searchParams`;
- `connection()`;
- `userAgent()`.

### Navigation

Biome/Next APIs/tests own:

- `Link`;
- router hooks;
- redirects/rewrites;
- prefetching;
- state preservation.

Raw anchors are not blanket-banned because downloads, external protocols, and
non-navigation links can be valid.

### Loading, Suspense, and streaming

Next.js runtime plus Playwright/review own:

- `loading.tsx`;
- route/component Suspense;
- streaming;
- blocking route behavior;
- loading UX.

Suspense placement is a UX/data-dependency decision, not a safe syntax-only
rule.

### Error handling

Next.js conventions and runtime tests own:

- `error.tsx`;
- `global-error.tsx`;
- `not-found.tsx`;
- `notFound()`;
- forbidden/unauthorized boundaries;
- reset/recovery.

### Metadata and SEO

Next.js Metadata API/types plus Biome own:

- static/dynamic metadata;
- `generateMetadata`;
- title/description;
- Open Graph;
- icons;
- robots;
- sitemap;
- manifest;
- viewport;
- JSON-LD.

### Images, fonts, and scripts

Biome's Next.js domain and Next.js build own:

- `next/image`;
- raw image warnings;
- `next/font`;
- Google font behavior;
- `next/script`;
- synchronous/inline script rules.

### Forms

React/Next.js types, browser tests, and accessibility checks own:

- `<Form>`;
- Server Action forms;
- pending/optimistic state;
- `useActionState`;
- `useFormStatus`;
- validation and error UX.

### Authentication and authorization

Security tests/review own:

- session validation;
- route protection;
- Server Action authorization;
- Route Handler authorization;
- resource ownership;
- least privilege.

Proxy or client-side route checks are never considered sufficient
authorization.

### Data security

Next.js/server-only boundaries, TypeScript, Biome security rules, and review
own:

- secret isolation;
- environment poisoning prevention;
- safe DTOs;
- data minimization;
- tainting when useful;
- CSP/CORS decisions.

### TypeScript and configuration

`next typegen`, TypeScript, and production build own:

- `PageProps`;
- `LayoutProps`;
- `RouteContext`;
- typed routes where enabled;
- `next.config.ts` correctness;
- build/runtime configuration.

### Accessibility and internationalization

Biome recommended accessibility rules, semantic primitives, Base UI, and
browser tests own accessibility behavior.

Locale routing/content is validated when an i18n architecture is actually
introduced. The current `dev` branch has no active i18n implementation.

### Performance and production

CI owns:

- production build;
- bundle budgets;
- dead code;
- dependency health;
- E2E smoke behavior.

Field performance such as Core Web Vitals requires runtime/production
instrumentation once real user-facing routes exist.

### Observability and deployment

These remain review/deployment concerns until corresponding infrastructure is
implemented:

- instrumentation;
- OpenTelemetry;
- deployment adapters;
- multi-zone/multi-tenant topology;
- PWA/offline service workers.

## Why there are only two custom Next.js GritQL files today

The Next.js documentation contains hundreds of concepts and recommended
practices. Converting each noun into an AST rule would create false confidence
and false positives.

The current project therefore prefers the strongest enforcement layer:

```text
Next.js > TypeScript > Biome > GritQL > tests > review
```

Add a new GritQL guard only when:

1. the violation has a stable syntactic shape;
2. the rule is not already better enforced elsewhere;
3. false positives are acceptably low;
4. the plugin compiles in the pinned Biome version;
5. CI remains green.
