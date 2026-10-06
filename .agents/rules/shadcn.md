# Rule: shadcn/ui Standards and Principles

## Project Context

- Framework: Next.js App Router with RSC.
- shadcn style: Base Nova.
- primitive base: Base UI.
- Tailwind CSS v4 with semantic CSS variables.
- UI primitives live in `src/components/ui` and application code consumes them.

## Mandatory Rules

### Composition and ownership

- Reuse existing shadcn primitives before creating custom equivalents.
- Prefer compound-component composition over monolithic wrappers.
- Keep each subcomponent under its documented owner primitive.
- Use `FieldGroup` + `Field` for form layouts.
- Use `FieldSet` + `FieldLegend` for semantic groups of related controls.
- Use full `Card` composition with at least `CardHeader` and `CardContent`.
- Keep Sidebar parts under `SidebarProvider` and their documented parent slots.
- Do not mix controlled and uncontrolled props on the same component.

### Base UI

- Never use Radix-only `asChild`; use the Base UI `render` API.
- Do not use legacy Radix props rejected by the repository GritQL guards.
- Let Base UI own focus management, portals, dismissal, and overlay behavior.

### Accessibility

- Dialog, Sheet, Drawer, and AlertDialog content must have a title.
- Avatar must have `AvatarFallback`.
- Icon-only Button variants require an accessible name.
- Pair `Field[data-invalid]` with `aria-invalid` on its control.
- Pair `Field[data-disabled]` with `disabled` on its control.
- Preserve native link semantics: style links with `buttonVariants`; do not
  turn Button into an anchor.

### Styling and tokens

- Use semantic tokens such as `bg-background`, `text-foreground`,
  `text-muted-foreground`, `border-border`, and component-specific tokens.
- Do not use raw Tailwind palette colors or arbitrary literal color values in
  application component class names.
- Do not add manual `dark:` color overrides; semantic tokens own theme changes.
- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use `truncate` instead of the manual overflow/ellipsis/nowrap trio.
- Use logical direction utilities (`start/end`, `ms/me`, `ps/pe`,
  `text-start/text-end`) so code remains RTL-ready.
- Use `cn()` for conditional class composition.
- Do not set manual z-index values on shadcn overlay content.

### Buttons, icons, and inputs

- Buttons do not expose `isPending` or `isLoading`; compose loading state with
  `disabled` + `Spinner` + `data-icon`.
- Icons in Button must declare `data-icon="inline-start"` or
  `data-icon="inline-end"`.
- Do not manually size icons inside Button when Button owns icon sizing.
- Buttons inside `InputGroup` belong inside `InputGroupAddon`.
- Use `InputGroupInput`/`InputGroupTextarea` inside `InputGroup`.
- Prefer shadcn Button/Input/Textarea/Select primitives over raw interactive
  HTML controls in application code.

### Project configuration

- `components.json` is authoritative for style, RSC, TSX, Tailwind CSS, base
  color, CSS variables, aliases, icon library, RTL, menu color, and accent.
- Install registry components through the shadcn CLI; do not copy raw source
  from GitHub.
- `src/components/ui/**` is excluded from consumption guards because those
  files are the owned registry implementation layer.

## Guard boundary

Biome/GritQL enforce only mechanically verifiable invariants. Open Code,
Distribution, Registry strategy, Presets, monorepo organization, naming
quality, component responsibility, and 'prefer built-in variants first' remain
documented architecture policy because reliable AST enforcement would create
false positives.

See `docs/SHADCN-GUARD-COVERAGE.md` for full coverage.
