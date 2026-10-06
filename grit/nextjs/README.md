# Next.js GritQL Guards

This directory contains only the Next.js invariants that are both:

1. project-specific; and
2. reliably provable with the current Biome GritQL plugin engine.

The project does **not** use one `.grit` file per Next.js concept. Framework
invariants stay with the framework when Next.js, TypeScript, Biome, or runtime
tests can enforce them more accurately.

## Active guards

### `app-router-legacy-imports.grit`

Rejects legacy/Pages Router module references:

- `next/head`
- `next/router`
- `next/document`
- `next/legacy/image`

### `app-router-legacy-data-apis.grit`

Rejects Pages Router data lifecycle APIs:

- `getServerSideProps`
- `getStaticProps`
- `getStaticPaths`
- `getInitialProps`

## Enforcement ownership

- Next.js build/runtime: RSC boundaries, file conventions, rendering/cache
  behavior.
- `next typegen` + TypeScript: route-aware types and API signatures.
- Biome `next: "all"`: native Next.js lint rules.
- GritQL: low-ambiguity project migration/architecture patterns.
- Dependency Cruiser: import/dependency boundaries.
- Vitest/Playwright: runtime behavior.
- Review: authorization, DAL quality, Suspense placement, data minimization,
  deployment intent.

See [../../docs/NEXTJS-GUARD-COVERAGE.md](../../docs/NEXTJS-GUARD-COVERAGE.md).
