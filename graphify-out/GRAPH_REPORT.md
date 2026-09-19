# Graph Report - notes-app  (2026-09-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 189 nodes · 179 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.58)
- Token cost: 80,997 input · 1,227 output

## Graph Freshness
- Built from commit: `06954a66`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Package Config Metadata
- shadcn UI Config
- Biome Formatter Config
- TypeScript Compiler Config
- Repomix Output Settings
- Repomix Ignore Security
- Next.js Starter Assets
- Next.js App Layout
- Runtime Dependencies
- Dev Dependencies
- Next.js Lint Rules
- npm Scripts
- Repomix Git Settings
- Agent Instructions Files
- Graphify Skill Setup
- RTK CLI Proxy
- PostCSS Config
- Serena Project Config

## God Nodes (most connected - your core abstractions)
1. `output` - 18 edges
2. `compilerOptions` - 16 edges
3. `aliases` - 6 edges
4. `tailwind` - 6 edges
5. `scripts` - 6 edges
6. `git` - 6 edges
7. `ignore` - 5 edges
8. `linter` - 4 edges
9. `formatter` - 4 edges
10. `vcs` - 4 edges

## Surprising Connections (you probably didn't know these)
- `graphify (workflow)` --conceptually_related_to--> `graphify (rules)`  [INFERRED]
  .agents/workflows/graphify.md → .agents/rules/graphify.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Agent Rules Generation Flow** — agents, claude, node_modules_next_dist_server_lib_generate_agent_files [EXTRACTED 0.85]
- **Default Next.js Template Assets** — src_app_page, public_next, public_vercel, public_globe, public_file, public_window [INFERRED 0.50]
- **Graphify Knowledge Graph Integration** — gemini, agents_rules_graphify, agents_workflows_graphify [INFERRED 0.75]

## Communities (19 total, 6 thin omitted)

### Community 0 - "Package Config Metadata"
Cohesion: 0.08
Nodes (23): name, packageManager, private, version, babel-plugin-react-compiler, @base-ui/react, ref_base_ui_react_button, @biomejs/biome (+15 more)

### Community 1 - "shadcn UI Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 2 - "Biome Formatter Config"
Cohesion: 0.10
Nodes (19): source, assist, actions, css, parser, files, ignoreUnknown, includes (+11 more)

### Community 3 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "Repomix Output Settings"
Cohesion: 0.12
Nodes (17): output, compress, copyToClipboard, directoryStructure, filePath, filePathStyle, files, fileSummary (+9 more)

### Community 5 - "Repomix Ignore Security"
Cohesion: 0.14
Nodes (13): ignore, customPatterns, useDefaultPatterns, useDotIgnore, useGitignore, include, input, maxFileSize (+5 more)

### Community 6 - "Next.js Starter Assets"
Cohesion: 0.18
Nodes (3): Next.js Framework, Vercel Platform, ref_next_image

### Community 7 - "Next.js App Layout"
Cohesion: 0.20
Nodes (7): nextConfig, next, ref_next_font_google, src_app_globals, geistMono, geistSans, metadata

### Community 8 - "Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @base-ui/react, class-variance-authority, cn, lucide-react, next, react, react-dom (+2 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, babel-plugin-react-compiler, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 10 - "Next.js Lint Rules"
Cohesion: 0.29
Nodes (7): next, react, linter, domains, enabled, rules, recommended

### Community 11 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, format, lint, start

### Community 12 - "Repomix Git Settings"
Cohesion: 0.33
Nodes (6): includeDiffs, includeLogs, includeLogsCount, sortByChanges, sortByChangesMaxCommits, git

## Knowledge Gaps
- **132 isolated node(s):** `name`, `packageManager`, `private`, `version`, `babel-plugin-react-compiler` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `output` connect `Repomix Output Settings` to `Repomix Git Settings`, `Repomix Ignore Security`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Config Metadata`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `next` connect `Next.js App Layout` to `Package Config Metadata`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `name`, `packageManager`, `private` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Config Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `shadcn UI Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Biome Formatter Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._