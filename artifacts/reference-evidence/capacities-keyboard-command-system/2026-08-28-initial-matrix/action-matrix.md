# Keyboard Command System Action Matrix

| Surface | Action | Expected reference state | Observed local state | Verdict | Evidence |
| --- | --- | --- | --- | --- | --- |
| Slash menu | Idle trigger `/` after valid boundary | Confirmed: opens a caret-anchored command surface. | Existing slash implementation has local tests and will be rechecked after shared-controller extraction. | Reuse confirmed; local revalidation pending | `docs/references/capacities-slash-menu.md` |
| Slash menu | Hover/exit | Confirmed: active row treatment remains stable without geometry shift. | Pending post-change browser check. | Not tested in this change yet | `docs/references/capacities-slash-menu.md` |
| Slash menu | ArrowUp/ArrowDown | Confirmed: keyboard-operable command query and selection. | Existing tests cover slash keyboard behavior; shared-controller red/green pass pending. | Reuse confirmed; local revalidation pending | `docs/references/capacities-slash-menu.md`; `tests/e2e/block-editor.spec.ts` |
| Slash menu | Enter | Confirmed: accepted slash command inserts one supported block command. | Pending shared-controller migration check. | Reuse confirmed; local revalidation pending | `docs/references/capacities-slash-menu.md` |
| Slash menu | Escape/outside dismissal | Confirmed: Escape cancels without mutation and focus is recovered. | Existing tests cover Escape; post-change browser check pending. | Reuse confirmed; local revalidation pending | `docs/references/capacities-slash-menu.md` |
| Slash menu | Responsive containment | Confirmed: menu must clamp within an 8px viewport gutter and never flash at `(0,0)`. | Existing regression target remains in scope for shared controller. | Reuse confirmed; local revalidation pending | `docs/references/capacities-slash-menu.md` |
| Global palette | Idle open by `Mod+K` | Reference shortcut behavior not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Global palette | Idle open by `Mod+P` | Reference shortcut behavior not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Global palette | Focus/ArrowUp/ArrowDown/Enter/Escape/outside | Reference command palette stylesheet exists in legacy sanitized asset list; interaction state not safely confirmed. | Not implemented yet. | Not tested | `artifacts/capacities-reference/visual-contract-2026-08-22.json`; live browser acceptance required |
| Global palette | Hover/exit/reduced motion | Reference state not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Global palette | Search post-action/persistence/unavailable/console | Workspace search and shell evidence exist, but combined command-palette flow is not confirmed yet. | Not implemented yet. | Not tested | `artifacts/reference-evidence/capacities-pages-listing/2026-08-28-matched-1294x912/`; live browser acceptance required |
| Object triggers | `@` lookup and Escape | Reference state not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Object triggers | `[[` lookup and Escape | Reference state not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Block trigger | `((` lookup and Escape | Reference state not safely confirmed in reusable evidence. | Not implemented yet. | Not tested | Live browser acceptance required |
| Editor triggers | IME composition | Reference mutation is prohibited; expected local behavior is no trigger commit during composition. | Not implemented yet. | Mutation prohibited/reference not tested | Local TDD and browser acceptance required |

## 2026-08-28 local browser acceptance update

Target: `http://localhost:3001/pt-BR/4d0215ae-79d6-46bd-840f-8144ec5a84fb/df5fb424-5e86-44ef-8f9b-3c0ecf3f0bb9`, served from isolated worktree `notes-app-keyboard-command-system`.

| Surface | Action | Observed local state | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| Global palette | `Ctrl+K` open | `role="dialog"` opened with `data-slot="workspace-command-palette"`; input focused; first option selected; dialog rect `384x496 @ 448,240`; no console errors. | Pass | Browser DOM/geometry probe |
| Global palette | Search query | Filling `page` produced one deterministic item: `Novo Page`; no storage writes in source-contract performance test. | Pass | Browser DOM probe; `tests/workspace-command-performance.test.mjs` |
| Global palette | Arrow/Escape/focus restoration | Arrow kept the single selected item; Escape closed the input and restored focus to sidebar `Buscar`. | Pass | Browser keyboard probe |
| Global palette | Pointer invocation | Sidebar `Buscar` opens the shared command palette after the pointer event settles; input is focused, dialog role is present, rect is `384x496 @ 448,240`, background is `lab(99.9996 -0.00354648 -0.0378728)`, radius is `14px`, and no console errors were emitted. | Pass | Browser DOM/geometry/pointer probe |
| Global palette | `Ctrl+P` | Browser/backend did not deliver `Ctrl+P` reliably due in-app browser focus/shortcut translation; router/unit contract covers `Mod+P` equivalence through the same `workspace.openPalette` command. | Browser limitation; unit pass | `tests/workspace-command-system.test.mjs`; browser limitation probe |
| Contextual shortcut | selected-text `Ctrl+K` | With text selected in the editor, global palette did not open; focus remained in the `Text` textbox and the editor-owned link affordance remained available. This verifies global palette routing does not steal the contextual editor range. | Pass | Browser keyboard/focus probe; `tests/workspace-command-system.test.mjs` |
| Object trigger | `@` | Menu opened near caret (`440x58 @ 634,324`) with selected object result `Atlas Target / Page`; Enter created `objectLink` and `Links e referências` updated to `1 referência`; no console errors. | Pass | Browser DOM/geometry/keyboard probe |
| Object trigger | `[[` | Menu opened near caret (`440x58 @ 665,324`) with same selected object result; click and Enter created `objectLink`; no console errors. | Pass | Browser DOM/geometry/click/keyboard probe |
| Block trigger | `((` | Menu opened near caret (`440x58 @ 683,324`) with block result including owner context; click and Enter created `blockLink`; no console errors. | Pass | Browser DOM/geometry/click/keyboard probe |
| Editor triggers | Hover/exit | Pointer option selection/click applied the expected mark; shared geometry and row-state contracts cover active/hover stability without layout shift. Exact Capacities hover tone remains a visual limitation rather than a functional blocker. | Pass with visual limitation | Browser click probe; `tests/editor-shared-suggestion-controller.test.mjs`; `tests/slash-menu-reference.test.mjs` |
| Editor triggers | Responsive/reduced motion/IME | Unit contracts cover viewport clamp, no `(0,0)` flash, and composition guards; live IME/reduced-motion mutation remains mutation-prohibited in the browser acceptance pass. | Pass with browser limitation | `tests/editor-shared-suggestion-controller.test.mjs`; `tests/editor-trigger-arbitration.test.mjs`; browser limitation probe |
