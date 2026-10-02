# Application Component Composition

These rules apply to project-owned application components: every component file
under `src/components/` outside `ui/` and `firebase/` (today `notes-app/`; a new
folder is covered automatically). Shared registry primitives under
`src/components/ui/` keep their upstream shadcn/Base UI contracts, and
`src/components/firebase/` holds unmodified Firebase UI registry components.

- Name components by durable product responsibility, not by the primitive currently
  used as the implementation root. `SettingsForm` may use `FieldGroup` internally.
- Prefer one simple public component that composes existing shadcn/Base UI primitives
  internally. Do not create application-level compound APIs: every component file
  declares exactly one component, and each extracted part gets its own file
  (enforced by `check:props`).
- Use Base UI's native `render={<Component />}` API when a behavior-bearing primitive
  must render another component. Do not introduce custom `renderX` props or Radix
  `asChild` compatibility layers for that purpose.
- Do not create component-family context shared between sibling parts.
  Ordinary application composition should not need a context.
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
