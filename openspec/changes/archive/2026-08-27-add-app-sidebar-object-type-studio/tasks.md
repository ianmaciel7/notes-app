## 1. Object-type studio component

- [x] 1.1 Add a focused `app-sidebar-object-type-studio` client component using the existing Dialog, ScrollArea, Item, and Button primitives.
- [x] 1.2 Add typed suggested and basic object-type preset data with compact 32px icon containers and a typed selection callback.
- [x] 1.3 Implement a viewport-bounded large dialog with a fixed header and independently scrollable body.
- [x] 1.4 Implement the source-inspired responsive `2 → 3 → 4 → 5` preset grid.
- [x] 1.5 Preserve native Base UI backdrop-click and Escape dismissal without document-level event listeners.

## 2. Integration

- [x] 2.1 Compose the object-type studio trigger below the existing primary actions in `AppSidebarPrimaryActionsDemo` without changing AppShell behavior.
- [x] 2.2 Keep the trigger a secondary sidebar affordance rather than an active navigation route.

## 3. Verification

- [x] 3.1 Verify the OpenSpec proposal, design, requirements, tasks, and implementation remain consistent.
- [x] 3.2 Verify the dialog structure statically: fixed header, `min-h-0 flex-1` scroll area, viewport-relative dimensions, and responsive grid classes.
- [x] 3.3 Run `pnpm verify` in a development checkout or confirm an equivalent CI quality check when available.
