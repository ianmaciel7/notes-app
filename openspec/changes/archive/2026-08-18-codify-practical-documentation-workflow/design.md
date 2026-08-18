## Context

The main repository already requires OpenSpec for significant proposal and design changes, but the scope boundary for practical documentation work remains implicit. This change creates a clear, explicit capability for documentation governance.

## Goals / Non-Goals

**Goals:**
- Clarify what counts as actionable documentation governance versus editorial cleanup.
- Formalize documentation workflow in OpenSpec for process-impacting doc updates.
- Ensure downstream PRs reference and preserve documentation decision continuity.

**Non-Goals:**
- Changing application runtime behavior.
- Adding new external dependencies.
- Rewriting all historical docs in this PR.

## Decisions

### Decision: Dedicated documentation capability
A separate capability under `docs/practical-workflow` will hold this behavior contract.

**Alternative considered:** Extending `developer-workflows` with a broad documentation section.
**Why rejected:** Reduced discoverability for doc-specific decisions and weaker traceability for documentation PRs.

### Decision: Explicit editorial exception
Only structural or process changes require planning, while pure editorial changes may use a fast path.

**Alternative considered:** Requiring OpenSpec for every doc edit.
**Why rejected:** Excessive overhead for low-risk language/format edits.

### Decision: Documentation freshness gate
All process-impacting documentation changes will include a final freshness gate that cross-checks the most authoritative docs and updates any stale copies.

**Alternative considered:** Relying solely on review comments without an explicit gate.
**Why rejected:** It allows regressions and drift, especially across `.agents` rules, project docs, and PR references.

## Risks / Trade-offs

- [Risk] Ambiguous boundary between governance updates and editorial edits → Mitigation: define examples and require PR author review of classification.
- [Risk] Teams may skip docs classification in urgent changes → Mitigation: add concise checklist in contributor docs and PR templates.
- [Risk] Overloading docs with process content → Mitigation: keep requirements focused on actionable governance only.
- [Risk] Stale documentation still escaping review in parallel edits → Mitigation: make stale-check part of the workflow and enforce it in the tasks.

## Migration Plan

- Publish this capability artifact after validation.
- Apply to future practical documentation changes through PR review discipline.
- No runtime migration required.
