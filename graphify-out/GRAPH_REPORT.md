# Graph Report - .  (2026-08-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1032 nodes · 956 edges · 111 communities (96 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a7a0514`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- devDependencies
- acquire-codebase-knowledge/SKILL.md
- biome.json
- Tier A - Official platform sources
- What You Must Do When Invoked
- ADDED Requirements
- Find Plugins
- openspec-onboard/SKILL.md
- Test API
- Mocking
- opsx-onboard.md
- Agent Governance Patterns
- Trust, Provenance, and Safety Model
- Vi Utilities
- Describe API
- postcss.config.mjs
- Code Coverage
- vitest/SKILL.md
- Expect API
- Test Environments
- Type Testing
- Test Filtering
- Commands
- Lifecycle Hooks
- Snapshot Testing
- graph-orchestrator/README.md
- Adoption Workflow
- Concurrency & Parallelism
- ADDED Requirements
- Agent Instructions
- Agentic Evaluation Patterns
- Projects
- Contributing
- Acquire Codebase Knowledge
- Compatibility and Capability Evidence
- Graph Orchestrator
- How to use it
- AGENTS.md Specification
- openspec-explore/SKILL.md
- Core Operational Rules
- Core Sections (Required)
- Core Sections (Required)
- Core Sections (Required)
- Core Sections (Required)
- Graph Engineering: Patterns and Failure Modes
- Test Context & Fixtures
- opsx-explore.md
- Next.js Server Architecture Rule
- Sources
- graphify reference: extra exports and benchmark
- Core Concepts
- Configuration
- Reporters
- Architecture
- Deployment
- Maintaining AGENTS.md
- Output Format
- Testing
- Security
- Benchmarking (v5)
- Test Tags (4.1+)
- Design
- graphify reference: query, path, explain
- Agent Context Efficiency Audit
- Graphify Infrastructure
- Notes App
- proposal.md
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- browser-use.md
- codex-mcp-plugin-sync.md
- git-workflow.md
- rules/graphify.md
- openspec-first.md
- plugin-preference.md
- shadcn-first.md
- extraction-spec.md
- GENERATION.md
- workflows/graphify.md
- GEMINI.md
- tasks.md

## God Nodes (most connected - your core abstractions)
1. `Vi Utilities` - 18 edges
2. `compilerOptions` - 16 edges
3. `Mocking` - 16 edges
4. `Type Testing` - 16 edges
5. `Find Plugins` - 16 edges
6. `Snapshot Testing` - 15 edges
7. `Expect API` - 14 edges
8. `Test Environments` - 14 edges
9. `Test Filtering` - 14 edges
10. `Agent Governance Patterns` - 13 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (111 total, 15 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 1 - "devDependencies"
Cohesion: 0.06
Nodes (34): babel-plugin-react-compiler, @biomejs/biome, next, dependencies, next, react, react-dom, devDependencies (+26 more)

### Community 2 - "acquire-codebase-knowledge/SKILL.md"
Cohesion: 0.04
Nodes (43): 1) Top Risks (Prioritized), 2) Technical Debt, 3) Security Concerns, 4) Performance and Scaling Concerns, 5) Fragile/High-Churn Areas, 6) `[ASK USER]` Questions, 7) Evidence, Codebase Concerns (+35 more)

### Community 3 - "biome.json"
Cohesion: 0.05
Nodes (35): source, assist, actions, css, parser, next, react, files (+27 more)

### Community 4 - "Tier A - Official platform sources"
Cohesion: 0.08
Nodes (25): 777genius universal plugins, Agent Plugins Directory, Agent Plugins standard, AI Plugin Marketplace, Anthropic / Claude Code, Claude Code Plugins Plus Skills / CCPI catalog, Completeness, Cursor (+17 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: Agent-Agnostic Configuration Ownership, Requirement: Environment Contract, Requirement: Markdown Path Portability, Requirement: MCP Recommendation Boundaries, Requirement: OpenSpec Change Gate, Requirement: OpenSpec Responsibility Boundary, Requirement: Shadcn-First UI Composition (+15 more)

### Community 7 - "Find Plugins"
Cohesion: 0.09
Nodes (21): Anthropic / Claude Code, Compatibility, Cross-source comparison, Cursor, Deduplication, Discovery priority, Find Plugins, Google Antigravity / AGY (+13 more)

### Community 8 - "openspec-onboard/SKILL.md"
Cohesion: 0.10
Nodes (19): Codebase Analysis, Graceful Exit Handling, Guardrails, Phase 10: Archive, Phase 11: Recap & Next Steps, Phase 1: Welcome, Phase 2: Task Selection, Phase 3: Explore Demo (+11 more)

### Community 9 - "Test API"
Cohesion: 0.10
Nodes (20): Async Tests, Basic Test, Benchmarks (v5), Concurrent Tests, Custom Test with Fixtures, Failing Tests, Focus Tests, Key Points (+12 more)

### Community 10 - "Mocking"
Cohesion: 0.10
Nodes (20): Async Timer Methods, Auto-Cleanup with `using`, Auto-mock with Spy, Clearing Mocks, Conditional Mocking with vi.when (v5), Config Auto-Reset, Dynamic Mocking (vi.doMock), Hoisted Variables for Mocks (+12 more)

### Community 11 - "opsx-onboard.md"
Cohesion: 0.10
Nodes (19): Codebase Analysis, Graceful Exit Handling, Guardrails, Phase 10: Archive, Phase 11: Recap & Next Steps, Phase 1: Welcome, Phase 2: Task Selection, Phase 3: Explore Demo (+11 more)

### Community 12 - "Agent Governance Patterns"
Cohesion: 0.11
Nodes (18): Agent Governance Patterns, Best Practices, CrewAI, Governance Levels, OpenAI Agents SDK, Overview, Pattern 1: Governance Policy, Pattern 2: Semantic Intent Classification (+10 more)

### Community 13 - "Trust, Provenance, and Safety Model"
Cohesion: 0.11
Nodes (18): 1. Trust, 2. Format / schema status, 3. Provenance chain, 4. Official-status evidence, 5. Read-only safety boundary, 6. Metadata mismatch, 7. Popularity, COMMUNITY (+10 more)

### Community 14 - "Vi Utilities"
Cohesion: 0.11
Nodes (18): Assertion Helpers — vi.defineHelper (4.1+), Conditional Mocking — vi.when (v5), Dynamic Mocking, Fake Timers, Global/Env Mocking, Global Mock Management, Hoisted Code, Key Points (+10 more)

### Community 15 - "Describe API"
Cohesion: 0.11
Nodes (17): Basic Usage, Concurrent Suites, Describe API, describe.each, describe.for, Focus Suites, Hooks in Suites, Key Points (+9 more)

### Community 18 - "Code Coverage"
Cohesion: 0.11
Nodes (17): CI Integration, Code Coverage, Configuration, Coverage with Sharding, Ignoring Code, Istanbul, Istanbul, Key Points (+9 more)

### Community 19 - "vitest/SKILL.md"
Cohesion: 0.20
Nodes (3): Advanced, Core, Features

### Community 20 - "Expect API"
Cohesion: 0.12
Nodes (16): Assertion Count, Asymmetric Matchers, Basic Assertions, Chai-Style Spy Assertions (4.1+), Conditional Mock Exhaustion (v5), Error Assertions, Expect API, Extending Matchers (+8 more)

### Community 21 - "Test Environments"
Cohesion: 0.12
Nodes (15): Available Environments, Browser Mode (Separate from Environments), Configuration, CSS and Assets, Custom Environment, Environment with VM, Fixing External Dependencies, happy-dom Environment (+7 more)

### Community 22 - "Type Testing"
Cohesion: 0.12
Nodes (16): assertType, Branded Types, Configuration, Equality vs Matching, expectTypeOf API, Function Types, Generic Types, Key Points (+8 more)

### Community 23 - "Test Filtering"
Cohesion: 0.12
Nodes (16): By File Path, By Test Name, Changed Files, CLI Filtering, Combining Filters, Environment-based Filtering, Focus Tests (.only), Include/Exclude Patterns (+8 more)

### Community 24 - "Commands"
Cohesion: 0.13
Nodes (15): Command Line Interface, Commands, Common Options, Key Points, Package.json Scripts, Sharding for CI, `vitest`, `vitest bench` (+7 more)

### Community 25 - "Lifecycle Hooks"
Cohesion: 0.13
Nodes (14): Around Hooks, aroundAll, Basic Hooks, Cleanup Return Pattern, Concurrent Test Hooks, Extended Test Hooks, Hook Execution Order, Hook Timeout (+6 more)

### Community 26 - "Snapshot Testing"
Cohesion: 0.13
Nodes (15): Basic Snapshot, Concurrent Test Snapshots, Custom Serializers, Custom Snapshot Matchers (4.1+), Error Snapshots, File Snapshots, Inline Snapshots, Key Points (+7 more)

### Community 27 - "graph-orchestrator/README.md"
Cohesion: 0.14
Nodes (12): Design notes, Install, License, Repo structure, The problem, What a run looks like, What it does, What it doesn't do (+4 more)

### Community 28 - "Adoption Workflow"
Cohesion: 0.14
Nodes (13): 1. Choose the Harness Surface, 2. Write Agent Instructions, 3. Add Enforceable Checks, 4. Record Failure Memory, 5. Add Drift Checks, 6. Report the Adoption, Adoption Workflow, Core Principles (+5 more)

### Community 29 - "Concurrency & Parallelism"
Cohesion: 0.14
Nodes (14): Bail on Failure, CI Example (GitHub Actions), Concurrency & Parallelism, Concurrent Tests, File Parallelism, Isolation, Key Points, Max Concurrency (+6 more)

### Community 30 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: Bounded Failure Handling, Requirement: Focused Subagent Delegation, Requirement: Human Gates, Requirement: Main Agent Loop, Requirement: Software and OpenSpec Verification Separation, Scenario: Delegating work, Scenario: High-impact operation (+5 more)

### Community 31 - "Agent Instructions"
Cohesion: 0.15
Nodes (12): Agent Instructions, Canonical Agent Configuration, Environment, Failure And Stop Conditions, Graphify, Human Gates, Mandatory Conventions, Minimal Agent Loop (+4 more)

### Community 32 - "Agentic Evaluation Patterns"
Cohesion: 0.15
Nodes (12): Agentic Evaluation Patterns, Best Practices, Evaluation Strategies, LLM-as-Judge, Outcome-Based, Overview, Pattern 1: Basic Reflection, Pattern 2: Evaluator-Optimizer (+4 more)

### Community 33 - "Projects"
Cohesion: 0.15
Nodes (13): Basic Projects Setup, Browser + Node Projects, Different Environments, Global Setup per Project, Key Points, Monorepo Pattern, Per-Project Pool & Isolation (v4), Project-Specific Dependencies (+5 more)

### Community 34 - "Contributing"
Cohesion: 0.15
Nodes (12): Branch Naming, Changelog, CI And Required Checks, Commit, Contributing, Git Workflow, Local Development, Production Promotion (+4 more)

### Community 35 - "Acquire Codebase Knowledge"
Cohesion: 0.17
Nodes (12): Acquire Codebase Knowledge, Anti-Patterns, Bundled Assets, Enhanced Scan Output Sections, Focus Area Mode, Gotchas, Output Contract (Required), Phase 1: Scan and Read Intent (+4 more)

### Community 36 - "Compatibility and Capability Evidence"
Cohesion: 0.17
Nodes (11): Canonical identity, Capability matrix, CLAIMED, Compatibility and Capability Evidence, Compatibility statuses, First-party preference, Graceful degradation, INCOMPATIBLE (+3 more)

### Community 37 - "Graph Orchestrator"
Cohesion: 0.17
Nodes (11): Executing the phases, Fan-in is where quality is actually lost, Further reading, Graph Orchestrator, Hidden edges, Irreversible actions, Model tiering, Output format (+3 more)

### Community 38 - "How to use it"
Cohesion: 0.17
Nodes (11): 1. The Spec (`spec.ts`), 2. The Handler (`handler.ts`), A. Contract Tests (Schema), Architecture Components, B. Logic Tests (Handler), How to use it, Step 1: Define the Contract (`spec.ts`), Step 2: Implement the Handler (`handler.ts`) (+3 more)

### Community 39 - "AGENTS.md Specification"
Cohesion: 0.18
Nodes (10): AGENTS.md Specification, Evaluation, Intent, Known Limitations, Maintenance Notes, Reference Architecture, Runtime Contract, Scope (+2 more)

### Community 40 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 41 - "Core Operational Rules"
Cohesion: 0.18
Nodes (10): 1. No "Horizontal Splurging", 2. Impose Backpressure, 3. Verification of Integrity, Core Operational Rules, Example Workflow (TypeScript + Vitest), Phase 1: Red (Establish Failure), Phase 2: Green (Minimal Pass), Phase 3: Refactor (Clean Up) (+2 more)

### Community 42 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Architectural Style, 2) System Flow, 3) Layer/Module Responsibilities, 4) Reused Patterns, 5) Known Architectural Risks, 6) Evidence, Architecture, Core Sections (Required) (+1 more)

### Community 43 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Naming Rules, 2) Formatting and Linting, 3) Import and Module Conventions, 4) Error and Logging Conventions, 5) Testing Conventions, 6) Evidence, Coding Conventions, Core Sections (Required) (+1 more)

### Community 44 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Integration Inventory, 2) Data Stores, 3) Secrets and Credentials Handling, 4) Reliability and Failure Behavior, 5) Observability for Integrations, 6) Evidence, Core Sections (Required), Extended Sections (Optional) (+1 more)

### Community 45 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Test Stack and Commands, 2) Test Layout, 3) Test Scope Matrix, 4) Mocking and Isolation Strategy, 5) Coverage and Quality Signals, 6) Evidence, Core Sections (Required), Extended Sections (Optional) (+1 more)

### Community 46 - "Graph Engineering: Patterns and Failure Modes"
Cohesion: 0.20
Nodes (9): A worked example, Contents, Dependency audit, Failure modes, Graph Engineering: Patterns and Failure Modes, Phases, Sizing guidance, What the naive version looks like (+1 more)

### Community 47 - "Test Context & Fixtures"
Cohesion: 0.20
Nodes (10): Built-in Context, Composing & Hooks, Custom Fixtures — Builder Pattern (4.1+, recommended), Fixture Options, Fixture Scopes (3.2+), Injected Fixtures (per-project values), Key Points, Object Syntax (Playwright-compatible) (+2 more)

### Community 48 - "opsx-explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 49 - "Next.js Server Architecture Rule"
Cohesion: 0.22
Nodes (8): Decision Rule, Default Architecture, Explicitly Avoid By Default, Next.js Server Architecture Rule, Optional Patterns, Required Practices, Sources, Verification Checklist

### Community 50 - "Sources"
Cohesion: 0.22
Nodes (8): Changelog, Coverage matrix, Current source inventory, Decisions, Open gaps, Selected profile, Sources, Stopping rationale

### Community 51 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 52 - "Core Concepts"
Cohesion: 0.22
Nodes (8): [Connect (MCP Connections)](https://smithery.ai/docs/use/connect.md), Core Concepts, [Namespaces](https://smithery.ai/docs/concepts/namespaces.md), Piped Output, Quick Start, Request-level Tool Restrictions (`rpcReqMatch`, experimental), Smithery, [Token Scoping](https://smithery.ai/docs/use/token-scoping.md)

### Community 53 - "Configuration"
Cohesion: 0.22
Nodes (9): Basic Setup, Common Options, Conditional Configuration, Configuration, Key Points, Merging Configs, Projects (Monorepos), Using with Existing Vite Config (+1 more)

### Community 54 - "Reporters"
Cohesion: 0.22
Nodes (8): Blob & Merge (CI/sharding), Built-in Reporters, Default Selection, HTML Report (v5 paths), JUnit Templating, Key Points, Output Files, Reporters

### Community 55 - "Architecture"
Cohesion: 0.22
Nodes (8): Application Structure, Architecture, Automation And Agent Context, OpenSpec, Overview, Runtime And Framework, Server Architecture, Styling

### Community 56 - "Deployment"
Cohesion: 0.22
Nodes (8): Build, CI/CD Boundary, Configuration, Current State, Deployment, Environments, Recommended Future Flow, Rollback

### Community 57 - "Maintaining AGENTS.md"
Cohesion: 0.25
Nodes (7): Anti-Patterns, Default Sections, External Reference Rules, File Setup, Maintaining AGENTS.md, Workflow, Writing Rules

### Community 58 - "Output Format"
Cohesion: 0.25
Nodes (7): Candidate format, If nothing is found, If only community results exist, If web access is unavailable, Installation request, Output Format, Source coverage

### Community 59 - "Testing"
Cohesion: 0.25
Nodes (7): Available Local Checks, CI, Current State, Future Test Strategy, Missing Checks, Testing, Verification Loop

### Community 60 - "Security"
Cohesion: 0.25
Nodes (7): Agent Work, Current Application Surface, Dependencies, GitHub Actions Supply Chain, Reporting, Secrets, Security

### Community 61 - "Benchmarking (v5)"
Cohesion: 0.29
Nodes (7): Benchmarking (v5), Comparing Implementations, Defining & Running, Key Points, Stability Notes, Storing & Replaying Baselines, v5 Migration

### Community 62 - "Test Tags (4.1+)"
Cohesion: 0.29
Nodes (7): Applying Tags, Checking the Filter at Runtime, Defining Tags, Filtering by Tag, Key Points, Option conflict resolution, Test Tags (4.1+)

### Community 63 - "Design"
Cohesion: 0.29
Nodes (6): Accessibility, Current Styling Surface, Current UI, Design, Future Design Rules, Product Direction

### Community 64 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 65 - "Agent Context Efficiency Audit"
Cohesion: 0.33
Nodes (5): Agent Context Efficiency Audit, Current Baseline, Current Policy, Tooling Status, Verification Notes

### Community 66 - "Graphify Infrastructure"
Cohesion: 0.33
Nodes (5): Current State, Future Restoration, Graphify Infrastructure, Known Limitations, Usage Policy

### Community 67 - "Notes App"
Cohesion: 0.33
Nodes (5): Getting Started, Notes App, Project Docs, Proposals And Decisions, Source

### Community 68 - "proposal.md"
Cohesion: 0.40
Nodes (4): Impact, Non-Goals, What Changes, Why

### Community 69 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 70 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 71 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **749 isolated node(s):** `allowJs`, `esModuleInterop`, `incremental`, `isolatedModules`, `jsx` (+744 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Mocking` connect `Mocking` to `vitest/SKILL.md`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Test API` connect `Test API` to `vitest/SKILL.md`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Vi Utilities` connect `Vi Utilities` to `vitest/SKILL.md`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `allowJs`, `esModuleInterop`, `incremental` to the rest of the system?**
  _749 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `acquire-codebase-knowledge/SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._