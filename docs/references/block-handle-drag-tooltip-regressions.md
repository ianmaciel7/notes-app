---
title: Notes App block-handle drag and tooltip regressions
reference_type: implementation-regression
source_type: user-supplied-screenshots-plus-capacities-archive
updated: 2026-08-24
confidence: confirmed
---

# Block handle drag, position, and tooltip regressions

These screenshots record Notes App regressions discovered while comparing `feat/block-editor` with the authenticated Capacities reference archive. They are bug evidence, not target-product screenshots.

## Regression screenshots

- `docs/references/assets/block-handle-position-regression-2026-08-24.webp`
  - source PNG: 1000 × 172 px
  - source SHA-256: `14fe653c5f650d746e5d20b94f49e67661a0a079dc67de95de14146324297f0c`
  - WebP SHA-256: `6a3b5fa46e009c378cd6402f2360bf297eb3d758157831ed4ad62d81419d27d4`
  - regression: the handle could appear at the far/right side rather than immediately left of the hovered text block.

- `docs/references/assets/block-drag-dropcursor-regression-2026-08-24.webp`
  - source PNG: 1071 × 249 px
  - source SHA-256: `452f36b3131e734c8a64c84fef276ff1b95d3c0e841c7fa32e7a9f269876e143`
  - WebP SHA-256: `d5c4b18875ac9f4e317ae189ce19532f9a446f58509de86001ac5200431ff5e6`
  - regression: the drag/drop indicator was visually too dark/prominent and the handle moved into the drop-target area.

## Capacities target evidence

The canonical archived source confirms:

- top-level handle container: immediately to the left of the block (`right-full top-0`), 100 ms opacity transition;
- plus: independent 18 × 22 px hit target offset left of the grip;
- grip: independent 18 × 22 px draggable surface with `cursor: grab` and global `grabbing` feedback while dragging;
- plus tooltip: **Click** to insert below; **Shift-click** to insert above;
- grip tooltip: **Drag** to move the block; **Click** to show block options.

## Acceptance contract

- The grip is positioned flush immediately left of the hovered top-level block; plus sits another 16 px to its left.
- The inner grip button is not a second native draggable element; the Tiptap DragHandle root remains the sole native draggable owner.
- Only a pointer gesture that begins on the six-dot grip may allow the root drag to start.
- The drop cursor is a subtle neutral state indicator, not a heavy black horizontal rule.
- During a drag the editor uses a grabbing cursor and the source handle does not jump to the current drop target.
- Native browser `title` tooltips are not used for the two controls; localized Base UI/shadcn tooltips render the evidence-backed multi-line text.
