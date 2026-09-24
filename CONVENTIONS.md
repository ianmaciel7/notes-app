# Coding Conventions & Standards

## Shadcn / Base UI Component Checklist

`src/components/ui/` currently imports `cn()` directly from the installed `cn` package. `@/lib/utils` re-exports the same function for application code.

The following rules are normative for shared UI in `src/components/ui/`. Use existing shadcn and Base UI primitives first, preserve their public anatomy, and keep domain behavior outside the primitive layer.

### Composition and APIs
- Prefer existing primitives and variants; compose with `children` and compound subcomponents rather than boolean-prop matrices or `renderX` props.
- Keep components small and semantic. Avoid rename-only wrappers, unnecessary DOM nodes, domain logic in generic primitives, and nested interactive elements.
- Derive props from the underlying primitive or native tag (`React.ComponentProps<typeof Primitive>` / `React.ComponentProps<"button">`). Use `Pick`/`Omit` intentionally, avoid `any` and unsafe casts, forward remaining props, and preserve controlled/uncontrolled behavior.
- Use kebab-case filenames, symmetrical named exports, and `Props`-suffixed prop types. Use CVA only for meaningful variants with typed `VariantProps` and sensible defaults.
- Preserve `data-slot`, primitive state attributes, refs, consumer event handlers, ARIA attributes, native behavior, and the installed component anatomy.

### Base UI and shadcn rules
- Use the installed Base UI API, not Radix-only examples. Use `render` for polymorphic slots; use `nativeButton={false}`, `useRender`, or `mergeProps` only when the actual Base UI composition requires them.
- Use `cn()` for class merging, following the current UI import convention above. Prefer semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-border`, `border-input`, `ring-ring`, `text-destructive`) over raw colors and one-off `dark:` overrides.
- Prefer `gap-*`, `size-*`, and `truncate`; avoid manual spacing, arbitrary values, `!important`, and arbitrary stacking overrides. Use configured Lucide icons explicitly and give icon-only controls accessible names.
- For forms use `FieldGroup`/`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, and `FieldSet`/`FieldLegend` where applicable. Use `data-invalid` on `Field`, `aria-invalid` on the input, and `disabled`/`data-disabled` for disabled state.
- For `InputGroup`, use `InputGroupInput`/`InputGroupTextarea` and `InputGroupAddon`; do not insert raw `Input`/`Textarea`. Use `ToggleGroup` for small related choices.
- Preserve required group hierarchies: `SelectItem` in `SelectGroup`, menu items in their menu group, and command items in `CommandGroup`. Follow the installed Base UI value and placeholder APIs for Select, Accordion, Slider, and Tabs.

### Component anatomy and accessibility
- Use `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter` according to the content.
- Choose overlays by intent: `Dialog` for focused modal work, `AlertDialog` for destructive confirmation, `Sheet` for side panels, `Drawer` for bottom/mobile panels, `Popover` for interactive contextual content, `HoverCard` for hover information, and `Tooltip` only for non-interactive information.
- Preserve overlay root/trigger/content structure, portal, backdrop, close behavior, focus and keyboard behavior, and required titles/descriptions. Use `sr-only` for visually hidden required titles; do not add consumer-level `z-index` overrides.
- Use semantic HTML, buttons for actions, links for navigation, visible focus styles, and accessible labels/descriptions. Loading, disabled, error, and selected states must not rely on color alone. Use `Alert`, `Empty`, `Separator`, `Skeleton`, `Badge`, `Spinner`, and `Progress` when their semantics apply.
- Keep components server-compatible where possible. Add `"use client"` only when required; in React 19 pass `ref` as a regular prop and use `use()` for context in new code rather than introducing `forwardRef` or `useContext`.

### Review questions
- Did the implementation reuse the nearest existing primitive and variant?
- Does it preserve Base UI anatomy, state attributes, keyboard behavior, refs, events, and ARIA?
- Are semantic tokens, `cn()`, the configured icon library, and composition APIs used consistently?
- Are forms, groups, cards, overlays, and loading/error/empty states using the documented anatomy?
- Is a Ladle story included or updated for new and changed shared UI?

## 1. Tooling & Enforcement
- Formatter & Linter: **Biome** (`biome.json`) — Biome is the only linter/formatter in the repo; there is no ESLint or Prettier config.
- Strict type checking: `tsconfig.json` has `"strict": true`. Avoid `any` and `@ts-ignore`.
- Dependency boundaries: **dependency-cruiser** (`.dependency-cruiser.cjs`) checks for circular dependencies under `src/`.
- Dead-code analysis: **Knip** (`knip.json`) checks unused source files, dependencies, and exports while treating the reusable UI catalog and hooks as intentional entry points.
- GitHub Actions validation: **actionlint** (`.github/actionlint.yaml`) checks workflow syntax and security; the repository provides `rtk pnpm lint:actions` and an optional `actionlint-system` pre-commit hook.
- Import organization: Biome's `assist.actions.source.organizeImports` is enabled — imports are auto-sorted on format, don't hand-order them against the tool.
- Commands:
  - Lint: `rtk pnpm lint` (`biome check`)
  - Dependency boundaries: `rtk pnpm deps:check`
  - Unused-code analysis: `rtk pnpm knip`
  - Task-end quality gate: `rtk pnpm check:fast`
  - Dependency security audit: `rtk pnpm check:security`
  - OSV dependency scan: `rtk pnpm check:osv` (configured by `osv-scanner.toml`)
  - Browser verification: `rtk pnpm lighthouse` (configured by `lighthouserc.cjs`)
  - GitHub Actions validation: `rtk pnpm lint:actions` (requires the system `actionlint` binary; no workflows exist yet)
  - Format: `rtk pnpm format` (`biome format --write`)
  - Staged-file checks: `rtk pnpm run lint-staged` (Biome `check --write` for staged JavaScript, TypeScript, CSS, and JSON files)

Husky runs the staged-file checks before the full `check:fast` gate through
`.husky/pre-commit`. Keep the lint-staged glob aligned with the Biome-supported
source and configuration file types when adding new tooling.

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
