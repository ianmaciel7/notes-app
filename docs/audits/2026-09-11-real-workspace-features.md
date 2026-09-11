# Runtime feature audit — 2026-09-11

## Baseline and boundaries

Inspected `dev` at `94b7b5e313fd84cc14bdbd6ca269bff9866a4cb9`. Incorporated the
concurrent changes through `c58857b5f89270d7abb7e08983f84a00bb8c710b` without
overwriting the Ladle catalog or the Quality workflow. This is a corrective delivery of confirmed local-first defects,
not a claim that every planned Capacities feature has been implemented.

Dexie/IndexedDB remains the real application data store. Test-only fake-indexeddb
and Ladle fixtures are not production mocks and have not been removed. Pending
sync mutations do not imply that a remote provider has acknowledged a write.

## Implemented corrections

| Flow | Persisted behavior |
| --- | --- |
| Object editing | Shared editor saves title, text blocks, tags and scalar properties; preserves block identity, annotations and unedited metadata. Revision checks refuse stale overwrites. |
| Flashcards | Stored front/back, answer reveal and four FSRS ratings; review state and pending sync mutation commit atomically. |
| Tasks | Complete/reopen updates saved status and completion timestamp. |
| Study goals | Deadline/retention editing and progress calculated for the selected goal's Space and target files. |
| Trash | Detail and pinned-menu deletion retain snapshots. Restore reconstructs objects and surviving relationships instead of purging the trash entry. Conflicting IDs and unrecoverable legacy entries produce errors. |
| Collections | Collection tabs filter actual membership; create-in-collection persists membership; duplication keeps existing members and rolls back on queue failure. |
| Tabs and hydration | Duplicate tab instance IDs resolve real objects/types. A scoped database snapshot prevents restoring tabs against partially loaded or previous-Space data. |
| Search | Main and side search include saved body text, tags, scalar properties and flashcard fields, including accent-insensitive matching. |
| Side panels | Real backlinks, outgoing links, shared-tag related content, local graph and search. Objects opened in the side panel render their actual per-type detail. |
| Clipboard/export | Pinned objects and collections copy actual Markdown content; failures do not report success. JSON exports contain stored object records, not just titles. Export is not a full binary-media backup. |
| Build/tooling | Fix the Base UI slider callback type, missing D3/axe development dependencies, graph theme tokens and the obsolete undeclared complexity-parser dependency. |

## Verification evidence

Local strict checks executed: full Vitest suite, `pnpm typecheck`, `pnpm build`,
and the metrics/agent-hook/Ladle-catalog tooling tests. The final complete suite
passed 369 tests in 68 files, including the database-reopen regression. Typecheck
and the production build also passed on the final source. The tooling suite
passed 25 tests. Publication verifies the patch checksum and final Git tree.

Failure-injection tests verify rollback of ordinary edits, reviews and collection
duplication. Other regressions verify stale-write rejection, cross-Space reads,
restore conflicts, collection membership and persisted data after reopening Dexie.
Source-contract tests were updated only where responsibilities moved to the scoped
snapshot reader or a placeholder was replaced by real behavior.

Global quality is **not fully green**. On the concurrent baseline, Biome lint
reported 52 errors and 13 warnings. After these changes it reported 51 errors and
13 warnings, with no newly introduced path/rule/severity diagnostic counts. Most
remaining findings concern pre-existing large functions/files and complexity.
Full formatting and metrics commands were run and their remaining repository-wide
failures must not be represented as passing gates. No limits, exclusions or
suppressions were added to conceal findings.

A Chromium browser attempt against the local app was blocked by the execution
environment with `ERR_BLOCKED_BY_ADMINISTRATOR`. No successful edit/save/reload UI
session, screenshot parity, keyboard/focus verification or complete E2E pass is
claimed. Graphify was unavailable; its generated graph was not refreshed.

## Explicitly remaining work

The following are not silently represented as complete:

- Context-menu import, type conversion, advanced settings, presentation, sharing
  and pinned-object duplication still route to unsupported/pending surfaces.
- AI chat is explicitly unavailable; live provider/account provisioning and
  end-to-end remote synchronization were not exercised.
- Rich media readers, rich-text formatting controls, complex property editors,
  and complete translations of the new controls remain outside this correction.
- Sidebar custom sections and hidden-collection preferences still need persisted
  state rather than component-only state.

Restore never fabricates missing relationships or missing legacy object content.
A relationship whose other endpoint no longer exists is skipped. Binary assets
are not embedded in the JSON object export. These limitations must remain visible
when evaluating completeness of the larger application.
