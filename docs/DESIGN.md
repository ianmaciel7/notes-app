# Design

This document is the canonical design reference for repository UI work. It reflects the current implementation in `src/app/globals.css` and the default Next.js starter surface in `src/app/page.tsx`.

## Repository Principles

- Prefer the simplest correct solution that fits the current codebase.
- Use existing project patterns, platform APIs, and dependencies before adding new abstractions.
- Keep modules focused and avoid coupling unrelated concerns.
- Keep documentation, rules, and examples system-agnostic unless they describe this repository's actual implementation.
- Follow the A11Y.md Standard profile for WCAG 2.2 AA unless a task explicitly sets another profile.
- Prefer native semantic HTML.
- Do not use clickable `div` or `span` elements.
- Keep every interaction keyboard-operable with visible focus and correct focus management.
- Provide connected labels for form controls and meaningful `alt` text for informative images.
- Meet contrast requirements: 4.5:1 for text and 3:1 for UI components or meaningful graphics.
- Do not convey state by color alone; pair color with text, iconography, or another cue.
- Respect `prefers-reduced-motion` for animations and transitions.
- Record accepted accessibility violations in `EXCEPTIONS.md`.
- Record conformant accessibility pattern decisions in `A11Y-DECISIONS.md`.

## Visual Direction

Use the default `create-next-app` visual baseline until a new product design system is accepted through OpenSpec.

The current UI is intentionally minimal:

- White light-mode background with near-black foreground text.
- Near-black dark-mode background with light foreground text.
- Default Next.js starter layout with centered content on mobile and left-aligned content at the `sm` breakpoint.
- Black/foreground primary action using a pill shape.
- Subtle gray outlined secondary action.
- Next.js starter SVG assets from `public/`.
- Tailwind utility classes colocated in components.

Do not reintroduce the previous Notion-inspired palette, deep navy hero bands, purple CTA system, pastel card tints, or workspace mockups unless a future OpenSpec change explicitly restores that direction.

## Tokens

### Colors

The implemented global color contract is intentionally small:

```yaml
colors:
  background: "#ffffff"
  foreground: "#171717"

dark:
  background: "#0a0a0a"
  foreground: "#ededed"
```

Tailwind theme aliases are defined inline:

```yaml
theme:
  color-background: "var(--background)"
  color-foreground: "var(--foreground)"
```

Use `bg-background`, `text-foreground`, `bg-foreground`, and `text-background` when components should follow the global light/dark color contract.

### Typography

`layout.tsx` loads Geist Sans and Geist Mono and exposes them through CSS variables:

```yaml
fonts:
  sans-token: "var(--font-geist-sans)"
  mono-token: "var(--font-geist-mono)"
  body-fallback: "Arial, Helvetica, sans-serif"
```

The body currently uses `Arial, Helvetica, sans-serif` from `globals.css`. Components may opt into the Tailwind font tokens with `font-sans` and `font-mono`, as the starter page does.

Typography should stay close to the starter page:

| Use | Tailwind Pattern |
| --- | --- |
| Body and links | `text-sm` or `sm:text-base` |
| Ordered instructions | `font-mono text-sm/6` |
| Button labels | `text-sm font-medium` and `sm:text-base` |
| Inline code | `font-mono font-semibold` |

### Radius

The current starter UI uses pill-shaped action buttons and small rounded inline code.

```yaml
radius:
  code: "rounded"
  actions: "rounded-full"
```

### Spacing

The current page uses Tailwind utility spacing directly.

```yaml
spacing:
  page-padding-mobile: "p-8 pb-20"
  page-padding-sm: "sm:p-20"
  main-gap: "gap-[32px]"
  page-gap: "gap-16"
  action-gap: "gap-4"
  footer-gap: "gap-[24px]"
```

## Components

### Page Shell

- Use `grid min-h-screen grid-rows-[20px_1fr_20px]`.
- Center content with `items-center justify-items-center`.
- Use `font-sans` when a shell should use the configured Geist Sans token.

### Primary Action

- Use `bg-foreground text-background`.
- Use `rounded-full`.
- Use `h-10 px-4` on mobile and `sm:h-12 sm:px-5` at the `sm` breakpoint.
- Include an icon when the action matches the starter Vercel deploy pattern.

### Secondary Action

- Use a transparent background with `border border-solid border-black/[.08]`.
- In dark mode, use `dark:border-white/[.145]`.
- Use `rounded-full`.
- Keep hover states subtle with light gray fills.

### Inline Code

- Use `rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold`.
- In dark mode, use `dark:bg-white/[.06]`.

### Footer Links

- Use inline icon plus text.
- Use `hover:underline hover:underline-offset-4`.
- Keep links in a wrapping flex row with `gap-[24px]`.

## Layout

- Mobile-first layout is centered.
- At `sm`, main content aligns to the start with `sm:items-start`.
- Action buttons stack vertically on mobile and become a row at `sm`.
- Footer links wrap and remain centered.
- The page has no custom max-width container, card system, sidebar, or marketing hero.

## Responsive Behavior

| Breakpoint | Behavior |
| --- | --- |
| Base | Centered single-column layout with stacked actions |
| `sm` | Larger page padding, left-aligned main content, horizontal actions |
| `md` | Secondary action may use fixed width via `md:w-[158px]` |

## Do

- Keep new UI consistent with the implemented `background` and `foreground` tokens.
- Use Tailwind utilities already present in the starter page before adding new CSS.
- Preserve semantic HTML and accessible link names.
- Use existing SVG assets from `public/` for the starter page.
- Keep dark-mode behavior tied to `prefers-color-scheme`.

## Do Not

- Do not add brand colors that are not present in `globals.css` without an OpenSpec-backed design change.
- Do not describe unavailable tokens, components, or visual systems as current implementation.
- Do not reintroduce the old workspace UI language without updating specs and implementation together.
- Do not duplicate detailed design rules across agent files. Link to this document instead.

## State And Data

The current app has no persistent application data model. When state or data flows are introduced, document accepted architecture in `docs/ARCHITECTURE.md` and design rationale in OpenSpec for significant changes.

## Error Handling

- Prefer explicit, user-appropriate error states over silent failures.
- Keep error handling close to the boundary that can recover or present the failure.
- Avoid leaking secrets or sensitive implementation details in user-facing errors.

## Maintainability

- Keep generated files out of manual edits.
- Avoid duplicating the same rule or workflow across multiple documents.
- Use links to canonical docs instead of copying detailed instructions.
- Before adding semantic indexes, memory systems, or context middleware, record security review and benchmark evidence in `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md`.
