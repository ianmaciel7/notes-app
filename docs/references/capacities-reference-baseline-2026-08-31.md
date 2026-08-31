---
title: Capacities reference baseline
reference_type: official-sanitized-local
updated: 2026-08-31
repository_branch: dev
repository_commit: e051c166fb85da5e72f50caede3621626487a956
official_documentation_count: 196
legacy_documentation_count: 154
confidence: high-for-source-inventory-and-limitations
---

# Capacities reference baseline - 2026-08-31

## Purpose

This is the canonical source inventory for clean-room Capacities parity work in Notes App. It records current public documentation indexes, project-held reference evidence, local OpenSpec/code evidence, provenance labels, and known limitations. It does not claim access to Capacities private implementation, storage, ranking, or backend contracts.

## Source precedence

1. Current official public documentation is normative for documented semantics.
2. Current authenticated observations are evidence for visible behavior when safely captured and sanitized.
3. Sanitized WACZ and JSONL evidence supports historical UI and network observations within the audit limits below.
4. Notes App canonical specs and `dev` code define local behavior.
5. Inference is advisory and must be labeled.
6. Unobserved private behavior remains `UNKNOWN`.

Newer sources do not automatically override more specific evidence. Conflicts must be recorded with source dates and scope.

## Source families

| Source family | Source kind | Checked date | Status | Scope | Limitations |
| --- | --- | --- | --- | --- | --- |
| `https://docs.capacities.io/llms.txt` | official documentation index | 2026-08-31 | current public index | Machine-readable documentation discovery. | Direct local fetch was blocked by sandbox network permissions in this run; use the official URL as the canonical refresh source. |
| `https://docs.capacities.io/llms-full.txt` | official documentation index | 2026-08-31 | current public index | Full public documentation corpus for semantic review. | Direct local fetch was blocked by sandbox network permissions in this run; do not treat cached excerpts as complete page content. |
| `https://docs.capacities.io/sitemap.xml` | official documentation index | 2026-08-31 | current public index | URL discovery, redirects, removals, and sitemap coverage. | Direct local fetch was blocked by sandbox network permissions in this run. |
| `https://docs.capacities.io/robots.txt` | official documentation index | 2026-08-31 | current public index | Crawl policy and public discovery context. | Direct local fetch was blocked by sandbox network permissions in this run. |
| `capacities-urls.txt.txt` | official documentation URL inventory | 2026-08-31 | external project reference file | 196 normalized public documentation pages derived from official indexes. | File is referenced by planning artifacts but is not stored in this repository. Re-import from official indexes before new parity work. |
| `reference-urls.json` | legacy URL inventory | 2026-08-31 | external project reference file | Older dated inventory containing 154 Capacities URLs. | Historical provenance only; not current completeness. |
| `capacities-wacz-completeness-audit(1).json` | sanitized archive evidence | 2026-08-31 | external project reference file | Completeness audit for captured WARC metadata and response resources. | Records response-payload completeness only within its published limits. |
| `capacities-wacz-complete-source(1).jsonl` | sanitized archive evidence | 2026-08-31 | external project reference file | Deduplicated captured response payload corpus. | Not a bit-for-bit WACZ reconstruction. |
| `my-archiving-session (1)(1).wacz` | authenticated archive evidence | 2026-08-31 | external project reference file | Historical authenticated capture input. | Must not be republished; use only through sanitized summaries or audits. |
| `my-archiving-session(2).wacz` | authenticated archive evidence | 2026-08-31 | external project reference file | Historical authenticated capture input. | Must not be republished; use only through sanitized summaries or audits. |
| `docs/references/capacities-functional-gap-audit-2026-08-31.md` | local code/test evidence | 2026-08-31 | current repository file | Functional gap matrix for active parity planning. | Planning evidence, not product implementation. |
| `openspec/CAPACITIES_PARITY_ROADMAP.md` | local planning evidence | 2026-08-31 | current repository file | Current parity roadmap, dependencies, priorities, and intentional divergences. | Must be updated when active or archived change state changes. |
| `artifacts/reference-evidence/` | sanitized archive evidence | 2026-08-31 | current repository path | Reusable UI, DOM, CSS, behavior, and manifest evidence. | Coverage is route, viewport, semantic-state, and interaction-state specific. |
| `artifacts/capacities-reference/` | sanitized archive evidence | 2026-08-31 | current repository path | Legacy visual contracts and control matrices. | Historical evidence; refresh when stale or conflicting. |

## Official documentation inventory

The current public documentation baseline is the 196-page Capacities documentation list represented by `capacities-urls.txt.txt` and derived from the official machine indexes. The older `reference-urls.json` inventory contains 154 URLs and is retained only for provenance and diff history.

URL normalization for parity inventories:

- lowercase scheme and host;
- strip fragments;
- strip query strings unless an official documentation page requires a stable query;
- trim trailing slash except for the origin root;
- deduplicate by normalized URL;
- preserve removed, redirected, or renamed historical URLs with status metadata instead of deleting provenance.

Representative current public documentation pages checked through the browser-search surface on 2026-08-31:

- `https://docs.capacities.io/`
- `https://docs.capacities.io/reference`
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

## Archive completeness boundary

The completeness audit is authoritative only for its published archive scope: all captured response payloads are recoverable by SHA-256 from the deduplicated response resources, and all WARC records are represented as metadata. The corpus is insufficient for claims that depend on request bodies, four resource-image payloads, warcinfo bodies, revisit resolution, exact private headers, signed URLs, or original WACZ bytes.

## Sanitization contract

Shareable reference indexes must not contain:

- cookies, authorization headers, bearer tokens, OAuth tokens, API keys, or session identifiers;
- signed query strings such as `X-Amz-Signature`, `Signature`, `Expires`, or credential-bearing URLs;
- raw authenticated HTML, private object content, account identifiers, or email-bearing URLs;
- full third-party bundles copied from authenticated sessions.

If a source cannot be sanitized without losing fidelity, keep the raw source outside the repository and document the limitation here.

## Provenance labels

Every parity claim must use one of these labels:

- `official-documentation`
- `authenticated-observation`
- `sanitized-archive-evidence`
- `local-code-test-evidence`
- `inference`
- `unknown`

Use `unknown` for private Capacities implementation details even when observable output is documented.
