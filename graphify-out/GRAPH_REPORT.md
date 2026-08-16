# Graph Report - .  (2026-08-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 310 nodes · 395 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a1a486b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- workspace-shell.tsx
- audit-capacities-visual.mjs
- devDependencies
- includes
- dependencies
- biome.json
- extract-capacities-reference.mjs
- scripts
- compilerOptions
- workspace-audit-data.ts
- workspace-navigation.ts
- check-graphify.mjs
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 34 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 14 edges
4. `includes` - 7 edges
5. `include` - 7 edges
6. `WorkspaceShell()` - 6 edges
7. `normalizeText()` - 6 edges
8. `loadWorkspaceAuditData()` - 6 edges
9. `attributesFor()` - 5 edges
10. `elements` - 5 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `!node_modules`  [EXTRACTED]
  tsconfig.json → biome.json
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `CreatedObjectCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/workspace-shell.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "workspace-shell.tsx"
Cohesion: 0.06
Nodes (48): CapacitiesSidebarIcon(), CapacitiesSidebarIconName, IconPath, paths, Badge(), badgeVariants, Button, ButtonProps (+40 more)

### Community 1 - "audit-capacities-visual.mjs"
Cohesion: 0.06
Nodes (27): artifactsDir, beforePath, chatPanel, consoleErrors, correctedPath, dayPanel, designTokens, diffPath (+19 more)

### Community 2 - "devDependencies"
Cohesion: 0.06
Nodes (34): babel-plugin-react-compiler, @biomejs/biome, jsdom, devDependencies, babel-plugin-react-compiler, @biomejs/biome, jsdom, playwright (+26 more)

### Community 3 - "includes"
Cohesion: 0.08
Nodes (21): files, ignoreUnknown, includes, !node_modules, nextConfig, **, !build, !dist (+13 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, lucide-react, next, dependencies, class-variance-authority, clsx, lucide-react (+17 more)

### Community 5 - "biome.json"
Cohesion: 0.08
Nodes (23): source, assist, actions, css, parser, next, react, formatter (+15 more)

### Community 6 - "extract-capacities-reference.mjs"
Cohesion: 0.17
Nodes (19): allElements, attributesFor(), designTokens, dom, elementIdByElement, elements, indexByElement, isRelevant() (+11 more)

### Community 7 - "scripts"
Cohesion: 0.11
Nodes (18): name, packageManager, private, scripts, build, dev, format, format:check (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 9 - "workspace-audit-data.ts"
Cohesion: 0.22
Nodes (11): AuditLoadProgress, AuditLoadResult, AuditMessage, AuditState, cloneFixture(), isCompleteFixture(), loadWorkspaceAuditData(), nextTurn() (+3 more)

### Community 10 - "workspace-navigation.ts"
Cohesion: 0.23
Nodes (6): Home(), WorkspaceShell(), NavigationGroup, navigationGroups, NavigationIcon, NavigationItem

### Community 11 - "check-graphify.mjs"
Cohesion: 0.20
Nodes (10): fail(), failures, graphDir, graphPath, htmlPath, manifestPath, readJson(), reportPath (+2 more)

## Knowledge Gaps
- **150 isolated node(s):** `IconPath`, `ButtonProps`, `ContextPaletteItem`, `ContextTabId`, `AuditLoadProgress` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `IconPath`, `ButtonProps`, `ContextPaletteItem` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `workspace-shell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05576923076923077 - nodes in this community are weakly interconnected._
- **Should `audit-capacities-visual.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `includes` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._