---
name: adr
description: Use when creating, updating, superseding, or auditing Architectural Decision Records (ADRs) under docs/decisions/ and maintaining the decision log in DECISIONS.md and docs/decisions/README.md.
compatibility: Designed for Node.js environments (requires Node.js 18+ for script execution).
metadata:
  category: architecture
  version: "1.0"
---

# Architectural Decision Records (ADR) Skill

## Overview

Architecture Decision Records (ADRs) capture the **why** behind major technical decisions — not merely the code that was written. Code shows *what* was built; an ADR explains *why it was built this way*, *what constraints existed*, *what alternatives were considered and rejected*, and *what positive and negative consequences resulted*.

In this repository, all ADRs follow the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) format and are tracked under `docs/decisions/` and indexed in `DECISIONS.md`.

---

## When to Use

Use this skill when:
- Choosing a library, database, protocol, or framework (e.g., UI component libraries, Dexie/IndexedDB, sync engine, state management).
- Introducing breaking changes to public APIs, data schemas, or component contracts.
- Defining system architecture boundaries (Server Components vs. Client Components, Route Handlers vs. proxy layers).
- Establishing cross-cutting standards, performance budgets, or developer workflows (e.g., Biome, Husky, path portability).
- Deprecating or superseding an existing architecture decision.

### When NOT to Use
- Routine bug fixes or tactical refactors within existing architectural boundaries.
- Minor UI layout tweaks or standard component composition.
- Speculative ideas that have not been proposed for adoption yet (use brainstorming or design notes first).

---

## Repository Standards & Invariants

1. **MADR Format**: Every ADR must use the standardized MADR template located at [`.agents/skills/adr/templates/madr-template.md`](templates/madr-template.md).
2. **Language**: All ADRs, titles, and explanations must be written in **English** (per the project rule in `AGENTS.md`).
3. **Sequential Numbering**: Files follow zero-padded 4-digit numbering: `docs/decisions/XXXX-<slug>.md` (e.g., `0001-...`, `0002-...`, `0005-...`).
4. **Dual Index Synchronization**: Every ADR must be registered in:
   - `docs/decisions/README.md` (directory index table)
   - `DECISIONS.md` (root consolidated decision log)
5. **Path Portability**: Never hardcode user-dependent machine paths (`C:\Users\...` or `/home/...`). Use portable placeholders or relative paths.
6. **Knowledge Graph Sync**: Run `graphify update .` after adding or updating an ADR.

---

## Lifecycle & Status Flow

```
   ┌──────────┐
   │ Proposed │
   └────┬─────┘
        │
   ┌────┴────────────────────────┬──────────────────────┐
   ▼                             ▼                      ▼
┌──────────┐              ┌──────────┐            ┌────────────┐
│ Accepted │              │ Rejected │            │ Deprecated │
└────┬─────┘              └──────────┘            └────────────┘
     │
     ▼ (when replaced by a newer ADR)
┌─────────────────────────┐
│ Superseded by ADR-XXXX  │
└─────────────────────────┘
```

- **Proposed**: Under active discussion; trade-offs and options are being evaluated.
- **Accepted**: Decision is agreed upon and actively enforced in the codebase.
- **Rejected**: Decision was considered and explicitly declined. The record remains for historical context.
- **Superseded by ADR-XXXX**: A later decision has replaced this approach. Must cite the succeeding ADR ID.
- **Deprecated**: The decision is no longer relevant or applicable.

---

## Standard Workflow

### Step 1: Check Existing ADRs

Before proposing a new decision, check the log to understand historical context:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs list
```

### Step 2: Scaffold the Next ADR

Use the automated script to calculate the next sequential ID and generate the file:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs new "Local-First Storage Engine"
```

This creates `docs/decisions/0005-local-first-storage-engine.md` with the standard template and automatically updates the indexes.

### Step 3: Complete the Decision Document

Edit the generated file to fill in:
- **Context and Problem Statement**: What problem are we solving? Why now?
- **Decision Drivers**: 2–4 primary constraints or goals (e.g., latency, offline support, type safety).
- **Considered Options**: The approaches evaluated (minimum 2 options).
- **Decision Outcome**: The selected option and rationale.
- **Positive & Negative Consequences**: Explicit trade-offs and liabilities accepted.
- **Pros and Cons of the Options**: Objective pros/cons for each candidate.

### Step 4: Synchronize Indexes

If you edited titles, dates, or statuses:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs sync
```

### Step 5: Validate

Verify sequential numbering, required headers, and path portability:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs validate
```

### Step 6: Update Knowledge Graph

Keep the repository knowledge graph current:

```bash
graphify update .
```

---

## Tooling & Scripts Reference

The skill includes [`scripts/manage-adr.mjs`](scripts/manage-adr.mjs):

| Command | Description |
| :--- | :--- |
| `node .agents/skills/adr/scripts/manage-adr.mjs list` | Prints tabular summary of all existing ADRs. |
| `node .agents/skills/adr/scripts/manage-adr.mjs new "<Title>"` | Scaffolds next sequential ADR and updates indexes. |
| `node .agents/skills/adr/scripts/manage-adr.mjs sync` | Rebuilds `docs/decisions/README.md` and `DECISIONS.md`. |
| `node .agents/skills/adr/scripts/manage-adr.mjs validate` | Audits numbering, headers, and path portability. |

---

## Anti-Patterns & Pitfalls

| Anti-Pattern | Correct Practice |
| :--- | :--- |
| Writing only the decision without listing rejected options | Always record considered alternatives and why they were rejected. |
| Omitting negative consequences / trade-offs | Every technical choice has downsides; state them explicitly. |
| Creating an ADR file manually and forgetting to update `DECISIONS.md` | Use `manage-adr.mjs new` or run `manage-adr.mjs sync`. |
| Writing ADRs in non-English languages | Write all ADR content in English per repository rules. |
| Hardcoding absolute user paths in problem descriptions | Use generic placeholders (e.g., `C:/Users/<username>/...`). |
