# Contributing

## Prerequisites

- Node.js 22.19.0
- pnpm 12.8.1
- Git

## Setup

```bash
pnpm install
pnpm dev
```

## Branch workflow

Feature and fix work should branch from `dev` and normally merge back into
`dev`.

Use lowercase kebab-case branch names with a clear prefix, for example:

- `feat/question-card`
- `fix/sidebar-state`
- `chore/next-guards`

Delivery branches such as `stag` and `main` are promoted deliberately rather
than used as everyday feature integration branches.

## Commits

Use Conventional Commits:

`<type>(<scope>): <description>`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Prefer small commits with one coherent context.

## Local verification

During iteration:

```bash
pnpm run verify:changed
```

Before opening or updating a PR:

```bash
pnpm run verify:fast
```

The fast CI gate additionally runs Knip, jscpd, Fallow, and the high-severity
pnpm audit.

The extended CI gate runs:

```bash
pnpm run build
pnpm run check:size
pnpm run test:rules
pnpm run test:e2e
```

Firestore security rules are a separate suite. `pnpm run test:rules` starts a
Firestore Emulator through `firebase emulators:exec` on port 8080, so it
requires the emulator prerequisites, including Java. See
[Testing](./TESTING.md) for the complete unit, rules, and E2E test layout.

## Repository layout

The application is organized by runtime boundary. `src/domain/` contains
SDK-free domain rules; `src/client/` contains browser Firestore access;
`src/parsers/` contains Firestore snapshot parsers;
`src/data/` contains the server-only Admin SDK Data Access Layer; and
`src/actions/` contains thin Server Actions that validate arguments and
delegate. `src/app/**/_components/` contains route-private application components,
`src/components/ui/` is the owned shadcn implementation layer, and `src/lib/`
and `src/hooks/` hold shared infrastructure and client behavior.

Tests are separated into `tests/unit/` (Vitest), `tests/rules/` (Firestore
security rules), and `tests/e2e/` (Playwright). Dependency Cruiser enforces
the domain, client, data, and actions boundaries; see
[ARCHITECTURE.md](./ARCHITECTURE.md) for the implemented structure.

## Standards

Read these before substantial changes:

- [Architecture](./ARCHITECTURE.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Testing](./TESTING.md)
- [Security](./SECURITY.md)
- [Next.js guard coverage](./docs/guards/NEXTJS-GUARD-COVERAGE.md)
- [shadcn guard coverage](./docs/guards/SHADCN-GUARD-COVERAGE.md)

## Pull requests

1. Keep the diff focused.
2. Explain behavior changes and architectural impact.
3. Include visual evidence for UI changes when useful.
4. Confirm relevant fast and extended verification.
5. Prefer squash merge for feature-to-`dev` integration unless preserving
   individual commits materially helps history.
