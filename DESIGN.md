---
name: "KnowledgeOS"
colors:
  background: "#FFFFFF"
  foreground: "#18181B"
  surface: "#FAFAFA"
  card: "#FFFFFF"
  border: "#E4E4E7"
  primary: "#18181B"
  primary-foreground: "#FAFAFA"
  secondary: "#F4F4F5"
  secondary-foreground: "#18181B"
  muted: "#F4F4F5"
  muted-foreground: "#71717A"
  destructive: "#EF4444"
  sidebar: "#FAFAFA"
  sidebar-border: "#E4E4E7"
  ring: "#A1A1AA"
---

# Design System: KnowledgeOS

## 1. Visual Theme & Atmosphere

KnowledgeOS embodies a **monastic, distraction-free knowledge sanctuary** paired with **high-density spatial rigor**. Inspired by the precision of physical studio desks and the clean architecture of Capacities and Readwise Reader, the interface balances generous, readable typography with compact, functional tooling.

The atmosphere is **clinical, calm, and tactile**:
- **Light Theme**: Crisp off-white surfaces (`#FAFAFA` and `#FFFFFF`) framed by hairline whisper-thin borders (`#E4E4E7`), giving every pane physical containment without visual clutter.
- **Dark Theme**: Deep zinc foundations (`#18181B` to `#27272A`) with subdued contrast text and 10% translucent borders, eliminating eye fatigue during prolonged reading and study sessions.
- **Elevation Philosophy**: Minimalist flat layering. Rather than heavy artificial drop shadows, hierarchy is communicated through subtle border boundaries (`1px`), clean background surface stepping, and precise spatial zoning.

---

## 2. Color Palette & Roles

All colors are defined via modern OKLCH tokens in [`src/app/globals.css`](file:///C:/Users/ianma/workspace/notes-app/src/app/globals.css) and exposed through Tailwind CSS v4 variables:

### Primary Foundation & Surfaces
- **Canvas White (`--background`)**: `oklch(1 0 0)` / `#FFFFFF` (Light) | `oklch(0.145 0 0)` / `#18181B` (Dark)
  - Primary application viewport surface.
- **Surface Elevation (`--card`, `--popover`)**: `oklch(1 0 0)` / `#FFFFFF` (Light) | `oklch(0.205 0 0)` / `#27272A` (Dark)
  - Modals, popovers, property sheets, and floating toolbars.
- **Sidebar Rail (`--sidebar`)**: `oklch(0.985 0 0)` / `#FAFAFA` (Light) | `oklch(0.205 0 0)` / `#27272A` (Dark)
  - Navigation drawer, daily note calendar rail, and object directory.

### Interactive & Accents
- **Primary Ink (`--primary`)**: `oklch(0.205 0 0)` / `#18181B` (Light) | `oklch(0.922 0 0)` / `#E4E4E7` (Dark)
  - Primary call-to-action buttons, active navigation pills, and focused tab indicators.
- **Subtle Surface (`--secondary`, `--muted`, `--accent`)**: `oklch(0.97 0 0)` / `#F4F4F5` (Light) | `oklch(0.269 0 0)` / `#3F3F46` (Dark)
  - Hover states, tag chips, secondary button backgrounds, and code snippets.
- **Focus Ring (`--ring`)**: `oklch(0.708 0 0)` / `#A1A1AA` (Light) | `oklch(0.556 0 0)` / `#71717A` (Dark)
  - 3px semi-transparent ring outline for accessible keyboard navigation (`focus-visible`).

### Typography & Hierarchy
- **Primary Ink (`--foreground`)**: `oklch(0.145 0 0)` / `#18181B` (Light) | `oklch(0.985 0 0)` / `#FAFAFA` (Dark)
  - Page titles, headings, and high-priority body content.
- **Muted Steel (`--muted-foreground`)**: `oklch(0.556 0.0051 33.89)` / `#71717A` (Light) | `oklch(0.708 0.006 30.59)` / `#A1A1AA` (Dark)
  - Metadata, timestamps, backlinks count, property keys, and placeholder labels.

### Functional States & Highlighting
- **Destructive Alert (`--destructive`)**: `oklch(0.577 0.245 27.325)` / `#EF4444`
  - Deletion warnings, failed sync status, and overdue study alerts.
- **Highlight API Tones**:
  - Yellow anchor highlight: `oklch(0.92 0.15 95 / 35%)`
  - Emerald highlight: `oklch(0.88 0.14 150 / 35%)`
  - Sky blue highlight: `oklch(0.88 0.12 230 / 35%)`
  - Rose highlight: `oklch(0.88 0.14 15 / 35%)`

---

## 3. Typography Rules

KnowledgeOS uses **Geist** (Vercel’s engineered sans-serif) and **Geist Mono** loaded via `next/font/google`:

- **Sans-Serif (`--font-sans`)**: Geist Sans. Highly legible at small UI sizes (11px–13px) with clean geometry for reading notes.
- **Monospace (`--font-mono`)**: Geist Mono. Used exclusively for code blocks, exact text anchor offsets, SRS stability/difficulty metrics, and burndown calculations.

### Type Scale & Hierarchy
- **Display / Document Title (H1)**: `text-3xl sm:text-4xl font-semibold tracking-tight leading-tight` (32px–36px)
- **Section Heading (H2)**: `text-xl font-semibold tracking-tight leading-snug` (20px)
- **Subheading / Panel Header (H3)**: `text-sm font-semibold tracking-normal text-foreground uppercase` (13px–14px)
- **Body Text**: `text-base font-normal leading-relaxed text-foreground max-w-[68ch]` (16px, line-height 1.625)
- **UI Label / Button / Sidebar Item**: `text-sm font-medium tracking-normal` (13px–14px)
- **Caption / Metadata / Badge**: `text-xs font-medium text-muted-foreground` (11px–12px)

---

## 4. Component Stylings & Interaction Patterns

All interactive primitives are built on `@base-ui/react` and shadcn/ui composable patterns:

### Buttons
- **Shape & Radii**: Subtly rounded corners (`rounded-lg` = `0.625rem` / 10px).
- **Tactile Response**: Active state translates down `1px` (`active:not-aria-[haspopup]:translate-y-px`).
- **No Neon AI Glows**: Flat, crisp background fills with subtle opacity hover transitions (`transition-colors duration-150`).
- **Sizes**:
  - `sm` (`h-7 px-2.5 text-xs`): For toolbar controls, inspector buttons, and card actions.
  - `default` (`h-8 px-2.5 text-sm`): Standard button height across dialogs and panes.
  - `lg` (`h-9 px-3 text-sm`): Primary action triggers.

### Floating Action Toolbar (Reader)
- Floating contextual palette appearing over text selection.
- Pill-shaped container (`rounded-full shadow-lg border border-border bg-popover/95 backdrop-blur-md`).
- Quick actions: Highlight color circle swatches, "Extract to Flashcard", "Copy Anchor Link".

### Object & Tag Chips
- `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-secondary-foreground border border-border/50`.
- Icon paired with color tone registered centrally in `src/components/object-icons.tsx`.

### Cards & Property Sheets
- Minimal hairline borders (`border border-border`).
- Zero heavy drop shadows; card elevation uses background contrast or slight hover border brightening.

---

## 5. Layout Principles: The 3-Pane Capacities Architecture

The application layout strictly follows the **Capacities 3-Pane Geometry**:

```
+-------------------+--------------------------------------------+-----------------------+
|   Left Sidebar    |            Main Center Workspace           |    Right Inspector    |
|      (240px)      |                  (Flex-1)                  |        (320px)        |
|                   |                                            |                       |
| - Quick Switcher  | Split View (e.g. PDF reader & Notes)       | - Properties Sheet    |
| - Daily Notes     | - BlockNote editor                         | - Outgoing Relations  |
| - Object Directory| - Text quote highlight overlays            | - Backlinks Graph     |
| - Tags / Views    | - Staging Drawer for AI cards              | - 2D Local Graph      |
+-------------------+--------------------------------------------+-----------------------+
```

### Layout Specifications
1. **Left Sidebar (`w-60` / 240px fixed)**:
   - Sticky navigation rail, collapsible to an icon-only or hidden rail.
   - Border-right `1px solid var(--sidebar-border)`.
2. **Main Center (`flex-1`)**:
   - Split-view container supporting 50/50, 60/40, or full single-pane focus.
   - Document reader respects reading column width (`max-w-3xl mx-auto px-6 py-10`).
3. **Right Inspector Panel (`w-80` / 320px fixed)**:
   - Collapsible properties sheet.
   - Border-left `1px solid var(--border)`.
4. **Responsive Collapse Rules**:
   - **Desktop (>= 1280px)**: All 3 panes visible simultaneously.
   - **Laptop (1024px - 1279px)**: Right inspector collapses into a sliding overlay drawer.
   - **Mobile (< 768px)**: Strict single-pane focus with bottom navigation bar and full-screen sheets. Horizontal scroll on root viewport is strictly forbidden (`overflow-x-hidden`).

---

## 6. Critical Engineering & Anti-Pattern Guidelines

To maintain production excellence and avoid generic AI design pitfalls:

- **Banned AI Tells**:
  - No generic purple/neon gradient buttons or glowing drop-shadow halos.
  - No pure black (`#000000`) on white; use Zinc-950 (`#18181B`).
  - No arbitrary floating numbers or fake uptime metric tiles without real user data.
  - No arbitrary DOM manipulation for highlights; use the native **CSS Custom Highlight API** or SVG/Canvas bounding overlays.
- **Motion & Micro-interactions**:
  - Use subtle 150ms–200ms ease-out transitions (`transition-all duration-150 ease-out`).
  - Staggered cascade reveals for modal entries and drawers.
- **Accessibility & Spacing**:
  - Target sizes: minimum `44px` touch target for primary touch interactions, `28px–32px` for high-density desktop toolbar icons.
  - High-contrast text compliance against all theme backgrounds.

---

## 7. Accessible Interaction Contract

Interaction semantics are **ARIA-first** and presentation is centralized. A component must not invent its own tooltip timer, copy, positioning, or floating-surface styling.

### Canonical semantics

1. **`aria-label` is the canonical action name.** Do not duplicate the same string in `tooltip`, `title`, `data-tooltip`, or component-specific hint props.
2. **Icon-only `Button` controls must have `aria-label`.** The shared button primitive automatically opts icon-sized labeled buttons into the standard visual hint.
3. **Text controls opt into the standard hint with `data-hint`.** `data-hint` is a behavior flag only; it never contains user-facing copy.
4. **`aria-description` contains optional explanatory copy.** The interaction hint mirrors it for sighted users while assistive technology keeps the semantic description. Never repeat the `aria-label` verbatim in `aria-description`.
5. **`aria-keyshortcuts` contains keyboard shortcuts.** Shortcut rendering is derived from that attribute; do not maintain separate visual shortcut strings when an ARIA shortcut is available.
6. **`data-hint-side` is presentation-only.** Supported values are `top`, `right`, `bottom`, and `left`.
7. **Popup state remains native ARIA.** Interactive triggers use `aria-haspopup`, `aria-expanded`, and `aria-controls` as appropriate.

```tsx
<Button aria-label="Navegar para frente" size="icon-sm">
  <CaretRightIcon />
</Button>

<Button
  aria-label="Explorar"
  aria-description="Abrir Explorar no painel lateral"
  aria-keyshortcuts="Control+Shift+J"
  data-hint
  data-hint-side="right"
>
  Explorar
</Button>
```

### One behavior owner

`InteractionProvider` is mounted once at the application root. `Button` transparently registers standard hints with one detached Base UI Tooltip handle, so callers keep a single component and `aria-label` remains the source of truth:

- pointer hover opens after **200 ms**;
- keyboard focus opens immediately;
- close delay is **0 ms**;
- moving between hints within **400 ms** opens the next hint immediately;
- floating offset is **6 px** with Base UI collision handling;
- Base UI owns Escape, focus, hover, touch suppression, and adjacent-tooltip delay grouping;
- an already-open popup (`aria-expanded="true"`) disables its hint trigger;
- hints are non-interactive and have no arrow by default.

These values intentionally mirror the archived Capacities tooltip behavior documented under `artifacts/reference-evidence/floating-interactions/`.

### Hint vs preview vs popup

The visual system shares tokens and positioning primitives, but semantics remain distinct:

- **Hint** — auxiliary explanation of a control. Copy comes from ARIA. Non-interactive. Global behavior is owned by `InteractionProvider`.
- **Preview (`HoverCard`)** — a sighted preview of the destination/object itself. Use Base UI Preview Card semantics. Default trigger dwell is **330 ms**, close tolerance is **180 ms**, and object previews use the shared preview surface.
- **Popover/Menu** — interactive content opened explicitly by click/focus/keyboard. Its state is expressed through popup ARIA and it does not inherit hover-hint timing.

### Floating surface rules

- `tooltipSurfaceClass` in `shared-styles.ts` is the single visual token for hints/tooltips.
- `floatingInteractionSurfaceClass` in `shared-styles.ts` is the shared preview/popover surface token.
- `Kbd` is the single keycap treatment; `KbdGroup` is a semantic `<span>` container, never a nested `<kbd>` element.
- Components must not add local `setTimeout` hover logic for hints.
- Components must not duplicate `aria-label` into a separate tooltip prop.
- Components must not recreate collision detection, z-index, border, shadow, or motion when a shared primitive already owns it.
