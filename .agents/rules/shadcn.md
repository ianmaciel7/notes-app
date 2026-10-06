# shadcn/ui Project Rules

## Context

- Next.js 16 App Router with RSC.
- shadcn style: `base-nova`.
- Primitive base: Base UI.
- Tailwind CSS v4 with semantic variables.
- Owned primitives: `src/components/ui/**`.

## Composition

- Reuse existing shadcn primitives before custom equivalents.
- Prefer compound composition over monolithic wrappers.
- Keep subcomponents under their documented owner.
- Use `FieldGroup` + `Field` for form layouts.
- Use `FieldSet` + `FieldLegend` for related controls.
- Keep Sidebar parts under `SidebarProvider`.
- Do not mix controlled and uncontrolled props.

## Base UI

- Do not use Radix-only `asChild`; use Base UI `render`.
- Let Base UI own focus management, portals, dismissal, and overlay behavior.

## Accessibility

- Dialog-like content needs an accessible title.
- Avatar needs `AvatarFallback`.
- Icon-only buttons require an accessible name.
- Pair invalid/disabled field state with the control state.
- Preserve native link semantics.

## Styling

- Use semantic tokens.
- Avoid raw palette colors in application components.
- Avoid manual `dark:` color ownership when semantic tokens suffice.
- Prefer `gap-*`, `truncate`, and logical direction utilities.
- Use `cn()` for conditional classes.
- Do not set manual z-index on shadcn overlay content.

## Buttons, icons, and inputs

- Loading state is composed with `disabled`, `Spinner`, and icon metadata.
- Button icons use `data-icon="inline-start"` or `"inline-end"`.
- Do not manually size icons when Button owns icon sizing.
- Use owned Input/Button/Textarea/Select primitives in application code when
  they fit the semantic role.

## Guard boundary

Application-code guards intentionally exclude `src/components/ui/**`. That
directory is the owned implementation layer, not ordinary consumption code.

Biome/GritQL should enforce only mechanically reliable invariants. Naming
quality, abstraction quality, registry strategy, and component responsibility
remain architecture/review concerns.

See [../../docs/SHADCN-GUARD-COVERAGE.md](../../docs/SHADCN-GUARD-COVERAGE.md) and
[../../docs/SHADCN-DIRECTORY-STRUCTURE.md](../../docs/SHADCN-DIRECTORY-STRUCTURE.md).
