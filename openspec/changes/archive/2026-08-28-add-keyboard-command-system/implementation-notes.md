# Implementation Notes

## Baseline

- Worktree: `C:\Users\ianma\.codex\visualizations\2026\08\28\01a049b4-b8be-70c2-9105-acbe61da778f\notes-app-keyboard-command-system`
- Branch: `codex/add-keyboard-command-system`
- Base branch: `dev`
- Initial status after copying OpenSpec artifacts: only `openspec/changes/add-keyboard-command-system/` was untracked.
- Baseline `pnpm.cmd test` before implementation: 216/218 tests passed. The two failing tests are known clean-`dev` baseline failures in `tests/workspace-objects.test.mjs` and `tests/workspace-surface-contract.test.mjs`; the main checkout contains unrelated concurrent edits that already adjust those regex guards, so this worktree does not copy them.

## Next.js 16 API Notes

- Interactive command and palette code must remain in Client Components. The installed Next.js App Router docs state that event handlers, state, effects, and browser APIs such as `window` require a client boundary.
- A `"use client"` directive is needed only at entry points imported by Server Components; imports below an existing client boundary are already in the client module graph.
- Programmatic route changes in Client Components use `useRouter` from `next/navigation`, not `next/router`.
- `router.push` and `router.replace` must receive application-owned sanitized routes only. This change resolves navigation through existing workspace owners rather than routing arbitrary query text.
- The `Link` component remains preferred for static link navigation, but command execution and palette selection are event-driven, so existing workspace action owners stay canonical.

## Reused Reference Evidence

- `docs/references/capacities-slash-menu.md` confirms the `/` trigger contract, caret anchoring, 8px viewport clamp, keyboard operation, visible active row, and the prior `(0,0)` regression that this change must not reintroduce.
- `docs/references/capacities-workspace-parity.md` confirms the August 28 workspace evidence rules and current action-matrix discipline for idle, hover, focus, pointer, keyboard, open, Escape-close, post-click, reload, unavailable, responsive, and console states.
- `artifacts/reference-evidence/capacities-pages-listing/2026-08-28-matched-1294x912/` contains reusable DOM, style, behavior, focus, persistence, responsive, console, and search-interaction evidence for workspace shell/search surfaces.
- `artifacts/reference-evidence/capacities-object-page/2026-08-28-mentions-utilities/` contains reusable object-page mention and utility evidence.
- `artifacts/capacities-reference/visual-contract-2026-08-22.json` contains legacy sanitized component metrics, including the reference new-content palette and a recorded `CommandPalette59846.css` stylesheet asset reference.

## Current Action Matrix Coverage

The canonical action matrix for this change is linked from `docs/references/capacities-keyboard-command-system.md` and stored under `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-28-initial-matrix/`.

- Confirmed now: `Ctrl+K`, sidebar `Buscar`, palette query/navigation/Escape/focus restoration, selected-text `Ctrl+K` precedence, `@`, `[[`, and `((` against `localhost:3001` served from the isolated worktree.
- Confirmed through unit/source contracts: `Mod+P` equivalence, IME guards, viewport containment, no `(0,0)` flash, reduced-motion-safe state changes, and no per-keystroke workspace persistence.
- Browser limitation: the in-app browser backend did not reliably deliver `Ctrl+P`; the central shortcut router contract covers the same `workspace.openPalette` command.
- Visual limitation: exact Capacities hover tone is documented as a visual limitation; pointer/keyboard selection and layout stability are covered by browser probes and focused contracts.

## Verification Notes

- `pnpm.cmd lint` passed.
- `pnpm.cmd typegen` passed.
- `pnpm.cmd typecheck` passed.
- Focused command/editor/query/performance suite passed: 56/56.
- Focused post-refactor command/query/performance suite passed: 19/19.
- `pnpm.cmd build` passed with Next.js 16.3.1.
- `openspec validate add-keyboard-command-system --strict` passed.
- `pnpm.cmd test` is blocked by the same clean-`dev` baseline failures recorded before implementation: `tests/workspace-objects.test.mjs` expects `importHandler`, and `tests/workspace-surface-contract.test.mjs` expects `objectTypeHelper`. Current result: 241/243 pass.
- `pnpm.cmd verify` stops at existing `format:check` CRLF drift in `package.json` and `biome.json`; `pnpm.cmd complexity` is additionally blocked by pre-existing broad complexity findings in `WorkspaceObjectPageView` and `findUnlinkedMentionCandidates`.
