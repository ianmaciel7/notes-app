# Exam Study Platform

This repository is the foundation for an exam-study platform built with
Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

The repository name remains `notes-app`, but the active product direction is
study and assessment workflows rather than a generic notes product.

## Current implementation state

The `dev` branch currently contains the application foundation:

- Next.js 16.3.8 App Router with React Compiler enabled.
- Local Firebase Authentication, server-verified sessions, and protected routes.
- Cookie-driven language preferences for `en`, `pt-BR`, and `es`, with a
  user-facing selector, translated validation, and Firestore profile sync.
- React 19.2.8 and TypeScript 5.9.
- Tailwind CSS v4 and shadcn Base Nova / Base UI.
- A project-owned UI primitive layer in `src/components/ui/**`.
- Biome 2.4.2 with Next.js, React, project, types, test, and Playwright domains.
- Custom GritQL guards for Next.js App Router migration rules and shadcn
  consumption rules.
- Vitest unit and regression tests, Firestore security-rules tests, and
  Playwright E2E coverage.
- CI gates for linting, type generation, tests, architecture, spelling, unused
  code, duplication, code health, security audit, production build, bundle
  size, and E2E tests.

The exam domain and assessment workflows are not yet implemented.
Authentication and cookie-based localization are present. The repository has
an SDK-free domain layer (`src/domain/`), browser Firestore access
(`src/client/`), a server-only Admin SDK Data Access Layer (`src/data/`), and
thin Server Actions (`src/actions/`). The implemented data access covers
Spaces, Object Type deletion, and signed-in locale preferences; broader
exam-domain persistence remains planned. Browser Firestore configuration also
includes persistent local caching.

## Prerequisites

- Node.js 22.19.0
- pnpm 12.8.1

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Local authentication

Authentication and locale profile preferences use Firebase Auth and
Firestore Emulators with the `demo-notes-app` project ID, without any
Firebase cloud credentials in local development.

Production builds must provide `NEXT_PUBLIC_FIREBASE_CONFIG` as JSON with
`apiKey`, `appId`, `authDomain`, and `projectId`. This is Firebase's public
browser configuration, not a privileged credential. In production,
`authDomain` must be the domain that serves the app (not
`<projectId>.firebaseapp.com`): the app proxies `/__/auth/*` to Firebase so
sign-in works in browsers that block third-party storage. Also
authorize that domain in Firebase Authentication and add
`https://<app domain>/__/auth/handler` to the Google OAuth client's redirect
URIs (see [ADR 0006](docs/adr/0006-adopt-firebase-ui-v7-and-auth-resilience.md)).

```bash
pnpm run emulator
$env:FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099"
$env:FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080"
pnpm dev
```

The committed emulator seed contains one non-secret development account:

| Email | Password |
| --- | --- |
| `student@example.test` | `correct-horse-battery-staple` |

The same account owns two seeded Spaces (ADR 0010), written through
`firestore.rules` by the seed script.

Run `pnpm run emulators:seed` only when intentionally refreshing the committed
fixture. It exports a new baseline to `.firebase/seeds/`; ordinary emulator and
E2E commands import that baseline and never rewrite it. `pnpm run test:e2e`
owns the Auth and Firestore emulators and the Next.js lifecycle.
`pnpm run test:rules` separately starts a Firestore Emulator through
`firebase emulators:exec` on port 8080 to run the security-rules suite.

The supported local flows are e-mail/password registration, sign-in, sign-out,
e-mail-link sign-in, phone sign-in, and Firebase SDK-managed OAuth popup (redirect in embedded Electron browsers such as Cursor's)
sign-in. The Auth Emulator stores e-mail links and produces SMS/MFA codes
locally; it does not deliver messages. Tests retrieve OOB links from `oobCodes`
and SMS codes from `verificationCodes` through the emulator REST API instead of
relying on terminal output.

SMS MFA is enrolled and removed from the protected `/settings` route (which
requires a verified e-mail) and asserted at sign-in; the E2E retrieves both codes from `verificationCodes`. TOTP MFA is not an Emulator-backed flow in the pinned toolchain. The Emulator
serves a local provider page with mock accounts for Firebase SDK-managed OAuth;
manually supplied provider credentials remain subject to Emulator limits. See
[ADR 0005](./docs/adr/0005-adopt-firebase-auth-with-local-emulator.md) for the
support matrix.

## Language preferences

Select English, Brazilian Portuguese, or Spanish in the page header. An
explicit choice is stored in `NEXT_LOCALE` and, for signed-in users, in
`users/{uid}.locale` through a verified server session and Firebase Admin.
At sign-in a saved profile preference is applied across devices; automatically
detected languages are never stored as a deliberate choice. The Firestore
emulator is required locally when using signed-in locale preferences.

## Verification

Fast local verification:

```bash
pnpm run verify:fast
```

Focused verification while iterating:

```bash
pnpm run verify:changed
```

Test suites are separated into `tests/unit/` (Vitest), `tests/rules/`
(Firestore Emulator security rules), and `tests/e2e/` (Playwright). Run the
rules suite with `pnpm run test:rules`; it requires the Firestore Emulator and
Java. See [TESTING.md](./TESTING.md) for the test inventory and server-only
Vitest pattern.

Full CI additionally runs:

- Knip
- jscpd
- Fallow
- `pnpm audit --audit-level high`
- `next build`
- Size Limit
- Firestore security-rules tests
- Playwright E2E

## Guard system

Guard ownership is intentionally layered:

1. Next.js build/runtime owns framework invariants.
2. `next typegen` + TypeScript own route-aware typing.
3. Biome owns native Next.js/React/project/type/test rules.
4. GritQL owns low-ambiguity project-specific AST rules.
5. Dependency Cruiser owns module-boundary checks.
6. Vitest/Playwright own runtime behavior.
7. Code review owns architectural decisions that static analysis cannot prove.

See:

- [Next.js guard coverage](./docs/guards/NEXTJS-GUARD-COVERAGE.md)
- [shadcn guard coverage](./docs/guards/SHADCN-GUARD-COVERAGE.md)

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Testing](./TESTING.md)
- [Security](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)
- [Domain Glossary](./GLOSSARY.md)
- [Proposed Data Model](./DER.md)
- [ADRs](./docs/adr/README.md)
- [Product Specs](./docs/product-specs/README.md)
- [Execution Plans](./docs/exec-plans/README.md)
- [Agent Workflows](./docs/guides/workflows.md)
