# Architecture

This document describes the architecture that is actually present on the
current `dev` branch. Planned product architecture belongs in product specs,
ADRs, or `DER.md` and must not be described here as already implemented.

## 1. Current system

```text
Browser
  |
  v
Next.js 16.3.8 App Router
  |
  +-- Server Components by default
  +-- Client Components only for interactive leaves
  +-- React Compiler enabled
  |
  v
shadcn Base Nova / Base UI
  |
  v
Tailwind CSS v4 semantic tokens
```

Current core versions:

| Concern | Current choice |
| --- | --- |
| Framework | Next.js 16.3.8 App Router |
| React | React 19.2.8 |
| Compiler | React Compiler via `babel-plugin-react-compiler` 1.0.0 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4.3 |
| UI | shadcn Base Nova on Base UI |
| Lint/format | Biome 2.4.2 |
| Package manager | pnpm 12.8.1 |
| Unit tests | Vitest 5 + Happy DOM |
| E2E | Playwright 1.63, Chromium |
| Architecture checks | Dependency Cruiser |
| Dead code | Knip |
| Bundle budgets | Size Limit |

## 2. Current repository structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    typeset.css
  components/
    ui/                 # project-owned shadcn implementation layer
  hooks/
    use-mobile.ts
  lib/
    utils.ts
  smoke.test.ts

tests/
  e2e/
    home.spec.ts

grit/
  nextjs/
  shadcn/

docs/
  adr/
  agents/
  exec-plans/
  guides/
  product-specs/
```

There is currently no implemented Firebase layer, authentication layer,
internationalization layer, DAL, repository layer, exam domain service layer,
or persistence adapter on `dev`.

## 3. Next.js architecture

### Server-first

Server Components are the default. Add `"use client"` only when a subtree
requires client-side state, effects, event handlers, browser APIs, or another
client-only dependency.

Keep the client boundary as low as practical. Static presentation and
server-readable data should remain in Server Components.

### Server and Client boundaries

- Do not import server-only modules into the client graph.
- Do not expose private environment variables to Client Components.
- Data crossing a Server-to-Client boundary must be serializable.
- Prefer Server/Client composition through children rather than pulling server
  concerns into a client entry module.
- Treat Server Actions and Route Handlers as security-sensitive server
  endpoints: validate input and authorize at the operation boundary.

### Data access

When server-side data is introduced:

- Server Components should access the data source directly rather than calling
  the application's own Route Handler.
- Privileged data access should live in a server-only DAL or equivalent narrow
  server module.
- Return minimum safe DTOs to Client Components.
- Avoid obvious request waterfalls; parallelize independent I/O.
- Put slow runtime work behind appropriate Suspense boundaries.

### Cache and revalidation

Cache semantics belong to Next.js framework checks and explicit tests. Do not
invent GritQL rules for behavior that requires request/runtime knowledge.

When Cache Components are adopted, use current Next.js APIs and update
`docs/guards/NEXTJS-GUARD-COVERAGE.md` with the chosen enforcement layer.

## 4. UI architecture

`src/components/ui/**` is the project-owned shadcn implementation layer.

Application code should:

- reuse existing shadcn primitives before creating equivalents;
- compose compound components according to their documented ownership;
- use semantic Tailwind tokens;
- keep accessibility semantics intact;
- prefer Base UI's `render` API instead of Radix-only `asChild`;
- keep raw interactive HTML out of application code when an owned primitive
  already exists.

The UI implementation directory is intentionally excluded from application
consumption guards so registry-managed code is not rewritten by project rules.

## 5. Guard and verification architecture

```text
Source change
   |
   +--> Biome + GritQL
   +--> next typegen + TypeScript
   +--> Vitest
   +--> Dependency Cruiser
   +--> CSpell
   +--> Knip
   +--> jscpd
   +--> Fallow
   +--> pnpm audit
   |
   v
Fast Verification Gate
   |
   +--> next build
   +--> Size Limit
   +--> Playwright
   |
   v
Extended Verification
```

The current CI must remain green before documentation can claim a capability is
verified.

## 6. Planned domain architecture

The target product includes exam and question workflows, attempts, review
scheduling, and related study concepts. `GLOSSARY.md` and `DER.md` describe
target-domain vocabulary and proposed data modeling.

Those documents are planning artifacts until corresponding source modules,
tests, and active ADRs exist.

Historical Firebase and localization ADRs are retained for traceability but are
not active implementation decisions on the current `dev` branch.

## 7. Architecture rules

- No circular dependencies.
- UI primitives cannot depend on application routing or domain components.
- Server-first Next.js composition.
- Small client boundaries.
- No speculative wrappers or service layers.
- Runtime behavior must be tested rather than inferred from syntax.
- Documentation must distinguish current implementation from planned or
  historical architecture.
