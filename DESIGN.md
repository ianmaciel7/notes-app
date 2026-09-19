# Design System

This project uses [shadcn/ui](https://ui.shadcn.com/) as a source-code design
system with the `base-nova` style, Tailwind CSS v4, React 19, and Base UI
primitives. Shared components live in `src/components/ui/`; application
features compose those primitives instead of recreating them.

## Source of truth

- `components.json` defines the shadcn configuration and aliases.
- `src/app/globals.css` defines theme variables and exposes them as Tailwind
  utilities.
- `src/components/ui/` contains the installed component implementations.
- `.agents/rules/shadcn.md` defines repository-specific component rules.
- `pnpm` is the package runner; Biome is the formatter and linter.

The current configuration is:

| Setting | Value |
| --- | --- |
| Style | `base-nova` |
| Base color | `neutral` |
| CSS variables | Enabled |
| Tailwind | v4 |
| Primitive library | Base UI (`@base-ui/react`) |
| Icons | Lucide (`lucide-react`) |
| RSC support | Enabled |
| RTL | Disabled |

See the official [components.json documentation](https://ui.shadcn.com/docs/components-json)
and [Tailwind v4 guidance](https://ui.shadcn.com/docs/tailwind-v4).

## Theme tokens

Use semantic tokens so light and dark themes can change without rewriting
component classes. Every surface token should use its matching `-foreground`
token for text and icons.

| Token pair | Intended use |
| --- | --- |
| `background` / `foreground` | Application surface and default content |
| `card` / `card-foreground` | Raised content surfaces |
| `popover` / `popover-foreground` | Menus, popovers, dialogs, and overlays |
| `primary` / `primary-foreground` | Main actions and selected states |
| `secondary` / `secondary-foreground` | Supporting actions and secondary emphasis |
| `muted` / `muted-foreground` | Subtle surfaces and supporting text |
| `accent` / `accent-foreground` | Hover, highlighted, and navigation states |
| `destructive` / `destructive-foreground` | Dangerous actions and error emphasis |
| `border` | General borders and separators |
| `input` | Input borders and input surfaces |
| `ring` | Focus indicators |

Use the corresponding utilities, for example:

```tsx
<section className="bg-card text-card-foreground">
  <p className="text-muted-foreground">Supporting information</p>
  <button className="bg-primary text-primary-foreground">Continue</button>
</section>
```

The variables are declared for both `:root` and the dark theme selector in
`src/app/globals.css`. Do not add a manual `dark:` color override when a
semantic token already expresses the state. To add a new project-wide semantic
color, define both light and dark variables and expose both utilities through
the `@theme inline` block.

Official reference: [shadcn theming](https://ui.shadcn.com/docs/theming).

## Color policy

Prefer semantic tokens in shared primitives and feature UI:

- Use `bg-primary`, `text-primary-foreground`, `bg-muted`,
  `text-muted-foreground`, `border-border`, `border-input`, and `ring-ring`.
- Use component variants such as `Button` `variant="destructive"` or
  `Badge` `variant="secondary"` before adding custom color classes.
- Use `text-destructive` and destructive backgrounds for errors and dangerous
  actions.
- Do not use raw Tailwind palette classes such as `text-emerald-600` or
  `bg-red-500` when the state can be represented by an existing semantic token.
- Do not use raw hex, RGB, or HSL values in ordinary component styling.

Literal colors are acceptable only when they carry meaning that is not part of
the neutral application theme, such as a third-party provider logo or a chart
series. Domain status colors should eventually become named semantic tokens
with light and dark values if they are used across multiple features.

The application-owned landing, authentication error, question status, and
feedback styles use semantic tokens. The remaining literal colors in
`src/components/auth/google-sign-in-button.tsx` are provider logo colors and
are an intentional brand-color exception.

## Components and composition

Use an existing shared primitive before creating custom markup or a new
primitive. Shared primitives should remain small wrappers around Base UI or
semantic HTML and should preserve their public API.

- Use `Button` variants and sizes for actions; compose `Spinner` with a
  disabled button for pending states.
- Use the complete `Card` composition: `CardHeader`, `CardTitle`,
  `CardDescription`, `CardContent`, and `CardFooter` where applicable.
- Use `Badge` for compact status labels instead of styled spans.
- Use `Alert` for callouts, `Empty` for empty states, and `Separator` for
  separators.
- Use `FieldGroup` and `Field` for forms, including `data-invalid` and
  `aria-invalid` validation states.
- Keep menu items inside their menu groups and tabs triggers inside
  `TabsList`.
- Dialog, sheet, and drawer content must have an accessible title, using
  `sr-only` when the title is visually hidden.
- Use Base UI `render`/`mergeProps` patterns where the local primitive uses
  them; do not introduce Radix-only `asChild` APIs into Base UI wrappers.

## Styling conventions

- Merge conditional classes with `cn` from the established project utility.
- Use `cva` and `VariantProps` for reusable, typed variants and sizes.
- Use `gap-*` for spacing rather than `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal.
- Use `truncate` for single-line truncation.
- Use the existing radius scale derived from `--radius`; do not invent local
  radius tokens.
- Keep stable `data-slot` values on primitive roots and meaningful subparts.
- Keep overlays accessible and let the overlay primitive manage stacking.
- Keep static components server-compatible; add `use client` only for state,
  effects, event handlers, or browser APIs.

## Icons and accessibility

Use `lucide-react` for ordinary interface icons and follow the project naming
style, such as `SearchIcon` or `ChevronDownIcon`.

- Icon-only controls need an accessible name.
- Icons inside buttons use `data-icon="inline-start"` or
  `data-icon="inline-end"` when the button supports those slots.
- Let the component control ordinary icon sizing; avoid ad-hoc icon dimensions
  inside shared primitives.
- Preserve semantic elements, visible labels, focus indicators, disabled
  states, and invalid states.
- Always provide `AvatarFallback` for avatars and titles for modal surfaces.

## Adding or updating components

1. Inspect and compose the local primitive first.
2. Check the shadcn registry before creating a new primitive.
3. Use the project package runner, for example `pnpm dlx shadcn@latest`.
4. Preview updates with `--dry-run` and `--diff`; do not overwrite local
   component changes without explicit approval.
5. Read every generated or updated file and correct imports, composition, and
   accessibility issues.
6. Add or update Ladle stories for meaningful variants, sizes, icon states, and
   edge cases.

Never create `index.ts` or `index.tsx` barrel files. Import components directly
from their specific modules.

## Validation checklist

For shared UI changes, run the smallest relevant checks and broaden them when
the change affects routes, primitives, or client/server boundaries:

```text
pnpm lint
pnpm format
pnpm build
pnpm ladle:build
```

Before considering a UI change complete, verify that:

- public exports and props remain compatible;
- semantic tokens work in light and dark themes;
- keyboard, focus, disabled, invalid, modal, and menu interactions work;
- icon-only controls are labelled;
- `data-slot` names remain stable;
- no unnecessary dependency or global CSS change was introduced.

## Official references

- [shadcn/ui documentation](https://ui.shadcn.com/docs)
- [Theming](https://ui.shadcn.com/docs/theming)
- [components.json](https://ui.shadcn.com/docs/components-json)
- [Tailwind CSS v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Component catalogue](https://ui.shadcn.com/docs/components)
