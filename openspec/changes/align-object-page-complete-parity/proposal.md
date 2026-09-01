## Why

The selected localhost object page still differs materially from the current authenticated Capacities object page in composition, spacing, transient surfaces, relationship presentation, and editor interactions. The remaining work needs one evidence-backed contract that covers the whole central object surface, including hover, focus, click, keyboard, open/close, post-action, persistence, block insertion, slash commands, `@` references, and aliases, rather than another screenshot-only adjustment.

## What Changes

- Align the complete object surface from the header through related content for both built-in Pages and custom-Structure instances: type control, Collections, Customize, overflow, title, Tags, optional/addable properties, editor body, relationship sections, related-content rows, and the editor utility trigger.
- Treat every visible affordance as a state machine with measured idle, hover, focus-visible, pointer, keyboard, open, Escape/outside-close, post-click, persistence, unavailable, reduced-motion, and responsive states when supported.
- Match the current reference menus and selectors without copying its weaker semantics: searchable type selection, inline Collections and Tags pickers, Structure/state-dependent Customize and overflow catalogs, and the custom-Structure Add property surface.
- Complete reference-aligned editor behavior for per-block plus and grip controls, slash-command aliases and ordering, `@` object-reference suggestions, selection, cancellation, focus recovery, and canonical link creation.
- Replace the local always-expanded generic relationship builder with reference-aligned derived relationship and related-content composition while preserving explicit local link/embed authoring through an appropriate transient control.
- Register correlated evidence for the exact reference and localhost states, including viewport, semantic selection, DOM/accessibility, rectangles, computed styles, transitions, behavior, console state, redactions, and explicitly untested mutations.
- Preserve local object identities, content, counts, canonical Structure ownership, offline persistence, localization, accessible names, and existing validated mention/editor-utility behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/capacities-en-fidelity`: Expand Functional Page parity into a complete object-page composition and interaction contract backed by matched current evidence.
- `ui/block-editor`: Specify the complete insertion, block-handle, slash-command, `@` reference, alias-search, focus, and responsive interaction matrix required inside the Page editor.
- `domain/object-and-block-linking`: Define deterministic `@` object-reference selection and canonical link creation without duplicate references or accidental prose mutation.
- `developer-workflows/reference-evidence`: Require a discoverable, correlated object-page evidence record that distinguishes measured, inferred, untested, and mutation-prohibited states.

## Impact

- Planning and evidence records under `openspec/changes/align-object-page-complete-parity/`.
- Future implementation is expected to affect `src/components/workspace-object-page-view.tsx`, `src/components/workspace-content.tsx`, `src/components/block-editor.tsx`, editor suggestion and block-control modules, relationship selectors, shared menu/popover primitives, `src/messages/*.json`, and focused source/browser tests.
- The existing `align-object-page-mentions-and-editor-tools` behavior remains a prerequisite and must not regress; the broader `audit-workspace-component-parity` change remains responsible for shell, sidebar, listing, and contextual-panel parity outside this central object surface.
- No dependency, public API, persistence-schema, authenticated-reference mutation, or production-code change is authorized by this proposal workflow.
