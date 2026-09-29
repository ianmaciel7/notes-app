# Search & Discovery Workflow

This document defines the canonical hierarchy and decision matrix for searching, navigating, and inspecting code, architecture, and documentation in the project.

---

## 1. Decision Hierarchy

When searching for information, agents and developers MUST use the most specialized and token-efficient tool that matches the intent:

```mermaid
flowchart TD
    Start["Information Need"] --> Type{"Query Intent?"}

    %% Architecture & Cross-file
    Type -->|"Architecture, cross-module flow, or impact"| Arch["1. Graphify MCP / CLI"]
    Arch --> ArchQuery["query_graph or shortest_path"]
    ArchQuery --> ArchReport["graphify-out/GRAPH_REPORT.md"]

    %% Code symbols & Semantic references
    Type -->|"Symbol definition, usage, or implementation"| Semantic["2. Serena MCP"]
    Semantic --> SemSymbol["find_symbol / find_referencing_symbols"]
    Semantic --> SemOverview["get_symbols_overview / find_declaration"]

    %% Syntax patterns & AST structure
    Type -->|"Syntax patterns, JSX, hooks, outlines"| AST["3. ast-grep"]
    AST --> ASTOutline["ast-grep outline"]
    AST --> ASTScan["ast-grep run / scan"]

    %% File paths & exact string matches
    Type -->|"File location or exact literal text"| FastSearch["4. Quick Discovery"]
    FastSearch --> Files["rtk rg --files / search_files"]
    FastSearch --> TextSearch["rtk rg '<pattern>'"]

    %% External libraries & APIs
    Type -->|"Third-party library, framework, or SDK"| LibDocs["5. Context7 CLI"]
    LibDocs --> CtxSearch["ctx7 library '<lib>' -> ctx7 docs '<id>'"]

    %% Repository snapshots
    Type -->|"Broad context consolidation"| Snapshot["6. Repomix"]
    Snapshot --> RepoPack["repomix (repomix.config.json)"]
```

---

## 2. Invariants & Tool Routing

| Intent | Primary Canonical Route | Fallback / Complementary |
| :--- | :--- | :--- |
| **Locate file path by name** | `search_files` (Filesystem MCP) / `find_file` (Serena) | `rtk rg --files` |
| **Search exact text or string pattern** | `search_for_pattern` (Serena MCP) | `rtk rg "<pattern>"` |
| **Inspect symbols, callers, and definitions** | `find_symbol` / `find_referencing_symbols` (Serena) | `get_symbols_overview` |
| **Analyze module relationships & call chains** | `query_graph` / `shortest_path` (Graphify MCP) | `graphify-out/GRAPH_REPORT.md` |
| **Outline file structure before reading** | `get_symbols_overview` (Serena) / `ast-grep outline` | `view_file` |
| **Search structural code/AST patterns** | `ast-grep scan` / `ast-grep run` | Serena MCP |
| **Third-party library & API docs** | Context7 (`ctx7 library` → `ctx7 docs`) | `search_web` (only if not on ctx7) |
| **Analyze commit history & diffs** | `git_log` / `git_diff` / `git_status` (Git MCP) | `rtk git log` |
| **Full repository context dump** | Repomix (`repomix.config.json` / `repomix`) | — |

---

## 3. Best Practices & Token Economy

- **Do Not Dump Whole Large Files**: Run `ast-grep outline` or `get_symbols_overview` first before reading entire multi-hundred line source files.
- **Graphify First for Architecture**: Query `graphify-out/` before manually tracing imports across multiple directories.
- **Context7 Over Web Search for Libraries**: Always query official docs via `ctx7` before performing generic web searches.
- **Relative Paths Only**: Keep all documentation references relative to the repository root.
