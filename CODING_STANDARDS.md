# Coding Standards

These standards describe the current enforced conventions for the `dev`
branch.

## 1. TypeScript

- Keep TypeScript strict.
- Do not bypass build failures with `ignoreBuildErrors`.
- Avoid `any` at route and domain boundaries.
- Prefer generated Next.js route-aware types when available:
  `PageProps`, `LayoutProps`, and `RouteContext`.
- Treat `params`, `searchParams`, form data, headers, cookies, and request
  bodies as untrusted runtime input.

Formatting is owned by Biome:

- spaces;
- 2-space indentation;
- LF line endings;
- 80-column formatter width;
- organized imports.

## 2. Next.js App Router

The project is App Router-only.

Do not use Pages Router APIs such as:

- `next/router`;
- `next/head`;
- `next/document`;
- `next/legacy/image`;
- `getServerSideProps`;
- `getStaticProps`;
- `getStaticPaths`;
- `getInitialProps`.

### Server-first components

Server Components are the default.

Use `"use client"` only when the subtree requires:

- client state;
- effects;
- event handlers;
- browser APIs;
- a client-only dependency.

Keep client boundaries as small and deep as practical.

### Data access

When server data is introduced:

- read server-accessible data directly in Server Components or server-only
  modules;
- do not call the application's own Route Handler from a Server Component;
- centralize privileged data access behind a narrow server-only boundary when
  the domain justifies a DAL;
- return minimum safe DTOs to Client Components;
- parallelize independent I/O instead of introducing avoidable waterfalls.

### Server Actions and Route Handlers

Treat both as externally reachable server operations.

- Validate input at runtime.
- Authenticate at the operation boundary.
- Authorize the concrete resource/action.
- Never trust client-provided ownership or role claims.
- Revalidate/cache-invalidate intentionally after mutations.

## 3. React

- Components and hooks must remain pure during render.
- Do not mutate props or state.
- Prefer composition over passthrough wrappers.
- Let React Compiler perform routine memoization.
- Add manual `useMemo`/`useCallback` only for measured or semantically
  necessary cases.

## 4. Component architecture

- One component should have one clear responsibility.
- Prefer compound component composition for structured UI.
- Keep state logic in the smallest sensible owner.
- Extract a custom hook when state/effects form a reusable or independently
  understandable behavior.
- Avoid middleman components that only rename another component.
- Name components after their actual primitive/semantic role.

For UI naming, prefer vocabulary from:

1. shadcn/ui;
2. Base UI / dnd-kit where relevant;
3. semantic HTML.

## 5. shadcn / Base UI

`src/components/ui/**` is the project-owned implementation layer.

Application code should:

- reuse owned primitives before creating equivalents (such as `Separator`
  over `<hr>`);
- use `Skeleton` for loading placeholders rather than custom `animate-pulse`
  markup;
- use the Base UI `toast` primitive (`@/components/ui/toast`) rather than
  `sonner`;
- use Base UI `render` rather than Radix-only `asChild`;
- keep required compound parts under their correct owner (including chat and
  messaging primitives);
- preserve Button vs Link semantics;
- let components own icon sizing rather than manual sizing classes on nested
  icons;
- provide accessible names for icon-only controls;
- use semantic color tokens;
- avoid manual dark-mode colors;
- use logical direction utilities for RTL readiness;
- use `cn()` for conditional class composition;
- avoid manual overlay z-index ownership.

Application consumption rules are enforced by the GritQL pack documented in
[shadcn guard coverage](./docs/guards/SHADCN-GUARD-COVERAGE.md).

## 6. Tailwind CSS

- Tailwind CSS v4 is CSS-first.
- Prefer semantic tokens over raw palette colors in application code.
- Prefer `gap-*` over `space-x-*` / `space-y-*`.
- Prefer `size-*` when width and height are equal (`size-10` over `w-10 h-10`).
- Prefer `truncate` over manually composing overflow/ellipsis/nowrap.
- Keep direction-sensitive styling logical (`start/end`, `ms/me`,
  `ps/pe`, `text-start/text-end`).

## 7. Accessibility

User-facing components should preserve semantic HTML and keyboard behavior.

Accessibility enforcement is layered across:

- Biome recommended accessibility rules;
- Base UI runtime primitives;
- shadcn GritQL rules;
- Playwright/axe for browser behavior.

Do not claim conformance solely because static checks pass.

## 8. Testing

- Add regression tests for bug fixes.
- Test observable behavior, not internal implementation.
- Use Vitest for fast source tests.
- Use Playwright for browser navigation and interaction.
- Add axe checks to meaningful user-facing flows as they are implemented.

See [TESTING.md](./TESTING.md).

## 9. Module boundaries

Dependency Cruiser enforces:

- no circular dependencies;
- no unresolved dependencies;
- UI primitives cannot depend on domain components or app routing.

Avoid speculative service/repository layers until an actual domain seam exists.

## 10. Guard ownership

Do not create a custom GritQL rule when Next.js, TypeScript, Biome, or runtime
tests already enforce the invariant more accurately.

Current Next.js GritQL rules intentionally focus on low-ambiguity legacy
patterns. See [Next.js guard coverage](./docs/guards/NEXTJS-GUARD-COVERAGE.md).

## 11. Verification

During iteration:

```bash
pnpm run verify:changed
```

Before delivery:

```bash
pnpm run verify:fast
```

CI additionally runs Knip, jscpd, Fallow, security audit, production build,
Size Limit, and Playwright.
