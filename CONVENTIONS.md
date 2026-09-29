# Coding Conventions & Standards

This file owns **how code is written**. Test strategy belongs to `TESTING.md`,
quality thresholds to `CONSTRAINTS.md`, visual semantics to `DESIGN.md`, and
contributor workflow to `CONTRIBUTING.md`.

## 1. Tool-Owned Conventions

- **Biome** (`biome.json`) is the formatter and linter. Do not introduce
  ESLint/Prettier as parallel sources of truth.
- **TypeScript** remains strict. Do not use `any`, `@ts-ignore`, or unsafe casts
  as shortcuts around type design.
- **Biome organizeImports** owns import ordering; do not maintain a competing manual
  import-order convention.
- **dependency-cruiser** owns executable dependency rules; architectural intent lives
  in `ARCHITECTURE.md`.
- Fix findings at the source. Suppression and non-regression policy is owned by
  `CONSTRAINTS.md`.

## 2. Naming & File Shape

- Files and folders use `kebab-case`.
- React components and types use `PascalCase`.
- Functions and variables use `camelCase`; hooks start with `use`.
- Shared UI files use named exports. Next.js route/layout entrypoints may use the
  framework-required default exports, but the underlying component declaration must be a named function.
- Derive props from the underlying primitive or native element where practical
  instead of duplicating them manually (enforced by `check:props`).
- **Component File Role Suffixes (`src/components/notes-app/`)**: Application UI components
  must carry an explicit archetype suffix in both filename (`kebab-case`) and component name
  (`PascalCase`) to preserve contract clarity:
  - `-card` / `*Card` for screen or container cards (e.g. `login-card.tsx` -> `LoginCard`)
  - `-form` / `*Form` for form sections and submit containers (e.g. `login-form.tsx` -> `LoginForm`)
  - `-header` / `*Header` for heading and greeting presentation blocks (e.g. `auth-greeting-header.tsx` -> `AuthGreetingHeader`)
  - `-alert` / `*Alert` for notification and error banners (e.g. `redirect-error-alert.tsx` -> `RedirectErrorAlert`)
  - `-button` / `*Button`, `-select` / `*Select`, `-menu` / `*Menu`, `-switcher` / `*Switcher` for interactive UI controls
  - `-provider` / `*Provider` for React context providers
- **Canonical Props Naming (`${ComponentName}Props`)**: Component prop interfaces/types must be declared canonically using the component's canonical PascalCase name (e.g. `login-card.tsx` must declare and use `export interface LoginCardProps`, never `SignInAuthScreenProps` as the primary interface). Legacy or library names may only be re-exported as backwards-compatible aliases (e.g. `export type { LoginCardProps as SignInAuthScreenProps }`). Enforced by `check:props`.

## 3. Component Composition

- Reuse the nearest existing primitive and variant before creating a wrapper or new
  primitive.
- Prefer `children`, explicit variants, and compound components over boolean-prop
  matrices or `renderX` APIs.
- Keep generic primitives free of product/domain behavior.
- Keep public APIs focused; avoid rename-only wrappers and unnecessary DOM nodes.
- Preserve consumer props, events, refs, native behavior, controlled/uncontrolled
  behavior, ARIA, and primitive state attributes.
- Use CVA only for meaningful variant axes with typed `VariantProps` and sensible
  defaults.

## 4. shadcn / Base UI

- Use the installed Base UI APIs rather than Radix-specific examples.
- Use Base UI's `render` pattern for polymorphic composition. Use
  `nativeButton={false}`, `useRender`, or `mergeProps` only when the installed
  primitive requires them.
- Preserve required grouping and anatomy: grouped Select/menu/Command items, overlay
  trigger/content structure, portals, backdrop/close behavior, titles/descriptions,
  focus management, and keyboard behavior.
- Forms should compose the existing Field/InputGroup primitives rather than bypassing
  their anatomy.
- Use semantic HTML and accessible names. Loading, selected, disabled, and error
  states must not rely on color alone.

## 5. React & Next.js

- Add `"use client"` only at the smallest boundary that requires client behavior (enforced by `check:rsc`).
- In React 19, pass `ref` as a normal prop and prefer `use()` for new context
  access; do not introduce `forwardRef` or `useContext` without a dependency or
  framework reason.
- React Compiler is enabled. Do not add `useMemo`/`useCallback` preemptively;
  optimize from measurement or a demonstrated semantic need.
- Prefer derived values during render over synchronization effects.
- Use functional state updates when the next state depends on previous state.
- Keep effect dependencies primitive and explicit.
- Do not define React components inside other component render functions.
- Keep client props minimal and serializable across server/client boundaries.
- Avoid request waterfalls: start independent work together and use Suspense where
  independent regions can stream.

### Fast Refresh Invariants
- **Named Component Exports**: All React component functions must have explicit identifiers (e.g. `export function LoginForm() {}` or `export default function LoginPage() {}`). Anonymous default function expressions (`export default () => ...`) break Fast Refresh boundary detection.
- **Module Isolation**: Isolate non-component constants, pure domain helpers, and data transformers into `src/lib/` and reusable hooks into `src/hooks/`. Exporting mixed non-React constants or mutable singletons alongside components causes Next.js Fast Refresh to fall back to a destructive full page reload.

### Server Actions & Form Mutations
- **`'use server'` Boundary**: All Server Actions must declare `'use server'` at the file or function level.
- **Typed Result Signature**: Server Actions must return a typed `Result<T, E>` pattern (e.g., `{ success: true, data: T } | { success: false, error: string, fields?: Record<string, string> }`) rather than throwing unhandled errors across the RPC boundary.
- **Zod Validation**: Validate all inbound action parameters and form data against strict Zod schemas before executing business logic.
- **React 19 Action Integration**: Bind server actions using `useActionState` and progressive `<Form action={...}>` (or Base UI form primitives) to ensure resilient pending states, optimistic updates, and fallback handling.

### Error Handling & Navigation
- **Error Boundaries**: Next.js App Router `error.tsx` components must always declare `'use client'`.
- **Navigation Primitives**: Trigger standard error UI via framework functions: `notFound()` for 404, `unauthorized()` for 401 unauthenticated requests, and `forbidden()` for 403 authorization failures.
- **No Direct `window.location`**: Direct imperative mutation of `window.location` is forbidden; use Next.js `useRouter()` (`push`, `replace`), `redirect()`, or `<Link>` components to maintain client-side routing state.

### Asynchronous Lifecycle & Background Work
- **`after()` for Post-Response Tasks**: Use Next.js `after()` (or `unstable_after`) to schedule asynchronous work (logging, analytics, cache warming) that should execute after the HTTP response has finished streaming, preventing background tasks from blocking user TTFB.

### App Router Page & Layout Props
- **Next.js `PageProps` Helper**: Use Next.js's globally generated `PageProps<Route>` (generated via `next dev`, `next build`, or `next typegen`) for typing route entrypoint props rather than closed ad-hoc interfaces. Remember that `params` and `searchParams` are asynchronous `Promise` instances since Next.js version 15. In unit tests for route page files, pass `params` and `searchParams` as resolved promises (`Promise.resolve(...)`).

### Hook Placement & Usage
- **Co-located Component Hooks (inside component file):** Keep custom hooks co-located
  within the component file when they are strictly coupled to that component family's
  context provider (e.g., `useSidebar` in `sidebar.tsx`, `useToastManager` in `toast.tsx`)
  or manage private compound state. Declare them as top-level exported functions; never define
  hooks inside a component render body.
- **Shared Standalone Hooks (`src/hooks/`):** Place hooks in `src/hooks/` only when they
  are generic, shared across multiple independent components or routes (e.g., `useIsMobile`,
  `useAuth`), encapsulate reusable browser APIs (media queries, listeners, sensors), or require
  isolated unit testing. Hooks in `src/hooks/` must never depend on application routes (`src/app/`).

### Internationalization (i18n) & Localized Strings
- **No Hardcoded User-Facing Text**: Hardcoding user-facing strings (such as button labels like "Retry Connection", "Sign in", headings, error messages, or placeholders) directly in JSX or UI components is strictly forbidden.
- **Mandatory i18n Translation Keys**: Always use the internationalization framework (`next-intl`, e.g. `useTranslations`) or Firebase UI translation mechanisms (`getTranslation(ui, ...)`). All user-facing strings must be defined across message catalogs (`src/messages/{locale}.json`).

## 6. Styling

- Merge classes with the project `cn()` convention.
- Use semantic design tokens instead of hardcoded colors or ad hoc dark-theme
  overrides; token semantics are owned by `DESIGN.md`.
- Prefer existing `gap-*`, `size-*`, and truncation utilities over arbitrary
  values when the standard scale fits.
- Avoid `!important` and consumer-level overlay stacking overrides.
- Use configured Lucide components explicitly and give icon-only controls accessible
  names.
- Emojis are forbidden in UI components, icon defaults, fallbacks, and domain entities;
  Lucide icons or semantic identifier strings must be used.

## 7. Performance-Sensitive Code

- Prefer direct module imports over broad barrel imports when it materially reduces
  client bundle work.
- Dynamically load heavy client-only features that are not needed initially.
- Avoid shared mutable module state in server code.
- Minimize server-to-client serialization and duplicate subscriptions/listeners.
- Defer non-critical third-party browser work until it is needed.

## 8. Anti-Patterns

Do not:

- bypass Biome or TypeScript merely to obtain a pass;
- hardcode visual tokens owned by `DESIGN.md`;
- hardcode user-facing copy, labels, or error messages (e.g. 'Retry Connection') in UI components instead of using i18n dictionaries;
- rebuild an existing shadcn/Base UI primitive with custom markup;
- put notes-domain behavior inside `src/components/ui/`;
- introduce a global state/data/auth pattern without an architectural decision;
- use emojis in UI components, icon defaults, fallbacks, or domain entities (use
  Lucide icons or semantic identifier strings instead);
- treat compilation as UI verification — visual/test requirements live in
  `TESTING.md`.
