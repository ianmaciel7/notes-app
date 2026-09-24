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
  framework-required default exports.
- Derive props from the underlying primitive or native element where practical
  instead of duplicating them manually.

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

- Add `"use client"` only at the smallest boundary that requires client behavior.
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

## 6. Styling

- Merge classes with the project `cn()` convention.
- Use semantic design tokens instead of hardcoded colors or ad hoc dark-theme
  overrides; token semantics are owned by `DESIGN.md`.
- Prefer existing `gap-*`, `size-*`, and truncation utilities over arbitrary
  values when the standard scale fits.
- Avoid `!important` and consumer-level overlay stacking overrides.
- Use configured Lucide components explicitly and give icon-only controls accessible
  names.

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
- rebuild an existing shadcn/Base UI primitive with custom markup;
- put notes-domain behavior inside `src/components/ui/`;
- introduce a global state/data/auth pattern without an architectural decision;
- treat compilation as UI verification — visual/test requirements live in
  `TESTING.md`.
