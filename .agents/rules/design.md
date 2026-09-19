# Design System Rule

This rule is mandatory for every UI, styling, component, theme, or visual
design change in this repository.

## Required source of truth

- Read `DESIGN.md` before changing UI code.
- Treat `DESIGN.md` as the project design contract, not optional guidance.
- Treat `components.json` and `src/app/globals.css` as the implementation
  sources of truth referenced by `DESIGN.md`.
- Preserve the configured shadcn style, base color, CSS-variable model, Base UI
  primitives, Lucide icons, and semantic token names unless the user explicitly
  requests a design-system change.
- If `DESIGN.md` is missing or does not define a required decision, create or
  update it before implementing the UI change. Do not invent an undocumented
  design token, color, radius, or component convention.

## Mandatory implementation behavior

- Use existing components from `src/components/ui/` before creating markup or
  a new primitive.
- Use semantic shadcn tokens such as `bg-background`, `text-foreground`,
  `bg-primary`, `text-primary-foreground`, `bg-muted`,
  `text-muted-foreground`, `border-border`, `border-input`, `ring-ring`, and
  `text-destructive`.
- Do not introduce raw Tailwind palette colors, raw hex/RGB/HSL values, or
  manual dark-mode color overrides when a documented semantic token applies.
- Keep feature components composable with the installed Base UI/shadcn
  primitives and preserve their public props and exports.
- Follow the documented accessibility, focus, disabled, invalid, icon, slot,
  radius, spacing, and responsive behavior rules.
- Keep user-facing copy in the established i18n system.
- Do not create `index.ts` or `index.tsx` barrel files.

## Component change template

Use this checklist in implementation notes, pull request descriptions, or task
reports for meaningful UI work:

```md
## Design-system implementation

- Design source: `DESIGN.md`
- Existing primitive reused: `<component path or none>`
- Semantic tokens used: `<token classes>`
- Intentional exceptions: `<none or documented brand/chart/status exception>`
- Accessibility states checked: `<keyboard, focus, disabled, invalid, modal/menu>`
- Stories/tests updated: `<paths or not applicable>`
- Validation run: `<commands>`
```

## Completion gate

Before finishing a UI task:

1. Re-read the relevant `DESIGN.md` section.
2. Search changed files for undocumented raw colors and manual dark-mode
   overrides.
3. Confirm that new tokens, if any, are defined for light and dark themes and
   exposed through `@theme inline`.
4. Run the smallest relevant project checks, normally `pnpm lint`; use
   `pnpm build` and `pnpm ladle:build` when routes, client/server boundaries,
   shared primitives, or stories are affected.
5. Update `DESIGN.md` when the implementation introduces a durable design
   decision or exception.

Official references are linked from `DESIGN.md`, including shadcn theming and
`components.json` documentation.
