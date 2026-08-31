## Context

See `proposal.md` for motivation and the three delta specs for the observable contract. The current production route composes `ObjectPageHeader`, title and metadata inputs, a Block Editor with a large minimum height, an always-expanded `ReferencePanel`, and a separately styled `RelatedContent` section. The authenticated reference instead keeps the same concerns in one compact flow and reveals most secondary controls through hover/focus-within without changing geometry.

The reusable `2026-08-28-mentions-utilities` evidence already proves mention direction, source previews, conversion, and the editor utility. It does not cover the complete object-page surface, the three Related content rows shown by the user, or all header/section/row hover states at the current 1329x912 browser viewport. A live refresh confirmed those missing states and also confirmed the local route still renders `Links and references`, `Add relationship`, an editable embed, and `Objects inside` as a large intervening region.

The repository already owns canonical Structures, entity relations, related-content selection, target-oriented mentions, explicit mention conversion, block documents, buffered commits, shared compound chips, popup primitives, central object icons, and localization. The design must reuse those owners, preserve unrelated dirty working-tree changes, and avoid a parallel reference-only Page implementation.

## Goals / Non-Goals

**Goals:**

- Make the production Page composition and each visible interaction state measurably converge on the matched reference.
- Keep one canonical relationship model while changing where review and authoring controls are projected.
- Make hover and focus reveals explicit, reserved, accessible, reduced-motion-safe state machines.
- Preserve responsive containment, input performance, offline behavior, and exact-once persistence.
- Leave a reusable evidence/action matrix that can drive iterative OpenSpec updates and implementation passes.

**Non-Goals:**

- Copying authenticated Capacities content, identifiers, inaccessible generic-element semantics, or weak accessible names.
- Removing canonical links, embeds, Objects inside, backlinks, graph edges, or their explicit authoring/contextual destinations.
- Reworking the workspace shell beyond the measured main/context split needed for the selected object-page surface, or changing the sidebar, graph panel, object-type listing, or unrelated side-panel behavior.
- Introducing a new relation schema, storage migration, remote service, or dependency.
- Exercising destructive, share, export, or authenticated mutation commands against the user's Capacities data merely to prove their labels.

## Decisions

### Compose one production Page flow from existing owners

`DocumentPage` remains the sole Page route owner, but its children will be organized into four explicit zones: compact object header and inline metadata; intrinsic-height editor; derived relationship review sections; editor utility edge control. The generic main-flow `ReferencePanel` will no longer sit between editor and review sections. Its canonical data and authoring behavior stay available through the explicit editor or contextual commands that already own link, embed, Objects inside, backlinks, and graph behavior.

Alternative considered: restyle the current `ReferencePanel` card and reduce its margins. Rejected because its content ordering, always-visible authoring action, embed editor, Objects inside ownership, and empty-state behavior remain structurally unlike the observed Page.

### Keep relationship data canonical and project compact section view models

Existing selectors remain authoritative. A small presentation projection will normalize each applicable section into a heading/count/help/action model and each row into stable identity, title, type identity, preview, disclosure, open, overflow, and optional conversion actions. Related content and Mentions retain separate semantics; converting a mention updates the canonical relation once and lets selectors update counts and rows.

Alternative considered: create Page-local arrays specifically shaped like the screenshot. Rejected because they would duplicate canonical relation state, drift after conversion or rename, and violate the Structure/data ownership contract.

### Reserve geometry for quiet and hover-revealed actions

Header, section, and row primitives will reserve their final action footprint at rest and vary only opacity, pointer events, colors, border, and background across idle, parent-hover, direct-hover, focus-within, pressed, and open states. Nested actions stay real buttons or links with localized names; primary targets never contain overlapping sibling activation regions. Reference measurements become named shared variants when the same 26px header control, 28px section action, 22px row action, or 269px popup pattern repeats.

Alternative considered: absolutely add controls only after hover. Rejected because it causes geometry/focus-order instability and makes touch/keyboard behavior harder to keep truthful.

### Use explicit disclosure state per review section and row

Related content and Mentions headings own independent collapsed state, and every preview-capable row owns independent expanded state keyed by stable entity or mention-range identity. Opening a nested menu does not toggle disclosure; navigating does not open the menu; inspecting a mention does not convert it. Section disclosure may remain presentation-local unless the reference evidence proves durable persistence.

Alternative considered: one shared expanded flag or click-anywhere row target. Rejected because the live reference exposes independent section and nested row targets and because a shared flag would collapse unrelated content.

### Match the object surface inside the reference workspace split

The authenticated 1059x912 capture shows the main Page card at about 474px and the contextual panel at about 277px after the 288px sidebar and gutters are applied. The local route used a fixed contextual panel, compressing the main card and forcing the Related content heading and row actions into a different layout. The shell will therefore use a 35.5% default contextual panel with a lower 240px minimum and relative resize preservation, while keeping the overlay breakpoint and left sidebar contract unchanged.

The object Page will also reserve the reference trailing scroll range inside the main scroll container so the selected content surface keeps the same scrollbar gutter and bottom rhythm even when the visible content is short. The Page title uses the reference-like single-row textarea owner rather than an input so geometry, font metrics, selection behavior, and autosizing remain aligned with the reference title field.

### Let editor content determine vertical size

The Page editor will use an intrinsic short-content and measured empty-state minimum instead of the current large fixed minimum. Block handle gutters remain outside the text measure. Buffered commit boundaries, undo, block ids, slash commands, and editor utilities do not change; relationship projection recomputation occurs from accepted document state rather than inside the keystroke path.

Alternative considered: compensate with negative margins on following sections. Rejected because it would overlap longer documents, obscure the real minimum-height cause, and create viewport-specific screenshot fixes.

### Drive implementation through red-green parity slices

Each implementation slice starts with a failing source/unit/browser contract for one observable mismatch, verifies the failure reason, applies the smallest production change, and reruns the focused test before proceeding. The slices are: matched evidence and baseline; header/metadata states; intrinsic editor rhythm; review-section composition; row/nested actions; responsive/reduced-motion/persistence; final visual convergence. Existing broad tests remain a regression net but do not substitute for the focused failure.

Alternative considered: rewrite the entire component and add screenshots afterward. Rejected because it would make regressions difficult to localize and could silently overwrite the completed mention/utility behavior.

### Refresh evidence incrementally and preserve unsafe boundaries

A new dated object-page bundle will extend, not replace, the August 28 capture. It will store the smallest sanitized reference DOM/style/behavior and image artifacts needed for baseline, header hover/open, section hover/collapse, and row hover/menu states, plus structured localhost observations and the action matrix. Destructive, sharing, exporting, duplicating, deleting, and remote content mutation remain explicitly untested unless isolated disposable evidence and action-time authorization exist.

Alternative considered: treat the supplied screenshots as sufficient. Rejected because they do not prove hover, focus, open/close, post-click, transition, persistence, or console behavior.

## Risks / Trade-offs

- [Removing the main `ReferencePanel` could hide a local authoring path] → Inventory every current authoring action first, map it to an explicit editor/contextual owner, and add a browser contract before removing the projection.
- [Related-content semantics may differ from the user's three reference rows] → Align deterministic local fixtures by semantic relation type and compare shell/row behavior separately from user-specific titles and counts.
- [Hover-only actions can become unreachable on touch] → Keep keyboard/focus-within access and provide the same nested actions through visible touch/open-state affordances.
- [Intrinsic editor sizing can regress empty or long documents] → Cover empty, one-block, multi-block, and long-scroll fixtures at desktop and narrow widths before removing the old minimum.
- [Nested controls can trigger each other] → Use sibling targets, stop propagation only at explicit ownership boundaries, and assert exactly one route/state/count effect per activation.
- [Current dirty files overlap the broad parity test] → Preserve existing edits, add focused cases without rewriting unrelated assertions, and report any conflict before touching an overlapping hunk.
- [Reference DOM sometimes lacks strong semantics] → Match visible geometry and behavior while retaining buttons, links, regions, accessible names, focus rings, and reduced-motion behavior.
- [Pixel measurements can become brittle across browser rendering] → Centralize confirmed constants, assert bounded geometry and no-shift invariants, and supplement numeric checks with semantic/behavior evidence.
- [Responsive shell constants affect other workspace surfaces] → Constrain the change to the contextual panel default/minimum and preserve the existing overlay/mobile breakpoint, resize handles, and panel collapse behavior.

## Migration Plan

1. Extend the reusable evidence bundle and action matrix for the exact user-selected surface, current viewport, hover states, open states, and safe reversible interactions.
2. Add focused failing contracts for the current generic dashboard, oversized editor gap, missing section disclosure/action states, and row target ownership.
3. Introduce shared object-page header, review-section, and review-row presentation variants without changing canonical relation data.
4. Recompose `DocumentPage`, remove the generic main-flow projection, and reduce editor sizing from fixed to content-aware behavior.
5. Align nested menus, help/reveal actions, focus recovery, reduced motion, localization, responsive containment, persistence, and input performance.
6. Correct the responsive main/context split, title textarea owner, secondary text token, tag inset, and trailing scroll reserve when measured evidence proves the component alone cannot match the selected surface.
7. Run up to five measured browser convergence iterations, updating the planning artifacts only when evidence changes the accepted design rather than hiding a mismatch in code.
8. Run focused and repository verification, strict OpenSpec validation, inspect the final diff against the unrelated dirty baseline, and update the evidence summary.

Rollback is a normal revert of the isolated Page composition, shared-style, locale, and test changes. No data rollback is required because this design introduces no persistence migration and leaves canonical relations unchanged.
