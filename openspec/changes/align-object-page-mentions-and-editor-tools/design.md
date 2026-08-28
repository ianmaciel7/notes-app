## Context

See `proposal.md` for motivation and `evidence/source-baseline.md` for the correlated reference/local observations. The current domain helper treats the focused object as the mention source and searches its body for other object titles. The reference and official documentation use the opposite projection: the focused object is the target, and other objects containing its title or aliases are the sources. The current object page also combines authoring actions, backlinks, embedded content, graph edges, related content, and advisory mentions in one large `Links and references` region. Finally, the editor-edge minus control owns a full-object hide/show state even though the reference uses it for a floating Structure/Statistics utility.

The repository already owns canonical object identities, block documents, forward-reference indexes, derived backlinks, editor localization, shared popup primitives, and a buffered persistence contract. This change must reuse those owners and must not introduce a parallel reference-only page.

## Goals / Non-Goals

**Goals:**

- Make unlinked mentions a target-oriented derived projection with enough source/range identity for deterministic preview and conversion.
- Separate passive relationship review from explicit link/embed authoring while keeping backlinks, graph edges, embeds, and property relations canonical.
- Give the edge trigger a small editor-utility state machine that never hides the object page.
- Preserve or improve local accessibility, keyboard behavior, offline operation, privacy, reduced motion, and buffered editing while matching reference composition.
- Provide fixtures that prove the exact reference direction and prevent the reversed algorithm from returning.

**Non-Goals:**

- Persisting mention candidates, excerpts, outlines, or text statistics as new canonical records.
- Adding AI mention detection, fuzzy semantic search, remote indexing, or global graph requirements.
- Reproducing reference accessibility defects, authenticated entity names/counts, or unrelated persisted panel widths.
- Redesigning the entire workspace shell, Pages listing, editor block catalog, or side-panel Explore content.
- Creating or deleting authenticated Capacities objects for test coverage.

## Decisions

### Derive mentions from candidate source objects toward the focused target

The selector will accept the focused target identity, normalize its non-empty title and aliases, scan eligible source documents, and return candidates that carry source identity, target identity, matched block/range identity, label, and a bounded excerpt. Existing canonical source-to-target references exclude the corresponding occurrence. Results remain derived and are recomputed when target labels, source content, or references change.

Alternative considered: retain the existing current-body scan and reverse labels only in the UI. Rejected because it cannot produce the source object and excerpt shown by the reference and would continue to encode the wrong graph direction.

### Keep advisory mentions separate from canonical links and authoring controls

The object page will consume projections from the relationship index: backlinks first, then Mentions. Each mention row is a read-only source preview with separate navigation, overflow, disclosure, and explicit conversion actions. Generic link/embed creation remains available through explicit editor or contextual commands rather than an always-expanded list of every entity. Conversion applies a stable reference mark to the exact matched source range, after which canonical indexes move the item from Mentions to backlinks and graph edges.

Alternative considered: keep one combined `Links and references` dashboard and restyle it. Rejected because composition, action ownership, empty states, and conversion semantics would remain unlike the observed product.

### Model editor utilities as transient presentation state

The edge trigger opens a shared compact surface with `structure` and `statistics` tabs plus `pinned` state. Unpinned panels dismiss on Escape or outside interaction; pinned panels ignore outside interaction until unpinned. None of these transitions change the entity. Structure is derived from heading blocks and stable block ids. Statistics are computed from the accepted editor document and canonical timestamps. The selected tab may remain session-local; no reload persistence is promised by the specs.

Alternative considered: keep the full-editor collapse and add Structure/Statistics elsewhere. Rejected because the visible minus control would still execute the wrong action. If full-editor collapse remains useful, it requires a separately named, separately evidenced control outside this change.

### Preserve stronger accessibility than the reference DOM

Reference controls sometimes render as focusable generic elements without useful names. The local implementation will retain buttons, tabs, regions, labels, `aria-expanded`/selected state, visible focus, keyboard activation, focus recovery, and reduced-motion handling while matching the reference's visible geometry and sequencing.

Alternative considered: reproduce reference DOM exactly. Rejected because parity is an observable product contract, not permission to regress accessibility.

### Test the projection and page composition independently

Domain fixtures will include focused target title/aliases, multiple containing sources, duplicate occurrences, existing links, property relations, renames, offline operation, and exact conversion ranges. Browser fixtures will render the same semantic data and test relationship ordering, count truthfulness, section collapse, source-row actions, utility tabs, pin/outside/Escape behavior, responsive containment, typing/undo, persistence boundaries, and console cleanliness.

Alternative considered: rely on a single screenshot or one end-to-end fixture. Rejected because it cannot isolate direction, exclusion, focus, persistence, or runtime failures.

## Risks / Trade-offs

- [Naive substring matching can create false positives] → Use the repository's normalized text model with explicit matched ranges and add word-boundary/punctuation/diacritic fixtures before conversion is allowed.
- [Scanning every document on every keystroke can regress editor input] → Recompute from committed/buffered document boundaries and reuse canonical indexes or incremental memoization; never run full-workspace work inside the keystroke handler.
- [A source can contain multiple occurrences] → Give every candidate stable source block/range identity, deduplicate exact ranges only, and convert the selected occurrence rather than the entire source.
- [Renames can invalidate visible candidates] → Treat candidates and excerpts as derived values and refresh from current canonical labels/content before conversion.
- [Pinned utility geometry can cover content in constrained layouts] → Use collision-aware compact placement or an overlay/sheet composition at narrow widths and verify no horizontal overflow.
- [Existing tests currently certify contradicted behavior] → Replace them with red-first fixtures tied to the official direction and keep the old inverse case as a negative assertion.
- [Authenticated screenshots can expose unrelated content] → Persist only inspected Capacities crops in the evidence workflow; keep localhost evidence structured and image-free.

## Migration Plan

1. Add failing domain fixtures for target-oriented discovery, exclusions, matched ranges, and explicit conversion before changing selectors.
2. Introduce the corrected derived projection without changing persisted object or block schemas.
3. Build the relationship review components and utility panel from shared primitives, then replace the generic page composition and incorrect collapse owner.
4. Update locale catalogs and focused source/browser contracts, including removal of the contradicted collapse test.
5. Run unit, component, browser, accessibility, keyboard, responsive, reduced-motion, persistence, performance-regression, console, evidence, and strict OpenSpec verification.
6. Recapture only the required sanitized Capacities crops and structured localhost evidence after implementation. Rollback is a normal revert of the isolated implementation commits; no data migration rollback is required because candidates and panel state are derived/transient.
