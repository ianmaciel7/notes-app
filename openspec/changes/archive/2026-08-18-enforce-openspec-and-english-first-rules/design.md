## Context

See `proposal.md` for the rationale and impact. Current state has process expectations partially present in agent rules but not formalized as a dedicated OpenSpec capability. This change introduces explicit workflow and language requirements for future work.

## Goals / Non-Goals

**Goals:**
- Formalize OpenSpec trigger logic in a dedicated planning artifact set.
- Enforce English-first wording for repository-facing technical artifacts.
- Provide a clear, reviewable transition path for contributors and agent sessions.

**Non-Goals:**
- No product feature behavior changes in runtime code.
- No migration of existing historical commits.
- No CI/CD engine redesign.

## Decisions

### Decision: Use repository-local OpenSpec store
This workflow uses the local repo OpenSpec root under `openspec/` for alignment with project context and low-friction usage.

**Alternative considered:** Centralized external OpenSpec store.
**Why rejected:** It adds cross-repo overhead and increases setup friction for this repository.

### Decision: Add capability path `developer-workflows/openspec-enforcement`
A dedicated capability keeps governance changes discoverable without mixing with app-feature specs.

**Alternative considered:** Extending existing root docs without a formal capability.
**Why rejected:** Reduced traceability and lower validation clarity for future changes.

## Risks / Trade-offs

- [Risk] Process overhead might slow very small changes → Mitigation: non-functional-only tasks can be excluded when behavior is not impacted.
- [Risk] English-first rule may increase review churn for localized contributors → Mitigation: allow explicit localization exceptions only with product requirements.
- [Risk] Overly rigid process may block urgent fixes → Mitigation: clarify `Non-Functional` and `Ambiguous vs. behavioral` gates in the requirement text.

## Migration Plan

- No deployment migration required.
- Validate the artifacts with OpenSpec tooling.
- On review, communicate the new workflow to contributors and begin applying only after this change is adopted.