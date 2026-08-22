# Design System

This document is the canonical visual and interaction contract for the notes
app. It describes the shared language used by `src/components/ui/*` and the
product compositions in `src/components/*`.

## Principles

- Prefer calm, dense, object-centric surfaces over dashboard decoration.
- Use hierarchy, spacing, and state changes before adding color or ornament.
- Keep behavior composable: primitives own semantics; product components own
  composition and state.
- Preserve keyboard, screen-reader, pointer, and touch access for every action.
- Use English for code-facing names and documentation; user-facing copy follows
  the active locale.

## Visual language

The visual language is informed by the observable Capacities workspace model:
compact navigation, quiet neutral surfaces, thin borders, restrained shadows,
and actions that appear at the point of focus. The reference is used for
hierarchy, density, geometry, and interaction rhythm—not for branding, private
content, or proprietary assets.

### Surfaces and tokens

Use semantic tokens from `src/app/globals.css` instead of raw hex values:

| Token | Purpose |
| --- | --- |
| `background` / `surface-canvas` | App canvas and page background |
| `surface-panel` | Cards, panels, popovers, and dialog surfaces |
| `surface-panel-muted` | Secondary panel regions and quiet containers |
| `surface-hover` | Hover and discoverable action state |
| `surface-active` | Pressed, selected, or expanded state |
| `content-primary` | Main labels and headings |
| `content-secondary` | Supporting labels and controls |
| `content-tertiary` | Metadata, hints, and inactive affordances |
| `content-active` | Selected navigation and active tab emphasis |
| `border` / `border-subtle` | Structural and low-contrast separators |
| `ring` | Keyboard focus indicator |

Product-specific color maps are allowed only for object-type identity chips.
They must be static, named by semantic tone, and must not be generated from
user input.

### Typography, spacing, and geometry

- Use the configured Geist sans and mono families through the theme tokens.
- Use `text-xs` for metadata, `text-sm` for controls and rows, and `text-base`
  or larger only for section and dialog hierarchy.
- Use the existing Tailwind spacing scale; prefer `gap-1.5`, `px-2`, `h-8`,
  and `rounded-lg` for compact controls unless a component contract requires
  another value.
- Sidebar entity rows use a compact 29px desktop rhythm; utility controls use
  32px; application headers use 46px.
- Use borders for structure and `shadow-sm`/`shadow-md` for elevation. Avoid
  decorative shadows and arbitrary one-off radii.

## Component architecture

### Primitives (`src/components/ui`)

- Keep primitives thin wrappers around Base UI, shadcn, or the configured
  library component.
- Expose `data-slot` and forward native props.
- Use `cn` and shared variants rather than duplicated class strings.
- A component acting as a button must render a native `<button>` by default.
  Use `render` only with an element that preserves the intended semantics.
- Keep variants stable and additive. Do not silently change a public prop or
  callback contract while changing its styling.

### Product components (`src/components`)

- `AppShell` owns panel geometry, resizing, collapse, and mobile presentation.
- `AppSidebar` owns workspace navigation and overview composition; it must not
  create a second resize or sidebar provider.
- `AppHeader` owns the 46px application header and global actions.
- Header tab components own tab geometry, overflow, focus, drag, pin, and close
  affordances while callers own tab state and persistence.
- Dialogs, sheets, popovers, and menus must use the shared primitives so their
  dismissal, focus return, and keyboard behavior remain consistent.

## Interaction states

- Every interactive control needs visible hover, active, disabled, and
  `focus-visible` behavior appropriate to its role.
- Reveal secondary actions on hover only when the same actions remain reachable
  by keyboard focus and touch.
- Use short, purposeful transitions, generally 150–200ms, and never use motion
  as the only signal of state.
- Selected navigation uses surface and text contrast, not color alone.
- Long labels truncate without changing row geometry; provide accessible names
  and tooltips where truncation hides meaning.

## Responsive behavior

- Desktop layouts may use persistent sidebar and side panel regions.
- Mobile layouts use the existing sheet-based shell and larger touch targets.
- Preserve `min-w-0` on flexible regions and verify `scrollWidth ===
  clientWidth` at supported viewport sizes.
- Do not duplicate desktop state logic inside mobile wrappers.

## Accessibility checklist

- Use native controls whenever the interaction is a button, link, checkbox,
  input, select, or dialog trigger.
- Provide an accessible name for icon-only controls and a visible or screen
  reader label for every form field.
- Keep focus order logical and return focus after dismissing overlays.
- Do not attach mouse or click handlers to static elements without an
  appropriate semantic role and keyboard behavior.
- Do not use color, hover, or animation as the only way to communicate state.

## New component checklist

- [ ] Uses semantic theme tokens and the existing spacing/radius scale.
- [ ] Uses a shared primitive for interactive behavior.
- [ ] Exposes `data-slot` and preserves native props where applicable.
- [ ] Has keyboard, focus-visible, disabled, and responsive behavior.
- [ ] Has an accessible name and does not rely on color alone.
- [ ] Preserves existing public contracts or documents an intentional migration.
- [ ] Includes typecheck, lint, and visual verification evidence.
