---
name: worktree-scout
description: Dispatches specialized subagents to explore, analyze, and extract prior-art architecture, domain patterns, and companion contract tests from git worktrees (.worktrees/old-*), and persists the synthesized findings into Serena memory, Graphify knowledge graph, or implementation plans. Trigger whenever the user mentions worktrees, scouting old branches, recovering code or patterns from .worktrees, checking how prior branches solved auth/editor/study/sync, or asks to synthesize worktree findings into plans.
---

# Worktree Scout

Orchestrates read-only research across historical Git worktrees in `.worktrees/old-*` (`old`, `old-1` ... `old-9`) using specialized subagents, and persists findings to maintain long-term context across sessions.

## Core Rules & Invariants

1. **Strict Runtime Isolation**: Never import or execute code from `.worktrees/` at runtime. Worktrees are prior-art evidence and design blueprints, not runtime dependencies.
2. **Subagent Delegation (Per-Worktree)**: Do not read multiple large worktree files sequentially in the main orchestrator context. Dispatch targeted subagents scoped per individual worktree (1:1 dedicated worktree per subagent) for maximum context isolation and precision.
3. **Prefer Light Models**: Always specify `"Model": "flash_lite"` (or `"flash"` when complex synthesis is required) when dispatching subagents for worktree exploration. Never default to heavy or `inherit` models for read-only research tasks.
4. **Leverage Graphify Skill**: Always consult Graphify (`query_graph` or `graphify query ...`, `get_node`, `shortest_path`) to map architectural relationships, communities, and god nodes before or alongside scouting. After documenting or persisting findings, run `graphify update .`.
5. **Lean Context Citing**: Subagents must quote at most 15 lines per citation and summarize architectural rationale, file paths, and contract boundaries.
6. **Persistent Knowledge Storage**: Always save synthesized findings in at least one persistent store:
   - **Serena Memory**: Use `write_memory(memory_name, content)` for enduring architectural lessons and domain contracts.
   - **Graphify Knowledge Graph**: Run `graphify update .` after adding documentation or syncing knowledge nodes.
   - **Structured Plans / Docs**: Write synthesis reports to `.agents/docs/` or update sections in `plan.md`.

---

## Worktree Navigation Index

Consult [evidence-map.md](./references/evidence-map.md) for the authoritative mapping of worktrees:

| Target Subsystem | Primary Worktree | Secondary Worktrees |
|---|---|---|
| **Auth, Tenancy & Revisions** | `.worktrees/old-9` | `.worktrees/old-5` |
| **Block Editor, Slash Commands & Contracts** | `.worktrees/old-4` | `.worktrees/old-6` |
| **Responsive Shell, ARIA & Focus Trap** | `.worktrees/old-2` | `.worktrees/old-4` |
| **Offline Sync Queue & Telemetry** | `.worktrees/old-5` | `.worktrees/old-6` |
| **Card Viewer & Study Sessions** | `.worktrees/old-8` | `.worktrees/old-9`, `.worktrees/old-5` |
| **AI Ingestion & Plugins** | `.worktrees/old-7` | `.worktrees/old-5` |

---

## Execution Workflow

### Step 1: Scope & Graphify Pre-Query
1. Identify the subsystem to investigate and select target worktrees.
2. Use the `graphify` skill (`query_graph` or `graphify query`) to inspect existing architecture, communities, and known dependencies.

### Step 2: Dispatch Subagents in Parallel (Per Worktree, Light Model)
Use `invoke_subagent` to launch one `research` subagent per target worktree, always configuring `"Model": "flash_lite"` (or `"flash"`):

```json
[
  {
    "Role": "Worktree Old-9 Scout",
    "TypeName": "research",
    "Model": "flash_lite",
    "Prompt": "Investigate space tenancy and server action authentication in .worktrees/old-9/src/data/action-auth.ts and companion tests. Quote <= 15 lines per citation. Do NOT edit files."
  },
  {
    "Role": "Worktree Old-4 Scout",
    "TypeName": "research",
    "Model": "flash_lite",
    "Prompt": "Analyze block editor contracts in .worktrees/old-4/tests/block-editor-contract.test.mjs. Summarize invariants and test assertions. Do NOT edit files."
  }
]
```

### Step 3: Synthesize & Extract "Minimal Test per Code" Patterns
When subagents report back:
- Extract the core architectural invariants.
- Identify the companion test files (unit test vectors, contract specs).
- Highlight trade-offs between different worktrees (e.g. `old-4` custom block editor vs `old-6` Plate.js editor; `old-9` FSRS vs active SM-2).

### Step 4: Persist Findings
Save the findings to preserve knowledge:

1. **Serena Memory**:
   Call `write_memory` with an informative slug:
   - `worktree-auth-patterns`: Tenant isolation contracts and permission rules.
   - `worktree-editor-patterns`: Block editor schemas and event lifecycle.
   - `worktree-study-patterns`: Spaced repetition algorithms and scheduling queues.

2. **Project Documentation**:
   Update or write to `.agents/docs/` (e.g. `.agents/docs/worktree-synthesis-<topic>.md`) or append to `plan.md`.

3. **Graphify Graph**:
   Run `graphify update .` to update the codebase knowledge graph with any new markdown documents or architectural notes.
