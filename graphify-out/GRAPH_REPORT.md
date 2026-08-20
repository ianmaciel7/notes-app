# Graph Report - .  (2026-08-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1918 nodes · 2522 edges · 180 communities (165 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70c0468e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- sidebar.tsx
- scan.py
- scripts
- utils.ts
- dependencies
- menubar.tsx
- compilerOptions
- app-shell.tsx
- graphify-ingest-legacy.mjs
- app-sidebar-overview.tsx
- components.json
- app-sidebar-primary-actions.tsx
- field.tsx
- command.tsx
- app-sidebar.tsx
- combobox.tsx
- context-menu.tsx
- drawer.tsx
- carousel.tsx
- Tier A - Official platform sources
- check-complexity.mjs
- alert-dialog.tsx
- chart.tsx
- item.tsx
- What You Must Do When Invoked
- toast.tsx
- app-sidebar-object-type-studio.tsx
- Find Plugins
- openspec-onboard/SKILL.md
- Test API
- attachment.tsx
- Mocking
- routing.ts
- Agent Governance Patterns
- Trust, Provenance, and Safety Model
- Vi Utilities
- input-group.tsx
- includes
- Describe API
- Code Coverage
- Expect API
- Test Environments
- navigation-menu.tsx
- vitest/SKILL.md
- Type Testing
- app/layout.tsx
- Test Filtering
- pagination.tsx
- biome.json
- Snapshot Testing
- ADDED Requirements
- Commands
- Lifecycle Hooks
- Find Skills
- graph-orchestrator/README.md
- Adoption Workflow
- Concurrency & Parallelism
- Requirements
- Requirements
- Agentic Evaluation Patterns
- Projects
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- card.tsx
- empty.tsx
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
- Core Sections (Required)
- Graph Engineering: Patterns and Failure Modes
- Test Context & Fixtures
- linter
- Requirements
- Core Sections (Required)
- Sources
- graphify reference: extra exports and benchmark
- Core Concepts
- Configuration
- Reporters
- 2026-08-18-codify-practical-documentation-workflow/design.md
- ADDED Requirements
- ADDED Requirements
- Requirements
- Core Sections (Required)
- Inquiry Checkpoints
- Stack Detection Reference
- Maintaining AGENTS.md
- Output Format
- Deployment
- Next.js + TypeScript + shadcn + Biome Bootstrap Guide
- 2026-08-18-enforce-openspec-and-english-first-rules/design.md
- Benchmarking (v5)
- Test Tags (4.1+)
- bubble.tsx
- 2026-08-18-add-missing-repository-documentation/design.md
- 2026-08-18-add-missing-repository-documentation/proposal.md
- 2026-08-18-codify-practical-documentation-workflow/proposal.md
- 2026-08-18-configure-modern-nextjs-biome-stack-2026/proposal.md
- 2026-08-18-enforce-openspec-and-english-first-rules/proposal.md
- 2026-08-18-restore-legacy-agents-assets/proposal.md
- configure-next-intl/proposal.md
- create-app-shell/proposal.md
- toggle-group.tsx
- AGENT Instructions
- openspec-first.md
- acquire-codebase-knowledge/SKILL.md
- graphify reference: query, path, explain
- CLAUDE.md
- Graphify
- Testing
- GEMINI.md
- 2026-08-18-add-missing-repository-documentation/tasks.md
- 2026-08-18-configure-modern-nextjs-biome-stack-2026/design.md
- Handoff Note
- configure-next-intl/design.md
- Requirement: Frontend stack bootstrap command contract
- create-app-shell/design.md
- Notes
- Next.js Server Architecture Rule
- graphify-install.mjs
- alert.tsx
- Architecture
- 2026-08-18-restore-legacy-agents-assets/design.md
- Configure CI/CD
- Security
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- tabs.tsx
- Contributing
- Design Principles
- 2026-08-18-codify-practical-documentation-workflow/tasks.md
- 2026-08-18-configure-modern-nextjs-biome-stack-2026/tasks.md
- 2026-08-18-enforce-openspec-and-english-first-rules/tasks.md
- configure-next-intl/tasks.md
- create-app-shell/tasks.md
- Graphify Rule
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- Handoff Note
- git-workflow-rule.md
- shadcn-first.md
- extraction-spec.md
- GENERATION.md
- 2026-08-18-restore-legacy-agents-assets/README.md
- 2026-08-18-restore-legacy-agents-assets/tasks.md
- configure-ci-cd/tasks.md
- formatter
- vcs
- marker.tsx
- assist
- badge.tsx
- postcss.config.mjs
- ci-baseline.test.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 389 edges
2. `Button()` - 22 edges
3. `main()` - 20 edges
4. `scripts` - 19 edges
5. `Vi Utilities` - 18 edges
6. `Find Plugins` - 16 edges
7. `Mocking` - 16 edges
8. `Type Testing` - 16 edges
9. `compilerOptions` - 16 edges
10. `Snapshot Testing` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AppHeaderHistory()` --calls--> `cn()`  [EXTRACTED]
  src/components/app-header.tsx → src/lib/utils.ts
- `AppSidebarObjectTypeCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/app-sidebar-object-type-studio.tsx → src/lib/utils.ts
- `AppSidebarEntityPicker()` --calls--> `cn()`  [EXTRACTED]
  src/components/app-sidebar-overview.tsx → src/lib/utils.ts
- `AppSidebarEntityRow()` --calls--> `cn()`  [EXTRACTED]
  src/components/app-sidebar-overview.tsx → src/lib/utils.ts
- `AppSidebarPrimaryActions()` --calls--> `cn()`  [EXTRACTED]
  src/components/app-sidebar-primary-actions.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (180 total, 15 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (57): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+49 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.05
Nodes (40): Input(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+32 more)

### Community 2 - "scan.py"
Cohesion: 0.09
Nodes (40): collect_code_metrics(), detect_ci_cd_pipelines(), detect_containers(), detect_monorepo(), detect_performance_markers(), detect_security_configs(), find_entry_points(), find_env_templates() (+32 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (40): @biomejs/biome, devDependencies, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+32 more)

### Community 4 - "utils.ts"
Cohesion: 0.07
Nodes (30): AppHeader(), AppHeaderHistory(), AppHeaderProps, AspectRatio(), Button(), buttonVariants, Calendar(), CalendarDayButton() (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (39): @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react (+31 more)

### Community 6 - "menubar.tsx"
Cohesion: 0.09
Nodes (26): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+18 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 8 - "app-shell.tsx"
Cohesion: 0.13
Nodes (24): AppShell(), AppShellContext, AppShellContextValue, AppShellHeader(), AppShellMain(), AppShellMobile(), AppShellMobileSidebar(), AppShellMobileSidePanel() (+16 more)

### Community 9 - "graphify-ingest-legacy.mjs"
Cohesion: 0.13
Nodes (23): allowedCodeExt, allowedDocExt, allowedSpecialFiles, BUILD_AFTER_SYNC, cleanWorkspace(), collectBranch(), DEFAULT_BRANCHES, fileExists() (+15 more)

### Community 10 - "app-sidebar-overview.tsx"
Cohesion: 0.11
Nodes (16): AppSidebarEntity, AppSidebarEntityPicker(), AppSidebarEntityRow(), AppSidebarSectionProps, AppSidebarSortMode, demoEntities, initialObjectTypes, Collapsible() (+8 more)

### Community 11 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 12 - "app-sidebar-primary-actions.tsx"
Cohesion: 0.12
Nodes (17): AppSidebar(), AppSidebarSpace, AppSidebarOverview(), AppSidebarPrimaryAction, AppSidebarPrimaryActionHint, AppSidebarPrimaryActionId, AppSidebarPrimaryActionItem(), AppSidebarPrimaryActions() (+9 more)

### Community 13 - "field.tsx"
Cohesion: 0.12
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+9 more)

### Community 14 - "command.tsx"
Cohesion: 0.12
Nodes (16): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+8 more)

### Community 15 - "app-sidebar.tsx"
Cohesion: 0.14
Nodes (15): AppShellContent(), AppSidebarLabels, AppSidebarProps, AppSidebarSpaceSwitcher(), areOrdersEqual(), defaultLabels, demoSpaces, DragPreview (+7 more)

### Community 16 - "combobox.tsx"
Cohesion: 0.12
Nodes (12): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+4 more)

### Community 17 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubTrigger() (+1 more)

### Community 18 - "drawer.tsx"
Cohesion: 0.14
Nodes (10): DrawerContent(), DrawerContext, DrawerContextProps, DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerSwipeHandle() (+2 more)

### Community 19 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 20 - "Tier A - Official platform sources"
Cohesion: 0.08
Nodes (25): 777genius universal plugins, Agent Plugins Directory, Agent Plugins standard, AI Plugin Marketplace, Anthropic / Claude Code, Claude Code Plugins Plus Skills / CCPI catalog, Completeness, Cursor (+17 more)

### Community 21 - "check-complexity.mjs"
Cohesion: 0.23
Nodes (12): allowedExtensions, branchWeight(), collectSourceFiles(), cyclomaticComplexity(), failures, functionName(), ignoredDirectories, isFunctionLike() (+4 more)

### Community 22 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 23 - "chart.tsx"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 24 - "item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 25 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 26 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 27 - "app-sidebar-object-type-studio.tsx"
Cohesion: 0.18
Nodes (10): AppSidebarObjectTypeCard(), AppSidebarObjectTypePreset, AppSidebarObjectTypeStudio(), AppSidebarObjectTypeStudioProps, AppSidebarObjectTypeTone, basicObjectTypes, suggestedObjectTypes, toneClasses (+2 more)

### Community 28 - "Find Plugins"
Cohesion: 0.09
Nodes (21): Anthropic / Claude Code, Compatibility, Cross-source comparison, Cursor, Deduplication, Discovery priority, Find Plugins, Google Antigravity / AGY (+13 more)

### Community 29 - "openspec-onboard/SKILL.md"
Cohesion: 0.10
Nodes (19): Codebase Analysis, Graceful Exit Handling, Guardrails, Phase 10: Archive, Phase 11: Recap & Next Steps, Phase 1: Welcome, Phase 2: Task Selection, Phase 3: Explore Demo (+11 more)

### Community 30 - "Test API"
Cohesion: 0.10
Nodes (20): Async Tests, Basic Test, Benchmarks (v5), Concurrent Tests, Custom Test with Fixtures, Failing Tests, Focus Tests, Key Points (+12 more)

### Community 31 - "attachment.tsx"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 32 - "Mocking"
Cohesion: 0.10
Nodes (20): Async Timer Methods, Auto-Cleanup with `using`, Auto-mock with Spy, Clearing Mocks, Conditional Mocking with vi.when (v5), Config Auto-Reset, Dynamic Mocking (vi.doMock), Hoisted Variables for Mocks (+12 more)

### Community 33 - "routing.ts"
Cohesion: 0.25
Nodes (4): LocaleLayoutProps, locales, routing, config

### Community 34 - "Agent Governance Patterns"
Cohesion: 0.11
Nodes (18): Agent Governance Patterns, Best Practices, CrewAI, Governance Levels, OpenAI Agents SDK, Overview, Pattern 1: Governance Policy, Pattern 2: Semantic Intent Classification (+10 more)

### Community 35 - "Trust, Provenance, and Safety Model"
Cohesion: 0.11
Nodes (18): 1. Trust, 2. Format / schema status, 3. Provenance chain, 4. Official-status evidence, 5. Read-only safety boundary, 6. Metadata mismatch, 7. Popularity, COMMUNITY (+10 more)

### Community 36 - "Vi Utilities"
Cohesion: 0.11
Nodes (18): Assertion Helpers — vi.defineHelper (4.1+), Conditional Mocking — vi.when (v5), Dynamic Mocking, Fake Timers, Global/Env Mocking, Global Mock Management, Hoisted Code, Key Points (+10 more)

### Community 37 - "input-group.tsx"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 38 - "includes"
Cohesion: 0.20
Nodes (10): files, ignoreUnknown, includes, !!node_modules, **, !!.agents, !!build, !!coverage (+2 more)

### Community 39 - "Describe API"
Cohesion: 0.11
Nodes (17): Basic Usage, Concurrent Suites, Describe API, describe.each, describe.for, Focus Suites, Hooks in Suites, Key Points (+9 more)

### Community 40 - "Code Coverage"
Cohesion: 0.11
Nodes (17): CI Integration, Code Coverage, Configuration, Coverage with Sharding, Ignoring Code, Istanbul, Istanbul, Key Points (+9 more)

### Community 41 - "Expect API"
Cohesion: 0.12
Nodes (16): Assertion Count, Asymmetric Matchers, Basic Assertions, Chai-Style Spy Assertions (4.1+), Conditional Mock Exhaustion (v5), Error Assertions, Expect API, Extending Matchers (+8 more)

### Community 42 - "Test Environments"
Cohesion: 0.12
Nodes (15): Available Environments, Browser Mode (Separate from Environments), Configuration, CSS and Assets, Custom Environment, Environment with VM, Fixing External Dependencies, happy-dom Environment (+7 more)

### Community 43 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuPositioner(), NavigationMenuTrigger() (+1 more)

### Community 44 - "vitest/SKILL.md"
Cohesion: 0.20
Nodes (3): Advanced, Core, Features

### Community 45 - "Type Testing"
Cohesion: 0.12
Nodes (16): assertType, Branded Types, Configuration, Equality vs Matching, expectTypeOf API, Function Types, Generic Types, Key Points (+8 more)

### Community 46 - "app/layout.tsx"
Cohesion: 0.22
Nodes (6): nextConfig, withNextIntl, !!.next, geistMono, geistSans, metadata

### Community 47 - "Test Filtering"
Cohesion: 0.12
Nodes (16): By File Path, By Test Name, Changed Files, CLI Filtering, Combining Filters, Environment-based Filtering, Focus Tests (.only), Include/Exclude Patterns (+8 more)

### Community 48 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 49 - "biome.json"
Cohesion: 0.25
Nodes (7): css, parser, quoteStyle, javascript, formatter, tailwindDirectives, $schema

### Community 50 - "Snapshot Testing"
Cohesion: 0.13
Nodes (15): Basic Snapshot, Concurrent Test Snapshots, Custom Serializers, Custom Snapshot Matchers (4.1+), Error Snapshots, File Snapshots, Inline Snapshots, Key Points (+7 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: Composable application shell primitives, Requirement: Desktop three-pane geometry, Requirement: Existing Nova theme is preserved, Requirement: Native shadcn resize behavior, Requirement: Responsive narrow-screen behavior, Requirement: Stable collapse triggers, Scenario: Components follow shadcn source conventions (+7 more)

### Community 52 - "Commands"
Cohesion: 0.13
Nodes (15): Command Line Interface, Commands, Common Options, Key Points, Package.json Scripts, Sharding for CI, `vitest`, `vitest bench` (+7 more)

### Community 53 - "Lifecycle Hooks"
Cohesion: 0.13
Nodes (14): Around Hooks, aroundAll, Basic Hooks, Cleanup Return Pattern, Concurrent Test Hooks, Extended Test Hooks, Hook Execution Order, Hook Timeout (+6 more)

### Community 54 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 55 - "graph-orchestrator/README.md"
Cohesion: 0.14
Nodes (12): Design notes, Install, License, Repo structure, The problem, What a run looks like, What it does, What it doesn't do (+4 more)

### Community 56 - "Adoption Workflow"
Cohesion: 0.14
Nodes (13): 1. Choose the Harness Surface, 2. Write Agent Instructions, 3. Add Enforceable Checks, 4. Record Failure Memory, 5. Add Drift Checks, 6. Report the Adoption, Adoption Workflow, Core Principles (+5 more)

### Community 57 - "Concurrency & Parallelism"
Cohesion: 0.14
Nodes (14): Bail on Failure, CI Example (GitHub Actions), Concurrency & Parallelism, Concurrent Tests, File Parallelism, Isolation, Key Points, Max Concurrency (+6 more)

### Community 58 - "Requirements"
Cohesion: 0.14
Nodes (13): docs/practical-workflow Specification, Purpose, Requirement: Documentation change classification, Requirement: Documentation freshness, Requirement: Documentation sync verification, Requirement: Editorial-only exception, Requirement: PR traceability for process docs, Requirements (+5 more)

### Community 59 - "Requirements"
Cohesion: 0.14
Nodes (13): Purpose, Repository Docs Baseline Specification, Requirement: Contributor entry point consistency, Requirement: Documentation baseline presence, Requirement: English-first docs baseline, Requirement: Practical docs synchronization, Requirement: Rule discoverability, Requirements (+5 more)

### Community 60 - "Agentic Evaluation Patterns"
Cohesion: 0.15
Nodes (12): Agentic Evaluation Patterns, Best Practices, Evaluation Strategies, LLM-as-Judge, Outcome-Based, Overview, Pattern 1: Basic Reflection, Pattern 2: Evaluator-Optimizer (+4 more)

### Community 61 - "Projects"
Cohesion: 0.15
Nodes (13): Basic Projects Setup, Browser + Node Projects, Different Environments, Global Setup per Project, Key Points, Monorepo Pattern, Per-Project Pool & Isolation (v4), Project-Specific Dependencies (+5 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Purpose, Requirement: Contributor entry point consistency, Requirement: Documentation baseline presence, Requirement: English-first docs baseline, Requirement: Practical docs synchronization, Requirement: Rule discoverability, Scenario: Agent onboarding (+4 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Purpose, Requirement: Documentation change classification, Requirement: Documentation freshness, Requirement: Documentation sync verification, Requirement: Editorial-only exception, Requirement: PR traceability for process docs, Scenario: Editorial-only update (+4 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, CI/CD, Requirement: Deployment configuration, Requirement: Deterministic quality gate, Requirement: Repository hygiene, Requirement: Safe branch promotion, Requirement: Security gate, Scenario: Environment-specific rollout (+4 more)

### Community 65 - "card.tsx"
Cohesion: 0.25
Nodes (7): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 66 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 67 - "Acquire Codebase Knowledge"
Cohesion: 0.17
Nodes (12): Acquire Codebase Knowledge, Anti-Patterns, Bundled Assets, Enhanced Scan Output Sections, Focus Area Mode, Gotchas, Output Contract (Required), Phase 1: Scan and Read Intent (+4 more)

### Community 68 - "Compatibility and Capability Evidence"
Cohesion: 0.17
Nodes (11): Canonical identity, Capability matrix, CLAIMED, Compatibility and Capability Evidence, Compatibility statuses, First-party preference, Graceful degradation, INCOMPATIBLE (+3 more)

### Community 69 - "Graph Orchestrator"
Cohesion: 0.17
Nodes (11): Executing the phases, Fan-in is where quality is actually lost, Further reading, Graph Orchestrator, Hidden edges, Irreversible actions, Model tiering, Output format (+3 more)

### Community 70 - "How to use it"
Cohesion: 0.17
Nodes (11): 1. The Spec (`spec.ts`), 2. The Handler (`handler.ts`), A. Contract Tests (Schema), Architecture Components, B. Logic Tests (Handler), How to use it, Step 1: Define the Contract (`spec.ts`), Step 2: Implement the Handler (`handler.ts`) (+3 more)

### Community 71 - "AGENTS.md Specification"
Cohesion: 0.18
Nodes (10): AGENTS.md Specification, Evaluation, Intent, Known Limitations, Maintenance Notes, Reference Architecture, Runtime Contract, Scope (+2 more)

### Community 72 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 73 - "Core Operational Rules"
Cohesion: 0.18
Nodes (10): 1. No "Horizontal Splurging", 2. Impose Backpressure, 3. Verification of Integrity, Core Operational Rules, Example Workflow (TypeScript + Vitest), Phase 1: Red (Establish Failure), Phase 2: Green (Minimal Pass), Phase 3: Refactor (Clean Up) (+2 more)

### Community 74 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Architectural Style, 2) System Flow, 3) Layer/Module Responsibilities, 4) Reused Patterns, 5) Known Architectural Risks, 6) Evidence, Architecture, Core Sections (Required) (+1 more)

### Community 75 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Naming Rules, 2) Formatting and Linting, 3) Import and Module Conventions, 4) Error and Logging Conventions, 5) Testing Conventions, 6) Evidence, Coding Conventions, Core Sections (Required) (+1 more)

### Community 76 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Integration Inventory, 2) Data Stores, 3) Secrets and Credentials Handling, 4) Reliability and Failure Behavior, 5) Observability for Integrations, 6) Evidence, Core Sections (Required), Extended Sections (Optional) (+1 more)

### Community 77 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Runtime Summary, 2) Production Frameworks and Dependencies, 3) Development Toolchain, 4) Key Commands, 5) Environment and Config, 6) Evidence, Core Sections (Required), Extended Sections (Optional) (+1 more)

### Community 78 - "Core Sections (Required)"
Cohesion: 0.20
Nodes (9): 1) Test Stack and Commands, 2) Test Layout, 3) Test Scope Matrix, 4) Mocking and Isolation Strategy, 5) Coverage and Quality Signals, 6) Evidence, Core Sections (Required), Extended Sections (Optional) (+1 more)

### Community 79 - "Graph Engineering: Patterns and Failure Modes"
Cohesion: 0.20
Nodes (9): A worked example, Contents, Dependency audit, Failure modes, Graph Engineering: Patterns and Failure Modes, Phases, Sizing guidance, What the naive version looks like (+1 more)

### Community 80 - "Test Context & Fixtures"
Cohesion: 0.20
Nodes (10): Built-in Context, Composing & Hooks, Custom Fixtures — Builder Pattern (4.1+, recommended), Fixture Options, Fixture Scopes (3.2+), Injected Fixtures (per-project values), Key Points, Object Syntax (Playwright-compatible) (+2 more)

### Community 81 - "linter"
Cohesion: 0.29
Nodes (7): next, react, linter, domains, enabled, rules, recommended

### Community 82 - "Requirements"
Cohesion: 0.20
Nodes (9): developer-workflows/openspec-enforcement Specification, Purpose, Requirement: English-first repository artifacts, Requirement: OpenSpec-first behavior changes, Requirement: Skill-use clarity, Requirements, Scenario: Ambiguous request, Scenario: Behavioral change request (+1 more)

### Community 83 - "Core Sections (Required)"
Cohesion: 0.22
Nodes (8): 1) Top-Level Map, 2) Entry Points, 3) Module Boundaries, 4) Naming and Organization Rules, 5) Evidence, Codebase Structure, Core Sections (Required), Extended Sections (Optional)

### Community 84 - "Sources"
Cohesion: 0.22
Nodes (8): Changelog, Coverage matrix, Current source inventory, Decisions, Open gaps, Selected profile, Sources, Stopping rationale

### Community 85 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 86 - "Core Concepts"
Cohesion: 0.22
Nodes (8): [Connect (MCP Connections)](https://smithery.ai/docs/use/connect.md), Core Concepts, [Namespaces](https://smithery.ai/docs/concepts/namespaces.md), Piped Output, Quick Start, Request-level Tool Restrictions (`rpcReqMatch`, experimental), Smithery, [Token Scoping](https://smithery.ai/docs/use/token-scoping.md)

### Community 87 - "Configuration"
Cohesion: 0.22
Nodes (9): Basic Setup, Common Options, Conditional Configuration, Configuration, Key Points, Merging Configs, Projects (Monorepos), Using with Existing Vite Config (+1 more)

### Community 88 - "Reporters"
Cohesion: 0.22
Nodes (8): Blob & Merge (CI/sharding), Built-in Reporters, Default Selection, HTML Report (v5 paths), JUnit Templating, Key Points, Output Files, Reporters

### Community 89 - "2026-08-18-codify-practical-documentation-workflow/design.md"
Cohesion: 0.22
Nodes (8): Context, Decision: Dedicated documentation capability, Decision: Documentation freshness gate, Decision: Explicit editorial exception, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 90 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Purpose, Requirement: Contributor documentation for startup and recovery, Requirement: Frontend stack bootstrap command contract, Requirement: Quality tooling alignment, Scenario: Contributor guidance is present, Scenario: Deterministic project initialization, Scenario: Quality checks are runnable

### Community 91 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Purpose, Requirement: English-first repository artifacts, Requirement: OpenSpec-first behavior changes, Requirement: Skill-use clarity, Scenario: Ambiguous request, Scenario: Behavioral change request, Scenario: Non-English contribution attempt

### Community 92 - "Requirements"
Cohesion: 0.22
Nodes (8): Purpose, Requirement: Contributor documentation for startup and recovery, Requirement: Frontend stack bootstrap command contract, Requirement: Quality tooling alignment, Requirements, Scenario: Contributor guidance is present, Scenario: Deterministic project initialization, Scenario: Quality checks are runnable

### Community 93 - "Core Sections (Required)"
Cohesion: 0.25
Nodes (8): 1) Top Risks (Prioritized), 2) Technical Debt, 3) Security Concerns, 4) Performance and Scaling Concerns, 5) Fragile/High-Churn Areas, 6) `[ASK USER]` Questions, 7) Evidence, Core Sections (Required)

### Community 94 - "Inquiry Checkpoints"
Cohesion: 0.25
Nodes (8): 1. STACK.md — Tech Stack, 2. STRUCTURE.md — Directory Layout, 3. ARCHITECTURE.md — Patterns, 4. CONVENTIONS.md — Coding Standards, 5. INTEGRATIONS.md — External Services, 6. TESTING.md — Test Setup, 7. CONCERNS.md — Known Issues, Inquiry Checkpoints

### Community 95 - "Stack Detection Reference"
Cohesion: 0.25
Nodes (8): Docker Base Image → Runtime, Framework Detection (Node.js / TypeScript), Framework Detection (Python), Language Runtime Version Detection, Manifest File → Ecosystem, Monorepo Detection, Stack Detection Reference, TypeScript Path Alias Detection

### Community 96 - "Maintaining AGENTS.md"
Cohesion: 0.25
Nodes (7): Anti-Patterns, Default Sections, External Reference Rules, File Setup, Maintaining AGENTS.md, Workflow, Writing Rules

### Community 97 - "Output Format"
Cohesion: 0.25
Nodes (7): Candidate format, If nothing is found, If only community results exist, If web access is unavailable, Installation request, Output Format, Source coverage

### Community 98 - "Deployment"
Cohesion: 0.25
Nodes (7): Branch flow, CI/CD boundary, Deployment, Firebase App Hosting, Local, Release validation, Rollback

### Community 99 - "Next.js + TypeScript + shadcn + Biome Bootstrap Guide"
Cohesion: 0.25
Nodes (7): 1) Bootstrap in a dedicated folder (recommended), 2) Bootstrap in the project root (when no conflicting files), 3) If `create-next-app` fails due to conflicts, 4) Tooling setup and rationale, 5) Post-creation validation, next-intl baseline (locale-ready), Next.js + TypeScript + shadcn + Biome Bootstrap Guide

### Community 100 - "2026-08-18-enforce-openspec-and-english-first-rules/design.md"
Cohesion: 0.25
Nodes (7): Context, Decision: Add capability path `developer-workflows/openspec-enforcement`, Decision: Use repository-local OpenSpec store, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 101 - "Benchmarking (v5)"
Cohesion: 0.29
Nodes (7): Benchmarking (v5), Comparing Implementations, Defining & Running, Key Points, Stability Notes, Storing & Replaying Baselines, v5 Migration

### Community 102 - "Test Tags (4.1+)"
Cohesion: 0.29
Nodes (7): Applying Tags, Checking the Filter at Runtime, Defining Tags, Filtering by Tag, Key Points, Option conflict resolution, Test Tags (4.1+)

### Community 103 - "bubble.tsx"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 104 - "2026-08-18-add-missing-repository-documentation/design.md"
Cohesion: 0.29
Nodes (6): Context, Decision: Baseline-first documentation strategy, Decision: Keep PR-focused freshness check, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 105 - "2026-08-18-add-missing-repository-documentation/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 106 - "2026-08-18-codify-practical-documentation-workflow/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 107 - "2026-08-18-configure-modern-nextjs-biome-stack-2026/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 108 - "2026-08-18-enforce-openspec-and-english-first-rules/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 109 - "2026-08-18-restore-legacy-agents-assets/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 110 - "configure-next-intl/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 111 - "create-app-shell/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 112 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 113 - "AGENT Instructions"
Cohesion: 0.33
Nodes (5): AGENT Instructions, Operational policy, Repository entry points, This is NOT the Next.js you know, Workflow notes

### Community 114 - "openspec-first.md"
Cohesion: 0.33
Nodes (5): Completion checklist, Core rule, Mandatory sequencing, Notes, OpenSpec skill trigger matrix

### Community 116 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 117 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Helpful Entry Documents, Mandatory Operating Rules, Priority for Decisions, Project Context

### Community 118 - "Graphify"
Cohesion: 0.33
Nodes (5): Graphify, Install references, Purpose, Runtime policy in this repository, Setup and usage

### Community 119 - "Testing"
Cohesion: 0.33
Nodes (5): Install, Local validation, Pull requests, Test baseline, Testing

### Community 120 - "GEMINI.md"
Cohesion: 0.33
Nodes (4): Decision Priority, Helpful References, Mandatory Rules, Project Context

### Community 121 - "2026-08-18-add-missing-repository-documentation/tasks.md"
Cohesion: 0.33
Nodes (5): 1. Documentation Baseline, 2.5 Repository Rules, 2. Technical Documentation, 3. Synchronization and Validation, 4. Completion check

### Community 122 - "2026-08-18-configure-modern-nextjs-biome-stack-2026/design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 123 - "Handoff Note"
Cohesion: 0.33
Nodes (5): Handoff Note, Review / Execution, Scope, Summary, Usage

### Community 124 - "configure-next-intl/design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 125 - "Requirement: Frontend stack bootstrap command contract"
Cohesion: 0.33
Nodes (5): MODIFIED Requirements, Requirement: Frontend stack bootstrap command contract, Scenario: I18n setup is visible in contributor workflow, Scenario: Locale-aware bootstrap is available by default, Scenario: Unsupported locales are rejected

### Community 126 - "create-app-shell/design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 127 - "Notes"
Cohesion: 0.33
Nodes (5): Available repo docs, Notes, Notes, Practical documentation synchronization, Repository Rules

### Community 128 - "Next.js Server Architecture Rule"
Cohesion: 0.40
Nodes (4): Default Architecture, Explicitly Avoid By Default, Next.js Server Architecture Rule, Required Practices

### Community 129 - "graphify-install.mjs"
Cohesion: 0.53
Nodes (4): configureProjectAfterInstall(), installWithPip(), installWithUv(), run()

### Community 130 - "alert.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 131 - "Architecture"
Cohesion: 0.40
Nodes (4): Architecture, Overview, Source layout, Tech Stack

### Community 132 - "2026-08-18-restore-legacy-agents-assets/design.md"
Cohesion: 0.40
Nodes (4): Decisions, Implementation Plan, Purpose, Verification

### Community 133 - "Configure CI/CD"
Cohesion: 0.40
Nodes (4): Configure CI/CD, Non-goals, What changes, Why

### Community 134 - "Security"
Cohesion: 0.40
Nodes (4): Code scanning and review, Reporting vulnerabilities, Secret handling, Security

### Community 135 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 136 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 137 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 138 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 139 - "Contributing"
Cohesion: 0.50
Nodes (3): Branching, Contributing, Required checks

### Community 140 - "Design Principles"
Cohesion: 0.50
Nodes (3): Accessibility, Coding Standards, Design Principles

### Community 141 - "2026-08-18-codify-practical-documentation-workflow/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Documentation Governance Setup, 2. Artifacts and Validation, 3. Operationalization

### Community 142 - "2026-08-18-configure-modern-nextjs-biome-stack-2026/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Documentation scaffold, 2. Tooling baseline implementation, 3. Verification and alignment

### Community 143 - "2026-08-18-enforce-openspec-and-english-first-rules/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Governance Documentation, 2. Validation and Sync, 3. Completion

### Community 144 - "configure-next-intl/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Project dependencies and i18n config, 2. Locale routes and translation provider, 3. Locale messages and guidance

### Community 145 - "create-app-shell/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Reusable app-shell primitive, 2. Composition and responsive behavior, 3. Integration and verification

### Community 157 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineEnding

### Community 173 - "vcs"
Cohesion: 0.40
Nodes (5): vcs, clientKind, defaultBranch, enabled, useIgnoreFile

### Community 174 - "marker.tsx"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

### Community 175 - "assist"
Cohesion: 0.50
Nodes (4): recommended, assist, actions, enabled

## Knowledge Gaps
- **966 isolated node(s):** `Context`, `Decision: Add capability path `developer-workflows/openspec-enforcement``, `Decision: Use repository-local OpenSpec store`, `Goals / Non-Goals`, `Migration Plan` (+961 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `sidebar.tsx`, `alert.tsx`, `utils.ts`, `menubar.tsx`, `app-shell.tsx`, `app-sidebar-overview.tsx`, `tabs.tsx`, `app-sidebar-primary-actions.tsx`, `field.tsx`, `command.tsx`, `app-sidebar.tsx`, `combobox.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `app-sidebar-object-type-studio.tsx`, `attachment.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `marker.tsx`, `badge.tsx`, `pagination.tsx`, `card.tsx`, `empty.tsx`, `bubble.tsx`, `toggle-group.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Vi Utilities` connect `Vi Utilities` to `vitest/SKILL.md`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Mocking` connect `Mocking` to `vitest/SKILL.md`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `Context`, `Decision: Add capability path `developer-workflows/openspec-enforcement``, `Decision: Use repository-local OpenSpec store` to the rest of the system?**
  _966 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05134575569358178 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0549645390070922 - nodes in this community are weakly interconnected._
- **Should `scan.py` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._