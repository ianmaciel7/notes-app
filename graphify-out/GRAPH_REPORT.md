# Graph Report - notes-app  (2026-08-13)

## Corpus Check
- 24 files · ~5,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 222 nodes · 205 edges · 24 communities (21 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05b40423`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- compilerOptions
- biome.json
- includes
- ADDED Requirements
- scripts
- package.json
- check-graphify.mjs
- include
- linter
- proposal.md
- Requirement: Local Verification Command
- README.md
- AGENTS.md
- postcss.config.mjs
- page.tsx
- Contributing
- Deployment
- Security
- Testing

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 14 edges
3. `Contributing` - 12 edges
4. `Deployment` - 9 edges
5. `Security` - 8 edges
6. `includes` - 7 edges
7. `include` - 7 edges
8. `Testing` - 7 edges
9. `ADDED Requirements` - 6 edges
10. `vcs` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (24 total, 3 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.06
Nodes (31): babel-plugin-react-compiler, @biomejs/biome, jsdom, devDependencies, babel-plugin-react-compiler, @biomejs/biome, jsdom, tailwindcss (+23 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 2 - "biome.json"
Cohesion: 0.12
Nodes (16): source, assist, actions, css, parser, formatter, enabled, indentStyle (+8 more)

### Community 3 - "includes"
Cohesion: 0.12
Nodes (13): files, ignoreUnknown, includes, !node_modules, nextConfig, **, !build, !dist (+5 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Branch Protection Source Files, Requirement: Dependency Maintenance, Requirement: Deployment Boundary, Requirement: Pull Request Quality Gates, Requirement: Security Validation, Scenario: Cloud deployment is added, Scenario: Code scanning (+9 more)

### Community 5 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, graphify:check, graphify:update, lint (+6 more)

### Community 6 - "package.json"
Cohesion: 0.17
Nodes (11): next, dependencies, next, react, react-dom, name, packageManager, private (+3 more)

### Community 7 - "check-graphify.mjs"
Cohesion: 0.20
Nodes (10): fail(), failures, graphDir, graphPath, htmlPath, manifestPath, readJson(), reportPath (+2 more)

### Community 8 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, exclude, include (+1 more)

### Community 9 - "linter"
Cohesion: 0.29
Nodes (7): next, react, linter, domains, enabled, rules, recommended

### Community 10 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 11 - "Requirement: Local Verification Command"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Local Verification Command, Scenario: Developer runs local verification, Scenario: Developer runs page tests

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 19 - "Contributing"
Cohesion: 0.15
Nodes (12): Branch Naming, CI And Merge, Commit, Contributing, Git Workflow, Local Development, Production Promotion, Pull Request (+4 more)

### Community 20 - "Deployment"
Cohesion: 0.20
Nodes (9): Build, CI/CD Boundary, Cloud Authentication, Deployment, Deployment Triggers, Environments, Recommended Delivery Flow, Rollback (+1 more)

### Community 21 - "Security"
Cohesion: 0.22
Nodes (8): Agent Work, Application Expectations, Dependencies, GitHub Actions Supply Chain, Reporting, Secrets, Security, Static Analysis

### Community 22 - "Testing"
Cohesion: 0.25
Nodes (7): CI, Coverage, Current State, Definition Of Done, Local Verification, Testing, Verification Loop

## Knowledge Gaps
- **145 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `biome.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `includes` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._