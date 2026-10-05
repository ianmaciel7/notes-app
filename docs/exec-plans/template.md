# Execution Plan: <Title>

## Metadata

- **Status**: `Draft` | `In Progress` | `Completed` | `Superseded`
- **Owner**: `<Author or Agent Name>`
- **Started**: `YYYY-MM-DD`
- **Last Updated**: `YYYY-MM-DD`

---

## 1. Objective

Provide a concise, high-level summary of what this plan achieves and why it is being executed.

---

## 2. Scope

### In Scope
- [Deliverable / component 1]
- [Deliverable / component 2]

### Out of Scope
- [Explicit boundary / deferred task 1]
- [Explicit boundary / deferred task 2]

---

## 3. Canonical Context

- **Architecture Decision Record**: [ADR XXXX](../../adr/XXXX-title.md) *(or `../adr/XXXX-title.md` if in active)*
- **Product Specification**: [Spec Title](../../product-specs/spec-name.md) *(optional)*
- **Issues / Tracking Tickets**: `#<issue-id>` *(optional)*
- **Technologies & Dependencies**:
  - Framework / Runtime: `<e.g. Next.js App Router, React 19>`
  - Language: `<e.g. TypeScript 5>`
  - Tooling: `<e.g. Biome, Tailwind CSS v4>`

---

## 4. Plan & Milestones

Ordered execution milestones with deliverable checkpoints:

- [ ] **Milestone 1: Preparation & Setup**
  - [ ] Task 1.1: Describe task detail
  - [ ] Task 1.2: Describe task detail
- [ ] **Milestone 2: Core Implementation**
  - [ ] Task 2.1: Describe task detail
  - [ ] Task 2.2: Describe task detail
- [ ] **Milestone 3: Verification & Polish**
  - [ ] Task 3.1: Run test suites and static analysis
  - [ ] Task 3.2: Verify production build and documentation

---

## 5. Progress and Decision Log

Chronological log of key activities, architectural choices, and deviations encountered during execution:

| Date | Author | Event / Decision | Rationale |
| --- | --- | --- | --- |
| YYYY-MM-DD | `<Name>` | Initial plan drafted | Baseline establishment |

---

## 6. Verification

Document verification steps executed to confirm quality and compliance:

- **Linting & Formatting**:
  ```bash
  pnpm lint
  pnpm format
  ```
  *Result*: Expected output or pass confirmation.

- **Type Checking & Build**:
  ```bash
  pnpm build
  ```
  *Result*: Expected output or build confirmation.

- **File Layout & Boundary Checks**:
  - Verify file tree aligns with structural standards.

---

## 7. Completion Summary

- **Completed Date**: `YYYY-MM-DD`
- **Result Summary**: Summary of outcomes, artifacts produced, and transition to production or subsequent plans.
