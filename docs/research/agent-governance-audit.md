# Historical Agent Governance, Subagent Architecture & Recovery Roadmap

**Date:** 2026-09-18  
**Scope:** Deep architectural analysis of agent systems across `.worktrees/old` through `.worktrees/old-8`, comparing historical subagent delegation, rules, and skills against the active branch (`feature/home`).  
**Auditors Dispatched:** 2 parallel specialist auditors (`Agent Architecture Auditor` & `Skills & Governance Auditor`).

---

## 1. How Agents and Subagents Were Managed

Across the historical worktrees, a sophisticated multi-agent governance architecture evolved through distinct phases:

### A. The 3-Tier Instruction Hierarchy
Historical branches solved "context bloat" and instruction dilution by enforcing strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Root AGENTS.md (Universal Entry Point)                                   │
│    • Target length: <60-100 lines                                           │
│    • Universal facts: Next.js 16, React 19, Dexie (KnowledgeOS_DB), Biome  │
│    • Cross-cutting policies: English code, no-index barrel files, paths     │
│    • Pointers to specialized rules and skills                               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            Activated conditionally by path/glob or domain
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Targeted Rules (.agents/rules/*.md)                                      │
│    • Domain-specific constraints and invariant contracts                   │
│    • Examples: nextjs-server-architecture, fsrs-srs, capacities-ui-parity   │
│    • Governance policies: skills-management, external-skills-policy        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            Activated procedurally for interactive workflows
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Specialized Capabilities (.agents/skills/<name>/)                        │
│    • Progressive disclosure: Metadata (~100w) → Body (<500 lines) → Scripts │
│    • Autonomous workflows: skill-creator, find-worktrees, graph-orchestrator│
│    • External skill immutability: Upstream skills are vendor-locked         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Historical Subagent Roles & Delegation Matrix

The historical branches (`old-6` and `old-7`) defined a complete multi-agent delegation topology:

| Subagent Role | Path in Worktree | Tools & Permissions | Key Responsibilities & Invariants |
| :--- | :--- | :--- | :--- |
| **`architect`** | `.agents/agents/architect/agent.md` | Read-only (`view_file`, `grep_search`, `find_by_name`) | RSC vs Client splits, component contracts, refactoring plans, ADR drafting, Next.js 16 `proxy.ts` vs `middleware.ts`. |
| **`doc-maintainer`** | `.agents/agents/doc-maintainer/agent.md` | Read & Write docs | MADR authoring in `docs/decisions/`, path portability enforcement, Ladle doc stories, graph synchronization. |
| **`security-reviewer`**| `.agents/agents/security-reviewer/agent.md` | Read & Commands | Threat modeling, default-deny Firestore rules validation, server auth verification, preventing `NEXT_PUBLIC_` secret leaks. |
| **`code-reviewer`** | `.agents/agents/code-reviewer/agent.md` | Read & Commands | Audits diffs, PRs, logic bugs, regressions, Biome linting, and enforces the no-index barrel files rule. |
| **`test-engineer`** | `.agents/agents/test-engineer/agent.md` | Read & Commands | Unit/component tests (Vitest + RTL), emulator integration tests, test plans, failure diagnoses. |
| **`ui-engineer` / `ui-designer`** | `.agents/agents/ui-engineer/agent.md` | Read, Write & MCP | shadcn/ui base-nova style with `@base-ui/react`, Tailwind CSS v4, Lucide icons, and mandatory colocated Ladle stories. |
| **`firebase` / `firebase-developer`** | `.agents/agents/firebase/agent.md` | Full stack | Firestore modeling, Security Rules, App Hosting, Functions, and local emulator workflows. |
| **`research` / `search`** | `.agents/agents/research/agent.md` | Read, Search & Web | Evidence-backed codebase exploration, Graphify knowledge graph queries, Context7 doc resolution. |

### Lead Orchestrator Execution Flow
1. **Triage & Decompose**: The Orchestrator divides multi-directory or multi-worktree tasks into distinct, non-overlapping partitions.
2. **Concurrent Dispatch**: Subagents are dispatched in parallel batches using a single `invoke_subagent` call.
3. **Reactive Wakeup**: The Orchestrator sleeps without polling loops; the runtime automatically wakes the Orchestrator when subagents complete.
4. **Synthesize & Persist**: Findings are aggregated into persistent Markdown documents (`docs/`) and indexed via `graphify update .`.

---

## 3. Historical Skills & Governance Mechanisms

Historical worktrees (`old-4`, `old-5`, `old-8`) contained advanced engineering skills and governance rules that were lost during branch resets:

### A. Key Skills
1. **`skill-creator` (`.worktrees/old-8/.agents/skills/skill-creator/`)**:
   - Complete harness for authoring, evaluating, and benchmarking new agent skills.
   - Runs parallel A/B subagents (with-skill vs. baseline without-skill) and measures variance.
2. **`find-worktrees` (`.worktrees/old-8/.agents/skills/find-worktrees/`)**:
   - Automated tool using `scripts/find_worktrees.py` to scan git worktrees and dispatch subagents to compare historical branch implementations.
3. **`graph-orchestrator` (`.worktrees/old-4/.agents/skills/graph-orchestrator/`)**:
   - Enforces DAG-based task planning, detects hidden dependency edges (shared state, rate limits, schema mutations), and manages tiered models.
4. **`typed-service-contracts` (`.worktrees/old-4/.agents/skills/typed-service-contracts/`)**:
   - Implements vertical-slice Design by Contract: Zod input/output schemas, discriminated failure unions, and separation of contract vs. business logic tests.
5. **`harness-engineering` (`.worktrees/old-4/.agents/skills/harness-engineering/`)**:
   - Converts repeated agent mistakes into durable repository artifacts: constraints, failure memory (`docs/failures/`), and drift check scripts.

### B. Key Domain & Governance Rules
1. **`instruction-scoping.md` (`old-8`)**: Maintains the lean `AGENTS.md` invariant by defining exact criteria for what belongs in `AGENTS.md`, `.agents/rules/`, or `.agents/skills/`.
2. **`skills-management.md` & `external-skills-policy.md` (`old-5`)**: Mandates CLI discovery (`npx skills`), requires user consent for custom skills, and treats external skills as immutable.
3. **`fsrs-srs.md` (`old-5`)**: Complete domain specification for the Free Spaced Repetition Scheduler (FSRS) algorithm, rating formulas, and Dexie storage indices.
4. **`prefer-batch-operations.md` (`old-6`)**: Mandates batching multi-file edits and parallel agent dispatches in a single turn.
5. **`adr-always.md` (`old-6`)**: Mandates MADR architectural decision records for non-trivial decisions, registered as Ladle stories.

---

## 4. Recovery & Restoration Plan for `feature/home`

To bring the current active repository up to the peak engineering standards discovered across the historical worktrees, the following assets should be recovered:

### Phase 1: Subagent Persona Completion
Recover the missing agent profiles into `.agents/agents/`:
- [ ] **`architect`** (from `old-6`/`old-7`): Provides architectural boundary advice and system design reviews.
- [ ] **`doc-maintainer`** (from `old-6`/`old-7`): Manages MADRs, Ladle doc stories, and documentation freshness.
- [ ] **`security-reviewer`** (from `old-6`/`old-7`): Audits auth boundaries, token verification, and Firestore default-deny rules.

### Phase 2: Essential Governance Rules Recovery
Restore the proven rules into `.agents/rules/`:
- [ ] **`prefer-batch-operations.md`** (from `old-6`): Enforces batched tool calls and subagent fan-outs.
- [ ] **`instruction-scoping.md`** (from `old-8`): Enforces lean entry-point conventions.
- [ ] **`skills-management.md`** (from `old-5`): Prevents unauthorized skill creation and enforces CLI-first discovery.
- [ ] **`adr-always.md`** (from `old-6`): Formalizes MADR decision-making and Ladle documentation.
- [ ] **`fsrs-srs.md`** (from `old-5`): Standardizes the flashcard study algorithm contracts.

### Phase 3: Meta-Agent Skills Recovery
Copy the reusable meta-agent skills into `.agents/skills/`:
- [ ] **`skill-creator`** (from `old-8`): Meta-authoring and eval harness.
- [ ] **`find-worktrees`** (from `old-8`): Dedicated multi-worktree audit automation.
- [ ] **`graph-orchestrator`** (from `old-4`): DAG-based planning for large-scale refactors.
- [ ] **`grill-me`** (from `old-8`): Socratic interview harness for sharpening requirements.
