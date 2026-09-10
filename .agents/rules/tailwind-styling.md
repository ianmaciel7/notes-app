---
trigger: glob
globs:
  - "src/**/*.tsx"
  - "src/**/*.css"
description: Tailwind CSS v4 styling aligned with shadcn-first and existing theme tokens.
---

# Tailwind CSS v4 Styling Rules

## CSS-First Architecture

Use the installed Tailwind CSS v4 configuration in `src/app/globals.css` and
`postcss.config.mjs`. Do not introduce `tailwind.config.js`, `tailwind.config.ts`,
component CSS modules, or standalone component stylesheets. Do not use `@apply`.

Keep local component styling in utility classes, meaningful CVA variants, and
existing semantic tokens. Theme changes need explicit scope; do not modify
`globals.css` to repair a local component.

## Component Styling

Follow `.agents/rules/shadcn-first.md` for component composition and style contracts.
Use `bg-sidebar`, `bg-background`, `bg-card`, `border-border`,
`text-foreground`, and `text-muted-foreground` according to their semantic role.
Do not hardcode palette colors or add separate light/dark color overrides.

Use `cn` from `@/lib/utils` to merge classes. Prefer the component's existing
variant and state API over repeated consumer overrides. Arbitrary descendant
selectors are appropriate for real child slots; do not use `!important` to hide
an incorrect layout, slot, or specificity contract.

For example, a layout-only descendant constraint can use
`[&_[data-slot=scroll-area-viewport]]:overflow-x-hidden` when that slot is owned by
the affected component. First check that clipping is intentional and does not
hide focus indicators or required content.

## Layout and Typography

Use the existing app-shell/resizable components and values in
`src/lib/space-layout.ts`; do not duplicate sidebar widths or breakpoints here.
Keep sidebar visibility, drag-resizing, and mobile presentation distinct.

Use the existing document typography utilities. Do not assume
`@tailwindcss/typography` is installed or add a plugin without checking the
package manifest and the actual rendering requirement.

Verify affected light/dark themes, overflow, keyboard focus, responsive layout,
and reduced-motion behavior. Do not claim visual parity without browser evidence.
