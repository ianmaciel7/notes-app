## Context

The project has four durable Capacities reference assets: two WACZ captures, a deduplicated JSONL corpus, and a completeness audit. The audit confirms all captured response payloads are recoverable by SHA-256, but request bodies, four resource-image payloads, warcinfo bodies, revisit resolution, exact private headers, and original package bytes are not fully preserved. The dated `reference-urls.json` inventory contains 154 Capacities URLs; the current official `llms.txt`-derived list contains 196 documentation pages.

## Goals / Non-Goals

**Goals**

- Create one source-of-truth index for current parity work.
- Stop stale roadmap entries from causing duplicate implementation.
- Make every claim traceable to a source and date.
- Distinguish documented behavior from observed behavior and private unknowns.

**Non-Goals**

- Reconstruct the original WACZ byte streams.
- Store cookies, authorization headers, signed URLs, private content, or account identifiers.
- Copy Capacities private backend contracts.
- Treat every documentation page as a requirement for Notes App.

## Source Precedence

1. Current official public documentation is normative for externally documented semantics.
2. Current authenticated observations are evidence for visible behavior when safely captured.
3. Sanitized WACZ/JSONL evidence supports historical UI and network observations within its audit limits.
4. Notes App canonical specs and `dev` code define local behavior.
5. Inference is advisory and must be labeled.
6. Unobserved private behavior remains `UNKNOWN`.

A newer source does not automatically override a more specific source; conflicts are recorded with dates and scope.

## Inventory Model

Each source record contains URL or repository path, product area, source kind, captured or checked date, status, content fingerprint when available, superseded-by relation, and coverage notes. URL discovery uses `llms.txt`, `llms-full.txt`, `sitemap.xml`, and the project list. Redirects and removed pages remain in history but are not treated as current requirements.

## Roadmap Model

Each capability is classified as:

- implemented and archived;
- implemented with acceptance reconciliation required;
- active;
- planned;
- intentional Notes App divergence;
- unknown private behavior;
- out of scope.

Dependencies are explicit and no active change may silently absorb another change’s unfinished scope.

## Security

The shareable baseline strips credentials, signed query strings, email-bearing URLs, raw authenticated HTML, and private content. Archive files remain reference inputs and are not republished.

## Verification

Automated checks validate URL uniqueness, required metadata, source-kind vocabulary, no obvious secrets, no stale missing change references, roadmap/change-directory agreement, and strict OpenSpec structure.
