# Next.js GritQL Guards

This directory contains project-specific Next.js guards that complement the
framework, TypeScript, and Biome.

The current pack intentionally targets rules with stable syntax and low false
positive risk. It does not try to convert every Next.js concept into GritQL.

## Active guards

### App Router migration

- `app-router-legacy-imports.grit`
- `app-router-legacy-data-apis.grit`

### Next.js 16 migration and removed APIs

- `next16-deprecated-middleware-export.grit`
- `next16-deprecated-middleware-config.grit`
- `next16-removed-runtime-config.grit`
- `next16-removed-amp.grit`
- `next16-removed-root-params.grit`
- `next16-removed-cache-experiments.grit`
- `next16-promoted-experimental-config.grit`
- `next16-experimental-ppr.grit`
- `next16-removed-dev-indicators.grit`
- `next16-removed-eslint-config.grit`

### Type safety, cache, and request APIs

- `no-ignore-build-errors.grit`
- `revalidate-tag-profile.grit`
- `async-cookies-access.grit`
- `async-headers-access.grit`
- `async-draft-mode-access.grit`

### Security and control flow

- `no-public-secret-env.grit`
- `redirect-outside-try.grit`

## Ownership

The pack does not duplicate rules already owned more accurately by:

- Next.js build/runtime;
- `next typegen` + TypeScript;
- Biome `next: "all"` and React/type/project domains;
- Dependency Cruiser;
- Vitest/Playwright;
- architecture and security review.

Examples intentionally left outside GritQL include authorization correctness,
DAL quality, whether two awaits are independent, Suspense placement, and
whether a Client Component boundary is unnecessarily large.

See [../../docs/NEXTJS-GUARD-COVERAGE.md](../../docs/NEXTJS-GUARD-COVERAGE.md).
