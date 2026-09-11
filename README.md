# Notes App (Unified Study & Knowledge System)

This repository is a local-first, zero-operating-cost web application unifying Capacities-style object architecture, Readwise document ingestion, and Anki SRS spaced repetition.

## Folder Architecture & Reference Worktrees

- **`.agents/`**: Agent configuration, lifecycle hooks (`hooks.json`), agent rules (`rules/graphify.md`), and installed skills (`skills/graphify`).
- **`graphify-out/`**: Knowledge graph outputs (`graph.json`, `graph.html`, `GRAPH_REPORT.md`, `wiki/`). Generated and maintained by Graphify.
- **`.worktrees/`**: Historical iterations and reference implementations of the project:
  - **`.worktrees/old`**: Initial Capacities & Readwise integration baseline.
  - **`.worktrees/old-2`**: Secondary revision with OpenSpec & reverse engineering specs.
  - **`.worktrees/old-3`**: Extended iteration with document parsing & SRS burndown prototypes.
  - **`.worktrees/old-4`**: Multi-file parity roadmap, sync protocol, and frontend bootstrap reference.
  - **`.worktrees/old-5`**: Complete Capacities component behavior map reference, Next.js 16 + React 19 architecture, FSRS engine, and AI gateway proxies.

> **Note for AI Agents**: Use `.worktrees/old` through `.worktrees/old-5` as historical reference implementations when implementing or porting features into the main codebase.