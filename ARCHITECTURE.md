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
    (public)/             # sign-in, sign-up, recovery, email-link, phone
    (protected)/          # dashboard and settings
    api/auth/session/      # server cookie exchange and sign-out
    globals.css
    layout.tsx
    page.tsx
    typeset.css
  proxy.ts                 # optimistic protected-route redirect
  i18n/
    request.ts              # cookie-driven next-intl request configuration
  messages/                 # en, pt-BR, and es message catalogs
  components/
    firebase/           # immutable upstream Firebase UI reference (ADR 0004)
    notes-app/          # application-owned auth cards, forms, dialogs (ADR 0004)
    ui/                 # project-owned shadcn implementation layer
  hooks/                # custom hooks (alias @/hooks), one use-*.ts(x) per hook
    use-mobile.ts
    use-*.ts            # state/form logic extracted from src/components/notes-app/
  lib/
    firebase/               # client, admin, server identity, session
    i18n/                   # locale negotiation and client synchronization
    utils.ts

tests/
  e2e/
    home.spec.ts
  unit/
    firebase-reference.test.ts
    firebase-reference.manifest.sha256
    i18n-client.test.ts
    i18n-config.test.ts
    locale-lang-script.test.ts
    sign-out-button.test.tsx
    smoke.test.ts

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

`src/components/firebase/` holds the immutable upstream Firebase UI reference
components (ADR 0004). `src/components/notes-app/` holds application-owned
authentication cards, forms, and dialogs built with project shadcn primitives
(ADR 0004). Their state and form logic lives in `src/hooks/` (see
`CODING_STANDARDS.md` section 4). The implemented authentication slice (ADR
0005) uses the local Firebase Auth Emulator, a server-only session-verification
boundary, public `(public)` sign-in routes, and the protected `(protected)`
routes `/dashboard` and `/settings`. Firestore access, a DAL, repository
layer, exam domain services, and persistence remain unimplemented.
Internationalization uses cookie-driven `next-intl` request configuration
without locale URL prefixes. The server resolves the locale from the
`NEXT_LOCALE` cookie, then `Accept-Language`, then `en`; only the
`setLocalePreference` Server Action writes the cookie, so auto-detected locales
are never persisted. The root layout renders a static `<html lang>` and a
`beforeInteractive` script sets it from the same rules before hydration (it must
not read cookies under Cache Components). Firebase Auth mirrors the resolved
locale in `auth.languageCode`, and Firebase UI text is localized after mount
through `@firebase-oss/ui-translations`. Auth cards use Firebase UI translations through their translation hooks, but
full localization of application-owned strings, a locale picker, and Firestore
preference sync are not implemented yet (ADR 0007).

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

ADRs 0004-0008 (Firebase auth, Firestore, and localization) are accepted but
only partly built on `dev`: ADR 0005 is implemented (Auth Emulator with
password, e-mail-link, phone, Google OAuth, and SMS MFA flows, plus cookie-backed
protected routes), ADR 0007 is partially implemented (cookie-based `next-intl`
foundation only), and Firestore access remains unimplemented. See each ADR's
Current State section.

## 7. Architecture rules

- No circular dependencies.
- UI primitives cannot depend on application routing or application components.
- `src/lib` and `src/hooks` cannot depend at runtime on `src/components` or
  `src/app`; components cannot depend on `src/app`. Type-only imports are
  allowed. Enforced by Dependency Cruiser.
- Server-first Next.js composition.
- Small client boundaries.
- No speculative wrappers or service layers.
- Runtime behavior must be tested rather than inferred from syntax.
- Documentation must distinguish current implementation from planned or
  historical architecture.
