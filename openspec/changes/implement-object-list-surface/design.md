## Context

The workspace shell, sidebar, local audit fixture, and context panel already exist. The missing boundary is the central object-type surface. The authenticated reference uses one repeated structure across object types: title and create controls, overview/list controls, count, then cards or a shared empty state.

## Goals / Non-Goals

**Goals:**

- Reuse one route-driven component for all object types.
- Match the observed desktop geometry and Portuguese labels.
- Keep source data, route metadata, and visible counts deterministic.
- Preserve keyboard names, focus indicators, and page-level overflow constraints.

**Non-Goals:**

- Clone vendor implementation details or network behavior.
- Add a new design system or component dependency.
- Replace the current local audit fixture.

## Decisions

### Navigation data owns route identity

`workspace-navigation.ts` resolves a path to a typed object-type item and its singular fixture label. The sidebar, top tab, and central surface therefore consume the same route identity.

### One composed surface owns all type pages

`ObjectTypeWorkspace` composes existing shadcn-style `Button` and `Badge` primitives with project tokens. It filters the audit fixture by singular type and renders cards or the shared empty state.

### Reference counts constrain seeded results

An object type whose canonical navigation count is zero stays empty even if the daily audit fixture contains a transient object of that type. This mirrors the authenticated reference inventory rather than leaking the daily-feed fixture into type lists.

### Rendered behavior is the replication boundary

The implementation records visible labels, geometry, computed color tokens, and interaction semantics from the rendered reference. It does not import vendor CSS, JavaScript bundles, class names, or private assets.

## Responsive Geometry

- Preserve the existing 288px desktop sidebar and context-panel breakpoint behavior.
- Keep the type header and toolbar fixed while the card region scrolls independently.
- Use an auto-filling grid with 188-202px cards so narrow central tracks remain unclipped.
- Preserve `scrollWidth === clientWidth` at the tested viewport.

## Risks / Trade-offs

- **Fixture counts diverge from daily objects** -> Treat sidebar counts as the current type-list inventory until persistence has a canonical data source.
- **Controls appear functional before behavior exists** -> Keep them accessible but scope filter/sort/create behavior to follow-up changes.
- **One card composition cannot represent every media type perfectly** -> Use shared semantics now and add type-specific previews only with browser evidence.

## Verification

- Focused Vitest coverage for a populated type route and a zero-count empty route.
- Biome and TypeScript checks for the affected files.
- Strict OpenSpec validation.
- Browser comparison of `/tipos/tabelas` against the authenticated `RootSimpleTable` page, including text, geometry, and horizontal overflow.
