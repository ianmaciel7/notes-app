---
version: alpha
name: notes-app-shadcn-design-system
description: Design system and component specification for Notes App based on shadcn/ui base-nova style with Base UI primitives, Tailwind CSS v4, and OKLCH color variables. Conforms to the design.md spec (https://github.com/google-labs-code/design.md) — this YAML block is the normative source of values; the Markdown body below is rationale and application guidance, referencing these tokens via {group.key} syntax rather than restating them.

colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  sidebar: "oklch(0.985 0 0)"
  sidebar-foreground: "oklch(0.145 0 0)"
  sidebar-primary: "oklch(0.205 0 0)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.97 0 0)"
  sidebar-accent-foreground: "oklch(0.205 0 0)"
  sidebar-border: "oklch(0.922 0 0)"
  sidebar-ring: "oklch(0.708 0 0)"

# The design.md v1(alpha) schema's `colors:` map is flat — it has no native concept of a
# dark-mode pairing yet. Rather than lose real project data, `colors-dark` below is a
# clearly-labeled, non-canonical extension: same keys as `colors`, values from the `.dark`
# block in globals.css. A linter built against strict v1(alpha) may flag these keys as
# unrecognized — that's expected until the spec adds theme-variant support.
colors-dark:
  background: "oklch(0.145 0 0)"
  foreground: "oklch(0.985 0 0)"
  card: "oklch(0.205 0 0)"
  card-foreground: "oklch(0.985 0 0)"
  popover: "oklch(0.205 0 0)"
  popover-foreground: "oklch(0.985 0 0)"
  primary: "oklch(0.922 0 0)"
  primary-foreground: "oklch(0.205 0 0)"
  secondary: "oklch(0.269 0 0)"
  secondary-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.269 0 0)"
  muted-foreground: "oklch(0.708 0 0)"
  accent: "oklch(0.269 0 0)"
  accent-foreground: "oklch(0.985 0 0)"
  destructive: "oklch(0.704 0.191 22.216)"
  border: "oklch(1 0 0 / 10%)"
  input: "oklch(1 0 0 / 15%)"
  ring: "oklch(0.556 0 0)"
  sidebar: "oklch(0.205 0 0)"
  sidebar-foreground: "oklch(0.985 0 0)"
  sidebar-primary: "oklch(0.488 0.243 264.376)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.269 0 0)"
  sidebar-accent-foreground: "oklch(0.985 0 0)"
  sidebar-border: "oklch(1 0 0 / 10%)"
  sidebar-ring: "oklch(0.556 0 0)"

typography:
  heading:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontWeight: 400

rounded:
  sm: "calc(var(--radius) * 0.6)"   # 6px
  md: "calc(var(--radius) * 0.8)"   # 8px
  lg: "var(--radius)"               # 10px — the base
  xl: "calc(var(--radius) * 1.4)"   # 14px
  2xl: "calc(var(--radius) * 1.8)"  # 18px
  3xl: "calc(var(--radius) * 2.2)"  # 22px
  4xl: "calc(var(--radius) * 2.6)"  # 26px

# No global --spacing-* tokens exist in globals.css. These are the real, component-scoped
# local custom properties in use today (see card.tsx, calendar.tsx) — not a fabricated
# global scale. See "Layout" below for the honest framing.
spacing:
  card: "--spacing(4)"
  card-sm: "--spacing(3)"
  calendar-cell: "--spacing(7)"

# Representative only — 4 of 61 primitives. Full catalog lives in the "Components" body
# section, grouped by category; exact class strings live in source, never copied here.
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
  button-destructive:
    backgroundColor: "{colors.destructive}/10"
    textColor: "{colors.destructive}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    ringColor: "{colors.foreground}/10"
    padding: "{spacing.card}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    ringColor: "{colors.foreground}/10"
---

# Design System Specification

## Overview

This repository uses **shadcn/ui** with the **`base-nova`** design preset, implemented on top of **`@base-ui/react`** accessible unstyled primitives and **Tailwind CSS v4**. Theme tokens are declared in `src/app/globals.css` and mapped via `@theme inline` into Tailwind utility classes — the YAML frontmatter above mirrors that file and is the normative source; if the two ever disagree, `globals.css` wins and this document is out of date.

The visual language emphasizes:
- High contrast, neutral palette defined via perceptually uniform **OKLCH** color tokens — `{colors.destructive}` is the only non-achromatic hue in the whole palette.
- Accessible keyboard focus and interaction states with `@base-ui/react` and `class-variance-authority` (CVA).
- Seamless light/dark switching via `next-themes` toggling a `.dark` class (see `ARCHITECTURE.md` §4 for the runtime mechanism — not repeated here).
- Definition over drop-shadow: surfaces mostly separate via a 1px `ring-foreground/10` hairline rather than heavy elevation (see Elevation & Depth below).
- Component development and state verification via **Ladle** (see Storybook section at the end).

**Not yet established** — don't assume these exist when writing UI, and don't invent values for them: a formal elevation/shadow token scale, a custom responsive breakpoint scale, and a grid/container/layout system (no app shell or marketing surface exists yet — see `INTENT.md`).

---

## Colors

Roles fall into three groups: **surface** (`{colors.background}`/`{colors.card}`/`{colors.popover}`/`{colors.sidebar}` — what a region sits on), **interactive** (`{colors.primary}`/`{colors.secondary}`/`{colors.accent}`/`{colors.ring}` — buttons, links, focus), and **semantic** (`{colors.destructive}` only). Every value lives in the frontmatter above (`colors` for light, `colors-dark` for dark) — this table restates them for readability but the frontmatter is authoritative if they ever diverge.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `background` / `foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` | Canvas + primary text |
| `card` / `card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Elevated surfaces |
| `popover` / `popover-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Menus, tooltips, dialogs |
| `primary` / `primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` | Main buttons and CTAs |
| `secondary` / `secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Secondary buttons, badges |
| `muted` / `muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | Inactive items, placeholders |
| `accent` / `accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Hover, selected menu items |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Errors, deletions |
| `border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Dividers, outlines |
| `input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Form field boundaries |
| `ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus-visible rings |
| `sidebar*` | see frontmatter | see frontmatter | Sidebar background/text/accent/border — same role pattern as above, scoped to `sidebar.tsx` |

---

## Typography

| Role | Token | Font | Tailwind Class | Usage |
|---|---|---|---|---|
| Headings | `{typography.heading}` | Inter Variable, weight 600 | `font-heading`, `font-semibold` | Page titles, dialog titles |
| Body | `{typography.body}` | Inter Variable, weight 400 | `font-sans`, `text-sm`/`text-base` | Paragraphs, descriptions |
| Code / Mono | `{typography.mono}` | Geist Mono, weight 400 | `font-mono`, `text-xs`/`text-sm` | Code, `kbd`, hashes |

**Principles:**
- No custom type scale beyond Tailwind's defaults — sizes come from Tailwind utilities directly; there's no `--font-size-*`/`--tracking-*` system layered on top, unlike colors/radii.
- `{typography.heading}` and `{typography.body}` both resolve to the same Inter Variable font today (`globals.css`: `--font-heading: var(--font-sans)`) — separate classes for future flexibility, not currently distinct faces.
- Mono is reserved for code/technical content (`kbd.tsx`, `chart.tsx` axis labels) — body copy and headings never use it.

---

## Layout

**Spacing:** no global `--spacing-*` tokens exist — padding/gap values come from Tailwind v4's default 4px-based scale used inline per component. A few components define their own local spacing custom property instead of a global token (frontmatter `spacing`): `card.tsx`'s `{spacing.card}`/`{spacing.card-sm}` (every card sub-part reads the same variable, so changing it once re-spaces the whole card) and `calendar.tsx`'s `{spacing.calendar-cell}`. If a third component needs the same trick, that's the signal to promote it to a real global token.

**Responsive behavior:** no custom breakpoint scale exists — `globals.css` has no `@theme --breakpoint-*` overrides, so `sm`/`md`/`lg`/`xl`/`2xl` resolve to Tailwind v4 defaults (640/768/1024/1280/1536px). Only `sm`/`md`/`lg` are actually used today, in: `button.tsx`, `dialog.tsx`, `alert.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `sidebar.tsx`, `calendar.tsx`, `drawer.tsx`, `input.tsx`, `input-group.tsx`, `item.tsx`, `pagination.tsx`, `textarea.tsx`, `toggle.tsx`, `attachment.tsx`, `questionnaire.tsx`.

**Grid & container:** none to document — no app shell or marketing surface exists yet (`src/app/page.tsx` is still the unedited Next.js starter). Add this once real layout surfaces exist, grounded in what's actually built.

---

## Elevation & Depth

There's no formal elevation system (no `--shadow-*` CSS variables in `globals.css`) — components reach for Tailwind's default `shadow-sm`/`md`/`lg`/`xl` utilities individually, and several use a **1px ring instead of a shadow**:

- **Ring-only** (no shadow): `card.tsx` — `ring-1 ring-foreground/10`. Cards separate from the page via a hairline ring, not elevation.
- **Shadow + ring**: `popover.tsx` — `shadow-md ring-1 ring-foreground/10`.
- **Shadow only**: `sheet.tsx` (`shadow-lg`), `dropdown-menu.tsx`, `context-menu.tsx`, `menubar.tsx`, `combobox.tsx`, `command.tsx`, `select.tsx`, `hover-card.tsx`, `sidebar.tsx`, `tabs.tsx`, `chart.tsx`, `input-group.tsx`, `navigation-menu.tsx` — each picks its own scale step without a documented rule for which step maps to which surface type.

If adding elevation to a new component, match the nearest existing pattern (overlays → `shadow-md`/`lg`; simple containers → `ring-1 ring-foreground/10`) rather than inventing a new value. If a real tiered system becomes worth formalizing, promote it to named `--shadow-*` tokens in `globals.css`, same as colors/radii.

---

## Shapes

Border radii derive from a single `--radius` base (`0.625rem` / `10px`) via `calc()` — change the base variable, not individual `rounded-*` classes. See frontmatter `rounded` for the full scale; typical use:

| Token | Value | Typical Use |
|---|---|---|
| `{rounded.sm}` | 6px | Inputs, small buttons, tags |
| `{rounded.md}` | 8px | Dropdown items, badges |
| `{rounded.lg}` | 10px (base) | Default button radius, cards, dialogs, popovers |
| `{rounded.xl}` | 14px | Large panels |
| `{rounded.2xl}`–`{rounded.4xl}` | 18–26px | Drawer sheets, modal cards |

---

## Components

Frontmatter `components` tokenizes 4 representative primitives to show the composition pattern — this is illustrative, not a mirror of the source files. Read the `.tsx` directly before relying on exact class strings:

- **`button.tsx`**: 6 `variant`s (`default`→`{components.button-default}`, `outline`, `secondary`, `ghost`, `destructive`→`{components.button-destructive}`, `link`) × 8 `size`s, independent axes. `destructive` is a soft-fill (`bg-destructive/10`), not solid, in both themes.
- **`card.tsx`** (`{components.card}`): spacing driven by the local `{spacing.card}` custom property so sub-parts (`CardHeader`/`CardContent`/`CardFooter`) stay consistent if it's changed once.
- **`popover.tsx`** (`{components.popover}`): the one primitive combining a shadow and a ring; animated via Base UI's `data-open`/`data-closed` attributes rather than a separate animation library.

### Full Catalog (`src/components/ui/`, 61 primitives)

1. **Actions & Triggers**: `button.tsx`, `button-group.tsx`, `toggle.tsx`, `toggle-group.tsx`.
2. **Layout & Navigation**: `sidebar.tsx`, `tabs.tsx`, `breadcrumb.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `accordion.tsx`, `collapsible.tsx`, `separator.tsx`, `resizable.tsx`, `scroll-area.tsx`, `aspect-ratio.tsx`.
3. **Overlays & Dialogs**: `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `menubar.tsx`, `command.tsx`.
4. **Data Input & Forms**: `input.tsx`, `textarea.tsx`, `field.tsx`, `input-group.tsx`, `checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `native-select.tsx`, `combobox.tsx`, `input-otp.tsx`, `slider.tsx`, `switch.tsx`, `calendar.tsx`, `label.tsx`, `direction.tsx`.
5. **Data Display & Feedback**: `card.tsx`, `table.tsx`, `badge.tsx`, `avatar.tsx`, `alert.tsx`, `progress.tsx`, `skeleton.tsx`, `sonner.tsx`, `chart.tsx`, `carousel.tsx`, `empty.tsx`, `kbd.tsx`, `spinner.tsx`, `item.tsx`.
6. **Conversational / Chat UI** (`@shadcn/react` extensions, not vanilla `@base-ui/react`): `bubble.tsx`, `message.tsx`, `message-scroller.tsx`, `attachment.tsx`, `questionnaire.tsx`, `marker.tsx`.

---

## Do's and Don'ts

1. **Use CVA & `cn` for class composition** — always merge Tailwind classes via `@/lib/utils` `cn(...)`; use `class-variance-authority` for multi-variant components.
2. **Leverage Base UI slots** — style sub-elements with data attributes like `data-slot="button"`, `in-data-[slot=...]`, `has-data-[icon=...]`.
3. **Respect OKLCH token semantics** — never hardcode hex codes (`#ffffff`, `#171717`); use `bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.
4. **Maintain the dark theme via CSS variables**, not scattered one-off `dark:` utility overrides. (Per `CONTEXT.md`'s glossary, "mode" is a rejected synonym for "Theme.")
5. **Match existing elevation patterns, don't invent new ones** — new overlays follow `popover.tsx`'s shadow+ring pattern; new simple containers follow `card.tsx`'s ring-only pattern.

---

## Storybook / Visual Verification (`ladle`)

Not a canonical design.md section — repo-specific tooling notes.

- Stories file pattern: `src/components/ui/*.stories.tsx`.
- Current coverage: only `button.tsx` has a story; the other ~60 primitives in the catalog above do not yet have one. Treat new/changed components as needing a story, not as already covered.
- Run local viewer: `pnpm ladle`. Build static catalog: `pnpm ladle:build`.
