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

Accessibility semantics and sighted floating interactions are **separate contracts**. ARIA describes controls to assistive technology; it never opts a control into a visual tooltip by itself. Tooltips, entity previews, and popups use distinct Base UI primitives and must follow the archived Capacities behavior documented under `artifacts/reference-evidence/floating-interactions/`.

### Accessibility semantics

1. **`aria-label` names a control for assistive technology.** It does not create a visual tooltip.
2. **Icon-only controls still require `aria-label`.** A labeled icon button may intentionally have no sighted tooltip.
3. **`aria-description` is optional assistive description.** It is not automatically mirrored into a visual tooltip.
4. **`aria-keyshortcuts` advertises actual keyboard shortcuts.** Visual keycap pills are supplied explicitly from the same command metadata rather than read back from the DOM.
5. **Popup state remains native ARIA.** Interactive triggers use `aria-haspopup`, `aria-expanded`, and `aria-controls` as appropriate.
6. **Do not use `title`, `data-hint`, or ARIA attributes as implicit tooltip opt-in mechanisms.**

### Explicit tooltips

Use the shared `Button` `tooltip` prop only where the equivalent Capacities interaction exposes a sighted hint. Tooltip copy/configuration is explicit, while ARIA metadata remains independently correct.

```tsx
<Button
  aria-label="Navegar para frente"
  tooltip={{ text: "Navegar para frente", side: "bottom" }}
  size="icon-sm"
>
  <CaretRightIcon />
</Button>

<Button
  aria-label="Explorar"
  aria-description="Abrir Explorar no painel lateral"
  aria-keyshortcuts="Control+Shift+J"
  tooltip={{
    text: "Explorar",
    description: "Abrir Explorar no painel lateral",
    shortcuts: ["Control+Shift+J"],
    side: "right",
  }}
>
  Explorar
</Button>
```

`InteractionProvider` is mounted once at the application root and owns one detached Base UI Tooltip handle. `Button` registers with it **only when `tooltip` is present**.

Capacities-parity defaults from the archived `Interactable59846.js` and `index59846.css`:

- pointer hover opens after **200 ms**;
- keyboard focus opens through the Base UI tooltip primitive;
- close delay is **0 ms**;
- moving between tooltips within the provider timeout opens the next hint without the normal dwell; this project keeps a **400 ms** provider timeout;
- floating offset is **6 px** with collision handling;
- default width is **`max-w-40`**;
- default arrow is **off**;
- tooltip popup is **non-interactive**;
- tooltip display is **disabled on mobile by default**; explicit `showOnMobile` may opt in when reference evidence requires it;
- an already-open popup (`aria-expanded="true"`) disables its tooltip trigger;
- visual motion is a restrained opacity fade of about **180 ms**, with no popover-style zoom or directional slide;
- the surface uses the shared compact translucent tooltip token: 50%-strength front background/border, `text-xs`, medium weight, restrained shadow, and approximately **8 px** backdrop blur.

Per-trigger `delay` and `closeDelay` overrides are allowed only when reference evidence requires different behavior.

### Tooltip vs preview vs popup

The visual family may share theme tokens, but semantics, timing, and primitives remain distinct:

- **Tooltip** — explicit auxiliary explanation of a control. Uses Base UI Tooltip through `Button.tooltip`. Non-interactive by default. Defaults: 200 ms open, 0 ms close, 6 px offset, `max-w-40`, desktop by default.
- **Entity preview (`HoverCard`)** — a sighted preview of the destination/object itself. Uses Base UI Preview Card. Defaults from `RootEntity59846.js`: **330 ms** open dwell, **180 ms** close tolerance, **top** placement, **4 px** main-axis offset, desktop only. Pointer entry into the preview keeps it open so the preview can be interacted with. The standard shell is compact (`w-72 p-1.5 text-xs`) and uses opacity-only motion (about 150 ms in / 100 ms out).
- **Popover/Menu** — interactive action/content surface opened explicitly by click/focus/keyboard. It does not inherit tooltip or entity-preview hover timing.
- **Dialog/Command Palette** — modal interaction surface with its own focus/overlay behavior. It must never be implemented as a HoverCard or hover tooltip.
- **Full object preview modal** — the editable object preview described by Capacities navigation documentation is separate from an entity hover preview and from the Tooltip primitive.

The official Capacities navigation documentation establishes preview-on-hover as an object/tab capability, while the archived application bundle supplies the exact hover-preview timing and floating geometry. The official shortcuts documentation defines shortcut semantics; the archived Tooltip implementation supplies their visual presentation inside explicit hints.

### Floating surface rules

- `tooltipSurfaceClass` is the single visual surface token for standard tooltips.
- `tooltipMotionClass` owns tooltip fade behavior; do not add zoom/slide locally.
- `floatingInteractionSurfaceClass` is the shared structural surface for preview/popover-style cards where appropriate.
- `previewSurfaceMotionClass` owns entity-preview fade behavior; previews must not inherit popover zoom/slide motion.
- `HoverCard` is reserved for destination/object preview content, never just because a tooltip has two lines or a shortcut.
- Components must not add local `setTimeout` hover logic when a shared Base UI primitive owns the timing.
- Components must not derive `tooltip` from `aria-label`, `aria-description`, or `aria-keyshortcuts` inside the shared `Button`.
- Components must not recreate collision detection, z-index, border, shadow, or motion when a shared primitive/token already owns it.
- `Kbd` is the single keycap treatment; `KbdGroup` remains a semantic `<span>` container rather than nested `<kbd>` markup.

### Reference sources

The normative interaction values above were confirmed against the user-provided archive bundle, especially:

- `https://app.capacities.io/Interactable59846.js` — explicit Tooltip configuration, timing, width, offset, mobile behavior, arrow/interaction defaults, and composed tooltip content.
- `https://app.capacities.io/RootEntity59846.js` — `EntityHoverPreview` dwell, close tolerance, desktop gating, pointer path, placement, and floating offset.
- `https://app.capacities.io/index59846.css` — `.base-tooltip` and `.preview-card-core` surfaces.
- `artifacts/reference-evidence/floating-interactions/README.md` — durable source/evidence mapping and captured screenshots.
