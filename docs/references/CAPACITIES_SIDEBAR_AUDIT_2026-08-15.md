# Capacities desktop sidebar audit — 2026-08-15

Status: authenticated browser observation of the Capacities light theme,
compared with the local `/tipos/paginas` implementation. This is a measured UI
reference, not an assertion about undocumented product internals.

## Structure and geometry

- Desktop sidebar width: 288 px.
- The sidebar is divided into workspace header, primary navigation, scrollable
  content, and a fixed footer.
- Primary rows are 276 x 32 px; object-type rows are 262 x 29 px; footer/help
  rows are 268 x 32 px. Interactive row radius is 8 px.
- Hover-only controls reserve their space and also appear on keyboard focus.
- The add-section row following the type list is 259 x 32 px.

## Visual states

- Primary-row hover uses the light `--bg-back` surface. Object rows use the
  workspace hover surface.
- The active row uses the hover surface with approximately `brightness(.965)`
  and keeps normal font weight.
- The New action uses the same muted foreground for its plus glyph and label.
- Verified object colors:

| Family | Background | Foreground | Types |
| --- | --- | --- | --- |
| Blue | `oklch(0.9513 0.0235 256.13)` | `oklch(0.5035 0.1579 264.41)` | Daily notes, audit entities, tweets, weblinks, tables, pages |
| Red | `oklch(0.9530 0.0218 17.35)` | `oklch(0.5060 0.1552 24.58)` | Images, files, audio, PDFs |
| Green | `oklch(0.9732 0.0311 157.36)` | `oklch(0.5327 0.1221 151.70)` | Queries |
| Orange | `oklch(0.9668 0.0264 74.74)` | `oklch(0.5570 0.1387 43.21)` | Tags |
| Purple | `oklch(0.9630 0.0229 308.05)` | `oklch(0.5082 0.1955 304.61)` | AI chats |

The local Capacities-compatible icon component contains the verified Phosphor
SVG glyphs. Keep the icon family and semantic color assignment stable unless a
new authenticated observation supersedes them.

## Object-type row behavior

Hovering or focusing an object-type row reveals its count and a 22 x 22 px
overflow button. The type menu is 270 x 265 px, has a 12 px radius, 6 px
padding, a border, a subtle layered shadow, and opens 4 px to the right of the
trigger. It provides:

- Open submenu: Open as page; Open in new tab, with Ctrl-click hint.
- Create the singular form of the selected type.
- New Query.
- New Collection.
- Pin or unpin in the sidebar.
- Object-type settings.
- Import, with Ctrl+I hint.

Local actions must be functional: links navigate, Import opens a file chooser,
and pinning changes the Pinned section rather than only changing menu text.

## Pinned section behavior

On hover or focus the 257 x 32 px header reveals a 22 x 22 px overflow button
and a 22 x 22 px add button. The header includes pin glyph, label, disclosure
chevron, and count. Its overflow menu supports manual and alphabetical sorting.
The add button opens an existing-object selector. Pinning updates the count and
removes the empty message; unpinning reverses that state.

## Custom sections

The Add section row opens a form with Icon, Name, and Create controls. The local
dialog may additionally expose Cancel and Close when they preserve the same
workflow and accessibility behavior. A successful submission creates a visible
custom sidebar section.

## Acceptance evidence

The local implementation was checked in the browser against the authenticated
reference for header controls, the muted New action, exact add-section geometry,
overflow menus, pinned actions, and custom-section creation. At the end of the
implementation pass, 47 tests, TypeScript checking, a production Next.js build,
and an HTTP 200 response from `/tipos/paginas` passed.

For future changes, re-check the reference because vendor UI can drift. Verify
default, hover, focus, active, menu-open, and click-result states; automated
tests alone are not sufficient evidence of visual parity.
