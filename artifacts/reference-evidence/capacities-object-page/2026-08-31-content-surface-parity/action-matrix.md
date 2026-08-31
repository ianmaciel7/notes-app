# Object Page Content Surface Action Matrix

| Action | Expected reference state | Observed localhost state | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| Open Page at 1059x912 | Main card about 474px, contextual panel about 277px, content title about 390px. | Contract asserts main 470-478px, side surface 260-286px, title 386-394px. | Pass | `workspace-parity.spec.ts`, object page 1059px split test. |
| Title idle/edit | Title owner is a single-row textarea using 30px/33px bold typography. | Local title is a buffered autosizing textarea with matching metrics. | Pass | `workspace-object-page-title` DOM/geometry assertions. |
| Tags metadata idle | Tags group is slightly inset left of the content column and uses reference secondary text. | Local group offset is -8 to -4px from title x; input color is `oklch(0.3887 0.0052 301.05)`. | Pass | Focused Playwright color and offset assertions. |
| Header hover | Customize appears from reserved geometry without moving overflow. | Local `Personalizar` is pointer-disabled/opacity-zero at rest and reveals on header hover/focus-within. | Pass | Header hover tests and source contract. |
| Related row hover/menu | Row actions reveal only for the row; heading-only actions stay hidden. | Local row hover/menu/focus recovery and no geometry shift asserted. | Pass | Relationship review section e2e. |
| Mention conversion | Source row converts only through explicit action. | Local conversion creates one canonical object link and removes the unlinked mention projection. | Pass | Mention conversion e2e. |
| Destructive/share/export authenticated commands | Not safely exercised against the reference. | Local commands remain explicit but are not inferred as reference-passing. | Not tested | Unsafe boundary recorded in manifest. |
