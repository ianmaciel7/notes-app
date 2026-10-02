# Application Component Composition

These rules apply to project-owned application components, especially
`src/components/notes-app/`. Shared registry primitives under
`src/components/ui/` keep their upstream shadcn/Base UI contracts.

- Name components by durable product responsibility, not by the primitive currently
  used as the implementation root. `SettingsForm` may use `FieldGroup` internally.
- Prefer one simple public component that composes existing shadcn/Base UI primitives
  internally. Do not recreate a matching application-level compound API unless
  consumers genuinely need independently composable parts.
- Use Base UI's native `render={<Component />}` API when a behavior-bearing primitive
  must render another component. Do not introduce custom `renderX` props or Radix
  `asChild` compatibility layers for that purpose.
- Create component-family context only when public sibling parts genuinely require
  shared state. Ordinary application composition should not need a context.
- If an application component has a dedicated same-family hook
  (`Component` + `useComponent`), that hook owns component-specific stateful React
  behavior: state, effects, refs, reducers, transitions, subscriptions, navigation,
  and handlers derived from that state. Keep the rendering component declarative.
- Components without a dedicated hook may keep straightforward local state when
  extraction would not create a meaningful behavior boundary.
- Keep Biome as the single formatter/linter for project-owned code. Do not introduce
  ESLint or Prettier to enforce these rules.
- `check:ui-pattern` is the mechanical gate for notes-app-specific composition rules;
  use standard tools (Biome, TypeScript, dependency-cruiser, tests) for concerns they
  already own.

Canonical rationale: `CONVENTIONS.md`, `ARCHITECTURE.md`, and ADR 0016.
