# Capacities parity OpenSpec roadmap

Planning snapshot: 2026-08-30. Repository baseline: `dev` at `e2b7d4fb01d46026df9459134d37e1095559bd6c`.

This roadmap is a clean-room Notes App plan grounded in current official Capacities documentation, sanitized authenticated evidence, the project WACZ/JSONL reference corpus, and current local code/specs. It describes observable behavior and does not claim access to Capacities' private implementation.

## Evidence boundary

Canonical project reference files:

- `capacities-urls.txt.txt` — current 196-page documentation inventory captured for this audit.
- `reference-urls.json` — older dated inventory with 154 Capacities URLs; retained for provenance, not current completeness.
- `capacities-wacz-completeness-audit(1).json`
- `capacities-wacz-complete-source(1).jsonl`
- `my-archiving-session (1)(1).wacz`
- `my-archiving-session(2).wacz`

Current official indexes:

- `https://docs.capacities.io/llms.txt`
- `https://docs.capacities.io/llms-full.txt`
- `https://docs.capacities.io/sitemap.xml`
- `https://docs.capacities.io/robots.txt`

Official public documentation is normative for documented semantics. Sanitized authenticated evidence supports visible historical behavior. Local code/tests define Notes App behavior. Inference must be labeled. Private algorithms and protocols remain `UNKNOWN`.

The JSONL corpus preserves all captured response payloads by SHA-256 according to its audit, but it is not a bit-for-bit WACZ reconstruction. Request bodies, selected resource-image payloads, warcinfo bodies, revisit resolution, exact private headers, and original package bytes have documented fidelity limits.

## Implemented and archived

1. Block editor first slice
2. Runtime object type model
3. Typed property values
4. Domain identities and relations
5. Stable block document identity
6. Object and block linking
7. Query engine and search index
8. Object views and conversion
9. Task management first slice
10. Dates, daily notes, and local calendar
11. Media storage first slice
12. Import/export pipeline
13. Workspace database
14. Account and Spaces
15. Offline sync
16. Keyboard command system first slice

These entries describe completed first slices, not full Capacities parity.

## Implemented but requiring acceptance reconciliation

### P0 `reconcile-keyboard-command-system-acceptance`

Reconcile the archived keyboard-command task status, `241/243` test record, blocked repository verification, stale evidence manifest/limitations, and obsolete change references before the delivery is treated as fully accepted.

## Active work to finish before broad parity claims

### P0 `audit-workspace-component-parity`

Complete the remaining help/footer, Space switcher, theme/profile/share, and left-sidebar collapse task, then rerun the full evidence and verification gate.

### P0 `align-object-page-mentions-and-editor-tools`

Complete source-oriented unlinked mentions, relationship section composition, and the Structure/Statistics utility panel. The implemented `@`, `[[`, and `((` triggers are foundations, not substitutes for this change.

### P0 `configure-ci-cd`

Finish the repository delivery pipeline required to make verification status visible and repeatable.

## Reference and planning correction

### P0 `refresh-capacities-parity-baseline`

Create the current source inventory, provenance model, functional-gap matrix, and roadmap consistency checks. This change precedes implementation of new parity gaps.

## Keyboard and editor

### P1 `complete-keyboard-command-surface`

Depends on `reconcile-keyboard-command-system-acceptance`. Complete registry-backed application/navigation/page/calendar commands, extended search, find in page, shortcut browser, and shared sidebar hints.

### P2 `add-editor-object-and-tag-triggers`

Depends on the keyboard command foundation and stable linking. Add `+` quick creation and `#` tag lookup/create through the shared suggestion controller.

### P2 `complete-advanced-block-catalog`

Depends on stable block identity/linking. Add toggle/emoji interfaces, highlight, language-aware code/Mermaid, math, group, multi-column/grid, and complete object block views. Table Block remains separate.

## Tasks and lifecycle

### P1 `align-task-management-with-current-capacities`

Replace closed legacy task status/priority semantics, correct dashboards, and add current documented recurrence, deadline advancement, catch-up, history, statistics, and migration.

### P1 `add-trash-lifecycle`

Add recoverable 30-day object Trash, restore, permanent delete, Empty Trash, automatic cleanup, projection isolation, media safety, and sync tombstones.

## Discovery and views

### P2 `add-related-content`

Add a ranked provider contract, transparent Notes App local strategy, inline top-five results, side-panel continuation, privacy, cache, and offline semantics. Capacities' private ranking algorithm remains `UNKNOWN`.

### P2 `align-object-dashboard-sections-and-view-customization`

Separate sidebar and dashboard sections; add All/built-in/collection/query section identities, small-card property configuration, and table-view column customization.

## Tables and numbers

### P2 `add-table-block-editor`

Add the structured Table Block domain and editor, Markdown paste, CSV export, keyboard/pointer operations, and atomic conversion to Table Object.

### P3 `add-number-formatting`

Add raw/display separation and number, percent, currency, and progress presentation across properties and views.

### P3 `add-table-formulas`

Depends on `add-table-block-editor` and `add-number-formatting`. Add a bounded formula language, stable references, dependencies, errors, recalculation, and the documented initial function catalog.

## Media

### P1 `align-media-upload-limit`

Replace the current 50 MiB default with an explicit 100,000,000-byte product policy shared by all ingestion paths. Monthly and total plan quotas remain out of scope until a separate account/quota capability exists.

## Existing P10 platform changes

1. `add-ai-assistant`
2. `add-public-api`
3. `add-mcp-server`
4. `add-input-integrations`
5. `add-calendar-integrations`

These remain active planned changes and must reuse the completed canonical domain/application services rather than create parallel persistence paths.

## Intentional Notes App divergences

- Native import/export may preserve more reconstructable state than Capacities' documented export behavior.
- Public API and MCP are Notes App-native and do not claim wire compatibility.
- Related Content ranking is implementation-owned unless independently specified; only its observable UI contract is a parity target.
- Deployment limits may be stricter than reference limits when they are disclosed truthfully.

## Apply rule

Before implementation, every change must:

1. confirm its current `dev` base and active/archived predecessor state;
2. re-check the relevant official documentation pages and project reference files;
3. label source-derived, local, inferred, and unknown behavior separately;
4. define migration, rollback, offline/sync, security, accessibility, localization, and performance boundaries;
5. use failing tests before behavior changes;
6. pass focused tests, full repository verification, strict OpenSpec validation, and staged diff review;
7. update this roadmap when status or dependencies change.
