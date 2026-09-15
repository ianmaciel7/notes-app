---
version: alpha
name: KnowledgeOS
description: Portuguese-first connected-object study studio for focused daily work
colors:
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  primary: oklch(0.205 0 0)
  primary-foreground: oklch(0.985 0 0)
  muted: oklch(0.97 0 0)
  muted-foreground: oklch(0.556 0 0)
  border: oklch(0.922 0 0)
  destructive: oklch(0.577 0.245 27.325)
  sidebar: oklch(0.985 0 0)
  dark-background: oklch(0.145 0 0)
  dark-foreground: oklch(0.985 0 0)
  dark-primary: oklch(0.922 0 0)
  dark-primary-foreground: oklch(0.205 0 0)
  dark-sidebar: oklch(0.205 0 0)
  dark-border: oklch(1 0 0 / 10%)
typography:
  editorial-display:
    fontFamily: Georgia, Cambria, Times New Roman, serif
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.2
  ui-body:
    fontFamily: ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  metadata:
    fontFamily: ui-sans-serif, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.333333
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  full: 9999px
spacing:
  base: 8px
  sm: 8px
  md: 16px
  lg: 24px
  section: 88px
components:
  header-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    height: 56px
  sidebar:
    backgroundColor: "{colors.sidebar}"
    width: 240px
  study-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 32px
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
---

# Design

> **Status:** Accepted visual guidance for the active `dev` MVP. Product
> behavior belongs in `SPEC.md`; system boundaries belong in
> `ARCHITECTURE.md`; runtime token values belong in `src/app/globals.css`.

## Overview

### Scope and historical synthesis

The historical worktrees were reviewed before this document was updated:

| Source | Useful contribution | Decision for `dev` |
|---|---|---|
| `old-2`, `old-3` | Portuguese-first connected-object studio; quiet density, progressive disclosure, stable geometry | Adopt as the product posture and interaction baseline |
| `old`, `old-4` | Three-region shell measurements, semantic focus behavior, explicit control contracts | Adopt the accessibility contracts; reserve the measured three-pane shell for a later workspace milestone |
| `old-5` | Capacities runtime evidence, hover-reveal sidebar controls, distinct tooltip/preview/menu semantics | Adopt as a future parity track; do not introduce its warm palette or extra controls into the MVP |
| `old-6` | Full object model, 18-tone palette, graph/inspector, editor, and AI surfaces | Keep as roadmap context only; these surfaces are not part of the current visual contract |

The active branch is intentionally narrower: authentication, the space
sidebar, the header bar, and the study-card flow. This document describes what
`dev` renders today and labels future Capacities-style surfaces as future;
historical documents remain read-only references.

This file follows the Google Labs `DESIGN.md` format: YAML front matter is the
machine-readable token layer, while the Markdown prose carries the rationale
and behavioral guidance. The official format is alpha and its normative
references are [the repository guide](https://github.com/google-labs-code/design.md),
[`docs/spec.md`](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md),
and [`PHILOSOPHY.md`](https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md).
Tokens are kept aligned with `src/app/globals.css`; prose explains intent and
implementation boundaries.

### Product direction

KnowledgeOS uses **editorial minimalism** as its organizing principle: content leads, chrome stays quiet, and generous spacing gives study cards room to breathe. Every surface decision follows three rules:

1. **Serif display heads** — card questions and hero headings use `font-serif` (Georgia fallback) to signal depth and focus; UI chrome uses `font-sans` throughout.
2. **Calm product chrome** — the sidebar, header bar, and navigation carry no decorative color. Neutral hairline borders, muted icon tints, and a single `--sidebar` off-white surface separate chrome from content without competing with it.
3. **Deck accent washes** — deck identity is expressed through small `deck-badge` chips (future), not through full-bleed color. The canvas remains paper-white; accent is additive, not structural.

No gradients. No drop shadows. No decorative imagery. One inverted dark surface is permitted per page when a strong primary CTA is needed (e.g., the Reveal button inside a study card).

The product posture is a Portuguese-first, connected-object study studio. The
interface should feel calm during repeated daily work, but minimalism must not
remove useful context, object identity, or accessible state. Prefer stable
geometry and progressive disclosure: frequent actions stay discoverable while
secondary actions appear in focused controls or menus.

---

## Colors

All color decisions map the project's shadcn semantic tokens to the CSS custom
properties defined in `src/app/globals.css`.

| Role | Name | CSS variable | Light value (oklch) | Hex approx. |
|---|---|---|---|---|
| Canvas | paper-white | `--background` | `oklch(1 0 0)` | `#ffffff` |
| Ink | ink-black | `--foreground` | `oklch(0.145 0 0)` | `#111111` |
| Primary action | primary-black | `--primary` | `oklch(0.205 0 0)` | `#1a1a1a` |
| Primary label | primary-fg | `--primary-foreground` | `oklch(0.985 0 0)` | `#fafafa` |
| Surface-soft | muted-surface | `--muted` | `oklch(0.97 0 0)` | `#f7f7f7` |
| Quiet text | muted-fg | `--muted-foreground` | `oklch(0.556 0 0)` | `#6b6b6b` |
| Hairline | border | `--border` | `oklch(0.922 0 0)` | `#e5e5e5` |
| Destructive | error-red | `--destructive` | `oklch(0.577 0.245 27.325)` | `#e53e3e` |
| Sidebar | sidebar-bg | `--sidebar` | `oklch(0.985 0 0)` | `#f9f9f9` |
| Dark surface | card-dark | (dark `.card` variant) | `oklch(0.205 0 0)` | `#1a1a1a` |

### Rules

- Use `--background` / `--foreground` for all page-level surfaces and text.
- Use `--muted` for input backgrounds, pill backgrounds on inactive states, and sidebar group labels.
- Use `--border` at `border-border/70` opacity for card outlines (subtler than `border-border`).
- Never introduce a new color not listed in the table above without a design decision record in `DECISIONS.md`.
- Dark mode values are already defined in `.dark {}` in `globals.css`; all components must use semantic tokens only — no hardcoded hex or raw oklch values in component files.

Historical parity palettes are evidence, not a second token system. If a
future workspace surface needs Capacities parity, add semantic aliases to
`globals.css` and record the decision before using them; do not copy literal
OKLCH values from `old-5` or `old-6` into components.

---

## Typography

Three font roles are in use. No additional typefaces may be introduced in MVP.

| Role | CSS var / class | Stack | Uses |
|---|---|---|---|
| Editorial serif | `--font-editorial` / `font-serif` | Georgia, Cambria, Times New Roman, serif | Card question fronts, card titles, login panel heading, sidebar brand name |
| UI sans | `--font-ui` / `font-sans` | ui-sans-serif, system-ui, sans-serif | All body copy, navigation labels, button labels, form inputs, metadata |
| Mono | `--font-geist-mono` / `font-mono` | Geist Mono, ui-monospace | Code blocks inside card content only |

### Scale in use

| Token | Size | Weight | Where |
|---|---|---|---|
| `text-3xl font-serif` | ~30px | 400 (regular) | Login panel `CardTitle`, study card question |
| `text-base font-serif` | 16px | 400 | Sidebar brand wordmark |
| `text-sm` | 14px | 400 | Body copy, nav labels, card descriptions |
| `text-xs` | 12px | 500, tracking-wide, uppercase | "KnowledgeOS" eyebrow label above login heading |
| `text-xs font-normal` | 12px | 400 | Sidebar footer subline ("Personal") |

### Rules

- Serif is reserved for content-level headings and study card fronts. Never use `font-serif` on navigation, buttons, or metadata.
- Do not set `font-weight` > 600 on serif text — Georgia renders poorly at heavy weights.
- Line-height defaults (`leading-normal`) apply everywhere; do not override without a documented reason.

---

## Layout

### Base unit

`8px`. All spacing values must be multiples of 8px (Tailwind: `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px). The `--radius` base is `0.625rem` (10px); derived radius tokens are generated in `globals.css`.

### Section rhythm

Major vertical sections are separated by `88px` (`mb-22` or equivalent). Within a section, subsections use `40px` (`gap-10`). Component internals use `16px` (`gap-4`) or `8px` (`gap-2`).

### Desktop shell (≥ 1024px)

```
┌──────────────┬─────────────────────────────┬───────────────┐
│  Space       │                             │               │
│  sidebar     │   Content column            │  Progress     │
│  (240px)     │   (flex-1)                  │  rail         │
│  collapsible │                             │  (future)     │
└──────────────┴─────────────────────────────┴───────────────┘
```

- **Sidebar** — `<Sidebar collapsible="icon">` from shadcn/ui. Collapses to icon-only mode (48px wide) on user toggle. Sidebar background is `--sidebar` (`oklch(0.985 0 0)`), separated from canvas by `--sidebar-border`.
- **Header bar** — `h-14` (56px), `border-b`, contains `<SidebarTrigger />` + a vertical divider (`h-4 w-px bg-border`) + breadcrumb/page label in `text-sm text-muted-foreground`.
- **Content column** — `flex-1 p-6 bg-background`. Hosts deck overview, card view, or empty state.
- **Progress rail** — reserved for a future FSRS streak/calendar widget. Not built in MVP; leave a `<!-- progress-rail -->` comment slot in layout if scaffolding.

### Mobile (< 768px)

- Sidebar collapses off-screen (shadcn/ui Sheet behavior). `<SidebarTrigger />` in the header bar opens it as a drawer.
- Content column takes full width (`w-full`).
- Card study UI stacks vertically: question block → reveal button → (after reveal) answer block → rating row.
- Rating row wraps to 2×2 grid if viewport < 360px.

---

## Elevation & Depth

KnowledgeOS is primarily flat. Hierarchy comes from semantic surface stepping
and hairline borders rather than decorative elevation. The login card may use
`shadow-sm`; study cards, navigation, and content surfaces do not use drop
shadows. Future floating surfaces may define their own restrained elevation
token when the component is implemented.

## Shapes

Use `rounded-lg` for cards and panels, `rounded-md` for controls, and
`rounded-full` for pills, avatars, and study rating actions. Shape communicates
component role; it is not decoration. Keep the 10px base radius and 8px
spacing rhythm stable across responsive states.

## Components

### `login-panel` — `src/components/login-panel.tsx`

The sole unauthenticated surface. Centered on a paper-white full-screen canvas.

| Property | Value |
|---|---|
| Layout | `grid min-h-screen place-items-center bg-background px-6 py-12` |
| Card container | shadcn `<Card>` with `border-border/70 shadow-sm`, `max-w-md w-full`, `rounded-lg` (10px) |
| Card padding | `CardHeader gap-3`, `CardContent gap-4` (inherits 24px default) |
| Eyebrow | `text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground` — "KnowledgeOS" |
| Heading | `font-serif text-3xl` — localized sign-in prompt |
| Description | `CardDescription` — `text-sm text-muted-foreground` |
| CTA button | shadcn `<Button>` with `w-full`; pill geometry from `rounded-full` variant (`className="w-full"`) |
| Error state | `text-sm text-destructive` paragraph below the button |
| Loading state | Button `disabled` + label swaps to "Loading…" |

> **Rule**: The login panel must never show any private study data, deck titles, or card counts before authentication is verified.

---

### `space-shell` — `src/components/space/space-shell.tsx`

The authenticated layout wrapper. Renders `<SidebarProvider>` → `<SpaceSidebar>` + `<SidebarInset>`.

| Property | Value |
|---|---|
| Header bar | `flex h-14 shrink-0 items-center gap-2 border-b px-4` |
| Header content | `<SidebarTrigger />` + `h-4 w-px bg-border` divider + `text-sm text-muted-foreground` page label |
| Main area | `flex-1 bg-background p-6 text-foreground` |
| Provider | `<SidebarProvider>` manages open/collapsed state; no additional wrappers needed |

---

### `space-sidebar` — `src/components/space/space-sidebar.tsx`

Collapsible navigation sidebar for the authenticated space.

| Section | Content |
|---|---|
| Header | Brand button: `size-6 rounded-md bg-primary text-primary-foreground` icon + `font-serif text-base` wordmark |
| Space group | Localized "Space" label + Overview (`LayoutDashboard`) + All cards (`Library`) nav items |
| Footer | Settings link (`<Settings>`) + user switcher button (`size-6 rounded-md bg-muted` avatar initial + name + "Personal" subline + `<ChevronsUpDown>`) |
| Collapse mode | `collapsible="icon"` — icon-only mode shows tooltips on hover; labels hidden |
| Active state | `isActive` prop on `<SidebarMenuButton>` applies `bg-sidebar-accent text-sidebar-accent-foreground` |

### Object icons and split buttons

Object types use the shared 256×256 `ObjectIcon` primitive. The `question`
object uses `QuestionIcon` and has a matching `QuestionSplitButton` composed
from the shared split-button primitives. New actionable object types should
preserve this icon and split-button pairing.

---

### `study-card` — _not yet built_

The central study UI. Located at `src/components/space/study-card.tsx`.

**Question state (before reveal):**

| Property | Value |
|---|---|
| Container | `rounded-lg border border-border/70 bg-card p-8` |
| Question text | `font-serif text-3xl leading-snug text-card-foreground` |
| Deck label | `text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4` |
| Reveal button | `<Button>` full-width, `rounded-full` pill, primary variant — "Reveal answer" |

**Answer state (after reveal):**

| Property | Value |
|---|---|
| Answer block | `mt-6 border-t border-border pt-6 font-sans text-base text-foreground` |
| Rating row | `flex gap-2 mt-6` — four pill buttons side by side |
| Again pill | `rounded-full` variant, destructive/outline style, label "Again" |
| Hard pill | `rounded-full` variant, secondary style, label "Hard" |
| Good pill | `rounded-full` variant, default/primary style, label "Good" |
| Easy pill | `rounded-full` variant, secondary style, label "Easy" |

> **Rule**: Rating buttons must not appear until the answer has been revealed. Manage this with a local `revealed` boolean state — never derive it from URL or Firestore.

---

### `deck-badge` — _not yet built_

A small accent chip used to label deck identity. Located at `src/components/space/deck-badge.tsx`.

| Property | Value |
|---|---|
| Container | `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium` |
| Background | `bg-muted text-muted-foreground` (neutral default); per-deck color class override allowed |
| Max width | Truncate at 120px with `truncate` |

> **Rule**: Deck badges must use only the muted neutral palette in MVP. Custom deck color palettes are a post-MVP concern.

---

### Interaction principles

Sidebar rows always keep a stable leading icon and accessible name. Icon-only
collapse mode may hide visible labels, but must retain tooltips and keyboard
focus. Counts, overflow actions, and other secondary affordances should be
progressively disclosed only when that surface exists; they must never steal
the primary row action.

- Google sign-in is the front door to the study space.
- Review is an intentional transition: reveal, rate, then save.
- Unauthenticated visitors are redirected before private study UI renders.
- Progress and future editing belong to the authenticated space.
- No import/export or anonymous persistence is exposed in this MVP.
- Loading and pending states use disabled UI + label swap; never spinner overlays.
- Destructive actions (if any future ones exist) require explicit confirmation — no undo.

### Accessibility and floating-surface contract

- Every actionable surface has a stable semantic name; `aria-label`,
  `aria-description`, and `aria-keyshortcuts` do not implicitly create visual
  tooltips.
- Tooltips are explicit, non-interactive hints. Entity previews and menus are
  separate interaction types with their own primitives, timing, and focus
  behavior; never substitute one for another.
- Preserve visible focus rings (`outline-ring/50`), restore focus to a stable
  trigger after closing an overlay, and respect `prefers-reduced-motion`.
- A hidden hover action must also be removed from pointer hit testing and the
  sequential keyboard order until it is revealed by the owning interaction.

---

### Responsive behavior

The desktop space has a navigation sidebar and content column, with a
progress-rail slot reserved for future work. Small screens collapse the sidebar
and keep the deck/card content as the primary flow. The URL remains stable
across viewport changes.

### Breakpoint table

| Breakpoint | Width | Layout |
|---|---|---|
| `sm` | ≥ 640px | Single column; sidebar drawer (Sheet) |
| `md` | ≥ 768px | Single column; sidebar drawer |
| `lg` | ≥ 1024px | Sidebar visible (240px) + content column |
| `xl` | ≥ 1280px | Sidebar + content + reserved progress rail slot |
| `2xl` | ≥ 1536px | Same as `xl`; content column max-width caps at `max-w-3xl` |

The three-pane editor/context geometry described by `old` and `old-6` is a
future workspace composition, not an MVP requirement. When introduced, it
must collapse progressively into drawers/sheets and preserve the study content
as the primary mobile flow; it must not be retrofitted by shrinking the MVP
content column below a readable measure.

### Mobile-specific rules

- Header bar remains visible at all breakpoints; it is the only persistent chrome on mobile.
- Rating row (`Again / Hard / Good / Easy`) wraps to 2×2 if viewport width < 360px.
- Sidebar opens as a Sheet (drawer) on `sm`/`md`; use `<SidebarTrigger />` in the header bar as the only affordance.
- Do not replicate navigation in the main content column on mobile.

---

## Do's and Don'ts

### Do

- Use semantic CSS custom properties (`--foreground`, `--muted`, etc.) in all new component files.
- Use `font-serif` only for study card questions, card titles, and hero headings.
- Keep all interactive elements (buttons, chips, tags) with `rounded-full` pill geometry.
- Use `rounded-lg` (10px via `--radius`) for card containers, panels, and modal dialogs.
- Apply `border-border/70` (subtly transparent border) on card surfaces instead of full `border-border`.
- Keep the header bar at exactly `h-14` (56px) — do not increase or make it dynamic.
- Always `truncate` text that may overflow in sidebar items and deck badges.

### Don't

- Don't add drop shadows (`shadow-*`) except `shadow-sm` on the login card (already set).
- Don't use gradients on any surface.
- Don't hardcode hex colors or raw oklch values in component files — always use CSS variables.
- Don't use `font-serif` on navigation items, buttons, form labels, or metadata.
- Don't introduce a fourth typeface.
- Don't show rating buttons before the card answer is revealed.
- Don't place more than one full-width primary (inverted dark) button per screen section.
- Don't expose study data, deck titles, or card content to unauthenticated renders.
