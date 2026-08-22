## Context

The current route-owned `WorkspaceProvider` stores lightweight created entities in React state and appends an untitled tab, while `workspace-content.tsx` renders only a generic editor for most types. Live authenticated inspection on 2026-08-22 showed seven distinct flow families: immediate full editors (Page), a structured Table editor, Task quick capture, URL capture (Weblink/Tweet), a Tag index, a Query builder, and file-backed creation. The local browser also reports a hydration mismatch, so persistence must not read changing client data during server render.

This change must coexist with the unarchived `refine-capacities-en-fidelity` work and preserve its shell geometry, component APIs, central icon contract, and route acceptance seed. It also must remain a local product implementation: no Capacities mutation, remote upload, metadata scraping, or AI dependency.

## Goals / Non-Goals

**Goals:**

- Model all thirteen palette entries with type-safe data and explicit creation status.
- Reproduce the observed creation and typing logic using deterministic local workflows.
- Keep editors, tabs, counts, indexes, and queries consistent from one canonical state.
- Restore user-created demo objects after reload without SSR/client divergence.
- Preserve localization, keyboard access, responsive composition, and existing visual fidelity.

**Non-Goals:**

- Backend storage, multi-user sync, authentication, sharing, or production routing.
- Remote file upload, binary persistence, URL scraping, tweet embedding, or third-party AI execution.
- A general rich-text engine or full Capacities query language.
- Restoring a historical monolithic workspace component or changing global UI primitives.

## Decisions

### Use a discriminated entity union and reducer

Introduce a neutral workspace-domain module that defines a shared entity base plus variants for document, quote, table, task, URL, tag, query, and file-backed data. A pure reducer owns create, commit, edit, select, hydrate, and recovery transitions; derived selectors compute counts and query results.

- **Why:** A single canonical transition boundary prevents the current mismatch where the tab changes but the rendered object and counts do not.
- **Alternative considered:** Add more conditional local state to each editor. Rejected because it duplicates ownership and makes persistence and cross-surface synchronization unreliable.

### Separate creation drafts from committed entities

Immediate editor types commit an untitled object when selected. Task and URL flows use transient drafts and commit only after valid input. File-backed flows commit only after a compatible file is chosen. Query commits immediately because its empty builder is itself an editable object.

- **Why:** This matches observed reference behavior and prevents cancelled dialogs or invalid URLs from inflating counts.
- **Alternative considered:** Create every object immediately and delete on cancel. Rejected because cancellation becomes destructive and temporarily corrupts visible counts.

### Render by workflow family, not one component per palette label

Create reusable family renderers: document editor, table editor, task capture/editor, URL capture/editor, tag index, query builder, and file metadata editor. Variant configuration controls visible fields, accepted MIME types, icon tone, and localized copy.

- **Why:** The reference has shared editor structure across several types but materially different state machines across families.
- **Alternative considered:** Thirteen independent components. Rejected because common fields, validation, and synchronization would drift.

### Use deterministic local derivation for URLs and queries

Weblink titles derive from the parsed hostname/path, while Tweet objects validate known status URL shapes and use an untitled fallback until edited. The query description supports a small documented set of local templates and also exposes direct type/date/tag filters; it never calls a model.

- **Why:** It preserves the interaction contract without introducing network variability, secrets, or an external dependency.
- **Alternative considered:** Fetch Open Graph/Tweet metadata and call an AI service. Rejected as outside scope and incompatible with deterministic offline acceptance.

### Persist a validated versioned snapshot after mount

Use a dedicated storage adapter with a stable key and schema version. The server and first client render always use the same deterministic seed. An effect reads, parses, validates, and dispatches hydration after mount; later committed transitions are serialized. File bytes and object URLs are excluded.

- **Why:** This addresses the observed hydration mismatch and allows safe migrations or recovery from malformed records.
- **Alternative considered:** Initialize React state directly from `localStorage`. Rejected because it changes client render output relative to SSR.

### Keep locale-neutral data and localized projections

Object discriminants, IDs, dates, filter operators, and storage records remain English and locale-neutral. Every visible string, fallback title, validation message, and accessible label comes from `src/messages/*.json` through `next-intl`.

- **Why:** Stored content must survive locale changes without embedding translated control values.
- **Alternative considered:** Store translated object-type labels. Rejected because counts, filtering, and migrations would depend on the locale used at creation time.

## Risks / Trade-offs

- [Risk] Local storage can diverge from future entity schemas. → Mitigation: validate a versioned snapshot, ignore unsupported future versions, and keep migrations explicit.
- [Risk] Ephemeral file previews disappear after reload. → Mitigation: persist metadata only and render a localized reselect-file state; document this deliberate local-only limitation.
- [Risk] A reduced query template set may look less capable than the reference AI. → Mitigation: expose direct filters as the authoritative deterministic path and label generated templates as local behavior.
- [Risk] The current dirty worktree overlaps controller and content files. → Mitigation: re-audit diffs before each edit, preserve existing changes, and use focused patches and tests.
- [Risk] Persisted acceptance data can make visual checks nondeterministic. → Mitigation: provide a test-only/reset adapter boundary and always test first-run seed separately from hydrated user state.

## Migration Plan

1. Add the domain union, reducer, selectors, validation, and storage adapter with unit tests before changing UI dispatch.
2. Replace the lightweight `createdEntities` path inside the route-owned provider while preserving existing public consumer behavior during the transition.
3. Implement and connect each workflow family in reference-observed order: document, table, task, URL, tag, query, file.
4. Add locale catalog entries and focused structural/interaction tests for each family.
5. Verify first-run and hydrated routes in the browser, including typing, reload, cancellation, counts, keyboard access, responsive layout, and clean console state.
6. Roll back by reverting the route-owned lifecycle modules and UI integration; the versioned local record can safely remain ignored by the prior build.

## Open Questions

- Whether a future backend should adopt the same entity schema or introduce a separate transport model; this local change does not decide that boundary.
- Whether binary persistence should later move to IndexedDB; current acceptance intentionally retains metadata only.
