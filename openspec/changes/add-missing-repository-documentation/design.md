## Context

The repository already uses OpenSpec for significant planning, but baseline documentation files are missing, which makes contributor onboarding and process discoverability inconsistent.

## Goals / Non-Goals

**Goals:**
- Restore missing baseline docs for contributors and automation.
- Enforce a no-stale-doc policy for practical docs that affect contributor process.
- Keep docs in English and concise.

**Non-Goals:**
- Modifying application runtime behavior.
- Adding external services or dependencies.
- Deep architectural redesign unrelated to docs.

## Decisions

### Decision: Baseline-first documentation strategy
Create all listed baseline files directly and update references in one change.

**Alternative considered:** Rely on external links only.
**Why rejected:** Missing local source-of-truth slows onboarding and causes ambiguity offline.

### Decision: Keep PR-focused freshness check
Add explicit task-based documentation freshness checks for baseline files.

**Alternative considered:** Manual review-only check.
**Why rejected:** Easily misses drift without consistent checklist.

## Risks / Trade-offs

- [Risk] Large initial docs baseline may become stale quickly → Mitigation: include freshness checks in practical workflow.
- [Risk] Over-documentation for early-stage project → Mitigation: keep each doc lightweight and template-like.
- [Risk] Existing historical conventions may conflict with new canonical files → Mitigation: reference explicit canonical paths in AGENTS.md and README.