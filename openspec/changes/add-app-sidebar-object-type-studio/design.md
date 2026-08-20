## Context

The branch already has a reusable `AppShell`, a controlled `AppSidebar`, primary sidebar actions, and shadcn primitives backed by Base UI. The object-type studio should therefore be implemented as a focused sidebar feature composed from the existing `Dialog`, `ScrollArea`, `Item`, and `Button` primitives instead of adding a new modal system or document-level event handlers.

The Capacities reference separates the modal shell from the scroll container: the header remains fixed while the body fills the remaining height and scrolls independently. Its object cards use compact 32px icon containers and a responsive `2 → 3 → 4 → 5` column grid. A bounded viewport-relative dialog height is required so the scroll viewport has a real flex constraint.

## Goals / Non-Goals

**Goals:**
- Add a reusable object-type studio component to the app sidebar demo.
- Use the existing Base UI-backed `Dialog` as the modal shell and preserve its native outside-click and Escape dismissal behavior.
- Give the dialog a viewport-bounded height and width with a `max-w-6xl` desktop cap.
- Keep the title/header outside the scrolling region.
- Make only the body scroll, using the existing `ScrollArea` primitive with `min-h-0 flex-1` flex behavior.
- Render suggested and basic object-type collections with `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`.
- Use compact cards with 32px icon containers and existing `Item` primitives.
- Expose a typed selection callback so actual object-type creation can be wired later.

**Non-Goals:**
- No persistence or backend object-type creation.
- No full object-type configuration/editor panel after a preset is selected.
- No replacement of the existing Dialog primitive or global modal behavior.
- No app-shell, resize, workspace-selector, or primary-action contract changes.
- No new dependency or global CSS.

## Decisions

- Add `src/components/app-sidebar-object-type-studio.tsx` as a focused client component.
  - **Why:** The current `app-sidebar.tsx` and primary-actions component are already substantial. Keeping the studio separate preserves composition and shadcn-style component boundaries.
- Use the existing controlled `Dialog` with `open`/`onOpenChange` and no custom document listeners.
  - **Why:** The repository uses `@base-ui/react/dialog`, whose Root/Backdrop/Popup already own outside-click and Escape dismissal. Custom listeners would duplicate primitive behavior and can conflict with portal event handling.
- Use an explicit viewport-relative height rather than only `max-height`.
  - **Why:** The body `ScrollArea` needs a concrete flex constraint so it can shrink below its content height and scroll internally.
- Keep `DialogHeader` as `shrink-0` and place `ScrollArea` as `min-h-0 flex-1`.
  - **Why:** This matches the reference structure: fixed modal chrome plus independently scrollable content.
- Use responsive outer margins: tighter on small screens and larger on desktop, while capping width at `max-w-6xl`.
  - **Why:** The reference is a large desktop modal, but the demo should remain usable at narrower viewport sizes without overflowing the screen.
- Render cards with the existing `Item` primitive via its `render` API.
  - **Why:** This branch uses Base UI-style `render` composition rather than Radix-style `asChild`; using the repository API avoids invalid props and keeps native item styling.
- Keep preset data typed and local to the studio component.
  - **Why:** The current change is UI-only. A later domain layer can provide persisted object types without rewriting the modal layout.

## Risks / Trade-offs

- [Risk] A large fixed-height dialog may feel oversized on very short viewports. → Mitigation: calculate height from `100dvh` and reduce outer margins on smaller breakpoints.
- [Risk] Two-column cards can become cramped on very narrow screens. → Mitigation: keep compact icon/text geometry and let labels truncate within the existing Item layout.
- [Risk] Closing immediately after preset selection differs from the full Capacities object-type configuration flow. → Mitigation: expose `onSelect`; a later change can replace close-on-select with an internal editor panel without changing the modal shell.
- [Risk] The studio trigger could compete visually with primary actions. → Mitigation: render it as a secondary sidebar affordance below primary navigation rather than as a selected route.

## Migration Plan

- Add the object-type studio component and typed preset model.
- Compose the studio trigger into the existing app-sidebar primary-actions demo.
- Validate that the dialog stays within the viewport, the header remains fixed, the body scrolls, the responsive grid changes at the expected breakpoints, and outside-click/Escape dismissal remains native.
- Run the repository verification workflow when a development checkout or CI run is available.
