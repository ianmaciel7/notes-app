# Coding Conventions & Standards

## 1. Tooling & Enforcement
- Formatter & Linter: **Biome** (`biome.json`) — Biome is the only linter/formatter in the repo; there is no ESLint or Prettier config.
- Strict type checking: `tsconfig.json` has `"strict": true`. Avoid `any` and `@ts-ignore`.
- Import organization: Biome's `assist.actions.source.organizeImports` is enabled — imports are auto-sorted on format, don't hand-order them against the tool.
- Commands:
  - Lint: `pnpm lint` (`biome check`)
  - Format: `pnpm format` (`biome format --write`)

## 2. Naming Conventions
- **Files & Folders**: `kebab-case.ts` / `kebab-case.tsx`, confirmed by every file in `src/components/ui/` (`button-group.tsx`, `dropdown-menu.tsx`) and `src/hooks/use-mobile.ts`.
- **Components**: `PascalCase` function names (e.g. `Button`, `AlertDialog`, `MessageScroller`).
- **Sub-component parts**: composed with a shared prefix, e.g. `Dialog`, `DialogTrigger`, `DialogContent` in `dialog.tsx`; `Bubble`, `BubbleGroup`, `BubbleContent` in `bubble.tsx`.
- **Functions & Hooks**: `camelCase`, hooks prefixed `use` (`useIsMobile` in `use-mobile.ts`).
- **Types & Interfaces**: `PascalCase`, no Hungarian prefixes (repo uses e.g. `React.ComponentProps<"div">` directly rather than hand-rolled interfaces where possible).

## 3. Component & File Anatomy
- **Export style**: Named exports only — every file under `src/components/ui/` ends with an `export { ... }` statement; there are no `export default` components in that directory. `src/app/page.tsx` and `src/app/layout.tsx` use `export default` because the Next.js App Router requires it for route/layout entrypoints — that is the one exception, not a repo-wide default-export convention.
- **Import ordering** (as Biome auto-organizes, observed in `dialog.tsx`):
  1. Directives (`"use client"`) first, where required.
  2. External packages (`react`, `@base-ui/react/...`).
  3. The `cn` utility.
  4. Workspace aliases (`@/components/...`).
  5. Icon imports (`lucide-react`).
- **Variant styling**: Multi-variant components use `class-variance-authority` (`cva`) — see `button.tsx`, `marker.tsx`, `attachment.tsx` — combined with `cn()` from `@/lib/utils` (which re-exports the `cn` package) for class merging.
- **Base UI slot pattern**: Sub-elements are marked with `data-slot="..."` attributes (e.g. `data-slot="bubble-group"`) rather than custom class hooks, matching Base UI's styling model — see `DESIGN.md` §7.

## 4. State & React Best Practices
- **Server vs. Client Components**: `"use client"` is declared explicitly wherever a primitive needs interactivity — in practice that's the majority of `src/components/ui/` (38 of 61 component files, e.g. `dialog.tsx`, `select.tsx`, `sidebar.tsx`, `command.tsx`), since most Base UI primitives involve event handlers, portals, or open/close state. Purely presentational primitives (e.g. `badge.tsx`, `card.tsx`, `separator.tsx`) correctly omit it and stay server-renderable.
- **Render optimization**: React Compiler is enabled (`docs/adr/0004`), so manual `useMemo`/`useCallback` should not be added preemptively — let the compiler handle memoization unless profiling shows a real need.
- No client-side state management library is installed; default to local component state or React context.

### Component architecture and performance
- Prefer compound components, explicit variants, and `children` composition over boolean prop proliferation or `renderX` props. Keep each public component API focused on one responsibility.
- If siblings need shared state, lift it into a provider. The provider may choose local state, a future store, or server synchronization; UI primitives consume an interface shaped as `state`, `actions`, and `meta`.
- In React 19, treat `ref` as a normal prop and use `use()` for context in new code. Avoid `forwardRef` and `useContext` unless a framework or dependency boundary requires them.
- Avoid defining components inside components, unnecessary effects for derived values, and subscriptions to state used only by callbacks. Use functional state updates and primitive effect dependencies.
- Preserve bundle boundaries: import from direct module paths, dynamically import heavy client-only features when they are not needed for the initial view, and conditionally load optional dependencies.
- For future server-backed work, authenticate server actions like API routes, deduplicate independent requests, use `React.cache()` for per-request reads where appropriate, minimize RSC-to-client serialization, and avoid shared mutable module state.
- Version and minimize browser storage schemas, deduplicate global listeners, use passive listeners for scroll behavior, and defer non-critical third-party scripts until after hydration.
- Prefer derived values during render over effects, use `startTransition`/`useDeferredValue` for non-urgent expensive updates, and use explicit ternaries for conditional rendering.

## 5. Anti-Patterns & Code Smells
- Hardcoded hex colors instead of the OKLCH CSS variable tokens (see `DESIGN.md` §2 and §7 for the required token classes).
- Bypassing Biome/TypeScript checks with inline suppressions.
- Adding a new UI primitive to `src/components/ui/` without a matching Ladle story — see `TESTING.md` for current story coverage gaps.
- Introducing state management, data fetching, or auth patterns without first updating `ARCHITECTURE.md` and `INTENT.md` to reflect the change.
- Rebuilding shadcn primitives with custom markup when an existing component, variant, or composition already covers the use case.
