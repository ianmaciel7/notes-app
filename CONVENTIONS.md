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
  - `-sidebar` / `*Sidebar` for navigation shells (e.g. `space-sidebar.tsx` -> `SpaceSidebar`)
  - `-provider` / `*Provider` for React context providers
- **Canonical Props Naming (`${ComponentName}Props`)**: Component prop types must be declared canonically using the component's canonical PascalCase name (e.g. `login-card.tsx` declares and uses `type LoginCardProps = ...`, never `SignInAuthScreenProps` as the primary type). Declare them with `type`, never `interface`, exactly as `src/components/ui/` does. Legacy or library names may only be re-exported as backwards-compatible aliases inside the file's trailing export block (e.g. `type LoginCardProps as SignInAuthScreenProps`). Enforced by `check:props` and `component-no-interface`.
- **Export shape (`src/components/notes-app/`)**: Application components follow the same file anatomy as `src/components/ui/`. Declare components and hooks as plain `function` declarations without `export`, and publish every value and type through one trailing `export { ... }` block (types with an inline `type` modifier, aliases as `X as Alias`). Do not write `export function`, `export const`, or `export interface`. Enforced by `component-trailing-export-block`.
- **Standalone overlays**: A dialog, sheet, or drawer owns its own open state and concern, so it lives in its own file named after it (e.g. `CreateSpaceDialog` in `create-space-dialog.tsx`), never inside another component's file such as `space-sidebar.tsx`. Cards and forms are exempt because multi-step flows keep their step forms next to the flow. Enforced by `check:props` (`checkStandaloneSurfaceComponents`).

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
- Application wrappers around shared shadcn primitives follow the primitive
  forwarding pattern: declare a canonical `${ComponentName}Props` type,
  destructure `className` and the remaining props, merge wrapper layout with
  `cn()`, spread the remaining props onto the root primitive, and apply the
  wrapper's required semantic attributes after the spread. Alert wrappers in
  `src/components/notes-app/*-alert.tsx` must use this pattern and keep their
  named component/type exports in the trailing export block. Compound alert
  wrappers must require `children`, render the caller-provided composition, and
  never substitute a default child tree. `guard-component-props.mjs` enforces
  the canonical alert props type.

### Primitive Anatomy (`src/components/ui/`)

Registry-installed shadcn primitives share one anatomy. New or edited primitives
must match it. Compare against upstream with `shadcn add <name> --diff` before
changing an installed primitive.

- **File shape:** optional `"use client"`, imports, constants and `cva`
  definitions, one plain `function` per part, then one trailing
  `export { ... }` block. Named exports only, no `export default`. The `cva`
  (`buttonVariants`) and any co-located hook (`useSidebar`) go in the same block.
- **Part shape:** `function Part({ className, ...props }: Primitive.Props)`
  renders the primitive with `data-slot="family-part"` (kebab-case, family
  prefix), `className={cn("base", className)}`, and `{...props}` last. Parts that
  only forward props omit `className`. Props the part fixes (`role`, `render`,
  `variant`) go before the spread.
- **Prop types:** derive from the primitive (`DialogPrimitive.Popup.Props`),
  `React.ComponentProps<"div">`, or `React.ComponentProps<typeof Other>`. Extra
  props are inline intersections (`& { size?: "sm" | "default" }`). Use a named
  `type` only for context or shared props. Primitives declare no `interface`,
  and application components under `src/components/notes-app/` follow the same
  file shape and the same no-`interface` rule (see section 2).
- **Variants:** `cva` with `variants` and `defaultVariants`; the default is
  repeated in the destructuring (`variant = "default"`); call
  `cva({ variant, size })` inside `cn(..., className)`. Expose the active variant
  as `data-variant` / `data-size` / `data-orientation` / `data-align` so child
  parts can react.
- **Polymorphic parts:** `useRender` with `defaultTagName`,
  `props: mergeProps<"tag">({ className: cn(...) }, props)`, `render`, and
  `state: { slot: "family-part", variant }`. The slot comes from `state.slot`,
  not a hand-written `data-slot`.
- **Overlay content:** `Portal` > `Positioner` > `Popup`, typed with
  `Pick<Primitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`
  and explicit defaults. Dialog, Sheet, and AlertDialog use `Portal` + `Overlay` +
  `Popup`. Close buttons are `render={<Button ... />}` plus an `sr-only` label.
  Stacking lives inside the primitive, never at the call site: the `Positioner`
  carries `className="isolate z-50"`.
- **Cross-part styling:** the root declares `group/<family>` (or `peer/<family>`)
  and children use `group-data-[...]/<family>`, `has-data-[slot=...]`,
  `*:data-[slot=...]`, or `in-data-[slot=...]`. Do not style children through
  extra props.
- **Icons:** the root sizes child icons with
  `[&_svg:not([class*='size-'])]:size-4`, so icons inside a primitive carry no
  `size-*`. Button icons use `data-icon="inline-start|inline-end"`. Icon-only
  controls include a `<span className="sr-only">` label.
- **State classes:** focus
  `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`,
  invalid `aria-invalid:border-destructive aria-invalid:ring-3
  aria-invalid:ring-destructive/20`, disabled
  `disabled:pointer-events-none disabled:opacity-50` (`data-disabled:` on Base UI
  parts). Popup surface is `bg-popover text-popover-foreground ring-1
  ring-foreground/10`; open/close motion is
  `data-open:animate-in ... data-closed:animate-out ...`.
- **Context:** `createContext<T | null>(null)` plus an exported `useX()` that
  throws `"useX must be used within a <X />"`.
- **CSS variables:** pass through `style` with an `as React.CSSProperties` cast.

### Forms: `Field` vs `Form`

- **Use `Field` + `FieldGroup` for new forms in this repository.** The installed
  Base UI/shadcn setup exposes `Field`, `FieldLabel`, `FieldDescription`,
  `FieldError`, and related primitives. Use them for field layout, accessible
  labels, descriptions, validation state, and consistent spacing. Pair them with
  `useForm`, `Controller`, or `FormProvider` from `react-hook-form` when the form
  needs controlled values or schema validation.
- **Use the classic shadcn `Form` components only for compatibility.** The
  `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`,
  and `FormMessage` API is appropriate when maintaining an existing form that
  already uses that composition or when integrating a dependency/example that
  specifically requires it. Do not introduce it for a new form alongside the
  repository's `Field` API, and do not mix both APIs inside one form.
- **Use native `<form>` with a Server Action for server mutations.** When the
  mutation is implemented as a Next.js Server Action, prefer progressive
  `<Form action={...}>`/native form submission with `useActionState` and
  `useFormStatus`; use `Field` for the visual and validation anatomy. React Hook
  Form is optional in this case and should be added only when client-side field
  orchestration materially improves the experience.
- **Use a plain native `<form>` for simple client submissions.** A form with a
  small number of uncontrolled inputs and one submit handler does not need either
  shadcn's classic `Form` wrapper or React Hook Form.
- **Keep responsibilities separate:** `Field`/`Form*` components provide UI and
  accessibility structure; React Hook Form provides client-side form state; Zod
  or another schema owns validation; Server Actions own server mutations. Do not
  treat a visual form wrapper as a validation or authorization boundary.

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

### Rendering, Async Work & Streaming

- Treat `page.tsx`, `layout.tsx`, and other route files as Server Components by
  default. Add `"use client"` only to the smallest interactive leaf and compose
  server-rendered content through `children` or explicit props.
- Use `loading.tsx` for route-segment loading states and `<Suspense>` for a more
  granular loading boundary inside a page. Keep the shell (navigation, headers,
  and stable layout) outside the boundary so independent content can stream as it
  becomes ready.
- Start independent async work before the first `await` and resolve it together
  with `Promise.all()`. Do not create sequential fetch chains when operations do
  not depend on one another.
- In the installed React version, a promise passed to a Client Component may be read with `use()`;
  the consumer must be inside an intentional `<Suspense>` boundary and the
  promise must be stable for the intended request/render lifetime.
- Prefer server-side data access close to the Server Component that renders it.
  Keep Firebase browser subscriptions in client hooks because this application
  uses Firestore's browser persistence and realtime observers; do not invent a
  server data layer until the architecture adopts one.
- Use `useTransition`/`startTransition` for non-urgent client updates such as
  filtering, navigation-adjacent state, or changing a locale. Use the transition's
  `isPending` state instead of a second manual loading flag for that interaction.
- Use React 19 form actions (`useActionState`, `useFormStatus`, and progressive
  `<Form action={...}>`) for Server Action mutations when a mutation is introduced.
  Add `useOptimistic` only when the optimistic state and rollback behavior are
  explicit and tested.
- Derive values during render. Move interaction-specific work into event handlers;
  use effects only for synchronization with external systems (subscriptions,
  browser APIs, or imperative widgets), with cleanup and primitive dependencies.
- Use `next/dynamic` for heavy, optional, or client-only features that are not
  required for the initial route. Prefer direct imports for normal UI primitives
  so the bundle remains statically analyzable.
- Use `after()` for non-critical post-response work such as analytics, logging, or
  cache warming. It must never be used to hide work required to render the response.
- Add `memo`, `useMemo`, or `useCallback` only after measurement or when a stable
  identity is a demonstrated API requirement; React Compiler is enabled here.

### Fast Refresh Invariants
- **Named Component Exports**: All React component functions must have explicit identifiers (e.g. `function LoginForm() {}` published through the file's trailing `export { LoginForm }`, or `export default function LoginPage() {}` for a Next.js route entrypoint). Anonymous default function expressions (`export default () => ...`) break Fast Refresh boundary detection.
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
- **Extract stateful application behavior when it clarifies a real concern:** Prefer a
  top-level co-located hook when authentication, subscriptions, navigation effects, or
  multi-step state form a coherent behavior that benefits from isolation. Do not
  extract a custom hook merely because a component contains an arbitrary number of
  state/effect calls. Keep a hook co-located when only that component family consumes
  it; move it to `src/hooks/` only when independent components or routes share it.
- **Shared Standalone Hooks (`src/hooks/`):** Place hooks in `src/hooks/` only when they
  are generic, shared across multiple independent components or routes (e.g., `useIsMobile`,
  `useAuth`), encapsulate reusable browser APIs (media queries, listeners, sensors), or require
  isolated unit testing. Hooks in `src/hooks/` must never depend on application routes (`src/app/`).

- **Stateful Component Extraction:** Treat hook extraction as a design/review decision,
  not a numeric quality gate. Extract when it produces a meaningful behavioral
  boundary; keep straightforward local state in the component when that is clearer.

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

- Prefer route-level `loading.tsx` and targeted `<Suspense>` boundaries over a
  page-wide spinner when content can be rendered independently.
- Eliminate waterfalls with early promise creation, `Promise.all()`, and component
  composition. Do not make a parent await data that only a child needs.
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

## 9. Enforcement Index

Every rule above has exactly one enforcer: a `package.json` script that runs in
`check:fast`, or `review-only` when no tool can decide it. `check:conventions`
runs `scripts/guards/guard-conventions.mjs` (application rules over `src/`;
`src/components/ui/` is checked only against the `ui-primitive-*` anatomy rules
and `src/components/firebase/` is skipped as an unmodified vendor drop) and
`scripts/verify/verify-conventions-index.mjs`, which fails when a row names a
missing or ungated script or when a guard rule is absent from this table. Add a
row here in the same change that adds or changes a rule; prefer promoting a
`review-only` rule to a checker over leaving it prose-only.

| Rule | Enforcer |
| --- | --- |
| `no-any-or-ts-suppress` | `check:lint` |
| `strict-types` | `check:types` |
| `import-order` | `check:lint` |
| `module-boundaries` | `deps:check` |
| `kebab-case-filename` | `check:conventions` |
| `no-default-export` | `check:conventions` |
| `component-role-suffix` | `check:naming` |
| `canonical-props-name` | `check:props` |
| `identifier-casing` | `check:lint` |
| `reuse-primitives` | review-only |
| `no-render-props-api` | `check:conventions` |
| `composition-over-boolean-props` | review-only |
| `ui-primitive-no-default-export` | `check:conventions` |
| `ui-primitive-trailing-export-block` | `check:conventions` |
| `ui-primitive-no-interface` | `check:conventions` |
| `ui-primitive-part-shape` | review-only |
| `no-domain-in-ui` | `deps:check` |
| `no-classic-form-api` | `check:conventions` |
| `use-client-smallest-boundary` | `check:rsc` |
| `error-boundary-use-client` | `check:conventions` |
| `no-forward-ref` | `check:conventions` |
| `no-use-context` | `check:conventions` |
| `no-preemptive-memo` | `check:conventions` |
| `no-window-location` | `check:conventions` |
| `no-component-in-render` | `check:lint` |
| `named-default-export` | `check:conventions` |
| `fast-refresh-module-isolation` | review-only |
| `server-action-use-server` | `check:conventions` |
| `server-action-validates-input` | `check:conventions` |
| `server-action-result-type` | review-only |
| `i18n-no-hardcoded-text` | `check:i18n` |
| `no-hardcoded-color` | `check:conventions` |
| `no-important` | `check:conventions` |
| `use-cn-for-class-merge` | `check:conventions` |
| `prefer-standard-scale` | review-only |
| `no-emojis` | `check:emojis` |
| `performance-patterns` | review-only |
