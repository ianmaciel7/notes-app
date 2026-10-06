# Exam Study Platform

This repository is the foundation for an exam-study platform built with
Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

The repository name remains `notes-app`, but the active product direction is
study and assessment workflows rather than a generic notes product.

## Current implementation state

The `dev` branch currently contains the application foundation:

- Next.js 16.3.8 App Router with React Compiler enabled.
- React 19.2.8 and TypeScript 5.9.
- Tailwind CSS v4 and shadcn Base Nova / Base UI.
- A project-owned UI primitive layer in `src/components/ui/**`.
- Biome 2.4.2 with Next.js, React, project, types, test, and Playwright domains.
- Custom GritQL guards for Next.js App Router migration rules and shadcn
  consumption rules.
- Vitest and Playwright smoke coverage.
- CI gates for linting, type generation, tests, architecture, spelling, unused
  code, duplication, code health, security audit, production build, bundle
  size, and E2E tests.

Domain features, authentication, persistence, localization, and assessment
workflows are not yet implemented on the current `dev` branch unless stated
by a future product spec or ADR.

## Prerequisites

- Node.js 22.19.0
- pnpm 12.8.1

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Verification

Fast local verification:

```bash
pnpm run verify:fast
```

Focused verification while iterating:

```bash
pnpm run verify:changed
```

Full CI additionally runs:

- Knip
- jscpd
- Fallow
- `pnpm audit --audit-level high`
- `next build`
- Size Limit
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
