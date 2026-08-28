## Context

The repository already stores human-readable Capacities observations in `docs/references/` and machine-oriented artifacts in `artifacts/capacities-reference/`, but no single contract defines discovery, bundle identity, freshness, sanitization, or the relationship between screenshots and inspectable HTML/CSS/JavaScript evidence. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**

- Make repeated comparison work start from existing evidence rather than a new browser capture.
- Keep evidence inspectable through a small manifest and stable repository-relative paths.
- Preserve the measured state needed for visual and interaction parity while enforcing privacy and content minimization.
- Keep the rule, skill, contributor guidance, and OpenSpec requirements synchronized.

**Non-Goals:**

- Mirroring an external site, archiving complete vendor bundles, or bypassing authentication and access controls.
- Treating stored evidence as permanently current or sufficient for states it does not cover.
- Migrating or deleting existing reference artifacts as part of this change.

## Decisions

### Use manifest-led capture bundles

New reusable captures use `artifacts/reference-evidence/<source-id>/<capture-id>/manifest.json`. The manifest records source URL or product surface, capture timestamp, viewport, route/state, interactions, artifacts, confidence, freshness notes, and redactions. A source-specific Markdown summary under `docs/references/` links to the bundle and explains interpretation.

This structure was chosen over loose screenshots because it lets a later agent decide whether an exact state is already covered. Existing `artifacts/capacities-reference/` files remain valid legacy evidence and are searched before recapture.

### Store minimal inspectable artifacts by state

Bundles may contain screenshots, sanitized HTML or DOM fragments, computed-style JSON, and JavaScript evidence. JavaScript evidence means minimal reproduction scripts, event/state observations, or narrowly scoped excerpts needed to explain behavior; complete production bundles are excluded. Artifacts use stable state identifiers so image, DOM, style, and behavior records can be correlated.

This was chosen over a mandatory full-page archive because full captures are larger, risk persisting secrets or personal content, and often contain far more third-party material than parity work needs.

### Reuse first, refresh selectively

The rule and skill require a discovery pass before browser inspection. A capture is reusable only when source, viewport, route/surface, semantic state, persisted layout state, and interaction state match. Agents refresh only missing, conflicting, or stale states and record the reason in the manifest.

This was chosen over time-only expiration because a recent capture can still represent the wrong state, while an older capture can remain useful for a stable, explicitly scoped contract.

### Keep summaries and raw evidence separate

`docs/references/` remains the human-readable contract. `artifacts/reference-evidence/` holds machine-readable and visual evidence. Rules and skills link both so implementation decisions can be traced without embedding large captures in process documentation.

## Risks / Trade-offs

- [Stored evidence becomes stale] -> Record capture identity and state dimensions, prefer current confirmed evidence on conflict, and refresh only affected states.
- [Evidence accidentally contains secrets or personal data] -> Require redaction before persistence and prohibit cookies, tokens, private storage values, and full authenticated exports.
- [Repository growth from repeated captures] -> Store the smallest useful artifacts, avoid duplicate states, and prefer compact structured measurements over redundant screenshots.
- [Agents trust an incomplete bundle] -> Require explicit coverage and limitation fields and preserve `not tested` or missing-state outcomes.

## Migration Plan

1. Add the new evidence workflow and Capacities delta specifications.
2. Update the workspace parity rule and skill with discovery, bundle, refresh, and sanitization requirements.
3. Add a practical reference-evidence guide and link it from contributor and agent entry points.
4. Validate the OpenSpec change and skill; leave existing evidence in place as legacy inputs.
5. Future parity captures adopt the new bundle path incrementally.
