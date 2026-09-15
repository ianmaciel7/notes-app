# Design

## Direction

KnowledgeOS uses **editorial minimalism** as its organizing principle: content leads, chrome stays quiet, and generous spacing gives study cards room to breathe. Every surface decision follows three rules:

1. **Serif display heads** — card questions and hero headings use `font-serif` (Georgia fallback) to signal depth and focus; UI chrome uses `font-sans` throughout.
2. **Calm product chrome** — the sidebar, header bar, and navigation carry no decorative color. Neutral hairline borders, muted icon tints, and a single `--sidebar` off-white surface separate chrome from content without competing with it.
3. **Deck accent washes** — deck identity is expressed through small `deck-badge` chips (future), not through full-bleed color. The canvas remains paper-white; accent is additive, not structural.

No gradients. No drop shadows. No decorative imagery. One inverted dark surface is permitted per page when a strong primary CTA is needed (e.g., the Reveal button inside a study card).

---

## Color system

All color decisions map Ollama design-system tokens to the app's semantic CSS custom properties defined in `src/app/globals.css`.

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

## Spacing & layout

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

Collapsible navigation sidebar with deck list.

| Section | Content |
|---|---|
| Header | Brand button: `size-6 rounded-md bg-primary text-primary-foreground` icon + `font-serif text-base` wordmark |
| Space group | "Space" label + Overview (`LayoutDashboard`) + All cards (`Library`) nav items |
| Decks group | "Study decks" label + `<Plus>` group action + per-deck `<BookOpen>` menu items, linked to `/study/{deck.id}` |
| Footer | Settings link (`<Settings>`) + user switcher button (`size-6 rounded-md bg-muted` avatar initial + name + "Personal" subline + `<ChevronsUpDown>`) |
| Collapse mode | `collapsible="icon"` — icon-only mode shows tooltips on hover; labels hidden |
| Active state | `isActive` prop on `<SidebarMenuButton>` applies `bg-sidebar-accent text-sidebar-accent-foreground` |

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

## Interaction principles

- Google sign-in is the front door to the study space.
- Review is an intentional transition: reveal, rate, then save.
- Unauthenticated visitors are redirected before private study UI renders.
- Progress and future editing belong to the authenticated space.
- No import/export or anonymous persistence is exposed in this MVP.
- Loading and pending states use disabled UI + label swap; never spinner overlays.
- Destructive actions (if any future ones exist) require explicit confirmation — no undo.

---

## Responsive behavior

The desktop space has a study rail, content column, and progress rail. Small screens collapse the rails and keep the deck/card content as the primary flow. The URL remains stable across viewport changes.

### Breakpoint table

| Breakpoint | Width | Layout |
|---|---|---|
| `sm` | ≥ 640px | Single column; sidebar drawer (Sheet) |
| `md` | ≥ 768px | Single column; sidebar drawer |
| `lg` | ≥ 1024px | Sidebar visible (240px) + content column |
| `xl` | ≥ 1280px | Sidebar + content + reserved progress rail slot |
| `2xl` | ≥ 1536px | Same as `xl`; content column max-width caps at `max-w-3xl` |

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
