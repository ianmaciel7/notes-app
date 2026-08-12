# Design

This document is the canonical design reference for the workspace UI. The
implemented source of truth is `src/app/globals.css` together with the Tailwind
utilities in `src/components/workspace-shell.tsx`.

## Direction

Use editorial minimalism with utilitarian productivity UI. The workspace takes
layout cues from object-centered knowledge tools such as Capacities and Notion,
without copying their product data, branding, or proprietary assets.

- Put content first: navigation and context support the document rather than
  competing with it.
- Prefer dense, quiet controls over marketing composition, decorative cards,
  gradients, or illustration-led surfaces.
- Use near-white layered surfaces, fine neutral borders, restrained color, and
  compact spacing.
- Communicate object type and state with icon, label, and color together.
- Keep motion short and functional. Respect `prefers-reduced-motion`.

## Application Shell

The desktop shell has three working regions. The document toolbar uses a 46 px
top row, while the contextual tabs use a second 46 px row above the context
panel only:

| Region | Default width | Purpose |
| --- | ---: | --- |
| Sidebar | 288 px | Creation, search, pinned items, and object types |
| Editor | 55% of work area | Active object content and properties |
| Context | 45% of work area | Views, links, related objects, search, and chat |

The editor and context regions use white surfaces, a 1 px neutral border, and a
12 px radius. The workspace background remains slightly darker so panel
boundaries stay visible without shadows.

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
  background: "#f8f8f7"
  surface: "#ffffff"
  surface-muted: "#f1f1ef"
  border: "#e5e5e3"
  text: "#222221"
  text-muted: "#747472"
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

- Use Geist Sans with Inter and system sans-serif fallbacks.
- Body and navigation: 13-16 px.
- Document title: 30-38 px with compact line height.
- Section heading: 23-27 px.
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
- Do not copy reference application names, user content, icons, or assets.
