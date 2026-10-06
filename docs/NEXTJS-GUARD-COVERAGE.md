# Next.js Concept Guard Coverage

This document maps the Next.js 16 App Router concepts used by this repository
to the layer that actually enforces them.

"Covered" does not mean "one GritQL file per noun". Next.js spans compile-time
file conventions, React module graphs, runtime behavior, HTTP security,
caching, deployment, accessibility, and architecture. A fake syntax rule is
worse than an explicit review/runtime invariant.

Primary references:

- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/api-reference/directives/use-client
- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/api-reference/directives/use-cache
- https://biomejs.dev/linter/domains/
- https://biomejs.dev/linter/plugins/

## Enforcement layers

| Layer | Purpose |
| --- | --- |
| Next.js build/runtime | File conventions, RSC constraints, route behavior, cache/runtime invariants |
| `next typegen` + TypeScript | Route-aware types, async request APIs, public signatures, type safety |
| Biome Next/React/security domains | Framework-native lint rules and React/security correctness |
| GritQL | Low-ambiguity project-specific App Router invariants |
| Dependency Cruiser / Knip / Size Limit | Architecture edges, dead code, package/bundle health |
| Vitest / Playwright / axe | Runtime behavior, navigation, accessibility, forms, offline/UI state |
| Code review | Authorization, DAL boundaries, Suspense placement, data minimization, deployment intent |

## Custom GritQL guards

| Guard | Concepts |
| --- | --- |
| `app-router-legacy-imports.grit` | App Router, Metadata API, next/navigation, next/image, Pages Router separation |

## Concept-by-concept coverage

| # | Concept family | Enforcement |
| --- | --- | --- |
| 1 | Fundamentals: App Router, app/src/public, project structure, configuration | Next.js conventions, NextConfig types, build |
| 2 | React components: Server Components, Client Components, RSC payload/module graphs, boundaries, interleaving | Next build + React compiler + Biome Next/React domains |
| 3 | Routing: pages, layouts, templates, route groups, dynamic/catch-all segments, parallel/intercepting routes, slots | Next file conventions + `next typegen` + build |
| 4 | Navigation: Link, router hooks, redirects, rewrites, prefetching, partial prefetching, state preservation | Next APIs + Biome + Playwright; raw anchors remain review-contextual |
| 5 | Rendering: static/dynamic/request-time rendering, prerendering, PPR, static shell, hydration | Next build/runtime |
| 6 | Loading/Streaming: loading.tsx, Suspense, streaming, skeletons, blocking-route behavior | Next runtime/build + Playwright + review |
| 7 | Data fetching: Server Components, direct DB/API access, parallel/sequential fetches, waterfalls, preload | Next App Router build/types + tests + architecture review |
| 8 | Cache Components: use cache/private/remote, cacheLife, cacheTag, cache handlers | Next runtime/build + cache/revalidation tests |
| 9 | Revalidation: revalidatePath, revalidateTag, updateTag, refresh, ISR | Next types/runtime + mutation tests |
| 10 | Mutations: Server Functions, Server Actions, use server, optimistic/pending state | Next/React compiler + directive Grit guard + tests + security review |
| 11 | Forms: Form, FormData, progressive enhancement, validation, useActionState/useFormStatus | TypeScript + React/Next + Vitest/Playwright/axe |
| 12 | Route Handlers: route.ts, HTTP methods, Request/Response, NextRequest/NextResponse, CORS, streaming | Next build/types + API tests + security review |
| 13 | Backend for Frontend: public endpoints, webhooks, callbacks, proxying, server resources | Route/API tests + security/architecture review |
| 14 | Proxy: proxy.ts, matchers, redirects/rewrites, auth gates, headers/cookies | Next file convention/build + integration tests |
| 15 | Request APIs: cookies, headers, draftMode, connection, params, searchParams, userAgent | Next 16 types/build; cache misuse additionally guarded by Grit |
| 16 | Error handling: error/global-error/not-found/forbidden/unauthorized/reset | Next file conventions + runtime tests |
| 17 | Metadata/SEO: metadata, generateMetadata, OG, icons, robots, sitemap, manifest, viewport | Next Metadata API/types + Biome noHeadElement + legacy-import Grit |
| 18 | Images: next/image, responsive sizing, remote patterns, placeholders | Biome Next `noImgElement` + Next build/config |
| 19 | Fonts: next/font, local/Google fonts, preloading/subsetting | Next build + Biome Google-font rules + review |
| 20 | Scripts/third parties: next/script, loading strategies, IDs | Biome Next script rules + runtime tests |
| 21 | Styling: global CSS, CSS Modules, Tailwind, Sass, CSS chunking/order | Biome CSS + Tailwind parser + build |
| 22 | Authentication: sessions, cookies, route protection, Server Action/Handler auth | Security tests + review; no syntax-only auth guard |
| 23 | Authorization: role/resource checks, least privilege, ownership | DAL/service tests + security review |
| 24 | Data security: DAL, DTOs, server-only, environment poisoning, tainting, CSP/CORS, validation | Next server-only build checks + environment rules + Biome security + review |
| 25 | Special files: page/layout/template/loading/error/not-found/default/route/proxy/instrumentation/metadata files | Next file conventions/build |
| 26 | TypeScript: generated route types, PageProps/LayoutProps/RouteContext, typed routes | `next typegen && tsc --noEmit` |
| 27 | Internationalization: locale routing/detection/content | Route design + integration tests |
| 28 | Accessibility: semantic UI, route announcements, focus, forms, keyboard behavior | Biome a11y + shadcn/Base UI + axe/Playwright |
| 29 | Observability: instrumentation, OpenTelemetry, Web Vitals, analytics/logging | instrumentation tests + production review |
| 30 | Performance: code splitting, lazy loading, bundle size, images/fonts/scripts, Web Vitals | Biome + Size Limit + build + field metrics |
| 31 | Package/bundling: Turbopack, client/server bundles, tree shaking, package optimization | Next build + Size Limit + Knip |
| 32 | Runtime: Node, Edge, browser, serverless constraints | Next config/types + deployment tests |
| 33 | Deployment: Vercel/self-hosting/Docker/CDN/multi-zone/multi-tenant/adapters | deployment configuration + CI/smoke tests |
| 34 | Static export / SPA / PWA | Next config/build + E2E/offline tests |
| 35 | Offline/connectivity: useOffline, recovery behavior | Playwright network/offline tests |
| 36 | UI state: layout persistence, template remounting, URL/search-param state | React tests + Playwright |
| 37 | Interactive UI: transitions, optimistic state, Client Components, view transitions | React compiler/Biome + interaction tests |
| 38 | Content: MDX, CMS, Draft Mode, static/dynamic content | Next build + content integration tests |
| 39 | Testing: unit/component/integration/E2E | Vitest + Playwright + mutation testing |
| 40 | Development: next dev, Fast Refresh, debugging, source maps, dev indicators | Next dev/tooling configuration |
| 41 | Build: next build, prerender analysis, output tracing, static/dynamic detection | production build gate |
| 42 | Configuration: next.config.ts, redirects/rewrites/headers/images/output/cache/compiler/Turbopack | NextConfig TypeScript type + build |
| 43 | CLI/tooling: create-next-app, next dev/build/start/typegen, codemods/upgrades, MCP | package scripts + documented workflow |
| 44 | Application architecture: server-first, client islands, DAL/BFF, route/cache/error/security boundaries | Next module-graph checks + Dependency Cruiser + review |
| 45 | React essentials: props/children/composition/state/hooks/context/Suspense/errors/transitions/hydration | React compiler + Biome React domain + TypeScript/tests |

## Biome Next domain

The repository uses `"next": "all"` rather than only `"recommended"` so the
native Next.js rules cover every stable rule in the installed Biome version.
This includes checks around:

- async Client Components;
- image elements;
- head/document usage;
- inline/synchronous scripts;
- unwanted polyfills;
- Google font connection behavior;
- Next-specific React hook correctness.

Native tooling remains preferred over duplicating the same rule in GritQL.

## Framework-owned Server/Client security checks

Next.js already produces build-time errors when a module marked with
`server-only` is pulled into the client graph. It also exposes browser
environment variables only when they use the `NEXT_PUBLIC_` prefix.
Duplicating these cross-module rules with a single-file GritQL heuristic would
be both weaker and more error-prone than the framework check, so they remain
framework-owned.

## Why some official concepts do not get a syntax guard

Examples:

- A Server Action can contain a call named `auth()` and still have incorrect
  resource authorization. Syntax cannot prove authorization semantics.
- A Client Component may legitimately accept a function prop from another
  Client Component; a single-file rule cannot prove whether that prop crosses
  the RSC serialization boundary.
- Two sequential awaits may be dependent or independent. A syntax rule cannot
  reliably decide whether `Promise.all` is valid.
- A raw anchor may represent navigation, a download, a file, or an external
  protocol-relative URL. Blanket replacement with `Link` creates false
  positives.
- Suspense placement is a UX/data-dependency decision, not merely a syntax
  shape.

These concepts are intentionally assigned to framework checks, tests, or code
review instead of noisy pseudo-guards.
