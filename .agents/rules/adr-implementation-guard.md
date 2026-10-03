# ADR Implementation & Planning Guard Rule

This rule defines the mandatory lifecycle guard connecting Architecture Decision Records (ADRs) to code implementation across all agents and orchestrators in this repository.

---

## 1. The Core Invariant: No ADR Code Without a Plan

**Never begin code implementation directly from an ADR or conceptual discussion without an active, durable implementation plan.**

An ADR (`docs/adr/XXXX-*.md`) records architectural rationale, trade-offs, and invariants. It is **NOT** a step-by-step implementation plan or execution tracker.

### 1.1 Trigger Condition
Whenever a new ADR is recorded or an existing ADR is selected for implementation:
1. **HALT BEFORE CODING**: Do not edit `src/`, scaffold components, or write production code directly.
2. **PLAN ARTIFACT CREATION**: An implementation plan MUST be created and committed before any implementation step begins.

---

## 2. Mandatory Planning Paths

Choose one of two canonical routes depending on the execution workflow:

### Path A: Repository Execution Plan (Default for Multi-Step & Subsystems)
* **Canonical Destination**: `docs/exec-plans/active/<adr-number>-<short-kebab-name>.md`
* **Process**:
  1. Copy `docs/exec-plans/template.md`.
  2. Populate:
     - Linked ADR reference (relative path: `../../adr/XXXX-*.md`).
     - Objective, Non-Goals, and Canonical Owners.
     - Ordered DAG steps (Types/Schema -> Adapters/Hooks -> Components/UI -> Tests/Stories).
     - Explicit Quality & Rollback Gates.
  3. Register the plan in `docs/exec-plans/README.md`.
  4. Work through the plan using `subagent-driven-development` or specialized subagents (`architect`, `test-engineer`, `code-reviewer`).

### Path B: Matt Pocock Flow (`/to-spec` -> `/to-tickets`)
* **When preferred**: When decomposing the work into discrete tickets with strict dependency graphs (`blocking edges`).
* **Process**:
  1. Run `/to-spec` targeting the ADR to extract concrete user-facing/system requirements and acceptance criteria.
  2. Run `/to-tickets` to generate tracer-bullet tickets in `.scratch/<feature>/issues/` (or the configured issue tracker).
  3. Execute each ticket via `/implement`, clearing/compacting context between tickets.

---

## 3. Orchestrator Enforcement Checklist

Before any code implementation turn is approved or dispatched:
- [ ] Is there an active execution plan in `docs/exec-plans/active/` OR tickets generated in `.scratch/...`?
- [ ] Does the plan reference the specific ADR by relative link?
- [ ] Are test plans (Vitest / Ladle) and quality checks declared in the plan?
- [ ] If NO plan exists, the orchestrator MUST pause and create the plan first.

---

## 4. Definition of Done for ADR Planning

An ADR transition to implementation is valid ONLY when:
1. The ADR status in `docs/adr/` is marked `Accepted`.
2. The active plan file exists on disk.
3. The user or orchestrator explicitly confirms the plan steps before starting Phase 1 implementation.
