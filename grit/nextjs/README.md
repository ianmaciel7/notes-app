# Next.js GritQL guards

These guards complement Biome's native Next.js domain for this repository's
Next.js 16 App Router architecture.

The project follows a strict enforcement order:

1. Prefer Next.js build/type checks when the framework already owns an
   invariant.
2. Prefer Biome's native Next.js/React/security rules when they already express
   the invariant.
3. Use GritQL only for low-ambiguity App Router rules that are not covered
   reliably by the standard tooling.
4. Use tests for runtime behavior.
5. Keep architectural decisions that require cross-file or domain knowledge in
   code review and repository documentation.

## Active GritQL coverage

- Reject Pages Router and legacy imports in this App Router-only codebase.
- Reject Pages Router data lifecycle APIs.
- Reject direct `cookies()` or `headers()` access inside a plain
  `"use cache"` function.

## Native framework and Biome coverage

`biome.json` enables the Next.js domain with `"next": "all"`. Native rules
therefore own checks such as image optimization, raw head usage, script
requirements, synchronous scripts, invalid document imports, and async Client
Components.

Next.js itself owns Server/Client module-graph errors, directive boundaries,
server-only/client-only imports, and environment-variable exposure rules. Those
checks are intentionally not duplicated with GritQL heuristics.

## What is intentionally not a GritQL rule

GritQL is not used when a rule would need semantic knowledge that a single-file
AST cannot prove. Examples include:

- whether a Client Component prop actually crosses a Server/Client boundary;
- whether independent fetches should run in parallel;
- whether a Server Action has correct authorization for a domain resource;
- whether a Route Handler needs authentication or rate limiting;
- whether a Suspense boundary is placed at the correct UX boundary;
- whether a raw anchor represents navigation versus a download/resource;
- whether a data-access module is the canonical DAL for the application.

Those concepts are still covered by the correct enforcement layer. See
`docs/NEXTJS-GUARD-COVERAGE.md`.
