## Context

The repository already has a reusable `AppShell`, an 18rem/14rem/24rem left `ResizablePanel`, and a Base UI-backed shadcn component set. The captured Capacities source provides the visual and interaction reference for the sidebar. The implementation therefore needs to preserve source-derived geometry and interaction semantics without introducing a parallel primitive or global-theme system.

The existing workspace selector is already robust and should remain in place. The remaining work is the navigation/body/footer composition.

## Goals / Non-Goals

**Goals:**
- Keep the workspace selector behavior already implemented.
- Match the reference sidebar appearance and interaction model closely enough that row height, inset, type-label geometry, selected state, section actions, lower utility rows, footer spacing, and hover transitions line up with the captured source.
- Keep `Pinned` visible while object types and lower navigation scroll.
- Keep pinned entities and object types as different row contracts.
- Use existing shadcn/Base UI primitives for interaction-heavy controls and semantic theme tokens from the current `globals.css`.
- Follow repository shadcn conventions: `data-slot`, `cn`, native props, semantic tokens, primitive state attributes, and no unnecessary custom CSS.
- Keep resize/collapse behavior owned by `AppShell`.

**Non-Goals:**
- No persistence layer for pinned content, object types, custom sections, theme, or account state.
- No backend navigation or data loading.
- No changes to `src/components/ui/*`.
- No sidebar-specific global CSS variables or new global stylesheet rules.
- No second sidebar provider/offcanvas/resize implementation inside the feature.

## Decisions

### Preserve `AppShell` ownership of geometry

The sidebar SHALL continue to render inside `AppShellSidebar` and SHALL NOT introduce its own `ResizablePanel`, `SidebarProvider`, or offcanvas system.

- **Why:** `AppShell` already owns the stable 18rem default, 14rem minimum, 24rem maximum, collapse transition, resize rail, and mobile sheet integration.

### Keep the workspace selector implementation

The existing `AppSidebarSpaceSwitcher` remains the header control.

- **Why:** Its controlled selection, filtering, focus management, pointer reorder, FLIP animation, desktop popup, and mobile sheet behavior are already aligned with the active change.

### Separate fixed and scrollable regions

The sidebar body is divided into:

1. primary navigation;
2. persistent pinned region;
3. scrollable overview region for object types, custom sections, Add section, Trash, and Help/resources;
4. fixed footer.

- **Why:** Pinned content must remain visible while the object overview can independently scroll.

### Separate pinned and object-type row contracts

`PinnedEntityRow` and `ObjectTypeRow` are distinct components.

Pinned rows:
- source-derived 29px desktop row;
- selected row uses the persistent background treatment and `font-medium` label;
- hover expands an 80px action rail over 300ms;
- no object count is rendered.

Object-type rows:
- same 29px desktop row geometry;
- label uses the source-derived compact type-label structure (`px-[0.49em]`, `py-[0.2em]`, rounded type icon, `mr-[0.4em]`, `ml-[-0.1em]`);
- hover expands an 80px action rail over 300ms;
- the object count is visible inside the hover rail before the context menu.

### Use shadcn/Base UI for behavior, not custom primitives

Use project `Button`, `Popover`, `DropdownMenu`, `Collapsible`, `Dialog`, `ScrollArea`, `Badge`, and `Tooltip` components for their native interaction behavior.

- **Why:** This preserves keyboard/focus/ARIA behavior and matches the repository `shadcn-first` contract.

### Use semantic theme tokens

Use `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `text-muted-foreground`, `bg-popover`, `border-border`, and related project tokens.

- **Why:** The current `globals.css` already defines the light/dark theme and sidebar palette. The feature must not duplicate or override it.

### Source-derived lower navigation behavior

Trash and Help/resources rows use a full-row ghost interaction with `h-8`, `px-2`, and `gap-x-1.5`. External-link affordances on Ask, Documentation, and Feedback remain opacity-zero until row hover and transition over approximately 200ms.

The Ask row uses the tooltip text `Faça perguntas sobre o Capacities` from the captured source.

### Footer behavior

The footer uses `px-2.5 pr-1 py-1.5`, `gap-x-0.5`, independent 32px icon buttons, a combined account/Pro control, a flexible spacer, and the Share control on the far right.

Settings uses an outline gear icon so it matches the reference appearance instead of a filled source glyph.

### Object-type studio

Keep `AppSidebarObjectTypeStudio` as a shadcn `Dialog`/`ScrollArea` flow rather than a small side popover.

- **Why:** The reference object-type creation flow is a larger studio, and the existing component already provides the correct reusable boundary.

## Risks / Trade-offs

- [Risk] Exact visual fidelity can conflict with generic shadcn spacing. → Mitigation: use source-derived values only where they represent concrete feature geometry (29px row, 80px hover rail, compact label padding, footer inset) and keep all theme behavior semantic.
- [Risk] Keeping Pinned outside the scroll region reduces available scroll height when many pinned items exist. → Mitigation: pinned content is intentionally persistent per the requested behavior; callers can later cap the number of visible pinned rows if product requirements change.
- [Risk] Custom drag behavior can diverge from the reference. → Mitigation: keep sorting visual duration at approximately 200ms and isolate reorder state from normal selection.
- [Risk] Demo-only local state can be mistaken for application data. → Mitigation: keep data contracts and callbacks separable from presentation so persistence can be connected later.

## Migration Plan

- Update the existing OpenSpec delta first.
- Keep `src/components/app-sidebar.tsx` focused on the workspace selector and shell-level composition.
- Refactor `src/components/app-sidebar-overview.tsx` into source-derived pinned/type/utility/footer composition.
- Update `src/components/app-sidebar-primary-actions.tsx` only where spacing/icons need to match the reference.
- Reuse `src/components/app-sidebar-object-type-studio.tsx` and existing project primitives.
- Keep the locale page integration through `AppSidebarPrimaryActionsDemo`.
- Verify with the repository `pnpm verify` workflow in a development checkout when available.
