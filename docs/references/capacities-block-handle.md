---
title: Capacities block-handle reference
reference_type: authenticated-product
source_type: user-supplied-screenshot-and-archived-source
updated: 2026-08-24
confidence: confirmed
---

# Capacities block-handle reference

This reference is the acceptance evidence for the two controls shown beside a hovered editor block.

## Screenshot

- Asset: `docs/references/assets/capacities-block-handle-2026-08-24.png`
- Dimensions: **90 × 57 px**
- SHA-256: `f1d0cde8444e16504a600cd3c640941274789a1aa81bb1e7fcd14a07f20a721c`
- Origin: screenshot supplied by the user in the Notes App project conversation on 2026-08-24.

The screenshot confirms the visual pairing only: a light plus control on the left and a six-dot vertical grip on the right. It does not by itself prove behavior.

## Archived behavior evidence

The project `capacities-wacz-complete-source(1).jsonl` source contains these current Capacities strings:

- Plus control: **Click** to insert block below.
- Plus control: **Shift-click** to insert block above.
- Six-dot grip: **Drag** to move the block around.
- Six-dot grip: **Click** to show block options.

## Notes App acceptance contract

- The plus and grip are independent `18 × 22 px` hit targets.
- The plus is never a drag origin.
- Normal plus click inserts one empty paragraph below and focuses it.
- Shift-click inserts one empty paragraph above and focuses it.
- Only the six-dot grip may initiate block drag.
- A grip click without a drag opens the block-options menu.
- Completing or cancelling a drag must not produce a delayed click that opens the menu.
- Nested list content remains part of its top-level drag target in this first slice.
- Touch/coarse-pointer layouts do not mount the desktop drag control.
