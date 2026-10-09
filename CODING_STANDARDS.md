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

Fallow audits code size and complexity (tests are exempt):

- functions over 80 lines (blank lines ignored);
- files over 300 lines (blank lines ignored);
- more than 4 parameters (use an options object);
- cognitive complexity above 15.

See [TOOLING.md](./TOOLING.md) section 3 for the check (`pnpm run check:health`).

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

For server-side data access:

- read server-accessible data directly in Server Components or server-only
  modules;
- do not call the application's own Route Handler from a Server Component;
- put privileged Firebase Admin SDK access in `src/data/`; each public DAL
  function obtains the current identity and authorizes the requested resource
  itself, never accepting a UID from its caller;
- return minimal DTOs rather than raw records when data leaves the DAL or
  crosses to a Client Component;
- parallelize independent I/O instead of introducing avoidable waterfalls.

### Server Actions and Route Handlers

Treat both as externally reachable server operations.

- Validate input at runtime.
- Server Actions in `src/actions/` stay thin: validate their arguments,
  delegate data access to `src/data/`, and return only the DTO the UI needs.
- The DAL, not the Action, authenticates and authorizes the concrete resource
  or action. Never trust client-provided ownership or role claims.
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
- There are two kinds of custom hooks:
  - **Context accessors** (read a context owned by the component, e.g.
    `useSidebar` in `sidebar.tsx`) stay in the same component file and are
    exported from it. This follows shadcn.
  - **All other hooks** (state, effects, refs, forms, behavior) live in their
    own `use-*.ts(x)` file in `src/hooks/`. shadcn defines the `@/hooks` alias
    (`aliases.hooks`) and keeps generic hooks there (e.g. `use-mobile.ts`).
- Project convention (stricter than shadcn, which keeps state inside its own
  `ui/` components): application components must not call stateful React hooks
  (`useState`, `useReducer`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useForm`)
  directly, and single-consumer hooks also go to `src/hooks/`. Files that own a
  context (`createContext`) are exempt, and `src/components/ui/**` is not
  linted.
- Avoid middleman components that only rename another component.
- Name components after their actual primitive/semantic role.
- Include an imported shadcn primitive in the component name when it is the
  component's returned JSX root; the component primitive name guard enforces
  this convention.
- Component props must use a named type/interface or `ComponentProps<...>`; never
  define props inline or omit the props parameter.

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

Application-owned app-private components live in `src/app/_components` when
shared, or in `(group)/_components` when private to a route group. A group's
`_components` must not import from another group's `_components`.
Application-owned files under `src/components/` are components and must use
the `.tsx` extension, except for the reserved `ui/` and `firebase/` layers.
Place hooks in `src/hooks/` and pure utilities, constants, script builders, or
other generic logic in `src/lib/<domain>/`; the Vitest structure guard enforces
this. Component `.tsx` files under `src/` must be named as the kebab-case of
their exported PascalCase component; a Vitest guard enforces this. SDK-free
business rules live in `src/domain/`, browser Firestore access lives in
`src/client/`, the server-only Data Access Layer lives in `src/data/`,
and Server Actions live in `src/actions/` (ADR 0011). The data-access and
Server Action requirements are defined once in [section 2](#2-nextjs-app-router).

Dependency Cruiser enforces graph rules on the source it currently cruises,
including:

- no circular dependencies;
- no unresolved dependencies;
- allowed-file rules for files directly under `src/`.
- `domain-is-pure`: `src/domain/` cannot import application layers or Firebase
  and Google Cloud SDKs;
- `client-cannot-import-server-layers`: `src/client/` cannot import
  `src/data/`, `src/app/`, or the Firebase Admin SDK;
- `data-cannot-import-client-layers`: `src/data/` cannot import `src/client/`,
  components, hooks, or app routing;
- `actions-cannot-import-client-layers`: `src/actions/` cannot import
  `src/client/`, components, hooks, or app routing.

`src/components/ui/**` is currently excluded from the Dependency Cruiser
graph to avoid traversing registry-managed implementation details. The rule
that UI primitives must not depend on domain components or app routing remains
an architecture/review invariant unless that exclusion is removed or replaced
with a dedicated validation pass.

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
