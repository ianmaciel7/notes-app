---
title: Capacities keyboard command system reference
reference_type: authenticated-product
source_type: reused-evidence-index
updated: 2026-08-31
confidence: partial
---

# Capacities keyboard command system reference

This document indexes the reusable evidence for the keyboard command system OpenSpec change. It intentionally separates confirmed reusable evidence from states that still require matched browser acceptance after implementation.

## Evidence bundles

- Initial bundle: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-28-initial-matrix/`
- Initial manifest: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-28-initial-matrix/manifest.json`
- Initial matrix: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-28-initial-matrix/action-matrix.md`
- Corrective bundle: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/`
- Corrective manifest: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/manifest.json`
- Corrective matrix: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/acceptance-matrix.md`
- Corrective limitations: `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/limitations.md`

## Reused sources

- `docs/references/capacities-slash-menu.md`
- `docs/references/capacities-workspace-parity.md`
- `artifacts/reference-evidence/capacities-pages-listing/2026-08-28-matched-1294x912/`
- `artifacts/reference-evidence/capacities-object-page/2026-08-28-mentions-utilities/`
- `artifacts/capacities-reference/visual-contract-2026-08-22.json`

## Coverage summary

The slash menu has confirmed reusable behavior and style evidence for trigger parsing, caret anchoring, keyboard navigation, Escape cancellation, and viewport containment. The workspace shell has confirmed reusable behavior evidence for hover, focus, click, keyboard, Escape-close, persistence, responsive containment, unavailable states, and console checks.

The corrective bundle records post-implementation localhost/browser and executable evidence with separate `local_status` and `reference_status` fields. `Mod+K`, `Mod+P`, selected-text `Mod+K`, `@`, `[[`, and `((` have local acceptance evidence, but matched authenticated Capacities parity remains unknown unless a state explicitly records `reference_status: confirmed`.

`Mod+P` browser delivery remains limited by in-app browser shortcut translation; the local contract covers the same command router path. Hover-tone matching, IME, reduced motion, responsive containment, and authenticated-reference mutation limits are recorded in the corrective limitations file rather than collapsed into a single pass verdict.

