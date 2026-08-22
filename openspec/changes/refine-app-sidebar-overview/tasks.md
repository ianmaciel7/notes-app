## 1. Overview structure

- [x] 1.1 Refine shared section header geometry, hover states, count/caret/action presentation, and mobile reachability.
- [x] 1.2 Refine compact object rows and static icon tone mappings.
- [x] 1.3 Add the pinned-content picker using existing Popover/Input/Item/ScrollArea primitives.
- [x] 1.4 Add custom-section creation, rename, sorting, and deletion behavior.

## 2. Menus

- [x] 2.1 Add distinct pinned-object and object-type menus with source-inspired nested actions.
- [x] 2.2 Make object-type `Open` contextual to the active destination.
- [x] 2.3 Match compact menu sizing and section-menu placement without modifying global primitives.

## 3. Object-type studio

- [x] 3.1 Remove document-level dialog dismissal listeners and rely on native Base UI Dialog semantics.
- [x] 3.2 Keep the studio header fixed and body independently scrollable.
- [x] 3.3 Preserve the responsive `2 → 3 → 4 → 5` grid and compact 32px preset icon geometry.
- [x] 3.4 Add selectable preset state and a responsive right-side detail/confirmation panel.
- [x] 3.5 Replace runtime-generated tone classes with static mappings.

## 4. Integration and verification

- [x] 4.1 Keep AppShell, workspace-selector, primary-action behavior, dependencies, and `global.css` unchanged.
- [x] 4.2 Reconcile the refinement with the archived Capacities reference source and screenshots.
- [x] 4.3 Run `pnpm verify` in a development checkout or confirm equivalent CI checks when available.
