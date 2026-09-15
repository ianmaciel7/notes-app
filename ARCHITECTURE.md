# Architecture

This document is the architectural source of truth for the Notes App. Read it
before planning or implementing changes. Keep it updated when the application
structure, runtime boundaries, routing model, or deployment architecture
changes.

## Current repository status

The active `dev` checkout contains the Next.js 16 App Router MVP. It uses
TypeScript, Tailwind CSS v4, Biome, shadcn/ui source components, Firebase
Google Auth, and static study fixtures. The historical `.worktrees/old*`
directories remain read-only references.

## Application model

- Use Next.js App Router, not the Pages Router.
- Use React Server Components by default.
- Add `'use client'` only for state, effects, event handlers, browser APIs, or
  client-only third-party packages.
- Keep client components small and place them below the nearest server
  component that owns data fetching.
- Pass only serializable values from Server Components to Client Components.
  Server Actions are the exception for function props.
- Use the Node.js runtime by default. Use Edge only for a documented
  requirement after verifying that every dependency is Edge-compatible.

## Target directory structure

```text
.
├── src/
│   ├── app/                         # App Router routes and route-local UI
│   │   ├── layout.tsx               # Root layout; server component by default
│   │   ├── page.tsx                 # Home route
│   │   ├── loading.tsx              # Root loading UI
│   │   ├── error.tsx                # Root error boundary; must be client
│   │   ├── not-found.tsx            # Root 404 UI
│   │   ├── global-error.tsx          # Last-resort global error boundary
│   │   ├── globals.css               # Global stylesheet imported by layout
│   │   ├── actions.ts                # Server Actions shared by app routes
│   │   ├── api/                      # Public/external HTTP endpoints
│   │   │   └── health/route.ts       # Deployment health check
│   │   └── (route-groups)/           # URL-neutral route organization
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Small presentational primitives
│   │   └── client/                   # Explicitly client-only components
│   ├── lib/                          # Server-safe and shared utilities
│   │   ├── utils.ts                  # cn() and shared shadcn utilities
│   │   ├── data/                     # Data access and cached loaders
│   │   ├── validation/               # Input and environment validation
│   │   └── image-loader.ts           # Optional custom image loader
│   └── styles/                       # Optional additional CSS modules
├── public/                           # Static files served at the site root
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                     # Generated Next.js types
├── tsconfig.json                     # Strict TypeScript configuration
├── postcss.config.*                  # CSS/Tailwind processing
├── components.json                    # shadcn/ui configuration and aliases
├── package.json                      # Scripts and dependencies
├── .env.example                      # Documented non-secret variables
├── Dockerfile                        # Only if self-hosting is required
├── cache-handler.*                   # Only for shared multi-instance caching
└── ARCHITECTURE.md                   # This document
```

## shadcn/ui architecture

The UI layer follows shadcn/ui conventions. Components are copied into the
repository and remain modifiable source code. The project must use the
configuration in `components.json` for its template, primitive base, style,
icon library, aliases, and component paths.

- `src/components/ui/` contains generated shadcn primitives and their local
  adaptations.
- `src/components/` contains feature-level compositions built from those
  primitives; do not duplicate primitives there.
- `src/lib/utils.ts` contains `cn()` and other genuinely shared helpers.
- `src/app/globals.css` is the single source for the shadcn theme variables and
  semantic color tokens. Extend the existing token system instead of adding
  unrelated color values or a second global theme file.
- Prefer shadcn components and their variants before custom markup. Compose
  `Card`, `Tabs`, `Sidebar`, `Dialog`, `Field`, `Alert`, `Empty`, `Skeleton`,
  `Badge`, `Separator`, and `sonner` according to their accessible structures.
- Use semantic tokens, `gap-*`, `size-*`, `truncate`, and `cn()` for styling.
  Avoid raw palette colors, manual dark-mode overrides, `space-x-*`,
  `space-y-*`, and manual overlay z-index values.
- Keep form validation accessible with `data-invalid` on `Field` and
  `aria-invalid` on its control. Keep Dialog/Sheet/Drawer titles present even
  when they are visually hidden.
- Check the configured `base` and `iconLibrary` before using `asChild`,
  `render`, or importing icons. Never assume Radix or Lucide without checking
  `components.json`.

The active checkout has been initialized through the official shadcn CLI. Its
configured Base UI primitive API uses `render`, not Radix-only `asChild`.

### Domain object UI

- `src/components/object/icons/` contains domain SVG components built on the
  shared `ObjectIcon` primitive.
- `src/lib/object.ts` owns the `ObjectIconName` union and `objectIconMap`
  consumed by object UI.
- `src/components/object/split-buttons/` contains feature compositions built
  on the shared split-button primitives. Actionable object types keep their
  icon and split-button variants paired.
- The `question` type follows this path and does not create a new primitive or
  runtime boundary.

### Route segment conventions

- `page.tsx` defines the UI for a route.
- `layout.tsx` provides shared UI and preserves state across navigation.
- `template.tsx` intentionally remounts its children on navigation.
- `loading.tsx` provides a streaming/Suspense fallback for a segment.
- `error.tsx` is a Client Component error boundary and must expose a reset
  path for recoverable errors.
- `not-found.tsx` renders a segment's 404 state.
- `route.ts` defines a Route Handler and cannot coexist with `page.tsx` in the
  same route segment.
- `proxy.ts` replaces `middleware.ts` in Next.js 16 and is reserved for
  request-time network concerns such as redirects, rewrites, or lightweight
  access checks.
- Use `[id]` for dynamic segments, `[...slug]` for catch-all segments,
  `[[...slug]]` for optional catch-all segments, `(group)` for URL-neutral
  organization, and `@slot` for parallel routes.
- Parallel and intercepting routes must include `default.tsx` fallbacks and
  must close modal flows with `router.back()` where appropriate.

## Rendering and component boundaries

### Server Components

Pages, layouts, and data-driven components should remain Server Components
unless they need client capabilities. Fetch private data directly on the
server; do not create an internal HTTP round trip merely to read data.

### Client Components

Client Components may use hooks, browser APIs, and event handlers, but they
must not be async components. Fetch their initial data in a Server Component
and pass serializable props down. Browser-only packages belong behind a small
client wrapper or a `next/dynamic` import with `ssr: false` when required.

Never pass functions, class instances, `Date`, `Map`, `Set`, symbols, or other
non-serializable values across a Server-to-Client boundary. Serialize dates and
convert collections to plain objects or arrays first.

### Directives

- `'use client'` marks a file as a Client Component boundary.
- `'use server'` marks a Server Action or a server-only module.
- `'use cache'` is allowed only where the caching behavior is intentional,
  documented, and compatible with the project's cache strategy.

## Data fetching and mutations

Use this decision model:

| Need | Preferred mechanism |
| --- | --- |
| Internal read for a Server Component | Direct server-side data access |
| UI mutation or form submission | Server Action |
| Public REST API, webhook, or external client | Route Handler |
| Cacheable HTTP GET endpoint | Route Handler with explicit cache policy |
| Client-side read | Pass initial data from the server, or use a Route Handler when necessary |

- In Next.js 15+, `params`, `searchParams`, `cookies()`, and `headers()` are
  asynchronous. Type them as `Promise<...>` and `await` them.
- Use `Promise.all` for independent requests and `Suspense` for independently
  streamable sections to avoid request waterfalls.
- Use React's `cache` and preload patterns for deduplicated data access where
  appropriate.
- Server Actions are POST-only internal mutations. Validate authorization and
  inputs inside every action and return only serializable values.
- Route Handlers use the Web `Request`/`Response` APIs, validate all input, and
  return explicit status codes. They must not import UI code.
- Revalidate intentionally with `revalidatePath` or `revalidateTag`; document
  the invalidation contract next to the data access code.

## Errors, loading, and navigation

- Add `loading.tsx` at route boundaries that can have meaningful wait time.
- Add `error.tsx` for recoverable segment errors; it must be a Client Component.
- Use `notFound()` and `not-found.tsx` for missing resources.
- Use `redirect()` or `permanentRedirect()` for navigation decisions on the
  server. Use `router.push`/`router.replace` only in client interactions.
- Preserve error causes when logging and do not expose secrets or internal
  stack traces to users.
- Wrap `useSearchParams()` in `Suspense`; wrap `usePathname()` in `Suspense`
  on dynamic routes unless static generation makes it unnecessary.

## Metadata, images, fonts, and scripts

- Define static metadata with `metadata` and dynamic metadata with
  `generateMetadata`; await dynamic `params` before deriving metadata.
- Prefer file-based metadata such as `favicon.ico`, `robots.txt`, `sitemap.xml`,
  `opengraph-image.*`, and `twitter-image.*` where suitable.
- Use `next/image` instead of `<img>`. Provide meaningful `alt` text, responsive
  `sizes`, and `priority` only for above-the-fold/LCP images. Configure remote
  image hosts explicitly.
- Use `next/font` for local or Google fonts. Keep font loading in the root
  layout and avoid unoptimized external font stylesheets.
- Use `next/script` instead of native `<script>` tags. Inline scripts require
  an `id`; do not put `Script` inside `next/head`. Use
  `@next/third-parties` for supported analytics integrations.
- Import CSS through the module system or CSS Modules. Do not add stylesheet
  `<link>` tags for application CSS.

## Bundling and dependencies

- Keep browser-only dependencies out of Server Components. Use client wrappers,
  dynamic imports, `serverExternalPackages`, or `transpilePackages` according
  to the package's needs.
- Do not add redundant CDN polyfills; Next.js supplies standard polyfills.
- Prefer Turbopack-compatible configuration and avoid custom webpack config
  unless there is a documented, tested exception.
- Run bundle analysis with `next experimental-analyze` when a dependency or
  route materially increases client/server bundle size.

## Configuration and security

- Keep secrets server-only. Only variables intentionally exposed to the browser
  may use the `NEXT_PUBLIC_` prefix.
- Validate environment variables at startup or at the server boundary.
- Never put credentials in client props, URLs, logs, or committed files.
- Keep authorization checks in Server Actions, Route Handlers, and data access
  functions; UI visibility is not an authorization boundary.
- Use `proxy.ts` for routing/network policy, not as a replacement for complete
  authorization in the data layer.

## Deployment

- The default deployment target is Vercel unless the project explicitly adopts
  another host.
- For Docker or other self-hosted deployments, use `output: 'standalone'`, run
  as a non-root user, copy `.next/static` and `public`, and expose a health
  check endpoint.
- A single instance can use the default filesystem cache. Multi-instance ISR
  requires a shared cache handler and coordinated invalidation.
- Choose Edge runtime only after checking dependency compatibility and the
  latency requirement. Node.js remains the default.
- Build locally with `pnpm build` before deployment and inspect the production
  output for route, metadata, image, and environment issues.

## Verification and debugging

- Use `pnpm test`, `pnpm build`, and the project's lint/typecheck commands as
  applicable before declaring changes complete.
- When a dev server is running on Next.js 16+, use its `/_next/mcp` endpoint or
  Next DevTools to inspect routes, errors, metadata, and Server Actions.
- Never assume the dev server uses port 3000; use the port reported by the
  running process.
- Verify hydration-sensitive code for browser-only APIs, unstable values,
  invalid HTML nesting, and server/client markup differences.

## Architectural change checklist

Before merging an architectural change:

1. Confirm the change follows the App Router and Server Component defaults.
2. Identify every new client boundary and verify prop serializability.
3. Choose Server Components, Server Actions, or Route Handlers using the data
   model above.
4. Add the required loading, error, not-found, metadata, and Suspense behavior.
5. Check runtime, caching, environment, security, image, font, and script
   implications.
6. Update this document and the actual directory tree together.
7. Run the relevant tests, type checks, lint checks, and production build.
