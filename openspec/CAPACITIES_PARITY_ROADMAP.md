# Capacities parity OpenSpec roadmap

Planning snapshot: 2026-08-24.

This file orders active and newly proposed changes so implementation does not bypass domain prerequisites. It is a clean-room Notes App roadmap grounded in the project reference archive plus official Capacities documentation; it is not a claim about Capacities' private implementation.

## P0 — finish current foundations

1. `add-block-editor`
2. `add-runtime-object-type-model`
3. `align-workspace-with-current-capacities`

## P1–P6 — knowledge model

4. P1 `add-typed-property-values`
5. P2 `add-domain-identities-and-relations`
6. P3 `complete-block-document-model`
7. P4 `add-object-and-block-linking`
8. P5 `add-query-engine-and-search-index`
9. P6 `add-object-views-and-conversion`

## P7–P8 — execution, dates, and content portability

10. P7 `add-task-management`
11. P7 `add-dates-daily-notes-and-calendar`
12. P8 `add-media-storage`
13. P8 `add-import-export-pipeline`

## P9 — durable local-first platform

14. `add-workspace-database`
15. `add-account-and-spaces`
16. `add-offline-sync`

## P10 — AI and developer/integration platform

17. `add-ai-assistant`
18. `add-public-api`
19. `add-mcp-server`
20. `add-input-integrations`
21. `add-calendar-integrations`

## Evidence boundary

The canonical reference set is `capacities-wacz-completeness-audit(1).json`, `capacities-wacz-complete-source(1).jsonl`, `my-archiving-session (1)(1).wacz`, `my-archiving-session(2).wacz`, and `reference-urls.json` when available to the implementation environment. The archive audit establishes complete recoverability of captured response payloads by SHA-256 but not bit-for-bit WACZ reconstruction; request bodies, selected resource payloads/private headers/revisit resolution/original package bytes are incomplete. Official public documentation is normative for externally documented semantics, while private backend details remain `UNKNOWN` unless independently evidenced.

## Apply rule

Each change must re-confirm its predecessors, reference sources, migration/rollback boundary, tests, strict OpenSpec validation, and staged diff before implementation is marked complete. A later change may not silently absorb an unfinished predecessor's responsibilities.
