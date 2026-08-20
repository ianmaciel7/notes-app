## 1. App-sidebar workspace selector

- [x] 1.1 Add `src/components/app-sidebar.tsx` as a client component using existing shadcn/Base UI primitives and named exports.
- [x] 1.2 Add controlled space selection, search, clear-search behavior, stable empty state, and disabled create-space footer.
- [x] 1.3 Add hover-only `Change space` hint that never opens from click/focus/selection.
- [x] 1.4 Add pointer-based reorder from the left grab handle with 200ms row transitions and keep the combobox open after drop.

## 2. Focus, sizing, and responsive behavior

- [x] 2.1 Keep the search input as focus owner while open and prevent trigger/outside-click flicker.
- [x] 2.2 Match the selected desktop geometry: 18rem width, 27rem maximum scroll-body height, right/start placement, viewport collision safety, and vertical-only scrolling.
- [x] 2.3 Add the below-768px bottom-sheet presentation with equivalent search/list/empty/footer behavior.

## 3. Integration and verification

- [x] 3.1 Integrate the app-sidebar component into the existing `AppShellSidebar` composition on the locale starter page without changing the app-shell contract.
- [ ] 3.2 Verify the resulting code with the repository `pnpm verify` workflow in a development checkout and resolve any formatting, lint, typecheck, test, or build errors.
