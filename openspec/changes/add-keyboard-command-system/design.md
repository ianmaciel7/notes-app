## Context

See `proposal.md` for motivation. The workspace already contains the necessary primitives but not one coordinating contract:

- `src/components/ui/command.tsx` wraps the configured `cmdk` command/dialog primitives and shared floating-surface styles.
- `src/lib/workspace-query-engine.ts` builds and incrementally updates a local object/block index from canonical entities, aliases, properties, and stable block content.
- `src/components/app-sidebar-primary-actions.tsx` already implements a keyboard-operable runtime-Structure creation picker, but currently owns duplicated shortcut metadata and a custom window event.
- `src/editor/block-command-catalog.tsx` and `src/editor/slash-command.tsx` own the existing localized slash catalog and caret-positioned Tiptap Suggestion surface.
- `src/editor/document.ts` and `src/lib/workspace-object-links.ts` already define stable block ids, object/block link marks, link indexing, backlinks, and rename-safe identity.
- `src/components/workspace-controller.tsx` owns current navigation, selection, object creation, sidebars, contextual panel, and focus-mode actions. Those owners must remain the actual mutation paths.

The implementation must preserve runtime Structure ownership, next-intl copy, shadcn/Base UI semantics, the local synchronous input path, buffered persistence, IME composition, undo/redo, and the existing object-page parity work. The current `dev` checkout also contains unrelated modifications, so apply work must start in an isolated `codex/*` worktree and integrate only the scoped commit.

## Goals / Non-Goals

**Goals:**

- Establish stable, testable command and shortcut interfaces that existing UI owners can consume without moving domain state into the command system.
- Make palette and editor suggestion filtering projections of canonical workspace state.
- Share interaction infrastructure while keeping trigger-specific eligibility and commit behavior explicit.
- Provide a first complete vertical slice that is independently usable and extensible by later priority changes.

**Non-Goals:**

- Replace `WorkspaceProvider`, routing, Tiptap, `cmdk`, Base UI, or the workspace query engine.
- Add a generic event bus, runtime dependency-injection container, second search index, or parallel object-type registry.
- Implement `+`, `#`, in-page search, advanced search, new Markdown syntax, sidebar key bindings, shortcut settings/browser, or unsupported block types in this change.
- Copy inaccessible reference semantics, persist reference-site data, or mutate authenticated Capacities content while collecting evidence.

## Decisions

### Use a pure declarative registry plus runtime execution context

The registry stores stable command metadata and a context-aware `isAvailable`/`execute` contract. It does not own workspace state. A runtime adapter assembled near `WorkspaceProvider` supplies current actions and state selectors, so the existing button, menu, palette, and shortcut all invoke the same action owner.

Command metadata uses stable English IDs and platform-neutral shortcut chords such as `Mod+K`; labels, descriptions, categories, aliases, and accessible names resolve through next-intl at the presentation boundary. Runtime Structure creation commands are projected from canonical `WorkspaceObjectState.structures` and use the existing guarded creation flow.

Alternative considered: put all commands and state mutations in a new global provider. Rejected because it would duplicate `WorkspaceProvider`, increase render coupling, and create a second owner for navigation and persistence.

Alternative considered: keep component-local shortcut arrays and normalize only their display. Rejected because dispatch, availability, aliases, and action behavior would still drift.

### Install one shortcut router at the workspace boundary

One capture-phase keyboard router normalizes platform chords and evaluates registered context claims in this order: modal, specialized component, editor, block selection, page, global. Specialized surfaces remain responsible for native arrow/Tab behavior; they publish context claims rather than adding document listeners.

The router ignores unrelated shortcuts in `input`, `textarea`, and contenteditable targets, ignores global dispatch during composition, preserves browser/OS behavior unless a valid command claims the chord, and calls `preventDefault` only after a command is accepted. `Mod+K` is therefore link editing for a supported non-empty editor selection and palette opening otherwise.

Alternative considered: a third-party hotkey package. Rejected because current dependencies are sufficient and another event abstraction would not remove the need for application-specific context arbitration.

### Build the palette as a projection over commands and search results

The global palette composes the existing `CommandDialog` and related `cmdk` parts. It has controlled local query state, a deferred query for expensive projections, grouped command/search results, deterministic selected identity, truthful empty/loading/error states, and focus restoration. `Mod+K` and `Mod+P` set the same open state; sidebar Search can invoke that same state instead of owning an independent global-search surface.

Command results are filtered by localized labels, descriptions, categories, and aliases after availability evaluation. Search results come from the existing index and map selection to existing navigation/selection actions. Commands and search entries have separate stable namespaces so visible-title collisions cannot execute the wrong result.

The first slice includes current, truthful actions only: existing navigation destinations, settings only if a real route/surface exists, calendar/today only when implemented, runtime Structure creation, sidebar/panel toggles only when their existing owners expose actions, and current object/block search. Unsupported requested examples are omitted rather than rendered as inert placeholders.

Alternative considered: merge every result into one precomputed static list. Rejected because runtime Structures, availability, and workspace content change independently and would require stale duplication.

### Extend the current search index with parsed query intent

A small pure query parser distinguishes plain input, one fully quoted exact phrase, and a leading `^` prefix-priority mode. Ranking is deterministic and type-neutral: exact normalized title, leading title, exact/leading alias or searchable value, strong token coverage, partial containment, approximate match, then relevance/recency and stable identity as tie-breakers. Object and block modes select from the same index rather than rebuilding data.

Approximate matching must be bounded and applied after cheaper comparisons so palette opening and ordinary short queries remain immediate. The index updates only when canonical buffered content commits; query typing never writes workspace state or localStorage.

Alternative considered: introduce a fuzzy-search dependency or remote search service. Rejected for this local-first slice because the current index contains the required data and deterministic small utilities are easier to test, cancel, and keep offline.

### Extract a trigger-neutral editor suggestion controller

The existing slash implementation becomes the first consumer of a shared controller that owns only interaction mechanics: plugin lifecycle, caret rectangle/document-position fallback, viewport clamping, selected index, pointer/keyboard activation, outside/Escape dismissal, reduced motion, and focus recovery. Trigger adapters own matching, catalog construction, result rendering data, and commit transactions.

Four trigger adapters use the controller:

- `/` keeps the existing localized block command catalog and ordering.
- `@` searches eligible objects and commits the existing object-reference mark.
- `[[` reuses the same object result provider and commit operation while replacing its two-character trigger range.
- `((` searches indexed blocks, displays owning-object context, and commits the existing block-reference mark with object id and stable block id.

Only one suggestion plugin may own the active text range. Trigger adapters are disabled during composition and validate current document position plus target identity immediately before commit. A successful selection is one Tiptap transaction, joins undo/redo, places the caret after the mark, and reaches buffered persistence once. Cancellation has no domain side effect.

Alternative considered: duplicate the slash component for each trigger. Rejected because caret bugs, keyboard semantics, focus behavior, and popup styles would diverge.

Alternative considered: insert visible titles as prose and derive references later. Rejected because rename safety, backlink correctness, graph projection, and duplicate visible labels require stable identity at commit time.

### Treat reference parity as a behavior matrix, not a screenshot target

Before live recapture, apply work searches `docs/references/`, `artifacts/reference-evidence/`, and the legacy corpus for matching palette/editor states. Missing or stale states are captured as the smallest sanitized correlated bundle containing provenance, viewport, semantic state, DOM/accessibility, geometry, computed styles, interactions, transition observations, redactions, and limitations.

Validation compares baseline, hover/exit, focus, keyboard, click, open/close, post-action, persistence, unavailable, responsive, and reduced-motion states between the reference and localhost. Stronger local accessibility semantics remain authoritative when the reference is weaker.

## Data and Control Flow

1. UI ownership exposes current actions and selectors through a workspace command runtime adapter.
2. The registry projects available command definitions, including dynamic creation commands from runtime Structures.
3. The shortcut router or palette resolves a command by stable id and calls the same runtime action.
4. Palette query input remains local; deferred parsing filters command metadata and calls the shared search index.
5. Editor trigger adapters call object/block result projections from the same canonical index.
6. A selected reference validates target identity and commits one structured editor transaction.
7. Existing buffered editor persistence flushes the canonical document and updates link/search projections once.

## Testing Strategy

- Pure node tests cover chord normalization, context priority, editable-target/IME guards, availability, dynamic Structure projection, query parsing/ranking/deduplication, and atomic reference target validation.
- Editor tests begin red for `@`, `[[`, and `((`, then cover trigger ranges, shared controller geometry, aliases, duplicate labels/text, arrows, Enter, Escape, composition, focus, undo/redo, and exactly-once persistence.
- Component/browser tests cover `Mod+K`, `Mod+P`, contextual link precedence, palette roles/names, grouped results, selection, navigation/creation execution, unavailable commands, focus restoration, platform labels, responsive containment, reduced motion, and console/hydration errors.
- Existing slash, query engine, linking, object lifecycle, sidebar, workspace surface, localization, and snapshot migration suites remain regression gates.

## Risks / Trade-offs

- [The active object-page parity change also touches slash and `@`] -> Keep this change authoritative for shared command/search/suggestion architecture and let the parity change consume it for measured appearance; reconcile overlapping delta specs before sync/archive.
- [A global router can steal native editor or browser shortcuts] -> Require explicit context claims, accept-before-preventDefault ordering, editable-target guards, composition tests, and browser verification for conflicting chords.
- [Dynamic command projection can cause unstable ordering] -> Use stable command ids, explicit group/order metadata, deterministic search tie-breakers, and identity-based selection.
- [Approximate search can regress input latency] -> Defer derived work, bound approximate candidates, benchmark representative large fixtures, and never place indexing or persistence in the keystroke path.
- [Editor trigger sequences can overlap ordinary punctuation] -> Require valid text boundaries, active-plugin ownership, IME guards, and exact trigger-range tests.
- [A target can change between search and commit] -> Revalidate canonical object/block eligibility at commit and reject atomically.
- [Dirty `dev` changes can contaminate implementation] -> Create an isolated `codex/add-keyboard-command-system` worktree from the intended base and stage only scoped files.

## Migration Plan

1. Add pure registry, shortcut, query-intent, and suggestion-controller contracts behind focused tests without wiring global behavior.
2. Adapt existing sidebar actions and workspace owners to publish canonical commands while preserving current controls.
3. Mount the palette and router at the workspace boundary and replace only the duplicated global open/search pathway.
4. Migrate slash to the shared suggestion controller with regression parity before enabling new triggers.
5. Enable `@`, `[[`, and `((` adapters in sequence, validating one atomic transaction and projection update per selection.
6. Complete browser/evidence validation, sync stable deltas, and archive only after the overlapping parity change is reconciled.

Rollback is additive: remove the palette/router mount and new trigger extensions, restore slash to its previous renderer adapter, and retain the unchanged canonical documents, marks, search index, and workspace owners. No data migration rollback is required because no schema change is introduced.
