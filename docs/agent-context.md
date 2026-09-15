# Agent context strategy

This repository uses one structural knowledge system: Graphify. The graph is
local, deterministic for source code, incremental after the initial build, and
ignored by Git because its JSON/report/HTML outputs are rebuildable artifacts.

## Context ladder

Agents must use this order:

1. Existing knowledge: query Graphify, then read the specific architecture,
   product, design, decision, or skill document relevant to the task.
2. Local search: search for the requested symbol or relationship with `rg` and
   open only the matching definition and nearby callers.
3. Broad exploration: inspect directories, historical worktrees, or complete
   documents only when the first two levels cannot answer the question.

Useful Graphify queries:

```text
graphify query "who depends on <symbol>?"
graphify path "<source symbol>" "<target symbol>"
graphify explain "<symbol or domain>"
graphify query "what would be affected if <file or symbol> changes?"
```

After source changes:

```text
graphify update .
```

If the graph is missing, run the official full build once from the repository
root, then use incremental updates. Do not commit `graphify-out/`.

## Responsibilities

- Graphify: cross-file structure, dependencies, architecture, impact, paths,
  communities, and persisted query context.
- `rg`/TypeScript tooling: exact local text and compiler validation.
- Skills and `.agents/rules/`: task procedure, not a second knowledge graph.
- `AGENTS.md`: short cross-agent map and routing instructions.
- `ARCHITECTURE.md`, `SPEC.md`, `DESIGN.md`, `DECISIONS.md`: authoritative
  domain documents, loaded only when their scope applies.

Serena was evaluated and is intentionally not installed. Its symbol-level
tools could complement Graphify, but this TypeScript repository currently has
no demonstrated navigation gap that justifies another MCP server. Re-evaluate
only with measurements showing repeated full-file reads or unresolved symbol
references after Graphify queries.

## Platform usage

- Codex: use root `AGENTS.md`; Graphify's official Codex installer targets the
  same file and should not be duplicated manually.
- Gemini CLI: use root `GEMINI.md` (`@AGENTS.md`) and reload memory with
  `/memory refresh` after instruction changes. Graphify also provides the
  official `graphify gemini install` command when the user's global config is
  writable.
- Antigravity: use the project `.agents/skills/graphify/SKILL.md` and root map.
  Graphify provides `graphify antigravity install` for writable global setup.

This project deliberately does not commit per-user MCP configuration. If an
agent needs live MCP access, start Graphify's official local server against the
ignored graph and configure that agent's user-level MCP settings:

```text
python -m graphify.serve graphify-out/graph.json
```

## Measuring benefit

For comparable tasks, record before and after:

- files read, complete files opened, `rg`/grep calls, total tool calls;
- context tokens when the client reports them;
- time to locate the relevant architecture and implementation;
- repeated searches or repeated reads of the same file.

Use the same task prompt, checkout state, model, and clean session. Report
observed values only; do not infer token savings from graph size or claim a
benefit without a baseline.
