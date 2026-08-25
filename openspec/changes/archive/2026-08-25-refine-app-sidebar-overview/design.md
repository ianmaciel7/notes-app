## Context

The current branch already contains a stable AppShell, workspace selector, and primary actions. The remaining work is localized to the overview and object-type studio. The archived reference shows compact 32px section headers, 29px desktop rows, hover-revealed counts/actions, distinct menus for pinned objects versus object types, and an object-type studio with a fixed header, scrollable body, selectable cards, and a right-side detail panel.

## Goals

- Preserve existing AppShell and workspace-selector behavior exactly.
- Use existing Base UI/shadcn primitives and Lucide icons.
- Keep all styling local to the affected components; do not change `global.css`.
- Match the reference interaction model more closely while retaining a reusable React API.

## Non-Goals

- Implement persistence or backend workflows for newly created object types or custom sections.
- Reproduce unsupported proprietary icon assets byte-for-byte.
- Add new dependencies.
- Change the primary navigation or AppShell sizing contract.

## Decisions

### Overview sections

`AppSidebarSection` remains the shared section primitive. Desktop headers use the compact 32px geometry, 12px muted label text, and hover-revealed caret/count/actions. Mobile keeps larger touch targets and does not rely on hover.

### Entity rows

Rows use a compact desktop height close to the archived 29px geometry. The icon chip, label, count, and overflow action area are separate so the right-side actions can expand on hover without shifting the label unexpectedly.

### Menus

Pinned objects and object types use different menus. Base UI `DropdownMenuSub` is used for nested open/template/copy actions. Menu items use the repository's native compact menu styling instead of forcing 40px rows.

### Pinned-content picker

The pinned `+` affordance opens a Popover containing a search field and scrollable Item-based result list. Already pinned entities are filtered out.

### Custom sections

A local demo-level custom-section model supports creation, editing the section name, sorting mode, and deletion. The component APIs remain callback-driven so persistence can be added later.

### Object-type studio

The studio uses the repository Dialog primitive without document-level pointer/keyboard listeners. `Dialog` owns backdrop and Escape dismissal. The content uses a fixed header and a flex-bounded `ScrollArea` body. Cards use the existing `Item` composition and static tone maps. Selecting a preset keeps the dialog open, shows a selected state, and opens a right-side detail panel; creation happens from that panel.

### Responsive behavior

The object-type grid follows `2 → 3 → 4 → 5` columns. The dialog uses viewport-relative margins and a `max-w-6xl` cap. The detail panel becomes full-width on narrow screens and a fixed-width overlay panel on wider screens.

### Style tokens

Use semantic project tokens for neutral surfaces and static Tailwind tone maps for colored icon chips. Avoid runtime Tailwind class generation and avoid global CSS changes.

## Risks / Trade-offs

- Lucide icons approximate the archived icon set because the original renderer uses a different icon source.
- Demo-level state is intentionally non-persistent.
- Exact mobile long-press sortable behavior remains outside this refinement unless it is already supported by existing project primitives.

## Verification

- Static review of Base UI primitive usage and dismiss semantics.
- Typecheck/lint/build through `pnpm verify` when a development checkout or CI is available.
- Manual comparison against the archived screenshots/source for section heights, menu placement, scrolling, and responsive layout.
