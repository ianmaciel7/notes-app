## Context

The current branch starts from the default Next.js page. The initial product foundation branch contains useful Portuguese workspace navigation patterns, but the current implementation must be rebuilt incrementally under the minimalist foundation instead of importing its full shell.

## Goals / Non-Goals

**Goals:**

- Make the workspace destinations visible and scannable without decorative competition.
- Keep navigation labels in Portuguese and use familiar icons with accessible names.
- Preserve one clear active destination for the current route.
- Give desktop and mobile users equivalent access to the same destinations.
- Keep the region independently testable before the rest of the shell exists.

**Non-Goals:**

- Decide the final page header, content columns, object cards, or context panel.
- Add navigation-specific data fetching or user customization.
- Define a permanent visual identity beyond the shared design tokens.

## Decisions

### Navigation groups are explicit

The initial fixture contains an unlabelled primary group with `Hoje`, `Objetos`, and `Capturar`, followed by an `Estudo` group with `Revisar`, `Estudar`, and `Tipos`. This keeps the first navigation surface understandable while leaving future groups open.

### Identity stays compact

The sidebar header shows the workspace name and short workspace label. It must consume shared typography, surface, border, and focus roles from `docs/DESIGN.md`; it must not become a marketing hero or a large branded block.

### Active state is semantic

The current route receives `aria-current="page"` and a visible background/text treatment. The active state must remain understandable without color alone.

### Mobile uses the same navigation model

At narrow widths, the persistent desktop region becomes an explicitly labelled, keyboard-accessible panel opened by a menu control. The destination list and active-state rules remain the same rather than becoming a second navigation implementation.

### Navigation is a link contract

Destinations use real links and route paths. The sidebar does not own page content, data loading, or client-side state beyond the panel open state needed on mobile.

## Responsive Geometry

- Desktop: the sidebar remains visible as a fixed-width, non-growing column beside the future workspace content.
- Narrow viewports: the sidebar is hidden from the persistent layout and opened as a left-side panel with a stable maximum width.
- All labels must fit or truncate inside their navigation item without causing page-level horizontal overflow.
- The navigation list may scroll independently when its contents exceed the viewport.

## Accessibility And Evidence

- Use a landmark with the accessible name `Navegação principal`.
- Every icon-only control has an accessible label and a tooltip when the icon is not self-evident.
- Keyboard focus is visible, tab order follows visual order, and Escape closes the mobile panel.
- Automated tests cover active-route semantics, all destination links, mobile trigger naming, and keyboard-reachable controls.
- Browser review records desktop and mobile screenshots, active state, panel open/close behavior, and absence of horizontal overflow.

## Risks / Trade-offs

- **The fixture hardens labels too early** -> Keep navigation data local and typed so later product decisions can change labels without changing the shell contract.
- **The sidebar becomes visually dominant** -> Keep width, contrast, and spacing subordinate to active content as required by `docs/DESIGN.md`.
- **Mobile duplicates behavior** -> Render the same navigation model in the desktop region and mobile panel.

## Migration Plan

1. Add the sidebar change and focused navigation fixture.
2. Implement the smallest reusable sidebar component and route shell needed to render it.
3. Run focused tests and strict OpenSpec validation.
4. Review the live page at desktop and mobile sizes.
5. Wait for user confirmation before creating the workspace shell layout change.

Rollback is limited to removing the sidebar component and its route wrapper; no persisted data is affected.

## Open Questions

- Should the workspace identity use a product name other than `Ateliê` before the final shell is reviewed?
- Which future object types, if any, should become a separate sidebar section?
