# Graph Report - notes-app  (2026-08-17)

## Corpus Check
- 81 files · ~126,495 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 861 nodes · 797 edges · 74 communities (70 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edc5014c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- compilerOptions
- biome.json
- includes
- ADDED Requirements
- scripts
- Requirements
- check-graphify.mjs
- ADDED Requirements
- Requirements
- add-production-ci-cd-pipeline/proposal.md
- Requirement: Local Verification Command
- README.md
- AGENTS.md
- postcss.config.mjs
- page.tsx
- ADDED Requirements
- Contributing
- Deployment
- Security
- Testing
- ADDED Requirements
- Design
- Decisions
- Decisions
- Decisions
- add-production-ci-cd-pipeline/design.md
- add-generic-objectives/proposal.md
- add-recurring-commitment-tracking/proposal.md
- define-minimalist-ui-foundation/proposal.md
- add-recurring-commitment-tracking/tasks.md
- add-generic-objectives/tasks.md
- OpenSpec
- define-minimalist-ui-foundation/tasks.md
- ADDED Requirements
- Object Model
- ADDED Requirements
- implement-workspace-sidebar/design.md
- Architecture
- AI Workflows
- ADDED Requirements
- ADDED Requirements
- Validation Sources
- Release Process
- ADDED Requirements
- Object Studio Foundation
- implement-workspace-sidebar/proposal.md
- define-object-studio-study-foundation/design.md
- define-object-studio-study-foundation/proposal.md
- implement-workspace-sidebar/tasks.md
- External Knowledge Base Snapshots
- External Product Knowledge Summary
- Capacities Knowledge Graph Source
- Obsidian Knowledge Graph Source
- Readwise / Reader Knowledge Graph Source
- ADDED Requirements
- ADDED Requirements
- check-complexity.mjs
- ADDED Requirements
- ADDED Requirements
- sync-stag-hotfixes-to-dev/proposal.md
- configure-biome-governance/proposal.md
- enforce-conventional-branch-naming/proposal.md
- enforce-quality-thresholds/proposal.md
- MODIFIED Requirements

## God Nodes (most connected - your core abstractions)
1. `scripts` - 21 edges
2. `compilerOptions` - 16 edges
3. `Contributing` - 13 edges
4. `ADDED Requirements` - 11 edges
5. `Requirements` - 11 edges
6. `Design` - 10 edges
7. `Architecture` - 10 edges
8. `AI Workflows` - 10 edges
9. `ADDED Requirements` - 10 edges
10. `Requirements` - 10 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (74 total, 4 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.06
Nodes (33): babel-plugin-react-compiler, @biomejs/biome, jsdom, lefthook, devDependencies, babel-plugin-react-compiler, @biomejs/biome, jsdom (+25 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 2 - "biome.json"
Cohesion: 0.06
Nodes (31): recommended, assist, actions, enabled, noExcessiveCognitiveComplexity, css, formatter, parser (+23 more)

### Community 3 - "includes"
Cohesion: 0.11
Nodes (15): files, ignoreUnknown, includes, !!node_modules, nextConfig, **, !!build, !!coverage (+7 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Branch Protection Source Files, Requirement: Dependency Maintenance, Requirement: Deployment Boundary, Requirement: Pull Request Quality Gates, Requirement: Security Validation, Scenario: Cloud deployment is added, Scenario: Code scanning (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (32): next, dependencies, next, react, react-dom, name, packageManager, private (+24 more)

### Community 6 - "Requirements"
Cohesion: 0.05
Nodes (43): Purpose, Recurring Commitments Specification, Requirement: Active Period Progress, Requirement: Completed Period Outcome, Requirement: Consistency And History, Requirement: Expected Progress And Pace Status, Requirement: Explicit Carryover, Requirement: Period And Cumulative Balance (+35 more)

### Community 7 - "check-graphify.mjs"
Cohesion: 0.20
Nodes (10): fail(), failures, graphDir, graphPath, htmlPath, manifestPath, readJson(), reportPath (+2 more)

### Community 8 - "ADDED Requirements"
Cohesion: 0.05
Nodes (42): ADDED Requirements, Purpose, Requirement: Active Period Progress, Requirement: Completed Period Outcome, Requirement: Consistency And History, Requirement: Expected Progress And Pace Status, Requirement: Explicit Carryover, Requirement: Period And Cumulative Balance (+34 more)

### Community 9 - "Requirements"
Cohesion: 0.05
Nodes (39): Objectives Specification, Purpose, Requirement: Objective As Configured Object Type, Requirement: Objective Context, Requirement: Objective Identity And Classification, Requirement: Objective Lifecycle, Requirement: Objective Preparation Progress, Requirement: Objective Requirements And Topics (+31 more)

### Community 10 - "add-production-ci-cd-pipeline/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 11 - "Requirement: Local Verification Command"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Local Verification Command, Scenario: Developer runs local verification, Scenario: Developer runs page tests

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 18 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Purpose, Requirement: Objective As Configured Object Type, Requirement: Objective Context, Requirement: Objective Identity And Classification, Requirement: Objective Lifecycle, Requirement: Objective Preparation Progress, Requirement: Objective Requirements And Topics (+30 more)

### Community 19 - "Contributing"
Cohesion: 0.14
Nodes (13): Branch Naming, CI And Merge, Commit, Contributing, Git Workflow, Local Development, Production Promotion, Pull Request (+5 more)

### Community 20 - "Deployment"
Cohesion: 0.20
Nodes (9): Build, CI/CD Boundary, Cloud Authentication, Deployment, Deployment Triggers, Environments, Recommended Delivery Flow, Rollback (+1 more)

### Community 21 - "Security"
Cohesion: 0.22
Nodes (8): Agent Work, Application Expectations, Dependencies, GitHub Actions Supply Chain, Reporting, Secrets, Security, Static Analysis

### Community 22 - "Testing"
Cohesion: 0.20
Nodes (9): Agent Hooks, CI, Complexity, Coverage, Current State, Definition Of Done, Local Verification, Testing (+1 more)

### Community 25 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Purpose, Requirement: Canonical Visual Foundation, Requirement: Content-First Minimalism, Requirement: Gated UI Delivery, Requirement: Responsive And Accessible Baseline, Requirement: Reusable Interaction Primitives, Requirement: Semantic Visual Roles (+10 more)

### Community 26 - "Design"
Cohesion: 0.14
Nodes (13): Acceptance Gate, Color, Components, Composition, Design, Do Not, Interaction And Motion, Principles (+5 more)

### Community 27 - "Decisions"
Cohesion: 0.14
Nodes (13): Assessments provide evidence; results conclude outcomes, Context, Custom outcomes remain first-class, Decisions, Goals / Non-Goals, Lifecycle and result remain separate, Objective represents the outcome, not the work, Open Questions (+5 more)

### Community 28 - "Decisions"
Cohesion: 0.14
Nodes (13): Compare progress with both the endpoint and the current expected position, Context, Decisions, Goals / Non-Goals, Keep active-period and completed-period concepts separate, Keep consistency transparent, Make carryover explicit, Open Questions (+5 more)

### Community 29 - "Decisions"
Cohesion: 0.15
Nodes (12): Context, Decisions, Documentation precedes component implementation, Evidence gates advancement, Existing primitives remain the default, Goals / Non-Goals, Migration Plan, Minimalism is content-first, not feature removal (+4 more)

### Community 30 - "add-production-ci-cd-pipeline/design.md"
Cohesion: 0.18
Nodes (10): Context, Decisions, Goals / Non-Goals, Keep security as a separate workflow, Migration Plan, Mirror CI with repository scripts, Open Questions, Risks / Trade-offs (+2 more)

### Community 31 - "add-generic-objectives/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 32 - "add-recurring-commitment-tracking/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 33 - "define-minimalist-ui-foundation/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 34 - "add-recurring-commitment-tracking/tasks.md"
Cohesion: 0.25
Nodes (7): 1. Commitment And Period Foundations, 2. Current Progress And Period Outcomes, 3. Expected Progress And Required Pace, 4. Carryover And Target Revisions, 5. History, Balance, And Consistency, 6. Product Integration, 7. Verification

### Community 35 - "add-generic-objectives/tasks.md"
Cohesion: 0.29
Nodes (6): 1. Objective Foundations, 2. Requirements And Preparation Context, 3. Assessments And Results, 4. Objective Progress, 5. Objective-Centered Experience, 6. Verification

### Community 36 - "OpenSpec"
Cohesion: 0.33
Nodes (5): Change Inventory, OpenSpec, Structure, UI Delivery Checkpoints, Working Agreement

### Community 37 - "define-minimalist-ui-foundation/tasks.md"
Cohesion: 0.40
Nodes (4): 1. Foundation Audit, 2. Canonical Design Guidance, 3. OpenSpec Foundation, 4. Review Gate

### Community 38 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: Gemini Secret Boundary, Requirement: Page-Aware Document Extraction, Requirement: Registered Source Content, Requirement: Review Before Save, Requirement: Role-Specific Structured Extraction, Requirement: Source Registration And Classification, Requirement: Structured Gemini Suggestions (+20 more)

### Community 39 - "Object Model"
Cohesion: 0.13
Nodes (14): Activity Records, Customization Model, Flashcard, Flashcard Review, Foundation Filters, Object Model, Potential Object Types, Principles (+6 more)

### Community 40 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Purpose, Requirement: Accessible Sidebar Controls, Requirement: Active Destination, Requirement: Responsive Navigation, Requirement: Workspace Identity, Requirement: Workspace Navigation Region, Scenario: Close navigation on mobile (+8 more)

### Community 41 - "implement-workspace-sidebar/design.md"
Cohesion: 0.14
Nodes (13): Accessibility And Evidence, Active state is semantic, Context, Decisions, Goals / Non-Goals, Identity stays compact, Migration Plan, Mobile uses the same navigation model (+5 more)

### Community 42 - "Architecture"
Cohesion: 0.18
Nodes (10): Application Data, Architecture, Enforcement, Foundation Persistence Decision, Gemini Boundary, Intent, Next.js Guidance, Provider Boundaries (+2 more)

### Community 43 - "AI Workflows"
Cohesion: 0.18
Nodes (10): AI Workflows, Answer-Key Extraction And Matching, Document Processing Pipeline, Flashcard Generation, Guardrails, Question Extraction, Role Of Gemini, Scheduling Boundary (+2 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: Focused Study Session, Requirement: Immutable Question Attempts, Requirement: Packaged Study Object Types, Requirement: Study Filters And Weakness Analytics, Scenario: Complete a study session, Scenario: Create a study goal, Scenario: Filter study objects (+4 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Configurable Object Types, Requirement: Cross-Type Organization, Requirement: Generic Object Records, Requirement: Property-Based Object View, Requirement: Structured Object Relations, Requirement: Workflow Behavior Over Generic Objects, Scenario: Add a workflow preset (+9 more)

### Community 46 - "Validation Sources"
Cohesion: 0.20
Nodes (9): Catalog, Exclusions, And Unavailable Sources, Completion Evidence, First End-to-End Validation Set, Historical DATAPREV Corpus, Ingestion Rules, Purpose, Related PPSA Proofs, Source Classification (+1 more)

### Community 47 - "Release Process"
Cohesion: 0.25
Nodes (7): Branch Flow, Changelog, OpenSpec Flow, Release Process, Release Readiness, Rollback, Versioning

### Community 48 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Deterministic Daily Question Target, Requirement: FSRS Flashcard Scheduling, Requirement: Today View, Scenario: Calculate the target, Scenario: Open the Today view, Scenario: Override the target, Scenario: Rate a flashcard review (+1 more)

### Community 49 - "Object Studio Foundation"
Cohesion: 0.22
Nodes (8): Core Workflow, Foundation Scope, Initial User, Non-Goals, Object Studio Foundation, Product Boundaries, Product Promise, Success Criteria

### Community 50 - "implement-workspace-sidebar/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 51 - "define-object-studio-study-foundation/design.md"
Cohesion: 0.22
Nodes (8): AI Generation Flow, Architecture Boundary, Customization Foundation, Domain Shape, Overview, Reference Model, Scheduling, Verification Strategy

### Community 52 - "define-object-studio-study-foundation/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, New Capabilities, Non-Goals, Supporting Docs, What Changes, Why

### Community 53 - "implement-workspace-sidebar/tasks.md"
Cohesion: 0.40
Nodes (4): 1. Spec And Fixture, 2. Sidebar Implementation, 3. Verification, 4. Review Gate

### Community 56 - "External Product Knowledge Summary"
Cohesion: 0.22
Nodes (8): Capacities, Corpus Coverage, Evidence, External Product Knowledge Summary, Obsidian, Product Boundary, Readwise / Reader, Shared Concepts

### Community 57 - "Capacities Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Capacities Knowledge Graph Source, Entities, Features, Graph Interpretation, Workflows

### Community 58 - "Obsidian Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Entities, Graph Interpretation, Obsidian Knowledge Graph Source, Topics, Workflows

### Community 59 - "Readwise / Reader Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Entities, Features, Graph Interpretation, Readwise / Reader Knowledge Graph Source, Workflows

### Community 60 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: Agent Validation Hook Source, Requirement: CI Quality Gate Includes Complexity, Requirement: Coverage Thresholds, Requirement: Function Complexity Gate, Scenario: Agent hook tooling is installed, Scenario: Agent hooks are installed locally, Scenario: Cognitive complexity is checked (+3 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: Back-Sync Safety, Requirement: Stag To Dev Back-Sync Detection, Requirement: Stag To Dev Sync Pull Request, Scenario: Back-sync workflow runs, Scenario: Conflicts are likely, Scenario: Dev branch is unavailable, Scenario: Stag receives a push (+2 more)

### Community 62 - "check-complexity.mjs"
Cohesion: 0.27
Nodes (9): allowedExtensions, branchWeight(), cyclomaticComplexity(), failures, functionName(), isFunctionLike(), root, sourceRoot (+1 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Biome Configuration Baseline, Requirement: Deterministic Biome Commands, Requirement: Generated File Scanning, Scenario: Biome configuration is reviewed, Scenario: Biome runs locally or in CI, Scenario: CI validates Biome, Scenario: Developer fixes safe Biome issues (+1 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.29
Nodes (6): ADDED Requirements, Requirement: Agent Workflow Entrypoint, Requirement: Conventional Branch Names, Scenario: Agent starts Git work, Scenario: Agent starts repository work, Scenario: Contributor creates a working branch

### Community 65 - "sync-stag-hotfixes-to-dev/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 66 - "configure-biome-governance/proposal.md"
Cohesion: 0.33
Nodes (5): Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 67 - "enforce-conventional-branch-naming/proposal.md"
Cohesion: 0.33
Nodes (5): Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 68 - "enforce-quality-thresholds/proposal.md"
Cohesion: 0.33
Nodes (5): Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 69 - "MODIFIED Requirements"
Cohesion: 0.33
Nodes (5): MODIFIED Requirements, Requirement: Branch Protection Source Files, Requirement: Pull Request Quality Gates, Scenario: Protected branch rules are reviewed, Scenario: Pull request validation

## Knowledge Gaps
- **590 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `defaultBranch` (+585 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _590 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `biome.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `includes` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `ADDED Requirements` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._