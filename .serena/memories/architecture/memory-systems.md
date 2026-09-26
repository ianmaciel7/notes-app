# Memory Systems and Architecture Knowledge

## Overview
This memory record provides agents and tools with the complete reference of all memory and persistence forms in the `notes-app` repository, across AI engineering tools, MCPs, and the product domain.

## 1. AI Agents, MCPs, and Tools Memory
- **Serena Memory (`mcp-server-serena`)**:
  - Location: `.serena/memories/` (persisted Markdown documents).
  - Tools: `write_memory`, `read_memory`, `list_memories`, `edit_memory`, `delete_memory`.
  - Used for persistent operational policies, architecture guidelines, and durable agent conventions.
- **Graphify Work-Memory (`mcp-server-graphify`)**:
  - Location: `graphify-out/graph.json` (code graph) and `graphify-out/memory/` (work-memory loop).
  - Tracks navigation paths, code relationships, and query feedback (`useful`, `dead_end`, `corrected`) to continually improve agent reasoning across sessions.
- **Agent Context vs Disk Persistence Rule**:
  - Context window memory is volatile and lost during compaction (`subagent-driven-development/SKILL.md`).
  - Durable task memory must always be persisted to repository markdown files (`docs/exec-plans/active/`, `docs/`, or `.serena/memories/`).
- **No Training Memory Rule**:
  - Agents must not invent commands, SDK APIs, or domain concepts from unverified pre-trained memory. Always query `ctx7`, Serena, or repository docs (`command-invariants.md`).

## 2. Product Domain Memory (`CONTEXT.md`)
- **Review (`Review`)**: Spaced memorization powered by the FSRS algorithm, scheduling questions nearing the human forgetting curve.
- **Attempt (`Attempt`)**: Immutable, append-only log recording every user answer to drive memory retention statistics.
- **Target Retention (`DailyLimit`)**: Target memory retention probability configured for spaced repetition (e.g., 90%).
- **Leech (`Leech`)**: Automatic detection of recurring memory failure (default: 8 "Forgot" reviews).
- **Version History (`VersionHistory`)**: Temporal revision tracking for user objects.
- **Saved Chat (`Chat`)**: AI dialogues persisted as first-class domain objects with source citation links.

## 3. Canonical Architecture Guide
- Full flow and diagram: `docs/guide/memory-architecture-flow.md`.
