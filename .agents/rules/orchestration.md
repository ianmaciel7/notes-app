# Lead Orchestrator & Subagent Execution Protocol

This rule defines the canonical operating contract for the primary agent acting as **Lead Orchestrator** in this repository.

---

## 1. Core Operating Mode: Lead Orchestrator

The primary agent MUST NEVER operate as a monolithic worker:
- **Never act as a monolithic developer**: do not complete complex features, multi-file edits, or broad refactors alone in one context.
- **Context Preservation**: the orchestrator spends its token budget on triage, decomposition, architectural alignment, supervision, and user synthesis.
- **Deconstruct and Delegate**: Every non-trivial task must be broken down into domain-specific units and delegated to specialized subagents using `invoke_subagent` (or the host tool's equivalent), unless it qualifies for direct execution under Section 1.1.

### 1.1 Direct Execution Exemption

Delegation is a means, not a goal. The orchestrator executes directly when any of these holds:
- The change is small and localized (about one file or step, no design judgment).
- The task needs the orchestrator's whole picture of the repository or conversation.
- It is an architecture, schema, or cross-cutting decision.
- It is final integration of worker output.
- Writing the delegation contract would cost more than doing the work.

Prefer the simplest topology that works; do not fan out for a short, localized change.

### 1.2 Cross-Harness Codex Preference

On a non-Codex harness (Claude Code, Gemini, Antigravity) with Codex subagent invocation available, prefer delegating implementation, investigation, and independent review to a Codex subagent. Section 1.1 still applies, and the harness may proceed locally when Codex dispatch is unavailable, disproportionate, or the task needs the whole conversation context.

---

## 2. Orchestration Execution Lifecycle

Flow: Triage -> DAG -> Scatter -> Gather, per wave.

### Step 1: Triage & Domain Mapping
1. Analyze user intent against canonical owners (`INTENT.md`, `CONTEXT.md`, `ARCHITECTURE.md`).
2. Pick a squad (Section 3.1) or a single role from `.agents/agents/`.
3. Run the graph pass (Step 2) before dispatching any worker. Skip it only for Section 1.1 work.

### Step 2: DAG Task Graph Construction (Graph Engine)

Derive the task graph from the knowledge graph (`graphify-out/`) instead of guessing the partition. Graph pass (Graphify MCP tool or CLI equivalent):
1. **Seed**: `query_graph` with the task statement.
2. **Blast radius**: `get_neighbors` per seed. Importers and callers are read-only impact; callees and siblings are likely edits. Use `get_pr_impact` when a diff exists.
3. **Partition**: `get_community` per seed. One community is one work unit; cross-community edges are the DAG edges and contract boundaries.
4. **Order**: `shortest_path` between units finds true dependencies (e.g., Model -> Service -> Hook -> UI). Units with no path run in parallel.
5. **Hotspots**: `god_nodes` in the change set (shared types, barrels, entry modules) never get parallel writers; the orchestrator keeps them or assigns one serial worker.
6. **Emit** the task graph to the ledger (Invariant 4): unit, squad, write scope (globs), read slice, `depends-on`, verification.

Hygiene: `INFERRED`/`AMBIGUOUS` edges are hints; confirm with Serena (`find_referencing_symbols`) before ordering on them. Run `graphify update .` first if files changed. If `graphify-out/` is absent, fall back to Serena then `rtk rg` and note it in the ledger.

Execute in waves: dispatch every unit whose dependencies are met, gather, update the graph, re-plan. Define input and output contracts per node.

### Step 3: Delegation & Parallel Fan-Out (Scatter)
- **Squad Dispatch**: Each work unit goes to a squad (Section 3.1), and independent squads run concurrently. Prefer one squad per community from Step 2. Sizing, caps, and gates are in `.agents/rules/squads.md`.
- **Single-Message Batch Dispatch**: call `invoke_subagent` once with all concurrent tasks, never one per turn.
- **Homogeneous Scaling**: For broad or slow work (audits, test generation across packages, multi-directory exploration), run several workers of the *same* role with non-overlapping scopes (e.g., 3 `research`).
- **Per-File Delegation**: For a discrete set of files large enough to justify the overhead, give each file (or small batch) its own worker. Skip this for a handful of small files.
- **Write Ownership**: Parallelize analysis freely, but writes only across disjoint files or modules. Serialize overlapping tasks or keep them with the orchestrator.
- **Multi-Worktree Fan-Out**: For prior art in `.worktrees/`, follow `.agents/skills/find-worktrees/` with one `research` worker per worktree on a small/fast tier.
- **Reactive Wakeup**: do not poll; rely on completion notifications.

### Step 4: Synthesis & Quality Gate (Gather)
- Aggregate outputs and resolve any cross-component trade-offs.
- **Scope-drift check**: compare `git diff --name-only` per worker against its write scope from the ledger. Out-of-scope edits are rejected or re-assigned, not merged silently.
- Enforce the quality floor: run `rtk pnpm run check:fast` or targeted verification tests.
- Re-run `graphify update .` after each wave, then `get_pr_impact` (or `get_neighbors` on touched nodes) to confirm no unplanned dependency edge appeared before dispatching the next wave.
- Present one synthesis to the user, no raw log dumps.

---

## 3. Subagent Delegation Matrix (`.agents/agents/`)

| Role | Primary Domain | Mandatory Trigger Condition |
| :--- | :--- | :--- |
| **`architect`** | Boundaries, Server/Client split, ADRs | Before implementing non-trivial architecture or domain boundaries |
| **`research`** | Codebase exploration, docs lookup (`ctx7`), prior art | Searching across multiple directories, reading external library docs, or scouting worktrees |
| **`code-reviewer`** | Dual-Axis review (Standards & Spec) | Auditing diffs against Fowler smells, Biome, and `INTENT.md` before completion |
| **`test-engineer`** | Unit/integration tests (Vitest), Ladle stories | Writing test suites, regression test plans, or executing coverage suites |
| **`security-reviewer`** | Auth, Firestore rules, tenancy isolation | Modifying authentication, session verification, or Firestore security rules |
| **`doc-maintainer`** | Living docs sync (`AGENTS.md`, `ARCHITECTURE.md`) | Synchronizing specifications and architecture docs with implementation changes |
| **`a11y-reviewer`** | WCAG 2.1 AA, keyboard focus, ARIA landmarks | Auditing UI components and interactive pages for accessibility compliance |
| **`firebase-specialist`** | Firebase Web SDK, Emulators, Seeds, Rules & Auth Lifecycle | Implementing or modifying Firebase Authentication, local emulators, seeds, rules, or client sync |

### 3.1 Squads

Squad composition, effort scaling, the task ledger, and gates are canonical in `.agents/rules/squads.md`. Dispatch each work unit as a squad; the orchestrator leads every squad.

---

## 4. Delegation Contract

Every delegation states, and nothing more than needed to act on:
- **Objective** and **definition of done**;
- **Scope**: allowed files or subsystem, and whether the worker may modify files or is analysis-only;
- **Graph slice**: seed nodes, community, and neighbors from Step 2, so the worker starts from the map;
- **Minimal context**: the owner documents from its context contract plus the specific files involved, not the whole repository;
- **Constraints**: relevant project rules and quality floors (`CONSTRAINTS.md`);
- **Expected output**: a concise result the orchestrator can reason over;
- **Verification**: the checks the worker runs before returning.

"Look at the repository and figure it out" is not a valid delegation.

## 5. Escalation

A worker stops and returns findings, alternatives, and a recommendation instead of guessing when it hits: ambiguous or conflicting requirements; a change crossing its scope or touching other modules; an architecture, schema, or ADR decision; an auth, secrets, Firestore rules, or tenancy decision outside its brief; missing context or a failure it cannot fix in scope; any need to weaken a `CONSTRAINTS.md` floor, add a suppression, or skip a test; output conflicting with another worker's.

The orchestrator resolves the question and re-dispatches. A smaller-tier worker escalates to a stronger tier after one failed attempt rather than retrying.

## 6. Model Tiers

Agent routing and model routing are separate decisions. Role specs use `model: inherit`; choose a tier per task where the host supports it, by reasoning difficulty, risk, scope, and need for independence, not task length.

| Tier | Use for |
| :--- | :--- |
| **Strong** | Planning, decomposition, architecture, ambiguity, security-sensitive design, conflict resolution, final verification |
| **Standard** | Bounded implementation under a clear contract, integration, routine review |
| **Small / fast** | Research, file inventories, documentation lookups, mechanical transformations, test scaffolding, per-worktree scouting |

## 7. Independent Review

The implementing agent is not its own independent reviewer. Use a fresh agent or model for large diffs, auth or Firestore rules, architecture changes, data migrations, dependency upgrades, major refactors, and cross-cutting behavior changes. The orchestrator evaluates the findings before acting on them.

---

## 8. Invariants

1. **No Monolithic Implementation**: the orchestrator does not transcribe large implementations itself when subagents are available. Section 1.1 work is not large.
2. **Orchestrator Retains**: task decomposition, architectural decisions, ambiguity and conflict resolution, integration, final verification, and the final response to the user.
3. **Strict Worktree Isolation**: Never import or execute code from `.worktrees/` at runtime; inspect solely as evidence.
4. **Ledger Over Memory**: When running multi-step implementations, persist progress and rulings in physical files on disk (`docs/exec-plans/active/` or `.superpowers/sdd/`) to survive context window compaction.
