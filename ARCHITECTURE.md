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
    (public)/             # email-link, forgot-password, phone, sign-in, sign-up
      email-link/page.tsx
      forgot-password/page.tsx
      layout.tsx
      phone/page.tsx
      sign-in/page.tsx
      sign-up/page.tsx
    (protected)/          # dashboard and settings
      dashboard/page.tsx
      error.tsx
      layout.tsx
      settings/page.tsx
    api/auth/session/
      route.ts             # server cookie exchange and sign-out
    error.tsx
    favicon.ico
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
    typeset.css
  actions/                 # thin Server Actions
    locale-actions.ts
    space-actions.ts
  client/                  # browser Firestore access
    space-client.ts
  components/
    firebase/              # immutable upstream Firebase UI reference (ADR 0004)
    notes-app/             # application-owned auth cards, forms, dialogs (ADR 0004)
    ui/                    # project-owned shadcn implementation layer
  data/                    # server-only Data Access Layer (*-dal.ts only)
    locale-dal.ts
    object-type-dal.ts
    space-dal.ts
    current-identity-dal.ts # shared verified-owner Space reference guard
  domain/                  # SDK-free domain rules (ADR 0011)
    object-type-inheritance.ts
    object-type.ts
    space.ts
  hooks/                   # custom hooks (alias @/hooks), one use-*.ts(x) per hook
  i18n/
    request.ts             # cookie-driven next-intl request configuration
  lib/
    firebase/              # client, admin, server identity, session, form errors
      admin.ts
      auth-error.ts
      auth-proxy.ts
      client.ts
      config.ts
      firestore.ts
      form-error.ts
      identity.ts
      second-factors.ts
      server-config.ts
      session-client.ts
      session.ts
    i18n/                  # locale negotiation and client synchronization
      client.ts
      config.ts
      firebase-ui-locale.ts
      locale-lang-script.ts # pre-hydration locale synchronization script builder
    theme/                 # theme constants, parsing, and script builder
    utils.ts
  messages/                # en, pt-BR, and es message catalogs
  proxy.ts                 # optimistic protected-route redirect

tests/
  e2e/
    firestore-cache.spec.ts
    home.spec.ts
    locale.spec.ts
  rules/
    firestore.rules.test.ts
    object-types.rules.test.ts
    space-deletion.rules.test.ts
    spaces-client.rules.test.ts
    spaces-offline.rules.test.ts
    spaces.rules.test.ts
  unit/
    auth-error.test.ts
    auth-proxy.test.ts
    auth-session-route.test.ts
    component-props-type-guard.test.ts
    components-layer-structure-lib.ts
    components-layer-structure.test.ts
    data-layer-structure-lib.ts
    data-layer-structure.test.ts
    firebase-firestore.test.ts
    firebase-reference.test.ts
    firebase-reference.manifest.sha256
    firebase-session.test.ts
    firebase-ui-locale.test.ts
    i18n-client.test.ts
    i18n-config.test.ts
    locale-actions-profile.test.ts
    locale-actions.test.ts
    locale-dal.test.ts
    locale-lang-script.test.ts
    object-type-inheritance.test.ts
    object-type-parse.test.ts
    second-factor-panel.test.tsx
    shadcn-composition-guards.test.ts
    sign-out-button.test.tsx
    smoke.test.ts
    space-actions.test.ts
    space-client.test.ts
    space-domain.test.ts
    theme-script.test.ts
    use-auth-provider.test.ts
    wait-for-ci.test.ts

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
0005) uses `src/lib/firebase/session.ts` and `src/lib/firebase/identity.ts` for
the server-side session and identity boundary, public `(public)` sign-in
routes, and the protected `(protected)` routes `/dashboard` and `/settings`.
The browser Firestore base configuration
(persistent multi-tab cache, emulator connection, cache cleanup on sign-out)
exists in `src/lib/firebase/firestore.ts` (ADR 0008). The Space module supports
owner-scoped Space reads and writes in `src/client/space-client.ts`, while
Space and Object Type deletion is a narrow **server-only** Admin SDK Data
Access Layer in `src/data/`, reached through the thin Server Actions in
`src/actions/space-actions.ts` (ADR 0011). The DAL obtains the current
identity itself, authorizes the requested resource, accepts no caller-supplied
UID, and exposes only minimal DTOs where a result crosses the action boundary.
`src/data/` contains only `*-dal.ts` modules beginning with `import
"server-only"`; their only exports are async DAL operations. Pure rules,
errors, and validation belong in `src/domain/`. The shared ownership guard
`requireOwnedSpaceRef(spaceId)` lives in `src/data/current-identity-dal.ts` and is used by
`space-dal.ts` and `object-type-dal.ts`; it returns an Admin SDK document
reference only after authenticating and verifying ownership. Other server-only
Firebase Admin SDK adapters shared by DALs belong in `src/lib/firebase/` and
are imported only by `src/data/`. The Vitest data-layer structure test enforces
the `*-dal.ts` name and the export rules for every file in `src/data/`, and the
Dependency Cruiser rule `data-not-importable-by-browser-layers` enforces who may
import `src/data/`, alongside the existing layer rules. The Dependency Cruiser
rule `data-files-must-be-dal` is a partial, redundant check that only sees
files with at least one dependency.
`src/domain/` contains the SDK-free Space types and Object Type parsing and
inheritance-resolution logic; the Dependency Cruiser rules `domain-is-pure`,
`client-cannot-import-server-layers`, `data-cannot-import-client-layers`, and
`actions-cannot-import-client-layers` enforce the layer boundaries. No runtime
path uses inherited Object Types. The same layout serves the locale
preference: `src/actions/locale-actions.ts` is thin, and the server-only
`src/data/locale-dal.ts` verifies the Firebase session itself and persists
signed-in user locale preferences to `users/{uid}.locale` (ADR 0007).

Internationalization uses cookie-driven `next-intl` without locale URL
prefixes. The server resolves locale from the `NEXT_LOCALE` cookie,
`Accept-Language`, or the English default; auto-detected values are never
persisted. The root layout keeps static `<html lang>`, with a
`beforeInteractive` script for pre-hydration language selection. An async
`IntlProvider` under root `Suspense` supplies translated application strings
and a page-header locale picker. The picker calls a Server Action, which
writes the explicit cookie and updates the verified user's Firestore profile.
At sign-in, a stored profile locale is applied through a server action.
Firebase Auth mirrors it in `auth.languageCode`, and Firebase UI text is
localized through `@firebase-oss/ui-translations` after mount. App-owned
messages and validation use `src/messages/{locale}.json`.

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

ADRs 0004-0008 cover Firebase UI, Authentication, localization, and
Firestore. ADR 0005 provides Auth Emulator flows and protected sessions.
ADR 0007 adds cookie-based locale selection, translated interfaces,
validation, and user-profile persistence through Firebase Admin Firestore.
ADR 0008 implements the base browser Firestore configuration, security rules
and cache cleanup. Runtime verification status belongs to each ADR and CI.

## 7. Architecture rules

- No circular dependencies.
- UI primitives cannot depend on application routing or application components.
- `src/lib` and `src/hooks` cannot depend at runtime on `src/components` or
  `src/app`; components cannot depend on `src/app`. Type-only imports are
  allowed. Enforced by Dependency Cruiser.
- `src/data/` contains only server-only `*-dal.ts` Data Access Layer modules;
  browser-capable layers cannot import it. Enforced by Vitest and Dependency
  Cruiser.
- Server-first Next.js composition.
- Small client boundaries.
- No speculative wrappers or service layers.
- Runtime behavior must be tested rather than inferred from syntax.
- Documentation must distinguish current implementation from planned or
  historical architecture.
