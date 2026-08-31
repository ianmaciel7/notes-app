---
title: Capacities functional gap audit
reference_type: mixed-official-authenticated-local
updated: 2026-08-31
repository_branch: dev
repository_commit: e051c166fb85da5e72f50caede3621626487a956
confidence: high-for-documented-and-local-state
---

# Capacities functional gap audit - 2026-08-31

## Purpose

This document records the source-grounded comparison used to refresh the Capacities parity backlog. It is a planning and provenance artifact, not a claim about Capacities private implementation.

## Sources

### Current official documentation

- `https://docs.capacities.io/llms.txt`
- `https://docs.capacities.io/llms-full.txt`
- `https://docs.capacities.io/sitemap.xml`
- `https://docs.capacities.io/robots.txt`
- `https://docs.capacities.io/reference`
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
- `https://docs.capacities.io/reference/import`
- `https://docs.capacities.io/reference/basic-types/files`
- `https://docs.capacities.io/misc/media-upload`
- `https://docs.capacities.io/developer/model-context-protocol`

### Project reference files

- `docs/references/capacities-reference-baseline-2026-08-31.md`
- `docs/references/capacities-workspace-parity.md`
- `docs/references/capacities-keyboard-command-system.md`
- `artifacts/reference-evidence/`
- `artifacts/capacities-reference/`
- `capacities-urls.txt.txt` - external project reference for 196 current documentation URLs.
- `reference-urls.json` - external dated legacy inventory containing 154 Capacities URLs.
- `capacities-wacz-completeness-audit(1).json`
- `capacities-wacz-complete-source(1).jsonl`
- `my-archiving-session (1)(1).wacz`
- `my-archiving-session(2).wacz`

## Repository state

`dev` is currently at `e051c166fb85da5e72f50caede3621626487a956`.

Canonical specs exist for:

- developer workflows: frontend stack, OpenSpec enforcement, reference evidence;
- docs: practical workflow;
- domain: account and spaces, block document model, dates/daily notes/calendar, identities and relations, import/export, media storage, object and block linking, offline sync, query/search index, runtime object types, task management, typed property values, workspace database;
- UI: app header, app shell, app sidebar, block editor, Capacities English fidelity, keyboard command system, object lifecycle, object views and conversion.

## Current verdicts

| Area | Current verdict | Planned corrective change | Evidence class |
| --- | --- | --- | --- |
| Keyboard command foundation | Implemented; acceptance artifacts inconsistent | `reconcile-keyboard-command-system-acceptance` | local-code-test-evidence |
| Full command/shortcut surface | Partial | `complete-keyboard-command-surface` | official-documentation plus local-code-test-evidence |
| `@`, `[[`, and `((` editor references | Implemented first slice | none for existing triggers | local-code-test-evidence |
| `+` and `#` editor triggers | Missing | `add-editor-object-and-tag-triggers` | official-documentation plus local-code-test-evidence |
| Workspace shell/listing parity | Active; 21/22 tasks complete | continue `audit-workspace-component-parity` | authenticated-observation plus sanitized-archive-evidence |
| Object page complete parity | Active broad parity gap | `align-object-page-complete-parity` | authenticated-observation plus local-code-test-evidence |
| Mentions and editor utility panel | Implemented tasks complete; pending archive/reconciliation with broader object-page work | `align-object-page-mentions-and-editor-tools` | authenticated-observation plus local-code-test-evidence |
| Advanced block catalog | Missing beyond first slice | `complete-advanced-block-catalog` | official-documentation |
| Task domain | First slice only; status, priority, dashboards, recurrence, and stats diverge | `align-task-management-with-current-capacities` | official-documentation plus local-code-test-evidence |
| Trash | Missing recoverable lifecycle | `add-trash-lifecycle` | official-documentation |
| Related Content | Structural helper exists; ranked provider contract missing | `add-related-content` | official-documentation plus inference |
| Dashboard sections and view customization | Partial | `align-object-dashboard-sections-and-view-customization` | official-documentation plus local-code-test-evidence |
| Table Block | Missing | `add-table-block-editor` | official-documentation |
| Number formatting | Missing full display contract | `add-number-formatting` | official-documentation |
| Table formulas | Missing | `add-table-formulas` | official-documentation |
| Media per-file limit | Active; implementation partly complete | `align-media-upload-limit` | official-documentation plus local-code-test-evidence |
| AI assistant | Planned | `add-ai-assistant` | official-documentation plus local planning evidence |
| Public API | Planned Notes App-native platform work | `add-public-api` | local planning evidence |
| MCP server | Planned Notes App-native platform work | `add-mcp-server` | official-documentation plus local planning evidence |
| Input integrations | Planned provider adapters | `add-input-integrations` | local planning evidence |
| Calendar integrations | Planned provider adapters | `add-calendar-integrations` | official-documentation plus local planning evidence |
| CI/CD | Active platform verification work | `configure-ci-cd` | local-code-test-evidence |

## Important corrections

- The keyboard command foundation is not missing; it needs acceptance reconciliation because the archived change artifacts and verification records disagree.
- Workspace visual parity is not broadly untouched; the active component parity change has one remaining task and still needs final evidence/verification.
- `align-object-page-mentions-and-editor-tools` reports complete tasks but has not been archived into canonical specs in this repository snapshot.
- Related Content must not be specified as Capacities-compatible embeddings or private semantic ranking. The observable result contract is documented; Capacities private ranking remains `UNKNOWN`.
- A local browser pass is not matched reference parity unless official/reference evidence and local evidence both cover the same route, viewport, semantic state, and interaction state.
- Media limit parity is active: core policy work is partly implemented, while UI reporting, ingestion-surface evidence, strict OpenSpec validation, and broad verification remain open.

## Priority order

1. `refresh-capacities-parity-baseline`
2. `reconcile-keyboard-command-system-acceptance`
3. `audit-workspace-component-parity`
4. `align-object-page-complete-parity`
5. `complete-keyboard-command-surface`
6. `align-task-management-with-current-capacities`
7. `add-trash-lifecycle`
8. `align-media-upload-limit`
9. `add-editor-object-and-tag-triggers`
10. `complete-advanced-block-catalog`
11. `add-related-content`
12. `align-object-dashboard-sections-and-view-customization`
13. `add-table-block-editor`
14. `add-number-formatting`
15. `add-table-formulas`

Platform integrations remain active but should not block visible prototype parity unless their user-facing surface is selected for implementation.

## Security and clean-room boundary

No cookies, authorization headers, signed URLs, raw authenticated HTML, private object content, account identifiers, or complete third-party bundles are copied into this document. Network observations support visible contracts only. Private backend behavior remains unknown unless independently documented.
