---
title: Capacities functional gap audit
reference_type: mixed-official-authenticated-local
updated: 2026-08-30
repository_branch: dev
repository_commit: e2b7d4fb01d46026df9459134d37e1095559bd6c
confidence: high-for-documented-and-local-state
---

# Capacities functional gap audit — 2026-08-30

## Purpose

This document records the source-grounded comparison used to create the current OpenSpec correction backlog. It is a planning and provenance artifact, not a claim about Capacities' private implementation.

## Sources

### Current official documentation

- `https://docs.capacities.io/llms.txt`
- `https://docs.capacities.io/llms-full.txt`
- `https://docs.capacities.io/sitemap.xml`
- `https://docs.capacities.io/reference/shortcuts`
- `https://docs.capacities.io/reference/search`
- `https://docs.capacities.io/reference/blocks`
- `https://docs.capacities.io/reference/block-based-linking`
- `https://docs.capacities.io/reference/task-management`
- `https://docs.capacities.io/reference/trash`
- `https://docs.capacities.io/reference/related-content`
- `https://docs.capacities.io/reference/sections`
- `https://docs.capacities.io/reference/small-card-view-customization`
- `https://docs.capacities.io/reference/table-view-customization`
- `https://docs.capacities.io/reference/tables`
- `https://docs.capacities.io/reference/number-formatting`
- `https://docs.capacities.io/misc/media-upload`

### Project reference files

- `capacities-urls.txt.txt` — 196 current documentation URLs.
- `reference-urls.json` — dated older inventory containing 154 Capacities URLs.
- `capacities-wacz-completeness-audit(1).json`
- `capacities-wacz-complete-source(1).jsonl`
- `my-archiving-session (1)(1).wacz`
- `my-archiving-session(2).wacz`

The completeness audit confirms all 405 captured response payloads are recoverable from 309 deduplicated response resources and that all 826 WARC records are represented as metadata. It also records missing exact fidelity for four resource image payloads, 60 request bodies, two warcinfo bodies, five revisit resolutions, selected private headers, URL sanitization coverage, and original ZIP/WARC bytes.

## Repository changes since the previous baseline

`dev` advanced from `afd399b5571275601275ba53460407c7d86369c7` to `e2b7d4fb01d46026df9459134d37e1095559bd6c`.

Implemented additions include:

- central command registry and shortcut resolver;
- `Mod+K` and `Mod+P` command palette;
- ranked object/block search with exact and leading modes;
- editor suggestions for `@`, `[[`, and `((`;
- Tasks navigation in the sidebar;
- broad shell, contextual-panel, header, tab, Pages-listing, responsive, keyboard, and accessibility parity corrections.

## Current verdicts

| Area | Current verdict | Planned corrective change |
| --- | --- | --- |
| Keyboard command foundation | Implemented; acceptance artifacts inconsistent | `reconcile-keyboard-command-system-acceptance` |
| Full command/shortcut surface | Partial | `complete-keyboard-command-surface` |
| `@`, `[[`, `((` editor references | Implemented | none for the existing triggers |
| `+` and `#` editor triggers | Missing | `add-editor-object-and-tag-triggers` |
| Workspace shell/listing parity | Nearly complete; one active task remains | continue `audit-workspace-component-parity` |
| Mentions and editor utility panel | Active | continue `align-object-page-mentions-and-editor-tools` |
| Advanced block catalog | Missing beyond first slice | `complete-advanced-block-catalog` |
| Task domain | First slice only; status, priority, dashboards, recurrence, and stats diverge | `align-task-management-with-current-capacities` |
| Trash | Missing | `add-trash-lifecycle` |
| Related Content | Structural helper exists; ranked provider contract missing | `add-related-content` |
| Dashboard sections and view customization | Partial | `align-object-dashboard-sections-and-view-customization` |
| Table Block | Missing | `add-table-block-editor` |
| Number formatting | Missing | `add-number-formatting` |
| Table formulas | Missing | `add-table-formulas` |
| Media per-file limit | Local default 50 MiB; reference 100 MB | `align-media-upload-limit` |
| AI/API/MCP/input/calendar integrations | Planned active changes | continue existing changes |

## Important corrections to earlier conclusions

- The keyboard command system, `@`, `[[`, and `((` are no longer missing.
- Workspace visual parity is not broadly untouched; most audited tasks are complete, but the active change must finish its final sidebar/footer task.
- Related Content must not be specified as Capacities-compatible embeddings or semantic ranking. The observable result contract is documented; the private ranking algorithm remains `UNKNOWN`.
- Local browser acceptance is not matched reference parity unless both evidence axes are present.
- The archived keyboard-command change cannot be considered internally reconciled while `tasks.md`, implementation notes, and evidence manifests disagree.

## OpenSpec backlog created from this audit

1. `reconcile-keyboard-command-system-acceptance`
2. `refresh-capacities-parity-baseline`
3. `complete-keyboard-command-surface`
4. `add-editor-object-and-tag-triggers`
5. `complete-advanced-block-catalog`
6. `align-task-management-with-current-capacities`
7. `add-trash-lifecycle`
8. `add-related-content`
9. `align-object-dashboard-sections-and-view-customization`
10. `add-table-block-editor`
11. `add-number-formatting`
12. `add-table-formulas`
13. `align-media-upload-limit`

## Security and clean-room boundary

No cookies, authorization headers, signed URLs, raw authenticated HTML, private object content, account identifiers, or complete third-party bundles are copied into this document. Network observations support visible contracts only. Private backend behavior remains unknown unless independently documented.
