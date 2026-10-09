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

The current Next.js pack contains **20 active GritQL guards**.

| Guard | Purpose |
| --- | --- |
| `app-router-legacy-imports.grit` | blocks Pages Router/legacy Next.js module imports |
| `app-router-legacy-data-apis.grit` | blocks Pages Router data lifecycle APIs |
| `next16-deprecated-middleware-export.grit` | rejects the deprecated exported `middleware` convention |
| `next16-deprecated-middleware-config.grit` | rejects `skipMiddlewareUrlNormalize` |
| `next16-removed-runtime-config.grit` | rejects removed runtime config and `next/config` |
| `next16-removed-amp.grit` | rejects removed AMP APIs |
| `next16-removed-root-params.grit` | rejects removed `unstable_rootParams` |
| `next16-removed-cache-experiments.grit` | rejects removed experimental Cache Component flags |
| `next16-removed-dev-indicators.grit` | rejects removed dev-indicator options |
| `next16-removed-eslint-config.grit` | rejects removed NextConfig ESLint build config |
| `next16-experimental-ppr.grit` | blocks legacy `experimental.ppr` in NextConfig and route segment config |
| `next16-deprecated-image-domains.grit` | rejects deprecated `images.domains` in favor of `images.remotePatterns` |
| `no-ignore-build-errors.grit` | prevents production builds from ignoring TypeScript errors |
| `revalidate-tag-profile.grit` | rejects deprecated single-argument `revalidateTag` |
| `next16-deprecated-cache-primitives.grit` | rejects legacy `unstable_cacheLife`, `unstable_cacheTag`, `unstable_noStore`, and `unstable_after` |
| `async-cookies-access.grit` | catches common synchronous `cookies()` access |
| `async-headers-access.grit` | catches common synchronous `headers()` access |
| `async-draft-mode-access.grit` | catches synchronous `draftMode()` access |
| `no-public-secret-env.grit` | blocks secret-like `NEXT_PUBLIC_*` names |
| `redirect-outside-try.grit` | prevents redirect errors from being swallowed by project try/catch flows |

## Next.js practice coverage

### App Router

Covered by Next.js build, typegen, Biome, Dependency Cruiser, and the migration guards.

Includes:

- `app/` routing;
- `src/` root convention boundaries (`proxy`, `middleware`, `instrumentation` allowed only; enforced by Dependency Cruiser `src-root-allowed-files-only`);
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

The following are project conventions verified by focused tests and security
review, not dedicated GritQL proofs:

- runtime input validation;
- thin `use server` modules in `src/actions/*-actions.ts`;
- authentication and resource-level authorization inside `src/data/*-dal.ts`;
- minimal returned DTOs;
- intentional cache invalidation.

Mechanically enforced for `src/data` (file structure only):

- `tests/unit/data-layer-structure.test.ts` (helper
  `tests/unit/data-layer-structure-lib.ts`) requires `*-dal.ts` file names, a
  leading `import "server-only"`, only exported `async function` declarations
  (no exported variables, types, classes, enums, non-async functions,
  re-exports or default exports), and no `uid`, `userId` or `ownerId`
  parameter name on an exported function. It covers the real directory plus
  embedded positive and negative fixtures.
- Dependency Cruiser `data-not-importable-by-browser-layers` (components,
  hooks, client, domain and lib cannot import `src/data`; `src/app` and
  `src/actions` can). `data-files-must-be-dal` is a partial, redundant
  import-graph check of `*-dal.ts` names that only sees files with at least one
  dependency; the Vitest guard above is what enforces the name for every file
  in `src/data`.

`actions-cannot-import-client-layers` restricts Server Action imports, while
`data-cannot-import-client-layers` restricts the DAL import graph. None of
these prove that an authorization check is correct; a call named `auth()` is not
sufficient evidence by itself.

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
- safe DTOs and data minimization;
- tainting when useful;
- CSP/CORS decisions.

The implemented Admin SDK DAL is `src/data/`. Its modules use the
`server-only` marker; the `data-cannot-import-client-layers` Dependency
Cruiser rule prevents imports from browser/component layers,
`data-not-importable-by-browser-layers` blocks the reverse direction, and the
`data-layer-structure` Vitest guard checks file structure. None of them prove
DTO shape or authorization behavior; a parameter-name check does not prove the
caller identity is derived correctly inside the DAL.

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

The current application uses cookie-driven `next-intl` without locale URL
prefixes. Vitest and Playwright cover locale negotiation, explicit cookie
persistence, and authenticated profile-preference restoration; this is
behavioral coverage, not a Next.js GritQL guard.

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

## Why the pack still does not mirror every Next.js concept

The Next.js documentation contains hundreds of concepts and recommended
practices. The custom pack now covers concrete Next.js 16 migrations, request
API misuse, cache invalidation signatures, type-safety configuration, and a few
project security/control-flow invariants. Converting every concept into an AST
rule would still create false confidence and false positives.

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
