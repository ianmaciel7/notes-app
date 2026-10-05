# Execution Plans

This directory contains execution plans for significant engineering initiatives, architectural refactors, and feature implementations across the notes application codebase.

## Directory Structure

```text
docs/exec-plans/
├── README.md              # Overview and lifecycle documentation (this file)
├── template.md           # Template for authoring new execution plans
├── active/               # Currently ongoing execution plans
└── completed/            # Finished, verified execution plans
    ├── README.md         # Index of completed plans
    └── 0001-*.md         # Archive of completed plans
```

---

## Lifecycle of an Execution Plan

Execution plans follow a transparent, traceable lifecycle:

```
[Draft / Proposed] ──> [Active / In Progress] ──> [Verification] ──> [Completed]
                               │
                               └──> [Abandoned / Superseded]
```

1. **Draft / Proposal**:
   - Created in `docs/exec-plans/active/` using [`template.md`](./template.md) as the baseline.
   - Defines clear objectives, explicit scope (in-scope vs. out-of-scope), canonical context (linked ADRs, specifications, issue numbers), and an ordered milestone checklist.

2. **Active / In Progress**:
   - The owner checks off milestones (`[x]`) as deliverables are completed.
   - Important operational decisions, mid-course adjustments, or blockers are appended to the **Decision & Progress Log**.

3. **Verification**:
   - The plan executes comprehensive verification procedures (e.g., linting, type-checking, automated unit/integration tests, production build verification).
   - Concrete commands and outputs are logged in the **Verification** section.

4. **Completion**:
   - Once all criteria and verifications pass, the status is set to `Completed`.
   - The file is moved from `docs/exec-plans/active/` to `docs/exec-plans/completed/`.
   - The index in [`completed/README.md`](./completed/README.md) is updated with the plan link, title, completion date, and owner.

---

## Authoring Guidelines

- **Portability**: NEVER use hardcoded local filesystem paths (e.g. `C:\Users\...` or `/home/...`). Always use repository-relative paths (`./active/...`, `../adr/...`, `src/...`).
- **Atomic Milestones**: Decompose work into testable, verifiable increments.
- **Traceability**: Always link the plan to the originating Architecture Decision Record (ADR) in `docs/adr/` and relevant product specs in `docs/product-specs/`.
- **Honest Logs**: Record friction points and deviations in the Decision Log to inform future retrospectives.
