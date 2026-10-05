# Product Specifications

This directory contains product specifications defining the feature scope, requirements, and user experience for the notes application.

---

## Overview

Product specifications serve as the single source of truth for *what* we are building and *why*. They bridge user needs, design requirements, and engineering execution by establishing unambiguous functional requirements, user journeys, acceptance criteria, and non-functional constraints before code is written.

### Relationship with Documentation Ecosystem

Product specifications integrate directly into the repository's documentation and engineering lifecycle:

- **Workflows Guide ([`docs/guides/workflows.md`](../guides/workflows.md))**:
  - Specs are created during **Step 2 (`/to-spec`)** of the Main Flow (`Idea → Code`) following initial discovery (`/grill-with-docs`).
  - Approved specs are broken down into actionable issues during **Step 3 (`/to-tickets`)**.
- **Architecture Decision Records ([`docs/adr/`](../adr/README.md))**:
  - Specs define *product requirements and user behavior*. Technical architecture, system choices, and trade-offs solving those requirements are documented in ADRs.
- **Execution Plans ([`docs/exec-plans/`](../exec-plans/README.md))**:
  - Complex, multi-step implementations spanning multiple issues or phases coordinate their delivery milestones and verification checklists within execution plans.

```
[Idea / /grill-with-docs]
           │
           ▼
[Product Spec (/to-spec)] ──> [Architecture Decisions (docs/adr/)]
           │
           ▼
[Ticket Graph (/to-tickets)]
           │
           ▼
[Execution Plan (docs/exec-plans/)] ──> [Implementation (/tdd)]
```

---

## Specification Index

| Spec ID | Title | Status | Last Updated | Notes |
| --- | --- | --- | --- | --- |
| *SPEC-0001* | *MVP Note Management* | Planned | — | Upcoming core note creation, editing, and list experience |

---

## Spec Lifecycle

All product specifications progress through a structured lifecycle:

```
[Draft] ──> [Review] ──> [Approved] ──> [Implemented]
                            │
                            └──> [Superseded / Deprecated]
```

1. **Draft**:
   - Initial authoring stage generated via `/to-spec` or manual drafting using [`template.md`](./template.md).
   - Problem statement, user journeys, and functional requirements are being shaped.
   - May contain open questions and unresolved edge cases.

2. **Review**:
   - Spec is open for stakeholder feedback, architectural review, and technical feasibility checks.
   - Open questions are actively resolved and cross-referenced with potential ADRs.

3. **Approved**:
   - Scope is locked and agreed upon.
   - Acceptance criteria are validated as testable.
   - Ready to be decomposed into GitHub issues via `/to-tickets`.

4. **Implemented**:
   - All associated tickets and execution plan milestones have been completed and verified.
   - The spec serves as canonical documentation of existing system behavior.

5. **Superseded / Deprecated**:
   - The feature was retired, or a newer specification has replaced its requirements.
   - Links to successor specifications are maintained in the metadata.

---

## Authoring Guidelines

When creating or updating a product specification:

1. **Start from the Template**: Always copy [`template.md`](./template.md) and assign the next sequential ID (`SPEC-XXXX`).
2. **Path Portability**: Use **ONLY** repository-relative links (e.g., `../adr/`, `../exec-plans/`, `../guides/workflows.md`). **NEVER** include hardcoded local machine paths (e.g., `C:\Users\...`).
3. **Structured Requirement IDs**: Enumerate functional requirements (`FR-1`, `FR-2`) and non-functional requirements (`NFR-1`, `NFR-2`) so individual tickets and test cases can trace back to specific requirements.
4. **Testable Acceptance Criteria**: Frame acceptance criteria as concrete, testable conditions or Given-When-Then scenarios.
