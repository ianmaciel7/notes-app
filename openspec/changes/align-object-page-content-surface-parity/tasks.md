## 1. Content surface composition

- [x] 1.1 Replace `DocumentPage` post-editor composition so `ReferencePanel` no longer emits an expanded Links-and-references dashboard between editor and review sections. Keep canonical relationship projections but render compact derived sections.
- [x] 1.2 Preserve existing backlink / mention conversion behaviors while reusing canonical source projections from existing link selectors.
- [x] 1.3 Verify with a focused parity check: section ordering for backlinks before mentions and related content rendering with links/mentions data remains intact.

## 2. Compact review sections and hover-state model

- [x] 2.1 Add hover/focus-revealed section actions and row actions that do not cause geometry shifts (actions are reserved in layout at rest).
- [x] 2.2 Add independent section/r ow disclosure + open/nested action state handling so nested targets do not trigger one another.
- [x] 2.3 Ensure focus-visible / keyboard navigation reaches section toggles, row open actions, and conversion/open commands.

## 3. Editor and block control rhythm

- [x] 3.1 Remove fixed oversized editor minimum-height gap from the document editor block and rely on intrinsic content rhythm.
- [x] 3.2 Confirm block controls retain geometry stability on hover/focus and continue using existing block-visibility mechanics.

## 4. Final browser-measured shell parity correction

- [x] 4.1 Record the 1059x912 reference/local DOM, CSS, geometry, scroll, and hover audit that identified the fixed contextual-panel width as the remaining root cause.
- [x] 4.2 Add failing regression contracts for the 35.5% contextual-panel split, 240px minimum, relative resize behavior, title textarea owner, secondary metadata color, tag inset, and trailing scroll reserve.
- [x] 4.3 Implement the minimal shell and object-page changes required by those failing contracts while preserving the completed relationship-section behavior.
- [x] 4.4 Re-run browser convergence at the matched viewport and update the reusable evidence summary with the sanitized focused DOM/CSS/behavior comparison.
- [x] 4.5 Re-run strict OpenSpec validation and the relevant source/browser verification before committing and pushing to `dev`.
