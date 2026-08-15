# Design

This document is the canonical visual foundation for the notes app. OpenSpec
owns observable requirements and acceptance scenarios; this document owns the
shared visual language used by future UI changes.

## Product Posture

The product is a Portuguese-first studio for connected objects. It should feel
quiet, focused, and useful during repeated daily work. It is not a marketing
site, a folder browser, a KPI dashboard, or a narrow study application.

Minimalism here means removing competition around the user's content. It does
not mean removing context, relationships, state, or necessary controls.

## Principles

1. **Content first.** Navigation and context support the active object instead
   of competing with it.
2. **Quiet density.** Prefer compact, scannable controls and stable alignment
   over oversized type, decorative whitespace, or card-heavy composition.
3. **Progressive disclosure.** Keep frequent actions visible; reveal secondary
   actions through menus, contextual controls, or focused panels.
4. **Semantic hierarchy.** Use type, spacing, weight, borders, and position
   before adding color or elevation.
5. **Object identity.** Types, properties, relations, backlinks, and status
   remain understandable without turning the interface into a dashboard.
6. **Functional motion.** Motion explains state or spatial change and never
   decorates an idle surface.
7. **Stable geometry.** Loading, hover, selection, and dynamic labels must not
   resize fixed controls or shift neighboring regions.

## Visual Language

### Color

Neutral surfaces carry most of the interface. Blue is the primary action and
focus color; green, amber, red, and violet are reserved for distinct semantic
roles. State must never depend on color alone.

| Token role | Light baseline | Dark baseline | Use |
| --- | --- | --- | --- |
| Background | `oklch(0.985 0.002 260)` | `oklch(0.18 0.004 260)` | App canvas |
| Surface | `oklch(1 0 0)` | `oklch(0.23 0.005 260)` | Active work regions and overlays |
| Muted surface | `oklch(0.965 0.003 260)` | `oklch(0.28 0.006 260)` | Hover and secondary regions |
| Border | `oklch(0.90 0.004 260)` | `oklch(0.36 0.007 260)` | Dividers and control outlines |
| Foreground | `oklch(0.21 0.006 260)` | `oklch(0.94 0.003 260)` | Primary text |
| Muted foreground | `oklch(0.48 0.008 260)` | `oklch(0.72 0.007 260)` | Secondary text |
| Primary | `oklch(0.54 0.14 250)` | `oklch(0.72 0.11 250)` | Primary action, focus, selection |
| Success | `oklch(0.56 0.12 155)` | `oklch(0.72 0.11 155)` | Confirmed success |
| Warning | `oklch(0.67 0.14 75)` | `oklch(0.78 0.12 75)` | Attention and recoverable risk |
| Danger | `oklch(0.58 0.19 25)` | `oklch(0.72 0.16 25)` | Destructive actions and errors |
| Relation | `oklch(0.58 0.13 305)` | `oklch(0.73 0.11 305)` | Relationship and graph cues |

Future implementation must expose these roles through semantic CSS variables.
Feature components consume roles rather than duplicating literal colors.

### Typography

- Use Geist Sans with system sans-serif fallbacks on `body`, overlays, and
  portals. Use Geist Mono only for code or identifiers.
- Body and editor copy begin at 16 px with a 1.5 line height.
- Workspace navigation and controls use 12-14 px text.
- Compact panel headings use 14-18 px; reserve 24-32 px for the active object
  title or genuine page-level heading.
- Letter spacing is `0`. Font size does not scale directly with viewport width.
- Long labels truncate only when the full value remains available through the
  surrounding interaction or accessible name.

### Spacing And Shape

- Use a 4 px spacing base and compose common gaps at 4, 8, 12, 16, 24, and
  32 px.
- Icon controls use stable square dimensions; text controls have stable minimum
  heights.
- Controls use 6-8 px radii. Repeated cards and framed tools use at most 8 px
  unless a proven component contract requires otherwise.
- Page sections remain unframed. Do not place cards inside cards.
- Use a border before a shadow. Shadows are limited to overlays and surfaces
  that must visibly float above another region.

## Composition

The workspace will be designed in independently reviewable regions. Exact
dimensions and breakpoint behavior belong to the OpenSpec change for that
region and are not pre-approved by this foundation.

1. Sidebar.
2. Workspace shell and primary layout regions.
3. Top rail and navigation controls.
4. Object list and collection surfaces.
5. Object editor and property surfaces.
6. Context, backlinks, and graph surfaces.
7. Capture, review, study, Objective, and commitment workflow surfaces.
8. Responsive behavior, interaction states, and accessibility polish.

Only one region advances at a time. Each region is reviewed in its default,
interactive, empty, loading, and error states that are reachable in scope.

## Components

- Prefer existing shadcn primitives and Tailwind utilities/tokens.
- Use Lucide icons when an established symbol exists. Icon-only controls need
  an accessible name and a tooltip when the meaning is not self-evident.
- Use familiar icon controls for actions such as close, back, search, settings,
  zoom, save, and overflow.
- Use segmented controls for modes, tabs for views, checkboxes or switches for
  binary settings, and menus for option sets.
- Semantic HTML owns structure: `header`, `nav`, `main`, `article`, `section`,
  and `aside` wrap interactive primitives.
- Client Components are introduced only for interaction, browser APIs, local UI
  state, or effects.

## Interaction And Motion

- Every pointer interaction has an equivalent keyboard path.
- Hover-only actions become visible on `focus-within` and reserve their layout
  space before appearing.
- Focus indicators meet WCAG 2.2 AA and remain visible against every surface.
- Use 120-220 ms transitions for local feedback and up to 300 ms for spatial
  panel changes.
- Respect `prefers-reduced-motion` and preserve the final state without
  nonessential movement.
- Destructive actions require clear language and an appropriate confirmation or
  undo path.

## Responsive Behavior

- Fixed-format controls, toolbars, and panels use explicit responsive
  constraints so content cannot resize the shell unexpectedly.
- Mobile navigation uses an accessible overlay rather than reusing desktop
  absolute positioning.
- The active content remains the last region removed as width decreases.
- No supported viewport may have incoherent overlap or page-level horizontal
  overflow.
- Breakpoints and region visibility are measured and accepted in the change
  that owns that region.

## Do Not

- Do not create a landing page in place of the working application.
- Do not use gradient backgrounds, decorative blobs, oversized hero type, or
  illustration-led empty space in the workspace.
- Do not build the interface from nested cards, pills, or one dominant hue.
- Do not use inline styles for repeatable design values or `!important` to
  force component states.
- Do not claim visual completion from code or tests alone.

## Acceptance Gate

Every UI change must pass its own checkpoint before the next region begins:

1. Strict OpenSpec validation.
2. Focused automated checks for the changed behavior.
3. Desktop, tablet, and mobile browser screenshots.
4. Keyboard, focus, overflow, and reachable state review.
5. User confirmation of the region before the next change is created.
