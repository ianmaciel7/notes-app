## Why

Keyboard actions, search surfaces, editor suggestions, and visible shortcut hints currently have separate ownership, so equivalent actions can drift in availability, labels, aliases, and execution. The application needs one command and search foundation before adding more keyboard-driven workflows, while preserving the editor's local input path and the canonical workspace model.

## What Changes

- Add a central, declarative command registry and contextual shortcut resolver with one execution path shared by buttons, menus, shortcuts, and the command palette.
- Add a global command palette opened by `Mod+K` or `Mod+P` that combines commands, navigation, runtime object creation, and indexed object/block search.
- Reuse the workspace search index while adding deterministic exact-phrase and leading-content query semantics required by the palette.
- Unify the editor suggestion infrastructure for `/`, `@`, `[[`, and `((` without duplicating catalogs, search, caret positioning, keyboard behavior, or persistence paths.
- Insert object and block references by stable canonical identity, preserve undo/redo and focus, and derive available object types from runtime Structures.
- Localize all visible copy, render platform-appropriate shortcut labels, preserve accessible combobox/listbox behavior, and validate reference-inspired interactions through reusable sanitized evidence.
- Limit this delivery to the approved maximum-priority foundation. Quick creation with `+`, tags with `#`, in-page search, Markdown additions, sidebar shortcuts, advanced search, and the complete shortcuts browser remain separate follow-up changes.

## Capabilities

### New Capabilities

- `ui/keyboard-command-system`: Defines the central command registry, contextual shortcut dispatch, global command palette, platform labels, accessibility, and shared action execution contract.

### Modified Capabilities

- `domain/query-engine-and-search-index`: Add deterministic palette query modes and shared ranked object/block result projection without creating a second search engine.
- `domain/object-and-block-linking`: Add canonical editor insertion semantics for `@`, `[[`, and `((` using stable object and block identities.
- `ui/block-editor`: Extend the shared caret-anchored suggestion behavior to object and block reference triggers while retaining the existing slash-command contract.

## Impact

- Affected areas include the workspace controller/provider, existing `cmdk` components, sidebar actions, workspace search index, Tiptap suggestion extensions, object/block reference marks, localization catalogs, and focused source/component/browser tests.
- The change reuses existing dependencies (`cmdk`, Tiptap Suggestion, Base UI, Floating UI, next-intl) and does not require a new command, hotkey, search, or dialog package.
- The change depends on, but must not duplicate, the editor visual and interaction work in `align-object-page-complete-parity`; conflicts are resolved through the shared command/suggestion contracts defined here.
- No persistence schema, public API, runtime Structure identity, object content, or authenticated third-party data is intentionally changed.
