---
name: adr
description: Use when creating, updating, superseding, or auditing Architectural Decision Records (ADRs) under docs/decisions/ and maintaining the decision log in DECISIONS.md and docs/decisions/README.md.
compatibility: Designed for Node.js environments (requires Node.js 18+ for script execution).
metadata:
  category: architecture
  version: "1.1"
---

# Architectural Decision Records (ADR) Skill

## Overview

Architecture Decision Records (ADRs) capture the **why** behind major technical decisions — not merely the code that was written. Code shows *what* was built; an ADR explains *why it was built this way*, *what constraints existed*, *what alternatives were considered and rejected*, and *what positive and negative consequences resulted*.

In this repository, all ADRs follow the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) format, stored under `docs/decisions/` and indexed in `DECISIONS.md`.

---

## When to Write an ADR

Write an ADR whenever making a technical choice that meets any of the following criteria:

- **Expensive to Reverse**: Any architectural choice that would require significant refactoring to undo (e.g., local storage engine, state sync protocol, routing model).
- **Choosing Dependencies or Frameworks**: Selecting or replacing a major library or runtime (e.g., Dexie/IndexedDB, Biome vs. ESLint, Tailwind CSS v4, AI Gateway).
- **Data Model & Schema Design**: Core entity representations, CRDT/FSRS schemas, or migration strategies.
- **System Architecture & Boundaries**: Defining boundaries between Server Components, Client Components, Route Handlers, and offline caches.
- **Repeated Debates**: When you find yourself or other agents repeatedly debating or re-deciding the same architectural topic.
- **Deprecations & Migrations**: Formally retiring or replacing an existing architectural pattern.

### When NOT to Write an ADR
- Routine bug fixes or tactical refactors within already-decided architectural boundaries.
- Standard component styling or mundane UI composition.
- Self-explanatory code or temporary throwaway prototypes.

---

## Repository Standards & Invariants

1. **MADR Format**: Every ADR must use the standardized MADR template located at [`.agents/skills/adr/templates/madr-template.md`](templates/madr-template.md).
2. **Language**: All ADRs, titles, and explanations must be written in **English** (per the project rule in `AGENTS.md`).
3. **Sequential Numbering**: Files follow zero-padded 4-digit numbering: `docs/decisions/XXXX-<slug>.md` (e.g., `0001-...`, `0002-...`, `0005-...`).
4. **Dual Index Synchronization**: Every ADR must be registered in:
   - `docs/decisions/README.md` (directory index table)
   - `DECISIONS.md` (root consolidated decision log)
5. **Path Portability**: Never hardcode user-dependent machine paths (`C:\Users\...` or `/home/...`). Use portable placeholders (e.g., `C:/Users/<username>/...`) or relative paths.
6. **Traceability in Code**: When code relies on a non-obvious architecture rule, reference the ADR in code comments (e.g., `// See ADR-0004 for path portability rules`).
7. **Knowledge Graph Sync**: Run `graphify update .` after adding or updating an ADR.

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

- **Proposed**: Under active discussion; trade-offs and alternatives are being evaluated.
- **Accepted**: Agreed upon and actively enforced in the codebase.
- **Rejected**: Considered and explicitly declined. Retained to preserve historical context and prevent re-proposing rejected ideas.
- **Superseded by ADR-XXXX**: A later decision replaced this approach. Must link directly to the succeeding ADR.
- **Deprecated**: The decision is no longer relevant or applicable.

> **Never delete past ADRs.** They prevent future engineers and AI agents from "re-inventing" rejected options or losing historical context.

---

## Standard Workflow

### Step 1: Check Existing ADRs

Before proposing a new decision, check the existing records to understand settled context:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs list
```

### Step 2: Scaffold the Next ADR

Use the automated script to calculate the next sequential ID and generate the scaffold:

```bash
node .agents/skills/adr/scripts/manage-adr.mjs new "Local-First Storage Engine"
```

This creates `docs/decisions/0005-local-first-storage-engine.md` with the standard template and automatically registers it in both index files.

### Step 3: Complete the Decision Document

Edit the generated file:
- **Context and Problem Statement**: What problem are we solving? Why now? What constraints apply?
- **Decision Drivers**: 2–4 primary drivers (e.g., offline-first latency, data integrity, bundle size).
- **Considered Options**: At least 2 candidate options with concrete descriptions.
- **Decision Outcome**: The selected option and a rigorous rationale.
- **Positive & Negative Consequences**: Explicit trade-offs, limitations, or maintenance costs accepted.
- **Pros and Cons of the Options**: Objective pros/cons for each candidate, including why rejected options were declined.

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

### Step 6: Link in Code & Update Knowledge Graph

Where relevant, add code references to the new ADR:

```typescript
/**
 * Local database provider.
 * See ADR-0005 for offline-first schema and migration guarantees.
 */
```

Then update the knowledge graph:

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

## Common Rationalizations vs. Reality

| Rationalization | Reality |
|---|---|
| *"The code is self-documenting"* | Code shows **what** was done. It never explains **why**, what alternatives were rejected, or what constraints were active. |
| *"ADRs are excessive overhead"* | A 10-minute ADR prevents a 2-hour bikeshedding debate or accidental regression 6 months later. |
| *"We will write docs when the architecture stabilizes"* | Architectures stabilize faster when documented. Writing the ADR is the first stress-test of the design. |
| *"Nobody reads architecture docs"* | Future AI agents and engineers do. ADRs prevent agents from re-litigating settled decisions. |
| *"Comments get outdated"* | Comments on **what** code does get outdated; documentation on **why** (intent & trade-offs) remains durable. |

---

## Anti-Patterns & Red Flags

| Red Flag / Anti-Pattern | Correct Practice |
| :--- | :--- |
| Architectural decisions made without a recorded rationale | Write an ADR before or alongside shipping the architectural PR. |
| Omitting rejected alternatives | Always record considered options and explicit reasons for rejecting them. |
| Concealing negative consequences | Acknowledge liabilities, trade-offs, and technical debt explicitly. |
| Deleting old or superseded ADRs | Keep all records; mark superseded ones as `Superseded by ADR-XXXX`. |
| Creating an ADR file manually and forgetting `DECISIONS.md` | Use `manage-adr.mjs new` or run `manage-adr.mjs sync`. |
| Writing ADRs in non-English languages | Write all ADR content in English per repository rules. |
| Hardcoding absolute user paths | Use generic placeholders (e.g., `C:/Users/<username>/...`). |

---

## Verification Checklist

Before considering an architectural decision documented:

- [ ] ADR file exists under `docs/decisions/XXXX-<slug>.md` with valid 4-digit numbering.
- [ ] Problem statement, constraints, and decision drivers are clearly stated.
- [ ] At least 2 alternatives were considered with explicit rejection rationales.
- [ ] Both positive and negative consequences are candidly documented.
- [ ] Both `docs/decisions/README.md` and root `DECISIONS.md` are synchronized.
- [ ] Sensitive or user-specific machine paths are absent.
- [ ] `node .agents/skills/adr/scripts/manage-adr.mjs validate` passes with zero errors.
- [ ] Relevant code comments reference the new ADR ID where appropriate.
- [ ] `graphify update .` was executed.
