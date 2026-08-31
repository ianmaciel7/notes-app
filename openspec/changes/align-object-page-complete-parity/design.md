## Context

See `proposal.md` for motivation. The current production owners are split between the Page composition in `workspace-object-page-view.tsx`, shared object editing in `workspace-content.tsx`, the block editor and suggestion extensions, canonical relationship selectors, runtime Structure metadata, and shared popup primitives. The completed `align-object-page-mentions-and-editor-tools` change already owns correct mention direction and the Structure/Statistics utility panel; this change must extend the surface without reintroducing the generic relationship or full-editor-collapse behavior it removed.

The audit reused the 2026-08-28 Pages and object-page bundles plus the stored slash-menu and block-handle references. A live read-only pass at `1138x912` then inspected the exact supplied reference and localhost routes. The reference exposed a searchable type selector; an inline Collections selector; a Customize surface with Add Icon, Add/Fill Description, Add/Fill Aliases, Add Cover, Fill All Properties, and Wide Layout; an overflow surface with Find in Page plus the full object command families; and an inline Tags selector. The current localhost exposed broadly similar menus but also showed key divergences: Generate Title appears where the observed reference offers Add Icon, Find in Page is absent, optional Icon and Cover render as unconditional text fields, and an always-expanded Links and references authoring region displaces the reference reading composition.

The reference central content measured approximately `x=339`, `364px` wide at this viewport; its multiline title used `30px/33px` bold text. The local central content began at the same `x=339` with approximately `361px` width and the same title typography, showing that the work is not a wholesale shell rewrite. The remaining gaps are primarily composition, conditional state, transient-surface semantics, editor interactions, and vertical rhythm. Exact vendor geometry remains time-specific and must be remeasured when the apply workflow starts.

## Goals / Non-Goals

**Goals:**

- Converge the production Page surface through existing app-domain components and shared primitives.
- Keep visual, interaction, accessibility, data/state, persistence, responsive, and runtime verdicts independently testable.
- Make `+`, grip, `/`, and `@` interactions use one canonical editor command/reference pipeline with localized alias matching.
- Preserve current mention and editor-utility behavior while aligning the surrounding composition.
- Produce a privacy-bounded evidence record that can be refreshed incrementally.

**Non-Goals:**

- Matching the reference workspace's object names, counts, tags, collections, or related-content membership.
- Implementing shell, sidebar, Pages listing, or contextual graph changes owned by `audit-workspace-component-parity`.
- Copying authenticated third-party source, private state, cookies, storage, or full screenshots into the repository.
- Exercising destructive or externally visible reference mutations merely to fill the matrix.
- Introducing a second object registry, parallel editor document model, product-prefixed components, or one-off global primitive overrides.

## Decisions

### Compose one production object-page surface from canonical projections

Keep header, optional properties, editor, derived relationships, related content, and utilities as explicit regions driven by canonical entity and Structure selectors. Optional rows mount only when configured or populated; Customize commands mutate canonical presentation/property state and the same projections re-render.

Alternative considered: preserve unconditional Icon/Cover placeholders and hide them visually. Rejected because hidden placeholder fields remain incorrect focus targets and create vertical drift.

### Keep header controls compound but independently semantic

The type label/disclosure, Collections, Customize, and overflow actions retain separate named targets. Their surfaces reuse shared Popover/Dropdown/Combobox contracts with local placement props, not local surface styling. State-dependent command labels such as Pin versus Unpin come from canonical state.

Alternative considered: make the whole header row one click target. Rejected because the reference exposes distinct outcomes and the action matrix requires keyboard isolation and recoverable focus.

### Use a shared editor suggestion controller for slash and at-reference flows

Slash commands and `@` references share caret measurement, viewport clamping, keyboard navigation, dismissal, reduced-motion, and focus-recovery infrastructure while retaining separate catalogs and commit operations. Slash aliases map to one command ID; title and alias matches map to one canonical object ID. Block plus and grip remain separate from suggestion ownership.

Alternative considered: implement `@` as plain-text replacement outside the editor schema. Rejected because it would not produce stable links, backlinks, or rename-safe rendering.

### Preserve canonical block and link transactions

Plus creates one new supported block adjacent to the owning top-level block. Grip drag changes block order in one document transaction. `@` replaces only the trigger range with one stable reference transaction. Every transaction validates current block and target identity before commit and has an all-or-nothing failure path.

Alternative considered: store the visible target title in prose and infer links later. Rejected because renames would break identity and duplicate the explicit mention-conversion contract.

### Separate derived reading sections from explicit authoring

Backlinks, Mentions, embedded objects, Objects Inside, and related content are derived projections with reference-aligned conditional composition. Explicit Add relation/link/embed remains available through a named transient control placed without making an empty generic authoring panel permanently visible.

Alternative considered: remove explicit local relation authoring. Rejected because it is real product behavior; parity changes its composition, not the domain capability.

### Register evidence as a versioned action matrix

During apply, extend or create a correlated bundle under `artifacts/reference-evidence/capacities-object-page/` and link it from `docs/references/capacities-workspace-parity.md`. The manifest records source fingerprint, capture time, viewport, semantic and persisted state, refresh reason, interactions, artifacts, confidence, redactions, and limitations. Reference images are minimal sanitized crops; localhost evidence is structured DOM/style/behavior unless the user explicitly requests otherwise.

Current planning evidence registry:

| Surface | Reference observation | Local observation | Planning verdict |
| --- | --- | --- | --- |
| Header type | Search field plus eligible object types | Menu of runtime types | Interaction/geometry needs matched capture |
| Collections | Inline focused selector, current choices visible | Empty dialog shell in supplied state | Data-state differs; empty-state composition needs verification |
| Customize | Add Icon; Description and Alias add/fill; Cover; all properties; wide layout | Generate Title; Description and Alias add/fill; Cover; all properties; wide layout | Command catalog mismatch |
| Overflow | Includes Find in Page and state-appropriate Unpin plus object commands | No Find in Page; Pin in current local state | Capability plus state mismatch; pin label must follow canonical state |
| Tags | Inline selector with New, Search all, and existing tags | Inline selector with New and Search all in empty local state | Shared behavior partly aligned; matched data needed |
| Optional properties | Absent until applicable in observed reference | Icon and Cover text fields always visible | Composition mismatch |
| Relationships | Reference reading surface shows related content without generic builder | Always-expanded Links and references, Add relation, Objects Inside | Composition mismatch; preserve authoring transiently |
| `+` / grip | Stored evidence confirms independent insertion and drag/options targets | Existing block-editor implementation present | Full hover/focus/post-action verification required |
| Slash | Stored evidence confirms caret anchoring, catalog, order, aliases, and keys | Existing slash implementation present | Reverify aliases and viewport behavior |
| `@` | Exact current menu state not safely captured in this pass | Implementation coverage is incomplete or unconfirmed | Explicit evidence task; no parity claim yet |
| Mentions/utilities | Current reusable bundle confirms behavior | Focused tests previously passed | Preserve without regression |

### Verify by ownership and interaction contract

Source tests protect canonical Structure/icon/localization/shared-primitive ownership. Unit tests protect alias normalization, suggestion deduplication, block/link transactions, and relationship selectors. Browser tests run the matched action matrix at desktop and constrained viewports, including reduced motion and console inspection. A screenshot is supplementary evidence only.

Alternative considered: one full-page visual snapshot test. Rejected because it cannot prove focus, mutation isolation, persistence, or canonical identity.

## Risks / Trade-offs

- [Reference content and persisted state differ from localhost] -> Record semantic state separately and compare shared controls before judging data-dependent rows.
- [Reference generic elements have weak accessible names] -> Preserve stronger local roles and names while matching visible behavior and geometry.
- [Suggestion popups can lose caret geometry during composition or scroll] -> Use the live decoration range first, a document-position fallback second, and viewport clamping with explicit no-origin regression coverage.
- [Alias matching can create duplicate slash commands or object results] -> Normalize aliases onto stable command or object IDs before ranking and rendering.
- [Buffered input can race with a menu command or navigation] -> Flush or cancel the owning valid draft at explicit lifecycle boundaries and assert exactly-once persistence.
- [Broader parity work can collide with the in-progress shell/listing change] -> Limit implementation ownership to the central object surface and shared primitives only when the same variant is reused.
- [Authenticated mutations cannot be exhaustively exercised] -> Mark those rows not tested, inspect pre-commit states, and prove local outcomes with reversible fixtures.

## Migration Plan

1. Complete the missing matched evidence rows, especially `@`, block controls, conditional properties, and relationship/related-content states, without production edits.
2. Add focused failing domain, editor, source-contract, and browser tests for one component group at a time.
3. Align shared popup/suggestion infrastructure, then header and optional properties, editor insertion flows, and relationship composition in isolated commits.
4. Run focused tests plus typecheck, lint, responsive/reduced-motion browser checks, console checks, and strict OpenSpec validation after each group.
5. Refresh only changed evidence states and update the source-specific reference summary without overwriting prior capture identities.
6. Roll back with the isolated implementation commits if canonical editing, persistence, or relationship projections regress; evidence history remains append-only.
