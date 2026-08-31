## Why

The local object page still presents a large generic relationship dashboard and oversized vertical gaps where the current Capacities object page uses one compact, continuous authoring surface with inline metadata, body content, collapsible Related content, and Mentions. Live inspection at the user-supplied route also shows materially different hover reveals, compound targets, row actions, menu contents, and spacing that the existing focused mentions change did not cover.

## What Changes

- Align the selected object-page surface from its type/collection/customize header through the editor, Related content, Mentions, and editor-utility edge control with the current authenticated Capacities composition, geometry, typography, colors, borders, icons, spacing, and scroll behavior.
- Match the selected surface inside the same workspace split used by the reference: a responsive main/context panel proportion that preserves the object content column, scrollbar gutter, trailing scroll range, and right panel width at both 1059x912 and wider desktop captures.
- Replace the always-expanded `Links and references` / `Add relationship` / embed / `Objects inside` dashboard in the main Page flow with the reference ordering and ownership: authoring remains in explicit commands, while applicable Related content and Mentions appear as compact derived review sections.
- Treat every visible affordance as a state machine: idle, whole-target and nested-target hover, pointer exit, focus-visible, keyboard activation, click, open, Escape/outside close, post-click state, persistence, reduced motion, and unavailable/failure behavior where applicable.
- Match the compound Page type control, inline Collections and Tags controls, hover-revealed Customize action, object overflow menu, editable title/body, section help and reveal actions, collapsible headings, relationship rows, source previews, type chips, nested open/overflow actions, and utility trigger without geometry shift.
- Preserve stronger local accessibility, localization, canonical Structure identity, buffered text-entry performance, local/offline data ownership, and non-destructive verification boundaries rather than copying weak reference semantics or reference data.
- Extend the reusable Capacities evidence bundle with the missing full-surface baseline and hover/open-state measurements, then record an action matrix that distinguishes confirmed, unavailable, unsafe, and untested transitions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/capacities-en-fidelity`: Define full object-page content-surface parity, including compact composition, exact visible control inventory, hover/action states, relationship-section ownership, and per-iteration browser evidence.
- `ui/object-lifecycle`: Define the reusable object editor shell and compound header/metadata/relationship controls as accessible, independently actionable, geometry-stable state machines.
- `ui/block-editor`: Define the object-page editor's inline spacing, hover-revealed block controls, buffered typing, focus, and transition behavior inside the matched continuous page composition.

## Impact

- Planning and evidence under `openspec/changes/align-object-page-content-surface-parity/`, `docs/references/`, and `artifacts/reference-evidence/capacities-object-page/`.
- Future implementation is expected to affect `src/components/workspace-object-page-view.tsx`, `src/components/block-editor.tsx`, shared workspace/menu primitives, `src/components/object-icons.tsx`, `src/components/app-shell.tsx`, `src/lib/workspace-layout.ts`, locale catalogs, relationship selectors only where projection ownership requires it, and focused source/browser tests.
- Existing unrelated working-tree edits in the sidebar, workspace controller, and parity suite are explicitly preserved and are not authorized for replacement by this proposal. Workspace shell edits are limited to the measured main/context split required for the selected object-page surface.
- No dependency, public API, authenticated Capacities data, or persistence-schema migration is intended.
