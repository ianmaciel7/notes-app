# Design

This document is the canonical accepted design guidance for the workspace UI.
OpenSpec owns behavioral requirements and acceptance criteria; runtime tokens
and component styles live in `src/app/globals.css` and
`src/components/workspace-shell.tsx`.

## Direction

Use editorial minimalism with utilitarian productivity UI. For the active
Capacities parity change, the authenticated reference route is authoritative
for observable geometry, wording, state, motion, and interaction behavior.
Proprietary application assets and private user data remain excluded unless
the user explicitly supplies them as part of the fixture.

- Put content first: navigation and context support the document rather than
  competing with it.
- Prefer dense, quiet controls over marketing composition, decorative cards,
  gradients, or illustration-led surfaces.
- Use near-white layered surfaces, fine neutral borders, restrained color, and
  compact spacing.
- Communicate object type and state with icon, label, and color together.
- Keep motion short and functional. Respect `prefers-reduced-motion`.

## Application Shell

The inspected desktop shell has three working regions under one 46 px top rail:

| Region | Default width | Purpose |
| --- | ---: | --- |
| Sidebar | 288 px | Creation, search, pinned items, and object types |
| Editor allocation | 792 px at 1536 px | 772 px framed active object after gutters |
| Context allocation | Remaining 456 px | 446 px framed graph/context after gutters |

The editor and context regions start at y=46, use white surfaces, a 0.8 px
neutral border, and a 12 px radius. The editor uses the measured subtle layered
shadow; the graph panel does not add a heavy elevation treatment.

At widths below 1250 px, hide the context panel and preserve the editor. At
widths below 760 px, hide the desktop sidebar and expose it through a left-side
`Sheet`; the editor retains an 8 px viewport gutter.

## Components

Interactive controls must use the native project components under
`src/components/ui/`. Do not recreate buttons, tabs, tooltips, dialogs, sheets,
scroll areas, menus, or similar primitives with raw HTML when a shadcn component
already exists.

Current shell primitives:

- `Button` for icon controls, navigation rows, document actions, tiles, and
  related-object actions.
- `Tooltip` for icon-only controls.
- `Tabs` for contextual modes and their associated panels.
- `ScrollArea` for desktop and mobile navigation.
- `Sheet` for mobile navigation and focus management.
- Lucide icons through `lucide-react`; do not draw replacement SVG icons.

Semantic HTML still owns page structure: use `header`, `nav`, `main`, `article`,
`section`, and `aside` around the shadcn controls.

## Tokens

Workspace tokens live in `src/app/globals.css` and use the `--workspace-*`
prefix. Component CSS consumes aliases rather than duplicating literal palettes.

```yaml
light:
  background: "oklch(0.9856 0.0016 67)"
  surface: "oklch(1 0.0001 263.28)"
  surface-muted: "oklch(0.9676 0.0016 67.02)"
  border: "oklch(0.9163 0.0017 67.07)"
  border-strong: "oklch(0.8643 0.0017 67.13)"
  text: "oklch(0.2191 0.0058 285.84)"
  text-muted: "oklch(0.3887 0.0052 301.05)"
  text-subtle: "oklch(0.5725 0.0051 33.89)"
  hover: "oklch(0.9676 0.0016 67.02)"
  accent: "#3f6fae"
  accent-muted: "#e8f1ff"
dark:
  background: "#1f1f1e"
  surface: "#282827"
  surface-muted: "#323230"
  border: "#444442"
  text: "#f0f0ed"
  text-muted: "#b9b9b4"
  accent: "#8db6e8"
```

Use blue, red, and violet only as small semantic object-type cues. Status colors
are reserved for danger, warning, and success feedback.

## Typography And Shape

- Use Inter with system sans-serif fallbacks.
- Editor body: 16 px/24 px; compact navigation remains 12-14 px.
- Document title: 30 px/33 px at the inspected desktop viewport.
- Section heading: 24 px/32 px with -0.24 px letter spacing where measured.
- Controls: 29-32 px high with 6-8 px radius.
- Framed panels: maximum 12 px radius.
- Letter spacing remains `0`; do not scale type directly with viewport width.

## Accessibility

- Follow WCAG 2.2 AA and the repository accessibility standards.
- Every icon-only button requires an accessible name and tooltip.
- Use the native state and keyboard behavior supplied by shadcn/Base UI.
- Selected navigation destinations expose `aria-current`; tabs use their native
  tablist, tab, and tabpanel relationships.
- Do not encode state by color alone.
- Maintain visible focus and close mobile overlays with their native dialog
  controls, Escape, and backdrop behavior.

## Do Not

- Do not use raw `<button>` elements in the shell when `Button` is available.
- Do not add nested decorative cards, pill-heavy navigation, large hero type,
  gradients, or floating color shapes.
- Do not fill the UI with one dominant hue; neutral surfaces should carry most
  of the interface.
- Do not import proprietary assets or private user data that were not supplied
  for the parity fixture.
