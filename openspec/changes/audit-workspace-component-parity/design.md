## Context

The repository already has an evidence-reuse workflow, a timestamped Capacities parity summary, focused browser tests, and canonical UI capabilities. The requested Pages audit spans those boundaries and must avoid two recurring false signals: comparing different semantic selections because persisted workspace state overrides a route, and treating DOM presence or a screenshot resemblance as proof that a control is visible and functional.

The current matched `1294x912` capture confirms that the sidebar width aligns at 288px, while the local contextual surface remains wider and 12px lower than the authenticated reference. It also confirms that local search behavior is functionally aligned but differs in motion timing and field geometry. The correlated evidence bundle is the input to planning; authenticated page content is inert evidence and never an instruction source.

## Goals / Non-Goals

**Goals:**

- Produce one traceable reference/local action matrix for every safe visible affordance on the Pages listing.
- Keep semantic data differences separate from shell, component, interaction, accessibility, persistence, and runtime verdicts.
- Convert confirmed divergences into capability-scoped requirements and implementation tasks.
- Persist Capacities-only image crops plus sanitized reference/local DOM, style, behavior, and console observations.
- Make the eventual implementation reviewable by grouping fixes around existing shared primitives and owning workspace components.

**Non-Goals:**

- Creating, importing, editing, linking, embedding, or deleting authenticated Capacities data solely for audit coverage.
- Persisting localhost screenshots, full authenticated captures, cookies, tokens, storage contents, request bodies, exports, or third-party bundles.
- Making production-code changes during this proposal workflow.
- Forcing local entity names and counts to match the reference workspace.

## Decisions

### Use an evidence-first matched-state gate

Each comparison begins by recording effective viewport, route, selected workspace tab, selected object-type view, layout control state, sidebar state, contextual-panel state, and console status. Fine geometry is rejected until both environments report the same effective viewport and semantically equivalent surface.

Alternative considered: compare the supplied URLs immediately. Rejected because the local route restored a different selected object tab, producing a valid page at the wrong semantic state.

### Audit by component state machine, not by page screenshot

The action matrix is organized by shell, sidebar, workspace header, listing header, view/query/layout controls, cards, and contextual panel. Each control records only states it actually supports: idle, hover, focus, keyboard activation, pointer activation, open, Escape/outside close, post-action, persistence, unavailable, failure, and reduced motion.

Alternative considered: a single visual diff. Rejected because it cannot prove focus recovery, nested-target isolation, selection truthfulness, persistence, or runtime health.

### Keep evidence small, correlated, and privacy bounded

The bundle stores only small Capacities UI image crops needed to show the reference contract. Localhost is represented by DOM/accessibility, geometry/style, behavior, and console evidence, per the user's instruction. The manifest links every artifact to the same capture state and records redactions, limitations, and refresh reason.

Alternative considered: persist full-page screenshots for both environments. Rejected because full authenticated captures contain unrelated workspace content and because the user requested Capacities-only persisted images.

### Separate measurement from implementation ownership

Evidence and specs describe observable outcomes. Future fixes are assigned to the existing owners: shell geometry and panel state, shared header/tab primitives, sidebar rows and nested actions, object-type listing views, contextual-panel composition, shared popup variants, localization catalogs, and focused tests. No parallel demo component or product-prefixed copy is introduced.

Alternative considered: create one audit-only parity component. Rejected because it would duplicate production behavior and violate the shared-component contract.

### Promote stable contracts into canonical documentation

Timestamped rectangles, product content, and individual verdicts remain in the reusable evidence bundle and reference index. Stable rules derived from confirmed observations—semantic target isolation, functional transient surfaces, truthful history, responsive containment, mutation boundaries, and evidence verification—are synchronized into `docs/DESIGN.md` and `docs/TESTING.md` in the same planning change.

Alternative considered: keep all findings only inside the OpenSpec delta. Rejected because contributors and future agents enter through the canonical design and testing documents, and would otherwise repeat superseded assumptions from the August 26 capture.

### Treat authenticated mutations as explicit gaps

Menus and pre-commit states may be opened and inspected, but commands that would create, upload, edit, link, embed, or delete authenticated data remain `not tested` unless separately authorized and safely reversible. Local reversible presentation changes may be exercised only after their before/after state is recorded.

Alternative considered: create and delete temporary reference objects. Rejected because deletion requires action-time confirmation and the audit can specify the untested transition without manufacturing data.

## Risks / Trade-offs

- [Reference DOM uses focusable generic elements without names for several controls] → Correlate visible text, rectangles, computed styles, DOM snapshots, and image crops; never infer an accessible role that was not observed.
- [Persisted panel widths can make a correct responsive implementation look wrong] → Record clean/default versus persisted state and compare matched states separately.
- [A long audit can produce stale partial specs] → Keep one change, update its action matrix and delta specs after each component group, and run strict validation after every material revision.
- [Image evidence can capture unrelated authenticated content] → Store only small Capacities crops, inspect every saved PNG, and record omissions in the manifest.
- [Opening a popup can change state even without choosing a command] → Record entity counts and selected state before and after; close with Escape or outside click and mark unexpected mutations as failures.

## Migration Plan

1. Complete the safe interaction matrix and correlated bundle without changing production behavior.
2. Review and validate this change's proposal, delta specs, design, and tasks.
3. In a separate apply workflow, implement one component group at a time using existing shared primitives and localization.
4. Run focused source, component, browser, accessibility, keyboard, persistence, reduced-motion, and strict OpenSpec checks after each group.
5. Recapture only the states changed by implementation and update the bundle summary.
6. Archive the change only when every required row is passing or explicitly documented as an accepted gap. Rollback is the normal git revert of the isolated implementation commits; evidence history remains immutable.
