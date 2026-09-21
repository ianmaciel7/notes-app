# Graph Report - notes-app  (2026-09-21)

## Corpus Check
- 212 files · ~127,229 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .rules 1, .ico 1)

## Summary
- 1910 nodes · 3174 edges · 170 communities (118 shown, 52 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 279 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f8cdb1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- shadcn Skill
- output
- Technical Specification: Recall — Community Exam Prep Platform
- field.tsx
- retry-queue-banner.tsx
- AI Tooling Mandate
- menubar.tsx
- generate_review.py
- space-tabs.tsx
- command-palette.tsx
- biome.json
- sidebar.tsx
- Anthropic AI-Native SDLC
- dependencies
- space-frame.tsx
- package.json
- repomix-explorer/SKILL.md
- run_loop.py
- components.json
- questionnaire.tsx
- Collection: objects
- Official Anthropic source map
- shadcn/ui Rules (Project Binding)
- 3. Phased Implementation Roadmap
- domain/api-keys.ts
- compilerOptions
- Specification: <short name>
- package_skill.py
- run_eval.py
- combobox.tsx
- cn
- tests/e2e/ Playwright Suite
- Styling & Customization Rules
- domain/recall.ts
- Tool Reference
- Post-hoc Analyzer Agent
- Grader Agent
- context-menu.tsx
- Agents CLI
- aggregate_benchmark.py
- Spec §3.1 Worktree Evidence Map
- helpers.ts
- react
- Documentation Conventions Rule
- Worktree Scout Agent
- carousel.tsx
- seed.ts
- radio-group.tsx
- Skill Creator
- Subagent Dispatch Templates
- chart.tsx
- measure-ai-proficiency Skill
- Plan: <short name>
- Registry Authoring and Addresses
- shadcn MCP Server
- attachment.tsx
- space-skeleton.tsx
- Execution Workflow
- Items always inside their Group component
- Chat & Messaging
- Process
- Shoogle Component Discovery Rule
- avatar.tsx
- DESING.md
- devDependencies
- alert-dialog.tsx
- shadcn/ui
- shadcn CLI Reference
- Chat & Messaging → [chat.md](./rules/chat.md)
- Component Selection
- sheet.tsx
- Responsive Behavior
- Creating a skill
- Component Composition
- navigation-menu.tsx
- Intent: <short name>
- Intent: Note Tagging
- Composition: asChild (radix) vs render (base)
- improve_description.py
- Collection: object_links (Graph Edges)
- layout.tsx
- tools.ts
- Commands
- Customization & Theming
- Notes App README Overview
- Process
- Description Optimization
- Intent: Recall — Community Exam Prep Platform
- scripts
- Implementation Plan: Recall — Collaborative Private Workspace & Exam Prep Platform
- pagination.tsx
- input-otp.tsx
- AI-Native SDLC Skill (Overview)
- Tools
- message.tsx
- space-switcher.tsx
- toast.tsx
- Process
- Process
- Components
- Spec §6 Database Schema (Graph-Ready Firestore)
- plan.md
- Running and evaluating test cases
- popover.tsx
- Worktree Code Quality Control Patterns
- mcp/route.ts
- actions/recall.ts
- item.tsx
- RTK - Rust Token Killer (Google Antigravity)
- Capture Intent (Stage 1)
- Colors
- select.tsx
- Typography
- button-group.tsx
- drawer.tsx
- proxy.ts
- resizable.tsx
- Separator
- study-panel.tsx
- RTK (Rust Token Killer)
- progress.tsx
- add command
- Comments Convention
- Paths in Docs Convention
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- notes-app Serena Project Config
- Next.js Agent Rules Block
- local.json
- graphify (rules)
- shadcn/ui Logo
- shadcn/ui Logo Icon
- src/app/ App Router Pages
- Formatting & Linting (Biome)
- Naming & Imports Convention
- Polymorphic Relations Constraint
- MVP Question Formats Constraint
- Spaced Repetition MVP Constraint
- Plan §7 Approval & Sign-Off Gate
- Plan §2 File Inventory Across Phases
- Plan §5 Risks, Breakage Points & Mitigations
- pnpm allowBuilds Configuration
- ref_next_image
- Spec §5.3 Interaction State & Event Logic
- NFR-2 Document Size
- NFR-4 Free Tier Availability
- Spec §10 Target Directory Structure
- Spec §4 Technology Stack
- Lint as a Gate
- accordion.tsx
- ReviewHandler
- bubble.tsx
- context-panel.tsx
- class-variance-authority
- breadcrumb.tsx
- empty.tsx
- collapsible.tsx
- Worktree Prior-Art Synthesis: shadcn/ui Architecture & Contracts
- tooltip.tsx
- native-select.tsx
- SM-2 Spaced Repetition Algorithm
- sdlc-builder.md

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 53 edges
3. `Component Selection` - 46 edges
4. `lucide-react` - 37 edges
5. `Button()` - 36 edges
6. `Skill Creator` - 27 edges
7. `firebase()` - 26 edges
8. `Items always inside their Group component` - 26 edges
9. `SpaceFrame()` - 22 edges
10. `Component Structure → [composition.md](./rules/composition.md)` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Component Selection` --references--> `Accordion()`  [INFERRED]
  .agents/skills/shadcn/SKILL.md → src/components/ui/accordion.tsx
- `Component Selection` --references--> `Breadcrumb()`  [INFERRED]
  .agents/skills/shadcn/SKILL.md → src/components/ui/breadcrumb.tsx
- `Composition: asChild (radix) vs render (base)` --references--> `BreadcrumbLink()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/breadcrumb.tsx
- `Items always inside their Group component` --references--> `BubbleGroup()`  [INFERRED]
  .agents/skills/shadcn/rules/composition.md → src/components/ui/bubble.tsx
- `Button / trigger as non-button element (base only)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Sidebar Subsystem Worktree Evidence Synthesis** — spec_worktree_old_2, spec_worktree_old_4, spec_worktree_old_5, spec_sidebar_contract [EXTRACTED 1.00]
- **FR-5 Spaced Repetition / SM-2 Traceability Chain (Intent to Spec to Plan)** — intent_sm2_decision, spec_fr_5_spaced_repetition, spec_sm2_algorithm, plan_phase_3_sm_2_spaced_repetition_engine [EXTRACTED 1.00]
- **FR-7 MCP Traceability Chain (Intent to Spec to Plan)** — intent_mcp_read_oriented, spec_fr_7_mcp_read_surface, plan_phase_5_space_scoped_api_keys_mcp_server [EXTRACTED 1.00]
- **FSRS Implementation Across Historical Worktrees** — claude_agents_worktree_scout_old_5, claude_agents_worktree_scout_old_8, claude_agents_worktree_scout_old_9, claude_agents_worktree_scout_fsrs [EXTRACTED 1.00]
- **Semantic Token Styling Discipline** — agents_skills_shadcn_rules_styling_semantic_colors, agents_skills_shadcn_rules_styling_built_in_variants_first, agents_skills_shadcn_rules_styling_classname_for_layout_only, agents_skills_shadcn_rules_styling_no_manual_dark_color_overrides [INFERRED 0.75]
- **Intent Capture Governance Pattern** — agents_rules_docs_intent_md, agents_skills_anthropic_sdlc_skill_capture_intent, agents_skills_anthropic_sdlc_evals_files_intent_tagging_note_tagging_intent [INFERRED 0.80]
- **shadcn/ui Governance Layering** — agents_rules_shadcn_shadcn_ui_rules, agents_skills_shadcn_skill, agents_rules_shadcn_base_ui [INFERRED 0.80]
- **Intent-Spec-Plan Artifact Chain** — agents_skills_anthropic_sdlc_skill_ai_native_sdlc_workflow, agents_skills_anthropic_sdlc_assets_intent_template_intent_template, agents_skills_anthropic_sdlc_assets_spec_template_spec_template, agents_skills_anthropic_sdlc_assets_plan_template_plan_template [INFERRED 0.85]
- **Base vs Radix API Divergence Pattern** — agents_skills_shadcn_rules_base_vs_radix_composition_aschild_radix_vs_render_base, agents_skills_shadcn_rules_base_vs_radix_select, agents_skills_shadcn_rules_base_vs_radix_togglegroup, agents_skills_shadcn_rules_base_vs_radix_slider, agents_skills_shadcn_rules_base_vs_radix_accordion, agents_skills_shadcn_rules_base_vs_radix_button_nonbutton [INFERRED 0.85]
- **Chat & Messaging Composition Pattern** — agents_skills_shadcn_rules_chat_messagescroller, agents_skills_shadcn_rules_chat_message, agents_skills_shadcn_rules_chat_bubble, agents_skills_shadcn_rules_chat_attachment, agents_skills_shadcn_rules_chat_marker [INFERRED 0.85]
- **Blind Comparison and Post-hoc Analysis Workflow** — agents_skills_skill_creator_agents_comparator_blind_comparator_agent, agents_skills_skill_creator_agents_analyzer_post_hoc_analyzer_agent, agents_skills_skill_creator_references_schemas_comparison_json, agents_skills_skill_creator_references_schemas_analysis_json [INFERRED 0.85]
- **Eval Grading and Metrics Collection** — agents_skills_skill_creator_agents_grader_grader_agent, agents_skills_skill_creator_references_schemas_grading_json, agents_skills_skill_creator_references_schemas_metrics_json, agents_skills_skill_creator_references_schemas_timing_json [INFERRED 0.85]

## Communities (170 total, 52 thin omitted)

### Community 0 - "shadcn Skill"
Cohesion: 0.19
Nodes (8): Dialog/Sheet/Drawer Title Requirement, shadcn Skill, CLI Rules (presets), npx shadcn@latest CLI, Component Selection Guide, Component Structure Rules, Styling & Tailwind Rules, Updating Components Workflow

### Community 1 - "output"
Cohesion: 0.05
Nodes (36): includeDiffs, includeLogs, includeLogsCount, sortByChanges, sortByChangesMaxCommits, ignore, customPatterns, useDefaultPatterns (+28 more)

### Community 2 - "Technical Specification: Recall — Community Exam Prep Platform"
Cohesion: 0.06
Nodes (36): 10. Target Directory Structure, 11. Acceptance Summary, 12. Implementation and screen verification status, 1. Summary & Scope, 2.1 Functional, 2.2 Non-Functional, 2.3 Users and flows, 2.4.1 Concrete Empty States (+28 more)

### Community 3 - "field.tsx"
Cohesion: 0.10
Nodes (24): ToggleGroup, Buttons inside inputs use InputGroup + InputGroupAddon, Contents, Field validation and disabled states, FieldSet + FieldLegend for grouping related fields, Forms & Inputs, Forms use FieldGroup + Field, InputGroup requires InputGroupInput/InputGroupTextarea (+16 more)

### Community 4 - "retry-queue-banner.tsx"
Cohesion: 0.16
Nodes (15): Icons, Icons in Button use data-icon attribute, No sizing classes on icons inside components, Pass icons as component objects, not string keys, RetryQueueBanner(), useGradeRetryQueue(), submitGrade(), Alert() (+7 more)

### Community 5 - "AI Tooling Mandate"
Cohesion: 0.11
Nodes (19): AI Tooling Mandate, Command Safety Hook, Context7 (Mandatory Docs Lookup), RTK Gatekeeper Hook, Graphify (Mandatory Architecture Query), Primitive Discipline (Cheapest Primitive First), Repomix (Token-Budget Audits Only), RTK (Mandatory Terminal Compression) (+11 more)

### Community 7 - "generate_review.py"
Cohesion: 0.14
Nodes (22): build_run(), embed_file(), find_runs(), _find_runs_recursive(), generate_html(), get_mime_type(), _kill_port(), load_previous_iteration() (+14 more)

### Community 8 - "space-tabs.tsx"
Cohesion: 0.42
Nodes (8): persist(), SpaceTabs(), close(), maxTabs, nextActiveTab(), parseTabs(), serializeTabs(), tabsCookie

### Community 9 - "command-palette.tsx"
Cohesion: 0.14
Nodes (16): Component Structure → [composition.md](./rules/composition.md), CommandPalette(), destinations, CardFooter(), Command(), CommandEmpty(), CommandGroup(), CommandInput() (+8 more)

### Community 10 - "biome.json"
Cohesion: 0.07
Nodes (26): source, assist, actions, css, parser, next, react, files (+18 more)

### Community 11 - "sidebar.tsx"
Cohesion: 0.08
Nodes (12): 5.4 Sidebar contract and Fluid Functionalism reference, Sidebar migration and rollout boundary, Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarProvider() (+4 more)

### Community 12 - "Anthropic AI-Native SDLC"
Cohesion: 0.08
Nodes (24): 10. Maintain / Close the Loop, 1. Capture Intent, 2. Requirements & Design, 3. Plan Mode, 4. Build, 5. Feedback Loop & Verification, 6. Continuous Evals, 7. PR Review (+16 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, firebase (+17 more)

### Community 14 - "space-frame.tsx"
Cohesion: 0.09
Nodes (23): ref_next_navigation, logout(), ObjectPage(), QuestionPage(), navGroups, NavKey, persistCollapsed(), settingsNavItem (+15 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (24): name, packageManager, private, version, @axe-core/playwright, babel-plugin-react-compiler, @biomejs/biome, cmdk (+16 more)

### Community 16 - "repomix-explorer/SKILL.md"
Cohesion: 0.07
Nodes (27): Best Practices, Communication Style, Efficiency, Error Handling, Example 1: Basic Remote Repository Analysis, Example 2: Finding Specific Patterns, Example 3: Structure Analysis, Example 4: Large Repository with Compression (+19 more)

### Community 17 - "run_loop.py"
Cohesion: 0.12
Nodes (18): generate_html(), main(), Generate HTML report from loop output data. If auto_refresh is True, adds a…, Generate an HTML report from run_loop.py output. Takes the JSON output from…, main(), Path, Run the eval + improve loop until all pass or max iterations reached. Combines…, Split eval set into train and test sets, stratified by should_trigger. (+10 more)

### Community 18 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 19 - "questionnaire.tsx"
Cohesion: 0.11
Nodes (8): react-day-picker, ref_shadcn_react_questionnaire, buttonVariants, Calendar(), QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit()

### Community 20 - "Collection: objects"
Cohesion: 0.18
Nodes (16): Content Moderation v1 (Report-and-Hide), One Exam Per User Constraint, Graph-Ready MVP Object Types, Phase 2: Object CRUD, TipTap Editor & Graph, Spec §9 Areas of Concern & Unresolved Conflicts, Collection: objects, FR-10 One Exam Per User, FR-2 Objects (+8 more)

### Community 21 - "Official Anthropic source map"
Cohesion: 0.13
Nodes (19): AI-native SDLC Playbook, Playbook: CI/CD integration and deployment, Playbook: Continuous evals in CI, Playbook: Give Claude a feedback loop, Playbook: Hooks as approval gates, Notes on interpretation, Official Anthropic source map, Playbook: Parallel sessions and subagents (+11 more)

### Community 22 - "shadcn/ui Rules (Project Binding)"
Cohesion: 0.11
Nodes (19): base-nova Style, Base UI (@base-ui/react), Button Spinner (no isPending/isLoading prop), Full Card Composition, Chat Primitives (scaffolded, unused), components.json Configuration, FieldGroup + Field Forms Pattern, src/app/globals.css (design tokens) (+11 more)

### Community 23 - "3. Phased Implementation Roadmap"
Cohesion: 0.17
Nodes (15): Read-Oriented MCP Surface Constraint, Configurable Study Sessions Constraint, Success Criteria, 3. Phased Implementation Roadmap, Phase 1: Auth & Tenant Isolation, Phase 2: Dynamic Object CRUD, TipTap Editor & Graph, Phase 4: Simulated Exam Engine & Timers, Phase 5: Space-Scoped API Keys & MCP Server (+7 more)

### Community 24 - "domain/api-keys.ts"
Cohesion: 0.22
Nodes (15): ref_node_crypto, createSpaceApiKey(), listSpaceApiKeys(), owner(), revokeSpaceApiKey(), ApiKeysCard(), ApiKey, apiKeyLabel (+7 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 26 - "Specification: <short name>"
Cohesion: 0.11
Nodes (17): Acceptance summary, Data and integrations, FR-1: <name>, Functional requirements, In scope, Migration / rollout considerations, Non-functional requirements, Objective (+9 more)

### Community 27 - "package_skill.py"
Cohesion: 0.14
Nodes (16): main(), package_skill(), Path, Skill Packager - Creates a distributable .skill file of a skill folder Usage:…, Check if a path should be excluded from packaging., Package a skill folder into a .skill file. Args: skill_path: Path to the skill…, should_exclude(), Basic validation of a skill (+8 more)

### Community 28 - "run_eval.py"
Cohesion: 0.15
Nodes (16): find_project_root(), main(), Path, Run the full eval set and return results., Run trigger evaluation for a skill description. Tests whether a skill's…, Find the project root by walking up from cwd looking for .claude/. Mimics how…, Run a single query and return whether the skill was triggered. Creates a…, run_eval() (+8 more)

### Community 29 - "combobox.tsx"
Cohesion: 0.10
Nodes (6): @base-ui/react, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants

### Community 30 - "cn"
Cohesion: 0.11
Nodes (4): ref_base_ui_react_preview_card, ref_base_ui_react_switch, cn, Table()

### Community 31 - "tests/e2e/ Playwright Suite"
Cohesion: 0.18
Nodes (13): src/proxy.ts Middleware, Implementation status, Command Palette (Fifth Pass), E2E Verification Run 2026-09-21, middleware.ts to proxy.ts Rename (Next.js 16), Phase 6 Verification Suite (Third Pass), Transient-Surface Contract, Tabs & Context Panel (Sixth Pass), Spec §5.5 Dialog/Popover/Menu/Tab/Context-Panel Contract (+5 more)

### Community 32 - "Styling & Customization Rules"
Cohesion: 0.20
Nodes (17): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Customizing Components, Built-in variants first, className for layout only, Contents (+9 more)

### Community 33 - "domain/recall.ts"
Cohesion: 0.10
Nodes (21): Domain Logic Convention, Validation Convention (zod, idSchema), Consolidated Domain/Action Files Decision, Plan §8 Recorded Drift From Plan, FirebaseUI Alternative Rejected, Literal SM-2 EF' Implementation, Plan §4 Automated Testing Matrix, Attempt (+13 more)

### Community 34 - "Tool Reference"
Cohesion: 0.14
Nodes (12): Call examples, Item fields, MCP server, Pagination, Response, Search behavior, Tool Reference, Gotchas (+4 more)

### Community 35 - "Post-hoc Analyzer Agent"
Cohesion: 0.13
Nodes (16): Categories for Suggestions, Guidelines, Inputs, Output Format, Post-hoc Analyzer Agent, Priority Levels, Role, Blind Comparator Agent (+8 more)

### Community 36 - "Grader Agent"
Cohesion: 0.15
Nodes (15): Field Descriptions, Grader Agent, Grading Criteria, Guidelines, Inputs, Output Format, Role, Step 8: Read Executor Metrics and Timing (+7 more)

### Community 38 - "Agents CLI"
Cohesion: 0.13
Nodes (16): Agents CLI, agents.json, agents mcp add Command, agents mcp test --runtime Command, agents status Command, agents sync Command, Root AGENTS.md (canonical instruction document), skills/*/SKILL.md Source Files (+8 more)

### Community 39 - "aggregate_benchmark.py"
Cohesion: 0.17
Nodes (15): aggregate_results(), calculate_stats(), generate_benchmark(), generate_markdown(), load_run_results(), main(), Path, Aggregate run results into summary statistics. Returns run_summary with stats… (+7 more)

### Community 40 - "Spec §3.1 Worktree Evidence Map"
Cohesion: 0.23
Nodes (16): Worktrees (.worktrees/old..old-9), Spec §11 Acceptance Summary, Cross-Worktree Subsystem Synthesis, Spec §5.4 Sidebar Contract, Spec Sidebar-Specific Evidence Map, Spec §3.1 Worktree Evidence Map, Worktree old, Worktree old-1 (+8 more)

### Community 41 - "helpers.ts"
Cohesion: 0.28
Nodes (13): @playwright/test, describeViolations(), expectNoViolations(), wcagTags, createObject(), createSpace(), ensure(), signUp() (+5 more)

### Community 42 - "react"
Cohesion: 0.12
Nodes (24): ref_base_ui_react_button, lucide-react, ref_next_link, react, ref_shadcn_react_message_scroller, @tiptap/react, @tiptap/starter-kit, changeObject() (+16 more)

### Community 43 - "Documentation Conventions Rule"
Cohesion: 0.17
Nodes (14): .agents/rules/<topic>.md Convention, `AGENTS.md`, `.agents/rules/` files, `CLAUDE.md` and `GEMINI.md`, `/docs`, /docs Project Documentation, Documentation Conventions Rule, GEMINI.md (root) (+6 more)

### Community 44 - "Worktree Scout Agent"
Cohesion: 0.19
Nodes (15): Auth Boundary Pattern, FSRS Scheduler, old-2 Worktree, old-3 Worktree, old-4 Worktree, old-5 Worktree, old-6 Worktree, old-7 Worktree (+7 more)

### Community 45 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): embla-carousel-react, CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 46 - "seed.ts"
Cohesion: 0.15
Nodes (17): Server-Only Boundary Convention, ref_firebase_admin_app, ref_firebase_admin_auth, ref_firebase_admin_firestore, ref_node_assert_strict, ref_node_test, ref_node_url, server-only (+9 more)

### Community 47 - "radio-group.tsx"
Cohesion: 0.40
Nodes (4): ref_base_ui_react_radio, ref_base_ui_react_radio_group, RadioGroup(), RadioGroupItem()

### Community 48 - "Skill Creator"
Cohesion: 0.14
Nodes (13): Apache License 2.0, scripts.aggregate_benchmark, Claude.ai-specific instructions, Communicating with the user, Cowork-Specific Instructions, How to think about improvements, Improving the skill, scripts.package_skill (+5 more)

### Community 49 - "Subagent Dispatch Templates"
Cohesion: 0.29
Nodes (6): 1. Domain & Security Scout Template (Old-9), 2. UI Shell & Navigation Scout Template (Old-2), 3. Editor & Query Engine Scout Template (Old-4), 4. Spaced Repetition & Study Flow Scout Template (Old-8), Invariants for Subagent Invocation:, Subagent Dispatch Templates

### Community 50 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 51 - "measure-ai-proficiency Skill"
Cohesion: 0.15
Nodes (13): CLAUDE.md (root), Playbook: The repository guidance file (claude-md), measure-ai-proficiency Skill, ARCHITECTURE.md Structure Recommendation, CLAUDE.md Structure Recommendation, Content Validation, CONVENTIONS.md Structure Recommendation, Cross-Reference Detection (+5 more)

### Community 52 - "Plan: <short name>"
Cohesion: 0.15
Nodes (12): Alternatives considered, Approval gate, Architecture and dependencies, Data / migration work, Files / modules that change, Implementation order, Likely breakage points, Plan: <short name> (+4 more)

### Community 53 - "Registry Authoring and Addresses"
Cohesion: 0.21
Nodes (13): build command, Configuring Registries, Address Schemes, Build and Verify, Built Registry, GitHub Registries, Include, Item Definitions (+5 more)

### Community 54 - "shadcn MCP Server"
Cohesion: 0.17
Nodes (12): info command, search command, view command, Adding Custom Colors (Tailwind v3/v4), shadcn:get_audit_checklist tool, shadcn:get_item_examples_from_registries tool, shadcn:get_project_registries tool, shadcn:list_items_in_registries tool (+4 more)

### Community 55 - "attachment.tsx"
Cohesion: 0.19
Nodes (6): Attachments use Attachment, Attachment(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 56 - "space-skeleton.tsx"
Cohesion: 0.20
Nodes (3): cardRows, navRows, SpaceSkeleton()

### Community 57 - "Execution Workflow"
Cohesion: 0.15
Nodes (11): Cross-Cutting Architecture Rules, Worktree Evidence Map, Worktree Matrix, Core Rules & Invariants, Execution Workflow, Step 1: Scope & Graphify Pre-Query, Step 2: Dispatch Subagents in Parallel (Per Worktree, Light Model), Step 3: Synthesize & Extract "Minimal Test per Code" Patterns (+3 more)

### Community 58 - "Items always inside their Group component"
Cohesion: 0.25
Nodes (8): Items always inside their Group component, ContextMenuGroup(), ContextMenuItem(), DropdownMenuItem(), DropdownMenuSub(), MenubarGroup(), MenubarItem(), MessageScrollerContent()

### Community 59 - "Chat & Messaging"
Cohesion: 0.21
Nodes (12): Attachment (file/image attachments), Bubble (message surface), Chat & Messaging, Contents, Escape hatch: the scroller hooks, Marker (system notes and dividers), Message (row layout), MessageScroller (scrollable threads) (+4 more)

### Community 60 - "Process"
Cohesion: 0.17
Nodes (11): Analyzing Benchmark Results, Guidelines, Inputs, Process, Role, Step 1: Read Benchmark Data, Step 2: Analyze Per-Assertion Patterns, Step 3: Analyze Cross-Eval Patterns (+3 more)

### Community 62 - "avatar.tsx"
Cohesion: 0.22
Nodes (4): Avatar always needs AvatarFallback, ref_base_ui_react_avatar, Avatar(), AvatarFallback()

### Community 63 - "DESING.md"
Cohesion: 0.12
Nodes (15): Border Radius Scale, Decorative Depth, Do, Do's and Don'ts, Don't, Elevation & Depth, Grid & Container, Iteration Guide (+7 more)

### Community 64 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @axe-core/playwright, babel-plugin-react-compiler, @biomejs/biome, firebase-tools, @playwright/test, tailwindcss, @tailwindcss/postcss (+5 more)

### Community 66 - "shadcn/ui"
Cohesion: 0.15
Nodes (13): CLI, Component Docs, Examples, and Usage, Critical Rules, Current Project Context, Detailed References, Icons → [icons.md](./rules/icons.md), Key Fields, Key Patterns (+5 more)

### Community 67 - "shadcn CLI Reference"
Cohesion: 0.25
Nodes (11): shadcn/ui Agent Interface Config, apply command, Contents, diff command (deprecated), docs command, init command, Presets, shadcn CLI Reference (+3 more)

### Community 68 - "Chat & Messaging → [chat.md](./rules/chat.md)"
Cohesion: 0.24
Nodes (9): Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in, Chat & Messaging → [chat.md](./rules/chat.md), ref_base_ui_react_scroll_area, MessageScroller(), MessageScrollerButton(), MessageScrollerItem(), MessageScrollerProvider() (+1 more)

### Community 69 - "Component Selection"
Cohesion: 0.30
Nodes (11): Choosing between overlay components, No manual z-index on overlay components, Component Selection, ref_base_ui_react_slider, AlertDialog(), Drawer(), HoverCard(), Popover() (+3 more)

### Community 70 - "sheet.tsx"
Cohesion: 0.25
Nodes (4): ref_base_ui_react_dialog, SheetContent(), SheetDescription(), SheetHeader()

### Community 71 - "Responsive Behavior"
Cohesion: 0.40
Nodes (5): Breakpoints, Collapsing Strategy, Image Behavior, Responsive Behavior, Touch Targets

### Community 72 - "Creating a skill"
Cohesion: 0.18
Nodes (11): Anatomy of a Skill, Capture Intent, Creating a skill, Interview and Research, Principle of Lack of Surprise, Progressive Disclosure, Skill Writing Guide, Test Cases (+3 more)

### Community 73 - "Component Composition"
Cohesion: 0.17
Nodes (11): Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Component Composition, Contents, Dialog, Sheet, and Drawer always need a Title, Empty states use Empty component, Use existing components instead of custom markup (+3 more)

### Community 74 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (5): ref_base_ui_react_navigation_menu, NavigationMenu(), NavigationMenuLink(), NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 75 - "Intent: <short name>"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: <short name>, Open questions, Out of scope, Problem, Proposed outcome (+1 more)

### Community 76 - "Intent: Note Tagging"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: Note Tagging, Non-goals, Open questions, Problem / unmet need, Proposed outcome (+1 more)

### Community 77 - "Composition: asChild (radix) vs render (base)"
Cohesion: 0.17
Nodes (13): Accordion, Base vs Radix, Button/trigger as non-button element (base only, nativeButton), Button / trigger as non-button element (base only), Composition: asChild (radix) vs render (base), Contents, Select, Slider (+5 more)

### Community 78 - "improve_description.py"
Cohesion: 0.24
Nodes (9): _call_claude(), improve_description(), main(), Path, Improve a skill description based on eval results. Takes eval results (from…, Run `claude -p` with the prompt on stdin and return the text response. Prompt…, Call Claude to improve the description based on eval results., argparse (+1 more)

### Community 79 - "Collection: object_links (Graph Edges)"
Cohesion: 0.20
Nodes (11): firestore.rules (Default-Deny), Multi-Tenancy Model, Open questions, Resolved Decisions, Blanket-Deny Firestore Rules Decision, Collection: object_links (Graph Edges), FR-3 Graph Linking, FR-8 Backlinks Navigation (+3 more)

### Community 80 - "layout.tsx"
Cohesion: 0.20
Nodes (7): nextConfig, next, ref_next_font_google, src_app_globals, geistMono, geistSans, metadata

### Community 81 - "tools.ts"
Cohesion: 0.12
Nodes (17): zod, MCP JSON-RPC Error & Protocol Contracts, Spec §7.2 MCP Server, MCP Tool: get_object, MCP Tool: get_study_summary, MCP Tool: list_objects, MCP Tool: search_space_content, StudyRecord (+9 more)

### Community 82 - "Commands"
Cohesion: 0.22
Nodes (9): `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, `diff` — Check for updates, `docs` — Get component documentation URLs, `info` — Project information, `init` — Initialize or create a project, `search` — Search registries (+1 more)

### Community 83 - "Customization & Theming"
Cohesion: 0.22
Nodes (8): Adding Custom Colors, Border Radius, Color Variables, Contents, How It Works (CSS variables to utilities), Customization & Theming, Dark Mode, How It Works

### Community 84 - "Notes App README Overview"
Cohesion: 0.29
Nodes (11): Recall Architecture Overview, Claude.com Design Analysis System, Color Token System (Cream/Coral/Dark Navy), Component Library (Buttons, Cards, Bands), Typography System (Copernicus/StyreneB), Problem, Plan §1.1 Architectural Layers, Notes App README Overview (+3 more)

### Community 85 - "Process"
Cohesion: 0.22
Nodes (9): Process, Step 1: Read Comparison Result, Step 2: Read Both Skills, Step 3: Read Both Transcripts, Step 4: Analyze Instruction Following, Step 5: Identify Winner Strengths, Step 6: Identify Loser Weaknesses, Step 7: Generate Improvement Suggestions (+1 more)

### Community 86 - "Description Optimization"
Cohesion: 0.22
Nodes (9): Eval Set Review HTML Template, Eval Viewer (viewer.html), Description Optimization, How skill triggering works, Package and Present (only if `present_files` tool is available), Step 1: Generate trigger eval queries, Step 2: Review with user, Step 3: Run the optimization loop (+1 more)

### Community 87 - "Intent: Recall — Community Exam Prep Platform"
Cohesion: 0.40
Nodes (5): Affected users and systems, Constraints, Intent: Recall — Community Exam Prep Platform, Proposed outcome, Related

### Community 88 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, emulators, emulators:exec, emulators:export, format, lint (+4 more)

### Community 89 - "Implementation Plan: Recall — Collaborative Private Workspace & Exam Prep Platform"
Cohesion: 0.22
Nodes (9): 1.1 Architectural Layers, 1.2 System Boundary Rules, 1. Architecture & Dependency Boundaries, 2. File Inventory Across Phases, 4. Automated Testing Matrix, 5. Risks, Breakage Points & Mitigations, 6. Traceability Matrix, 7. Approval & Sign-Off Gate (+1 more)

### Community 93 - "AI-Native SDLC Skill (Overview)"
Cohesion: 0.25
Nodes (8): Intent Template, Plan Template, Spec Template, AI-Native SDLC Skill (Overview), Playbook: Plan Mode, Playbook: Requirements and design, Plan Mode (Stage 3), Requirements & Design (Stage 2)

### Community 94 - "Tools"
Cohesion: 0.25
Nodes (8): `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, `shadcn:search_items_in_registries`, `shadcn:view_items_in_registries`, Tools

### Community 95 - "message.tsx"
Cohesion: 0.29
Nodes (3): Message rows use Message, Message(), MessageGroup()

### Community 96 - "space-switcher.tsx"
Cohesion: 0.16
Nodes (14): ref_base_ui_react_menu, selectSpace(), SpaceSwitcher(), DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuLabel(), DropdownMenuPortal() (+6 more)

### Community 98 - "Process"
Cohesion: 0.25
Nodes (8): Process, Step 1: Read Both Outputs, Step 2: Understand the Task, Step 3: Generate Evaluation Rubric, Step 4: Evaluate Each Output Against the Rubric, Step 5: Check Assertions (if provided), Step 6: Determine the Winner, Step 7: Write Comparison Results

### Community 99 - "Process"
Cohesion: 0.25
Nodes (8): Process, Step 1: Read the Transcript, Step 2: Examine Output Files, Step 3: Evaluate Each Assertion, Step 4: Extract and Verify Claims, Step 5: Read User Notes, Step 6: Critique the Evals, Step 7: Write Grading Results

### Community 100 - "Components"
Cohesion: 0.25
Nodes (8): Buttons, Cards & Containers, Components, CTA / Footer, Inputs & Forms, Tab / Filter, Tags / Badges, Top Navigation

### Community 101 - "Spec §6 Database Schema (Graph-Ready Firestore)"
Cohesion: 0.25
Nodes (8): Space-Based Architecture Constraint, All Spaces Are Private Decision, Collection: spaces, Collection: study_records, Collection: users, Spec §6 Database Schema (Graph-Ready Firestore), FR-1 Spaces, FR-6 Space-Scoped Browsing

### Community 102 - "plan.md"
Cohesion: 0.43
Nodes (3): AI-Native SDLC Skill, Contents, Suggested project installation

### Community 103 - "Running and evaluating test cases"
Cohesion: 0.29
Nodes (7): Running and evaluating test cases, Step 1: Spawn all runs (with-skill AND baseline) in the same turn, Step 2: While runs are in progress, draft assertions, Step 3: As runs complete, capture timing data, Step 4: Grade, aggregate, and launch the viewer, Step 5: Read the feedback, What the user sees in the viewer

### Community 106 - "mcp/route.ts"
Cohesion: 0.28
Nodes (11): dispatch(), envelope(), Id, POST(), reply(), resolveKey(), hashApiKey(), callTool() (+3 more)

### Community 107 - "actions/recall.ts"
Cohesion: 0.16
Nodes (27): Request Flow (Session & MCP), ref_next_headers, addMember(), createSpace(), finishSession(), loadSession(), login(), rateAttempt() (+19 more)

### Community 108 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 109 - "RTK - Rust Token Killer (Google Antigravity)"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 110 - "Capture Intent (Stage 1)"
Cohesion: 0.40
Nodes (5): Note Tagging Intent (Eval Fixture), Playbook: Capture as intent.md, Playbook: Closing the loop on metrics, Capture Intent (Stage 1), Maintain / Close the Loop (Stage 10)

### Community 111 - "Colors"
Cohesion: 0.40
Nodes (5): Brand & Accent, Colors, Semantic, Surface, Text

### Community 112 - "select.tsx"
Cohesion: 0.17
Nodes (7): Select — multiple selection and object values (base only), Workflow, ref_base_ui_react_select, SelectGroup(), SelectItem(), SelectLabel(), SelectValue()

### Community 113 - "Typography"
Cohesion: 0.40
Nodes (5): Font Family, Hierarchy, Note on Font Substitutes, Principles, Typography

### Community 114 - "button-group.tsx"
Cohesion: 0.22
Nodes (9): System notes and dividers use Marker, ref_base_ui_react_merge_props, ref_base_ui_react_use_render, ButtonGroup(), buttonGroupVariants, Marker(), MarkerContent(), MarkerIcon() (+1 more)

### Community 115 - "drawer.tsx"
Cohesion: 0.15
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 116 - "proxy.ts"
Cohesion: 0.29
Nodes (3): ref_next_server, config, protectedPrefixes

### Community 118 - "Separator"
Cohesion: 0.22
Nodes (7): Toast notifications follow the project base, Use Components, Not Custom Markup → [composition.md](./rules/composition.md), ref_base_ui_react_separator, Empty(), Separator(), Skeleton(), toast

### Community 119 - "study-panel.tsx"
Cohesion: 0.12
Nodes (21): ref_base_ui_react_input, ref_firebase_app, ref_firebase_auth, LoginPage(), recent, ReviewPage(), SettingsPage(), SpacePage() (+13 more)

### Community 120 - "RTK (Rust Token Killer)"
Cohesion: 0.50
Nodes (4): rtk discover, rtk gain, rtk proxy, RTK (Rust Token Killer)

### Community 122 - "add command"
Cohesion: 0.47
Nodes (6): add command, `add` — Add components, Dry-Run Mode, Smart Merge from Upstream, Checking for Updates, shadcn:get_add_command_for_items tool

### Community 155 - "ReviewHandler"
Cohesion: 0.33
Nodes (3): Serves the review HTML and handles feedback saves. Regenerates the HTML on each…, ReviewHandler, BaseHTTPRequestHandler

### Community 156 - "bubble.tsx"
Cohesion: 0.39
Nodes (7): Message surfaces use Bubble, Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 157 - "context-panel.tsx"
Cohesion: 0.23
Nodes (10): TabsTrigger must be inside TabsList, ref_base_ui_react_tabs, ContextPanel(), onKeyDown(), Tabs(), TabsContent(), TabsList(), tabsListVariants (+2 more)

### Community 158 - "class-variance-authority"
Cohesion: 0.36
Nodes (7): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, class-variance-authority, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 163 - "collapsible.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_collapsible, Collapsible(), CollapsibleTrigger()

### Community 165 - "tooltip.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_tooltip, TooltipContent(), TooltipTrigger()

### Community 167 - "SM-2 Spaced Repetition Algorithm"
Cohesion: 0.83
Nodes (4): SM-2 Spaced Repetition Algorithm Decision, Phase 3: SM-2 Spaced Repetition Engine, FR-5 Spaced Repetition, SM-2 Spaced Repetition Algorithm

## Ambiguous Edges - Review These
- `shadcn CLI Reference` → `shadcn/ui Agent Interface Config`  [AMBIGUOUS]
  .agents/skills/shadcn/agents/openai.yml · relation: references
- `Spec §5 Design System & UX Standards` → `Claude.com Design Analysis System`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **639 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+634 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1006 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `shadcn CLI Reference` and `shadcn/ui Agent Interface Config`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Spec §5 Design System & UX Standards` and `Claude.com Design Analysis System`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Button()` connect `react` to `Technical Specification: Recall — Community Exam Prep Platform`, `field.tsx`, `retry-queue-banner.tsx`, `command-palette.tsx`, `sidebar.tsx`, `space-frame.tsx`, `questionnaire.tsx`, `combobox.tsx`, `context-panel.tsx`, `carousel.tsx`, `attachment.tsx`, `alert-dialog.tsx`, `shadcn/ui`, `Component Selection`, `sheet.tsx`, `Composition: asChild (radix) vs render (base)`, `pagination.tsx`, `space-switcher.tsx`, `toast.tsx`, `study-panel.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `field.tsx`, `retry-queue-banner.tsx`, `menubar.tsx`, `space-tabs.tsx`, `command-palette.tsx`, `sidebar.tsx`, `space-frame.tsx`, `package.json`, `questionnaire.tsx`, `bubble.tsx`, `combobox.tsx`, `context-panel.tsx`, `breadcrumb.tsx`, `cn`, `class-variance-authority`, `context-menu.tsx`, `native-select.tsx`, `carousel.tsx`, `chart.tsx`, `attachment.tsx`, `avatar.tsx`, `alert-dialog.tsx`, `Chat & Messaging → [chat.md](./rules/chat.md)`, `sheet.tsx`, `pagination.tsx`, `input-otp.tsx`, `message.tsx`, `space-switcher.tsx`, `toast.tsx`, `popover.tsx`, `item.tsx`, `select.tsx`, `button-group.tsx`, `drawer.tsx`, `study-panel.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `Component Selection` connect `Component Selection` to `field.tsx`, `retry-queue-banner.tsx`, `menubar.tsx`, `command-palette.tsx`, `sidebar.tsx`, `accordion.tsx`, `bubble.tsx`, `context-panel.tsx`, `cn`, `breadcrumb.tsx`, `class-variance-authority`, `collapsible.tsx`, `context-menu.tsx`, `react`, `radio-group.tsx`, `attachment.tsx`, `avatar.tsx`, `shadcn/ui`, `Chat & Messaging → [chat.md](./rules/chat.md)`, `Component Composition`, `navigation-menu.tsx`, `pagination.tsx`, `message.tsx`, `space-switcher.tsx`, `button-group.tsx`, `Separator`, `study-panel.tsx`, `progress.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `Component Selection` (e.g. with `Accordion()` and `Alert()`) actually correct?**
  _`Component Selection` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `Button()` (e.g. with `Button / trigger as non-button element (base only)` and `Buttons inside inputs use InputGroup + InputGroupAddon`) actually correct?**
  _`Button()` has 9 INFERRED edges - model-reasoned connections that need verification._