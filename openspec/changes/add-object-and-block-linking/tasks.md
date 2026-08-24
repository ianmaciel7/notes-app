## 0. Evidence and dependency gate

- [ ] 0.1 Complete/isolate domain identities/relations and stable block identity before apply.
- [ ] 0.2 Re-confirm linking, block-based linking, backlinks/unlinked-mention/view references.

## 1. Graph domain

- [ ] 1.1 Define object links, block references, reverse indexes, reference counters, Objects Inside selectors, missing-target states, and cycle protection with failing-first tests.
- [ ] 1.2 Keep property-relation indexes distinct from content-link/backlink indexes.

## 2. Editor and UI

- [ ] 2.1 Add object/block link pickers, stable reference nodes, selection-link editing, embeds/transclusion, backlinks/reference counts, Objects Inside, and contextual per-object graph projection.
- [ ] 2.2 Add unlinked-mention detection/review/conversion without automatic mutation.

## 3. Acceptance

- [ ] 3.1 Browser-test rename survival, block reorder, counters, embeds/editable transclusion, backlinks, Objects Inside, contextual graph, missing targets, mention conversion, keyboard/mobile behavior, and clean console.
- [ ] 3.2 Run `pnpm verify`, relevant Playwright/parity suites, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
