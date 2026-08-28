## 1. App-sidebar workspace selector

- [x] 1.1 Add `src/components/app-sidebar.tsx` as a client component using existing shadcn/Base UI primitives and named exports.
- [x] 1.2 Add controlled space selection, search, clear-search behavior, stable empty state, and disabled create-space footer.
- [x] 1.3 Add hover-only `Change space` hint that never opens from click/focus/selection.
- [x] 1.4 Add pointer-based reorder from the left grab handle with 200ms row transitions and keep the combobox open after drop.

## 2. Source-derived navigation and overview

- [x] 2.1 Align New, Search, Explore, and Calendar to the compact source-derived row geometry and captured iconography.
- [x] 2.2 Keep `Pinned` outside the main overview `ScrollArea` so the heading and pinned entities remain visible while lower content scrolls.
- [x] 2.3 Split pinned entities and object types into distinct reusable row contracts.
- [x] 2.4 Match the source-derived desktop row geometry: 29px height, 3px leading inset, compact type-label padding/icon geometry, selected brightness, and 80px hover action rail.
- [x] 2.5 Show object count only on object-type hover rows and keep pinned rows count-free.
- [x] 2.6 Match section chevron/count/sort/add visibility transitions and the hover-only `Add section` affordance.

## 3. Lower navigation and footer

- [x] 3.1 Add Trash and Help/resources using full-row 32px shadcn ghost interactions.
- [x] 3.2 Add `Primeiros passos`, `Fazer uma pergunta`, `Documentação`, `Novidades`, and `Feedback` rows with source-derived external-link hover affordances.
- [x] 3.3 Add the captured `Faça perguntas sobre o Capacities` tooltip to the Ask action.
- [x] 3.4 Add the fixed footer with outline Settings, theme toggle, combined account/Pro control, flexible spacer, and Share action using the source-derived footer spacing.

## 4. Shadcn and AppShell integration

- [x] 4.1 Keep resize, collapse, trigger positioning, and mobile shell ownership in the existing `AppShell`.
- [x] 4.2 Reuse project `Button`, `Popover`, `DropdownMenu`, `Collapsible`, `Dialog`, `ScrollArea`, `Badge`, and `Tooltip` primitives where applicable.
- [x] 4.3 Add stable `data-slot` attributes to new reusable sidebar components and meaningful subcomponents.
- [x] 4.4 Use the native semantic tokens from `src/app/globals.css`; do not modify `src/components/ui/*` or add sidebar-specific global CSS.
- [x] 4.5 Keep `AppSidebarObjectTypeStudio` as the object-type creation dialog flow.

## 5. Integration and verification

- [x] 5.1 Integrate the app-sidebar component into the existing `AppShellSidebar` composition on the locale starter page without changing the app-shell contract.
- [x] 5.2 Sync the completed delta into the canonical `openspec/specs/ui/app-sidebar/spec.md` capability.
- [x] 5.3 Verify the resulting code with the repository `pnpm verify` workflow in a development checkout and resolve formatting, lint, typecheck, test, or build errors.
