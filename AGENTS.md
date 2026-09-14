# AGENTS.md

## Project overview

This is a Next.js application managed with pnpm.

## Setup and development

- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Run tests: `pnpm test`

## Code style

- Use TypeScript strict mode.
- Use single quotes and omit semicolons.
- Prefer functional patterns where practical.
- Keep code and documentation in English.
- Keep identifiers, filenames, test descriptions, comments, error messages, and user-facing application copy clear and idiomatic in English.

## Next.js best practices

- Follow current Next.js App Router conventions and inspect the existing project structure before adding files.
- Prefer React Server Components by default; add `'use client'` only when browser APIs, state, effects, or event handlers require it.
- Keep client components small and pass only serializable props across the server/client boundary.
- Use Server Actions for UI mutations and Route Handlers for HTTP APIs or external integrations.
- Avoid request waterfalls with parallel data fetching, `Suspense`, and appropriate caching or revalidation strategies.
- Use `next/link`, `next/image`, and `next/font` instead of equivalent unoptimized HTML or external loading patterns.
- Follow Next.js metadata and error-handling conventions, including `metadata`, `generateMetadata`, `not-found.tsx`, and `error.tsx` where appropriate.
- Use the Node.js runtime by default and choose Edge only when the implementation and dependencies support it.

## Tooling preferences

- Prefer the project's CLI tools or available MCP integrations for supported operations instead of manually recreating their results.
- Use the shadcn CLI or its MCP integration when adding shadcn components; verify the component before installing it.
- Use Shoogle or another appropriate registry/search integration when looking for reusable components or packages.
- Inspect generated or downloaded files and adapt them to the repository's conventions before considering the work complete.

## Contribution guidelines

- Preserve existing changes and avoid destructive commands.
- Keep changes focused.
- Add or update tests for behavior changes.
- Update documentation when behavior or architecture changes.
