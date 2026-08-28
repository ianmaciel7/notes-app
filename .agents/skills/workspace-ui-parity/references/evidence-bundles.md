# Reusable reference evidence bundles

Use this reference only when evidence must survive the current task or an existing bundle may replace live recapture.

## Discovery order

1. Read the matching summary under `docs/references/`.
2. Inspect `artifacts/reference-evidence/<source-id>/` for manifest coverage.
3. For Capacities, inspect legacy `artifacts/capacities-reference/` evidence.
4. Open the external reference only for missing, stale, conflicting, or inconclusive states.

## Coverage key

Evidence is reusable only when these dimensions match the requested comparison:

- source identity and product surface;
- capture timestamp or source version;
- viewport and device scale when material;
- route or component surface;
- semantic content and authentication-safe state;
- persisted layout state, such as resized or collapsed panels;
- interaction state, such as idle, hover, focus, open, selected, post-click, or reduced motion.

## Bundle layout

Use `artifacts/reference-evidence/<source-id>/<capture-id>/` with a `manifest.json`. Prefer descriptive state IDs in artifact names, for example:

```text
manifest.json
sidebar-idle.png
sidebar-idle.dom.html
sidebar-idle.styles.json
sidebar-idle.behavior.json
sidebar-open.repro.js
```

The manifest must record source, capture time, viewport, route/surface, semantic and persisted state, interactions, artifact paths and kinds, provenance, confidence, redactions, freshness notes, limitations, and refresh reason when applicable. Use repository-relative paths.

## Capture boundaries

- Keep the smallest DOM fragment and computed-style property set that proves the comparison.
- Store JavaScript only as minimal reproduction code, event/state observations, or a narrowly scoped excerpt needed to explain the behavior.
- Do not copy complete minified chunks, source maps, application bundles, authenticated exports, or unrelated page content.
- Remove cookies, tokens, credentials, private storage values, personal identifiers, and unrelated user content before writing files.
- If redaction affects confidence, record the limitation instead of filling the gap by inference.

## Refresh behavior

Keep old capture directories immutable. Add a new capture ID or a new state artifact, update the summary pointer, and explain why the earlier evidence was insufficient. Newer confirmed live evidence is authoritative when captures conflict.
