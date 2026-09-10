---
name: "KnowledgeOS"
colors:
  background: "oklch(0.9856 0.0016 67)"
  foreground: "oklch(0.2191 0.0058 285.84)"
  surface: "oklch(0.9856 0.0016 67)"
  card: "oklch(1 0.0001 263.28)"
  border: "oklch(0.9163 0.0017 67.07)"
  primary: "oklch(0.3887 0.0052 301.05)"
  primary-foreground: "oklch(0.9676 0.0016 67.02)"
  secondary: "oklch(0.9676 0.0016 67.02)"
  secondary-foreground: "oklch(0.2191 0.0058 285.84)"
  muted: "oklch(0.9676 0.0016 67.02)"
  muted-foreground: "oklch(0.5725 0.0051 33.89)"
  destructive: "#EF4444"
  destructive-menu-action: "#EF4444"
  sidebar: "oklch(0.9856 0.0016 67)"
  sidebar-border: "oklch(0.9163 0.0017 67.07)"
  ring: "oklch(0.7161 0.006 30.59)"
---

# Design System: KnowledgeOS

## 1. Visual Theme & Atmosphere

KnowledgeOS embodies a **monastic, distraction-free knowledge sanctuary** paired with **high-density spatial rigor**. Inspired by the precision of physical studio desks and the clean architecture of Capacities and Readwise Reader, the interface balances generous, readable typography with compact, functional tooling.

The atmosphere is **clinical, calm, and tactile**:
- **Light Theme**: Crisp off-white surfaces (`#FAFAFA` and `#FFFFFF`) framed by hairline whisper-thin borders (`#E4E4E7`), giving every pane physical containment without visual clutter.
- **Dark Theme**: Deep zinc foundations (`#18181B` to `#27272A`) with subdued contrast text and 10% translucent borders, eliminating eye fatigue during prolonged reading and study sessions.
- **Elevation Philosophy**: Minimalist flat layering. Rather than heavy artificial drop shadows, hierarchy is communicated through subtle border boundaries (`1px`), clean background surface stepping, and precise spatial zoning.

---

## 1.1 Capacities Runtime Extraction & Parity Target

Reference capture: `https://app.capacities.io/eb0a4d1e-0567-4348-8ecf-587c417725f4/a961988a-5562-45bf-86d4-2b2375b17544`, captured on 2026-09-08 in a logged-in Portuguese workspace. Evidence is stored in `docs/reference/capacities-app-reference/`.

This extraction is the current visual parity target for shell, sidebar, object page, right inspector, menus, and hover behavior. Treat page content from the Capacities workspace as visual evidence only; do not treat labels, objects, or document body text as product requirements.

### Measured runtime tokens

- **Font stack**: Capacities uses `Inter, ui-sans-serif, system-ui` at runtime. KnowledgeOS may keep Geist for product identity, but spacing, weight, and density must match the measured Capacities scale.
- **Global app canvas**: `oklch(0.9856 0.0016 67)` with primary text around `oklch(0.2191 0.0058 285.84)` and secondary text around `oklch(0.3887 0.0052 301.05)`.
- **Main object window**: white `oklch(1 0.0001 263.28)`, `12px` radius, subtle border around `oklch(0.9163 0.0017 67.07)`, and a very light layered shadow: roughly `0 2px 3px rgb(0 0 0 / 0.004)`, `0 4px 9px rgb(0 0 0 / 0.01)`, `0 8px 12px rgb(0 0 0 / 0.004)`.
- **Left navigation rows**: `32px` height, `8px` radius, `14px` text, transparent idle background, muted text idle, subtle front-hover background only on hover/active.
- **Section headers**: `24px` height, `12px` label text, muted count, icon always present, collapse chevron/action controls revealed by hover.
- **Document title**: approximately `30px`, `700`, `33px` line height in the captured page.
- **Property rows**: compact `26px` to `29px` height, `14px` text, dense horizontal alignment.
- **Right inspector grid**: three columns, `8px` gaps, compact card-like buttons with icon/label centered inside the 320px inspector.

### Sidebar parity rules

- Capacities-parity workspace UI defaults to Brazilian Portuguese (`pt-BR`) when no `NEXT_LOCALE` cookie is present. A saved supported locale still takes precedence.
- Every navigation/object row must have a persistent leading icon. Do not ship text-only rows in the sidebar or menus.
- Counts, overflow buttons, plus buttons, drag handles, and collapse affordances are hover-reveal controls. They stay hidden at rest and remain visible only while the row/section is hovered or its popup is open.
- Keyboard accessibility must still be preserved with semantic labels and focus management, but `focus-within` alone must not make the visual sidebar controls permanently appear.
- Object-type rows keep the object icon visible at all times; only secondary actions are hidden.
- Empty states use low-contrast italic caption copy, not a bordered card or loud callout.

### Menu parity rules

- Menus are compact click/focus popups, not tooltips and not preview cards.
- Every actionable menu row has a left icon. Selection indicators, chevrons, or shortcuts live on the far right.
- Default menu row height is `32px`; radius is `8px`; padding is compact.
- Menu and popover inputs must set foreground, placeholder, and selection colors explicitly. Typed text uses primary foreground, placeholders use `--app-text-subtle` at full opacity, and selected text uses the standard primary selection pair so nested muted containers cannot wash out the input color.
- The New menu create-from-query fallback preserves the typed value as the exact object title. A fallback row such as `Criar 'zzzzzzzzzz'` may display a type badge (`Page`) to explain what will be created, but the resulting object tab and object title must be exactly `zzzzzzzzzz`, not `Untitled zzzzzzzzzz`.
- Sidebar object-type/collection, pinned-object, and section action menus mirror the Capacities popup root captured via `document.querySelector("#popup-container > div")`: use the shared `sidebarContextMenu*` helpers from `src/components/ui/compact-menu.tsx`, with `preview-card-core`, `border border-[var(--app-border-front)]` for the captured `0.8px` computed outer stroke, `bg-front`, `text-subtle`, `text-left text-xs font-sans font-normal`, `shadow-[var(--app-shadow-sidebar-popover)]` where the token equals `0 3px 5px #00000003, 0 5px 10px #00000005, 0 10px 14px #00000003`, a visible popup width of `269px` implemented as `box-content w-[255px]` plus `p-1.5` and the outer border, a `12px` surface radius, `h-base`/`32px` menu rows with `text-sm leading-5` (`14px` / `20px` computed), `pl-1 pr-1` row padding, ghost icon frames with a `12px` inner icon, `bg-el` for hover/highlight/open submenu state, and `0.5px` `border-[var(--app-border-front)]` separators between action groups. Do not use Tailwind `border-front` here: it resolves to the front background token in this app. Destructive object actions such as `Excluir Objeto` use the shared destructive menu action color for both the trash icon and row label while keeping the hover/selected surface neutral.
- Sidebar object context menu rows that show a chevron in Capacities must be real submenus, not a plain item with a decorative chevron. `Open` opens a compact submenu containing `Open in view` with the right shortcut label `Alt ⇧ Click`; `Copy` opens a compact submenu with `Copy as Markdown` and `Copy object reference`. Submenu surfaces use the same `preview-card-core`/`bg-front` shell with `w-auto min-w-[220px]`, `p-1.5`, and the same warm `bg-el` hover/open state.
- Context-menu behavior must never be a silent no-op. `Open` and `Unpin` preserve their local workspace behavior. `Copy as Markdown` writes a Markdown heading, while `Copy object reference` writes `[[name]]`. Until their complete product flows exist, `Change type`, `Object type settings`, `Share`, `Present`, `Export`, `Import`, pinned-item `Duplicate`, and pinned-item `Delete` open a named main-panel `PendingImplementation` surface.
- Sidebar collection/object context menus must keep the captured Capacities click option order: Open, Unpin from space/sidebar, Change type, Object type settings, Share, Present, Export, Import, Copy, Duplicate, and Delete object. Do not add local-only collection creation or template actions to that menu; creation belongs in the object-type row controls.
- Command/search palette shell uses the captured Capacities geometry: `672px` desktop width (`sm:max-w-2xl`), `12px` card radius, `~585px` captured height at 1280px viewport, `43px` header row, `32px` input/control height (`--el-h-base`), and `16px` header input text.
- Desktop space switcher popups mirror the Capacities workspace picker: side-positioned beside the workspace name, `278px` fixed width, `12px` radius, `--app-bg-base` surface, `--app-border-front` hairline border, `--app-shadow-sidebar-popover`, a `32px` search field with `6px` outer inset, compact `32px` rows, and a centered `52px` empty state. Do not show a create-space footer in the desktop picker; the captured reference shows only search plus matching spaces or the empty message.
- Command/search palette menu badges follow the captured Capacities geometry: left badge uses `p-1`, `0.5px` border, `12px` inner icon (`h-3 w-3`), and `mt-1` alignment inside `items-start` rows. Far-right cursor/action affordances use the explicit element tokens `h-(--el-h-sm) w-(--el-w-sm)` (`28px` by `28px`) with a `1em` icon, not Tailwind `h-sm w-sm` container utilities and not `24px` square buttons.
- Add Object Type modal tones mirror the current Capacities screenshot exactly: colored types are `Livro=purple`, `Área=indigo`, `Definição/Viagem=violet`, `Ideia=yellow`, `Projeto=green`, `Mídia=teal`, `Nota atômica=amber`, `Página/Weblink/Tweet/Tabela=blue`, `Chat de IA=purple`, and `Query=green`; neutral gray types are `Pessoa`, `Reunião`, `Citação`, `Lugar`, `Organização`, `Etiqueta`, `Imagem`, `PDF`, `Áudio`, `Arquivo`, and `Tarefa`; `Crie o seu próprio` is also gray.
- Add Object Type modal cards use the captured Capacities card contract: `rounded-base border border-base bg-base px-2 py-2.5 text-lg font-medium text-secondary`, icon badge `32px` square with `rounded-base border-[0.5px] text-lg`, and label `text-sm font-semibold`. `Reunião` uses the three-person icon; `Nota atômica` uses the Capacities stacked-card icon; `Crie o seu próprio` uses the gray type-label badge with the bold plus shape.
- Add Object Type modal card surfaces must remain light Capacities surfaces even when global app/theme aliases drift: card background `oklch(1 0.0001 263.28)`, border `oklch(0.9163 0.0017 67.07)`, hover `oklch(0.9856 0.0016 67)`, and label text `oklch(0.3887 0.0052 301.05)`. Use inline `type-label-*` variables on modal badges so dark variants do not invert the pasted Capacities reference colors.
- Add Object Type modal must resolve badge tone from the shared Capacities `id -> tone` map, not only from persisted object type records, so the reference color map stays stable even if older workspace data has different tones.
- Add Object Type modal details panel follows Capacities dismiss behavior: selecting a card opens the right-hand details overlay; clicking non-interactive backing content outside that details panel closes it; clicking another object-type card first dismisses the open details panel rather than immediately switching selection through the overlay. The details panel itself remains interactive and stays open for its footer/create action.
- Object type colors across sidebar, command palette, and modal must use the shared Capacities resolver exported by `src/components/object-icons.tsx`. Do not introduce a second per-component color map.
- Object type sidebar context menus follow the Capacities object-type menu shape. The three-dot menu must expose `Open`, `Create {type}`, `New from Template`, `New Query`, `New Collection`, `Pin to Sidebar`, and type settings, using the same compact sidebar menu rows and separators as object/collection menus. Actions without completed local behavior should route to a named `PendingImplementation` surface instead of disappearing.
- Side-panel special entries follow the Capacities tab model: when the default `Explore` tab is the only side tab, choosing an available special item replaces that single `Explore` tab with the chosen item. When two or more side tabs are already open, choosing an item preserves the existing tabs and selects or appends the chosen item like the main workspace tabs. Availability is context-sensitive: object-type list views show only `AI chat` and `Search`; specific object pages show Graph view, Backlinks, Objects inside, Related content, AI chat, and Search; collection views show Graph view, AI chat, and Search.
- Closing the final side-panel tab resets the side-panel tab state to `Explore` before hiding the panel. Reopening the panel should show `Explore`, not the last special item that had been persisted in local browser state.
- Main workspace tabs distinguish object pages from object-type list views. Tabs must carry explicit type metadata (`object`, `object-list`, `collection`, or `action`) instead of deriving visual behavior from the label alone. Specific object tabs use the individual object title (`rebase`), normal inactive label weight, transparent inactive background, and the object's colored badge. Object-type list tabs use the plural type label (`Páginas`), keep the active front-surface tab treatment, show the colored object-type badge, and use a stronger active label, even when that list is the only open main tab. Collections follow their own tab kind so they can inherit collection-specific right-panel behavior without being mistaken for a single object.
- Main workspace tab membership is persisted separately from the active URL. Store only stable tab ids and the active tab id in local workspace browser state, then rebuild labels/icons from real workspace data after the space is ready. On refresh, saved tab membership wins over a stale route segment so a tab the user closed does not reappear after F5.
- Workspace navigation must be reflected in the browser URL without a full page reload. The active main tab is mirrored into a Capacities-like path, `/<spaceGuid>/<objectGuid>`, using clean GUID-like route segments instead of internal ids such as `personal` or `entity-*`. The active side tab is not encoded in the URL; it is stored in local workspace browser state so the address stays Capacities-like while the right panel restores its last selected item.
- Deep workspace URLs must hydrate from a stable default shell first, then restore the active route after mount. Do not read `window.location` or `localStorage` while constructing initial React state for SSR-rendered workspace tabs. While route/tab state is still restoring, the workspace header must show neutral tab space instead of rendering the fallback `Pages` tab, so refresh never flashes a tab that the user may have closed.
- Default popup width should fit content. Avoid oversized `w-56` menus unless the content genuinely requires it.
- Popup surface uses a hairline border, white popover background, and a restrained shadow around `0 2px 8px rgb(0 0 0 / 0.08)`.
- Motion is fade-only around `150ms`. Do not add zoom, slide, bounce, or theatrical easing to menus.

### Comparison against existing DESIGN.md

- Already aligned: light neutral palette, 3-pane Capacities architecture, hairline borders, compact desktop rows, Base UI primitives, explicit tooltip contract, and no heavy AI-style gradients/glows.
- Needs strict enforcement: persistent icons in all menu rows, hover-only secondary sidebar actions, compact `8px` menu surfaces, content-fit menu widths, and fade-only popover motion.
- Product identity exception: Geist remains allowed as the app font, but component density must follow the extracted Capacities geometry unless a project-specific accessibility requirement overrides it.

---

## 2. Color Palette & Roles

All colors are defined via modern OKLCH tokens in `src/app/globals.css` and exposed through Tailwind CSS v4 variables. Capacities parity components must use the `front`, `base`, `el`, `primary`, `secondary`, and `subtle` semantic tokens instead of generic shadcn color aliases when matching captured Capacities UI.

### Primary Foundation & Surfaces
- **Canvas (`--background`)**: `oklch(0.9856 0.0016 67)` (Light) | `oklch(0.1605 0.0063 285.63)` (Dark)
  - Primary application viewport surface.
- **Front Surface (`--bg-front`, `--app-bg-front`, `--color-front`)**: `oklch(1 0.0001 263.28)` (Light) | `oklch(0.2191 0.0058 285.84)` (Dark)
  - Modals, popovers, property sheets, and floating toolbars.
- **Element Surface (`--bg-el`, `--app-bg-el`, `--color-el`)**: `oklch(0.9676 0.0016 67.02)` (Light) | `oklch(0.2987 0.0072 285.88)` (Dark)
  - Selected command rows, keycap pills, compact icon button fills, and secondary controls.
- **Sidebar Rail (`--sidebar`)**: `oklch(0.9856 0.0016 67)` (Light) | `oklch(0.1605 0.0063 285.63)` (Dark)
  - Navigation drawer, daily note calendar rail, and object directory.
- **Hairline Border (`--border-base`, `--border-front`, `--app-border-base`, `--app-border-front`)**: `oklch(0.9163 0.0017 67.07)` (Light) | `oklch(0.2987 0.0072 285.88)` (Dark)
  - Command palette header divider, preview-card shell borders, footer separators, pane dividers, and neutral menu outlines. Do not substitute `--border-base-strong` or `--border-el` for Capacities `border-base` / `border-front`; those are visibly darker.

### Interactive & Accents
- **Primary Ink (`--text-primary`, `--app-text-primary`, `--color-text-primary`)**: `oklch(0.2191 0.0058 285.84)` (Light) | `oklch(1 0.0001 263.28)` (Dark)
  - Primary call-to-action buttons, active navigation pills, and focused tab indicators.
- **Secondary Ink (`--text-secondary`, `--app-text-secondary`, `--color-text-secondary`)**: `oklch(0.3887 0.0052 301.05)` (Light) | `oklch(0.9163 0.0017 67.07)` (Dark)
  - Section headings, footer shortcut text, inactive high-density controls, and supporting menu labels.
- **Subtle Ink (`--text-subtle`, `--app-text-subtle`, `--color-text-subtle`)**: `oklch(0.5725 0.0051 33.89)` (Light) | `oklch(0.7161 0.006 30.59)` (Dark)
  - Placeholder text, secondary group labels, disabled-looking metadata, and quiet counts.
- **Subtle Surface (`--secondary`, `--muted`, `--accent`)**: `oklch(0.9676 0.0016 67.02)` (Light) | `oklch(0.2987 0.0072 285.88)` (Dark)
  - Hover states, tag chips, secondary button backgrounds, and code snippets.
- **Focus Ring (`--ring`)**: `oklch(0.7161 0.006 30.59)` (Light) | `oklch(0.8643 0.0017 67.13)` (Dark)
  - 3px semi-transparent ring outline for accessible keyboard navigation (`focus-visible`).

### Typography & Hierarchy
- **Primary Ink (`--foreground`)**: `oklch(0.145 0 0)` / `#18181B` (Light) | `oklch(0.985 0 0)` / `#FAFAFA` (Dark)
  - Page titles, headings, and high-priority body content.
- **Muted Steel (`--muted-foreground`)**: `oklch(0.556 0.0051 33.89)` / `#71717A` (Light) | `oklch(0.708 0.006 30.59)` / `#A1A1AA` (Dark)
  - Metadata, timestamps, backlinks count, property keys, and placeholder labels.

### Functional States & Highlighting
- **Destructive Alert (`--destructive`)**: `oklch(0.577 0.245 27.325)` / `#EF4444`
  - Deletion warnings, failed sync status, and overdue study alerts.
- **Destructive Menu Action (`--destructive-menu-action`)**: `#EF4444`
  - In compact Capacities-style menus, destructive actions such as `Excluir Objeto` render the trash icon and row label in the destructive color while keeping hover/selected surfaces neutral.
- **Highlight API Tones**:
  - Yellow anchor highlight: `oklch(0.92 0.15 95 / 35%)`
  - Emerald highlight: `oklch(0.88 0.14 150 / 35%)`
  - Sky blue highlight: `oklch(0.88 0.12 230 / 35%)`
  - Rose highlight: `oklch(0.88 0.14 15 / 35%)`

---

## 3. Typography Rules

KnowledgeOS uses **Inter** for Capacities parity UI and local fallback system fonts:

- **Sans-Serif (`--font-sans`)**: `Inter, ui-sans-serif, system-ui`. This matches the captured Capacities runtime and preserves density at 11px-15px UI sizes.
- **Monospace (`--font-mono`)**: `ui-monospace, SFMono-Regular, Consolas, monospace`. Used exclusively for code blocks, exact text anchor offsets, SRS stability/difficulty metrics, and burndown calculations.

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
   - Flashcard review surface uses a compact work panel with due/total counters, front/back reveal, and four rating buttons (`Again`, `Hard`, `Good`, `Easy`). It displays empty/loading states from live workspace data instead of mocks.
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
