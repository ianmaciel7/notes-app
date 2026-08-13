# Graph Report - notes-app  (2026-08-13)

## Corpus Check
- 27 files · ~63,880 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 256 nodes · 233 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a7a0514`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- What You Must Do When Invoked
- /graphify
- Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification
- graphify reference: extra exports and benchmark
- Obsidian Feature and Functionality Landscape
- Obsidian Feature and Functionality Landscape
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- README.md
- biome.json
- compilerOptions
- package.json
- devDependencies
- includes
- include
- AGENTS.md
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `What You Must Do When Invoked` - 12 edges
3. `/graphify` - 10 edges
4. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
5. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
6. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
7. `Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification` - 8 edges
8. `graphify reference: extra exports and benchmark` - 8 edges
9. `include` - 7 edges
10. `Obsidian Feature and Functionality Landscape` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 1 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 2 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+7 more)

### Community 4 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 5 - "Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification"
Cohesion: 0.22
Nodes (8): API, integrations, and extensibility, Backend architecture, storage, sync, and conflict resolution, Data model and interaction flows, Executive summary, Implementation roadmap and MVP priorities, Open-source implementations and reusable components, Product surface and feature inventory, Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification

### Community 6 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 7 - "Obsidian Feature and Functionality Landscape"
Cohesion: 0.25
Nodes (7): Architecture and comprehensive capability map, Developer API and community ecosystem, Executive summary, Mobile and platform capabilities, Obsidian Feature and Functionality Landscape, Official plugins and high-value native workflows, Sync, Publish, and pricing

### Community 8 - "Obsidian Feature and Functionality Landscape"
Cohesion: 0.25
Nodes (7): Architecture and comprehensive capability map, Developer API and community ecosystem, Executive summary, Mobile and platform capabilities, Obsidian Feature and Functionality Landscape, Official plugins and high-value native workflows, Sync, Publish, and pricing

### Community 9 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 10 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 11 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 12 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 16 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 17 - "biome.json"
Cohesion: 0.08
Nodes (23): source, assist, actions, css, parser, next, react, formatter (+15 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 19 - "package.json"
Cohesion: 0.11
Nodes (17): next, dependencies, next, react, react-dom, name, packageManager, private (+9 more)

### Community 20 - "devDependencies"
Cohesion: 0.12
Nodes (17): babel-plugin-react-compiler, @biomejs/biome, devDependencies, babel-plugin-react-compiler, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 21 - "includes"
Cohesion: 0.13
Nodes (12): files, ignoreUnknown, includes, !node_modules, nextConfig, **, !build, !dist (+4 more)

### Community 22 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, exclude, include (+1 more)

## Knowledge Gaps
- **173 isolated node(s):** `This is NOT the Next.js you know`, `Getting Started`, `Learn More`, `Deploy on Vercel`, `$schema` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `files` connect `includes` to `biome.json`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `This is NOT the Next.js you know`, `Getting Started`, `Learn More` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._