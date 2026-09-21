# Graph Report - notes-app  (2026-09-21)

## Corpus Check
- 190 files · ~105,477 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1765 nodes · 2946 edges · 154 communities (113 shown, 41 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 274 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- item.tsx
- output
- Technical Specification: Recall — Community Exam Prep Platfo
- toast.tsx
- actions/recall.ts
- AI Tooling Mandate
- menubar.tsx
- generate_review.py
- api-keys-card.tsx
- react
- biome.json
- sidebar.tsx
- Anthropic AI-Native SDLC
- dependencies
- workspace-frame.tsx
- package.json
- lucide-react
- run_loop.py
- components.json
- questionnaire.tsx
- Collection: objects
- Official Anthropic source map
- shadcn/ui Rules (Project Binding)
- 3. Phased Implementation Roadmap
- tools.ts
- compilerOptions
- Specification: <short name>
- package_skill.py
- run_eval.py
- combobox.tsx
- cn
- actions/api-keys.ts
- Styling & Customization Rules
- Items always inside their Group component
- input-group.tsx
- Post-hoc Analyzer Agent
- Grader Agent
- context-menu.tsx
- Agents CLI
- aggregate_benchmark.py
- Spec §3.1 Worktree Evidence Map
- helpers.ts
- workspace-skeleton.tsx
- Documentation Conventions Rule
- Worktree Scout Agent
- carousel.tsx
- shadcn Skill
- Forms use FieldGroup + Field
- Skill Creator
- drawer.tsx
- chart.tsx
- measure-ai-proficiency Skill
- Plan: <short name>
- Registry Authoring and Addresses
- shadcn MCP Server
- attachment.tsx
- empty.tsx
- workspace-tabs.tsx
- Composition: asChild (radix) vs render (base)
- Chat & Messaging
- Process
- session.ts
- domain/recall.ts
- DESING.md
- devDependencies
- alert-dialog.tsx
- route.ts
- shadcn CLI Reference
- Chat & Messaging → [chat.md](./rules/chat.md)
- Component Selection
- sheet.tsx
- field.tsx
- Creating a skill
- tests/e2e/ Playwright Suite
- navigation-menu.tsx
- Intent: <short name>
- Intent: Note Tagging
- Base vs Radix
- improve_description.py
- Plan §8 Recorded Drift From Plan
- layout.tsx
- rich-text.tsx
- Commands
- Customization & Theming
- shadcn/ui
- Process
- Description Optimization
- Intent: Recall — Community Exam Prep Platform
- scripts
- Implementation Plan: Recall — Collaborative Private Workspac
- class-variance-authority
- pagination.tsx
- table.tsx
- AI-Native SDLC Skill (Overview)
- Tools
- message.tsx
- bubble.tsx
- tabs.tsx
- Process
- Process
- Components
- Spec §6 Database Schema (Graph-Ready Firestore)
- plan.md
- Running and evaluating test cases
- popover.tsx
- progress.tsx
- add command
- accordion.tsx
- alert.tsx
- RTK - Rust Token Killer (Google Antigravity)
- Capture Intent (Stage 1)
- Colors
- Responsive Behavior
- Typography
- tooltip.tsx
- input-otp.tsx
- proxy.ts
- resizable.tsx
- useIsMobile()
- changeObject()
- RTK (Rust Token Killer)
- Icons
- Layout
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

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 52 edges
3. `Component Selection` - 46 edges
4. `lucide-react` - 36 edges
5. `Button()` - 36 edges
6. `Skill Creator` - 27 edges
7. `Items always inside their Group component` - 26 edges
8. `firebase()` - 26 edges
9. `Component Structure → [composition.md](./rules/composition.md)` - 21 edges
10. `shadcn Skill` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Icons → [icons.md](./rules/icons.md)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/SKILL.md → src/components/ui/button.tsx
- `Field validation and disabled states` --references--> `NativeSelect()`  [INFERRED]
  .agents/skills/shadcn/rules/forms.md → src/components/ui/native-select.tsx
- `Composition: asChild (radix) vs render (base)` --references--> `BreadcrumbLink()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/breadcrumb.tsx
- `Composition: asChild (radix) vs render (base)` --references--> `NavigationMenuLink()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/navigation-menu.tsx
- `Composition: asChild (radix) vs render (base)` --references--> `PopoverTrigger()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/popover.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Intent-Spec-Plan Artifact Chain** — agents_skills_anthropic_sdlc_skill_ai_native_sdlc_workflow, agents_skills_anthropic_sdlc_assets_intent_template_intent_template, agents_skills_anthropic_sdlc_assets_spec_template_spec_template, agents_skills_anthropic_sdlc_assets_plan_template_plan_template [INFERRED 0.85]
- **Intent Capture Governance Pattern** — agents_rules_docs_intent_md, agents_skills_anthropic_sdlc_skill_capture_intent, agents_skills_anthropic_sdlc_evals_files_intent_tagging_note_tagging_intent [INFERRED 0.80]
- **shadcn/ui Governance Layering** — agents_rules_shadcn_shadcn_ui_rules, agents_skills_shadcn_skill, agents_rules_shadcn_base_ui [INFERRED 0.80]
- **Chat & Messaging Composition Pattern** — agents_skills_shadcn_rules_chat_messagescroller, agents_skills_shadcn_rules_chat_message, agents_skills_shadcn_rules_chat_bubble, agents_skills_shadcn_rules_chat_attachment, agents_skills_shadcn_rules_chat_marker [INFERRED 0.85]
- **Base vs Radix API Divergence Pattern** — agents_skills_shadcn_rules_base_vs_radix_composition_aschild_radix_vs_render_base, agents_skills_shadcn_rules_base_vs_radix_select, agents_skills_shadcn_rules_base_vs_radix_togglegroup, agents_skills_shadcn_rules_base_vs_radix_slider, agents_skills_shadcn_rules_base_vs_radix_accordion, agents_skills_shadcn_rules_base_vs_radix_button_nonbutton [INFERRED 0.85]
- **Semantic Token Styling Discipline** — agents_skills_shadcn_rules_styling_semantic_colors, agents_skills_shadcn_rules_styling_built_in_variants_first, agents_skills_shadcn_rules_styling_classname_for_layout_only, agents_skills_shadcn_rules_styling_no_manual_dark_color_overrides [INFERRED 0.75]
- **Eval Grading and Metrics Collection** — agents_skills_skill_creator_agents_grader_grader_agent, agents_skills_skill_creator_references_schemas_grading_json, agents_skills_skill_creator_references_schemas_metrics_json, agents_skills_skill_creator_references_schemas_timing_json [INFERRED 0.85]
- **Blind Comparison and Post-hoc Analysis Workflow** — agents_skills_skill_creator_agents_comparator_blind_comparator_agent, agents_skills_skill_creator_agents_analyzer_post_hoc_analyzer_agent, agents_skills_skill_creator_references_schemas_comparison_json, agents_skills_skill_creator_references_schemas_analysis_json [INFERRED 0.85]
- **FSRS Implementation Across Historical Worktrees** — claude_agents_worktree_scout_old_5, claude_agents_worktree_scout_old_8, claude_agents_worktree_scout_old_9, claude_agents_worktree_scout_fsrs [EXTRACTED 1.00]
- **FR-7 MCP Traceability Chain (Intent to Spec to Plan)** — intent_mcp_read_oriented, spec_fr_7_mcp_read_surface, plan_phase_5_space_scoped_api_keys_mcp_server [EXTRACTED 1.00]
- **FR-5 Spaced Repetition / SM-2 Traceability Chain (Intent to Spec to Plan)** — intent_sm2_decision, spec_fr_5_spaced_repetition, spec_sm2_algorithm, plan_phase_3_sm_2_spaced_repetition_engine [EXTRACTED 1.00]
- **Sidebar Subsystem Worktree Evidence Synthesis** — spec_worktree_old_2, spec_worktree_old_4, spec_worktree_old_5, spec_sidebar_contract [EXTRACTED 1.00]

## Communities (154 total, 41 thin omitted)

### Community 0 - "item.tsx"
Cohesion: 0.07
Nodes (17): System notes and dividers use Marker, ref_base_ui_react_merge_props, ref_base_ui_react_separator, ref_base_ui_react_use_render, Breadcrumb(), BreadcrumbLink(), ButtonGroup(), buttonGroupVariants (+9 more)

### Community 1 - "output"
Cohesion: 0.05
Nodes (36): includeDiffs, includeLogs, includeLogsCount, sortByChanges, sortByChangesMaxCommits, ignore, customPatterns, useDefaultPatterns (+28 more)

### Community 2 - "Technical Specification: Recall — Community Exam Prep Platfo"
Cohesion: 0.06
Nodes (36): 10. Target Directory Structure, 11. Acceptance Summary, 12. Implementation and screen verification status, 1. Summary & Scope, 2.1 Functional, 2.2 Non-Functional, 2.3 Users and flows, 2.4.1 Concrete Empty States (+28 more)

### Community 3 - "toast.tsx"
Cohesion: 0.06
Nodes (15): Avatar always needs AvatarFallback, Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Component Composition, Contents, Empty states use Empty component, Toast notifications follow the project base (+7 more)

### Community 4 - "actions/recall.ts"
Cohesion: 0.16
Nodes (27): addMember(), createSpace(), finishSession(), loadSession(), login(), rateAttempt(), saveObject(), saveSessionAnswer() (+19 more)

### Community 5 - "AI Tooling Mandate"
Cohesion: 0.08
Nodes (30): AI Tooling Mandate, Command Safety Hook, Context7 (Mandatory Docs Lookup), RTK Gatekeeper Hook, Graphify (Mandatory Architecture Query), Primitive Discipline (Cheapest Primitive First), Repomix (Token-Budget Audits Only), RTK (Mandatory Terminal Compression) (+22 more)

### Community 6 - "menubar.tsx"
Cohesion: 0.09
Nodes (13): No sizing classes on icons inside components, ref_base_ui_react_menu, ref_base_ui_react_menubar, DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+5 more)

### Community 7 - "generate_review.py"
Cohesion: 0.11
Nodes (25): build_run(), embed_file(), find_runs(), _find_runs_recursive(), generate_html(), get_mime_type(), _kill_port(), load_previous_iteration() (+17 more)

### Community 8 - "api-keys-card.tsx"
Cohesion: 0.15
Nodes (13): Component Structure → [composition.md](./rules/composition.md), ref_firebase_app, ref_firebase_auth, LoginPage(), recent, StudySession(), Card(), CardContent() (+5 more)

### Community 9 - "react"
Cohesion: 0.16
Nodes (17): ref_base_ui_react_input, react, destinations, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+9 more)

### Community 10 - "biome.json"
Cohesion: 0.07
Nodes (26): source, assist, actions, css, parser, next, react, files (+18 more)

### Community 11 - "sidebar.tsx"
Cohesion: 0.09
Nodes (8): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar()

### Community 12 - "Anthropic AI-Native SDLC"
Cohesion: 0.08
Nodes (24): 10. Maintain / Close the Loop, 1. Capture Intent, 2. Requirements & Design, 3. Plan Mode, 4. Build, 5. Feedback Loop & Verification, 6. Continuous Evals, 7. PR Review (+16 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, firebase (+17 more)

### Community 14 - "workspace-frame.tsx"
Cohesion: 0.12
Nodes (15): ref_next_navigation, logout(), ObjectPage(), QuestionPage(), ReviewPage(), SettingsPage(), StudyPage(), WorkspacePage() (+7 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (23): name, packageManager, private, version, babel-plugin-react-compiler, @biomejs/biome, cmdk, date-fns (+15 more)

### Community 16 - "lucide-react"
Cohesion: 0.20
Nodes (11): Buttons inside inputs use InputGroup + InputGroupAddon, ref_base_ui_react_button, lucide-react, ref_next_link, ref_shadcn_react_message_scroller, ContextPanel(), KindIcon, Badge() (+3 more)

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
Cohesion: 0.13
Nodes (21): Multi-Tenancy Model, Content Moderation v1 (Report-and-Hide), One Exam Per User Constraint, Graph-Ready MVP Object Types, Phase 2: Object CRUD, TipTap Editor & Graph, Spec §9 Areas of Concern & Unresolved Conflicts, Collection: object_links (Graph Edges), Collection: objects (+13 more)

### Community 21 - "Official Anthropic source map"
Cohesion: 0.13
Nodes (19): AI-native SDLC Playbook, Playbook: CI/CD integration and deployment, Playbook: Continuous evals in CI, Playbook: Give Claude a feedback loop, Playbook: Hooks as approval gates, Notes on interpretation, Official Anthropic source map, Playbook: Parallel sessions and subagents (+11 more)

### Community 22 - "shadcn/ui Rules (Project Binding)"
Cohesion: 0.11
Nodes (19): base-nova Style, Base UI (@base-ui/react), Button Spinner (no isPending/isLoading prop), Full Card Composition, Chat Primitives (scaffolded, unused), components.json Configuration, FieldGroup + Field Forms Pattern, src/app/globals.css (design tokens) (+11 more)

### Community 23 - "3. Phased Implementation Roadmap"
Cohesion: 0.15
Nodes (19): Read-Oriented MCP Surface Constraint, SM-2 Spaced Repetition Algorithm Decision, Configurable Study Sessions Constraint, Success Criteria, 3. Phased Implementation Roadmap, Phase 1: Auth & Tenant Isolation, Phase 2: Dynamic Object CRUD, TipTap Editor & Graph, Phase 3: SM-2 Spaced Repetition Engine (+11 more)

### Community 24 - "tools.ts"
Cohesion: 0.12
Nodes (17): MCP JSON-RPC Error & Protocol Contracts, Spec §7.2 MCP Server, MCP Tool: get_object, MCP Tool: get_study_summary, MCP Tool: list_objects, MCP Tool: search_space_content, StudyRecord, edges() (+9 more)

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

### Community 30 - "cn"
Cohesion: 0.11
Nodes (7): ref_base_ui_react_checkbox, ref_base_ui_react_preview_card, ref_base_ui_react_slider, cn, NativeSelect(), NativeSelectProps, Slider()

### Community 31 - "actions/api-keys.ts"
Cohesion: 0.22
Nodes (15): ref_node_crypto, createSpaceApiKey(), listSpaceApiKeys(), owner(), revokeSpaceApiKey(), ApiKeysCard(), ApiKey, apiKeyLabel (+7 more)

### Community 32 - "Styling & Customization Rules"
Cohesion: 0.20
Nodes (17): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Customizing Components, Built-in variants first, className for layout only, Contents (+9 more)

### Community 33 - "Items always inside their Group component"
Cohesion: 0.14
Nodes (11): Items always inside their Group component, Workflow, ref_base_ui_react_select, DropdownMenuGroup(), DropdownMenuSub(), MenubarGroup(), MenubarItem(), MessageScrollerContent() (+3 more)

### Community 34 - "input-group.tsx"
Cohesion: 0.18
Nodes (14): FieldSet + FieldLegend for grouping related fields, InputGroup requires InputGroupInput/InputGroupTextarea, Forms & Inputs → [forms.md](./rules/forms.md), FieldLegend(), FieldSet(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants (+6 more)

### Community 35 - "Post-hoc Analyzer Agent"
Cohesion: 0.13
Nodes (16): Categories for Suggestions, Guidelines, Inputs, Output Format, Post-hoc Analyzer Agent, Priority Levels, Role, Blind Comparator Agent (+8 more)

### Community 36 - "Grader Agent"
Cohesion: 0.15
Nodes (15): Field Descriptions, Grader Agent, Grading Criteria, Guidelines, Inputs, Output Format, Role, Step 8: Read Executor Metrics and Timing (+7 more)

### Community 37 - "context-menu.tsx"
Cohesion: 0.12
Nodes (4): ref_base_ui_react_context_menu, ContextMenu(), ContextMenuGroup(), ContextMenuItem()

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
Cohesion: 0.35
Nodes (10): @playwright/test, createObject(), createSpace(), ensure(), signUp(), startSession(), visit(), waitHydrated() (+2 more)

### Community 42 - "workspace-skeleton.tsx"
Cohesion: 0.17
Nodes (4): cardRows, navRows, WorkspaceSkeleton(), Skeleton()

### Community 43 - "Documentation Conventions Rule"
Cohesion: 0.17
Nodes (14): .agents/rules/<topic>.md Convention, `AGENTS.md`, `.agents/rules/` files, `CLAUDE.md` and `GEMINI.md`, `/docs`, /docs Project Documentation, Documentation Conventions Rule, GEMINI.md (root) (+6 more)

### Community 44 - "Worktree Scout Agent"
Cohesion: 0.19
Nodes (15): Auth Boundary Pattern, FSRS Scheduler, old-2 Worktree, old-3 Worktree, old-4 Worktree, old-5 Worktree, old-6 Worktree, old-7 Worktree (+7 more)

### Community 45 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): embla-carousel-react, CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 46 - "shadcn Skill"
Cohesion: 0.19
Nodes (8): Dialog/Sheet/Drawer Title Requirement, shadcn Skill, CLI Rules (presets), npx shadcn@latest CLI, Component Selection Guide, Component Structure Rules, Styling & Tailwind Rules, Updating Components Workflow

### Community 47 - "Forms use FieldGroup + Field"
Cohesion: 0.20
Nodes (12): Contents, Field validation and disabled states, Forms & Inputs, Forms use FieldGroup + Field, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_switch, Checkbox() (+4 more)

### Community 48 - "Skill Creator"
Cohesion: 0.14
Nodes (13): Apache License 2.0, scripts.aggregate_benchmark, Claude.ai-specific instructions, Communicating with the user, Cowork-Specific Instructions, How to think about improvements, Improving the skill, scripts.package_skill (+5 more)

### Community 49 - "drawer.tsx"
Cohesion: 0.15
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

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

### Community 56 - "empty.tsx"
Cohesion: 0.17
Nodes (8): CLI, Critical Rules, Icons → [icons.md](./rules/icons.md), Styling & Tailwind → [styling.md](./rules/styling.md), Use Components, Not Custom Markup → [composition.md](./rules/composition.md), Empty(), EmptyMedia(), emptyMediaVariants

### Community 57 - "workspace-tabs.tsx"
Cohesion: 0.32
Nodes (10): ref_node_assert_strict, ref_node_test, persist(), WorkspaceTabs(), close(), maxTabs, nextActiveTab(), parseTabs() (+2 more)

### Community 58 - "Composition: asChild (radix) vs render (base)"
Cohesion: 0.17
Nodes (10): Composition: asChild (radix) vs render (base), ref_base_ui_react_collapsible, AlertDialogTrigger(), Collapsible(), CollapsibleTrigger(), DialogClose(), DialogTrigger(), DropdownMenuTrigger() (+2 more)

### Community 59 - "Chat & Messaging"
Cohesion: 0.21
Nodes (12): Attachment (file/image attachments), Bubble (message surface), Chat & Messaging, Contents, Escape hatch: the scroller hooks, Marker (system notes and dividers), Message (row layout), MessageScroller (scrollable threads) (+4 more)

### Community 60 - "Process"
Cohesion: 0.17
Nodes (11): Analyzing Benchmark Results, Guidelines, Inputs, Process, Role, Step 1: Read Benchmark Data, Step 2: Analyze Per-Assertion Patterns, Step 3: Analyze Cross-Eval Patterns (+3 more)

### Community 61 - "session.ts"
Cohesion: 0.18
Nodes (10): Request Flow (Session & MCP), Server-Only Boundary Convention, ref_firebase_admin_app, ref_firebase_admin_auth, ref_firebase_admin_firestore, ref_next_headers, server-only, zod (+2 more)

### Community 62 - "domain/recall.ts"
Cohesion: 0.26
Nodes (9): Domain Logic Convention, Validation Convention (zod, idSchema), depthOf(), formats, kinds, qualityScale, richDoc, Snapshot (+1 more)

### Community 63 - "DESING.md"
Cohesion: 0.17
Nodes (11): Border Radius Scale, Decorative Depth, Do, Do's and Don'ts, Don't, Elevation & Depth, Iteration Guide, Known Gaps (+3 more)

### Community 64 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, babel-plugin-react-compiler, @biomejs/biome, firebase-tools, @playwright/test, tailwindcss, @tailwindcss/postcss, tsx (+4 more)

### Community 66 - "route.ts"
Cohesion: 0.32
Nodes (10): dispatch(), envelope(), Id, POST(), reply(), resolveKey(), hashApiKey(), callTool() (+2 more)

### Community 67 - "shadcn CLI Reference"
Cohesion: 0.25
Nodes (11): shadcn/ui Agent Interface Config, apply command, Contents, diff command (deprecated), docs command, init command, Presets, shadcn CLI Reference (+3 more)

### Community 68 - "Chat & Messaging → [chat.md](./rules/chat.md)"
Cohesion: 0.24
Nodes (9): Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in, Chat & Messaging → [chat.md](./rules/chat.md), ref_base_ui_react_scroll_area, MessageScroller(), MessageScrollerButton(), MessageScrollerItem(), MessageScrollerProvider() (+1 more)

### Community 69 - "Component Selection"
Cohesion: 0.40
Nodes (11): Choosing between overlay components, No manual z-index on overlay components, Component Selection, AlertDialog(), Dialog(), Drawer(), DropdownMenu(), HoverCard() (+3 more)

### Community 70 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Dialog, Sheet, and Drawer always need a Title, ref_base_ui_react_dialog, DrawerTitle(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle()

### Community 71 - "field.tsx"
Cohesion: 0.22
Nodes (4): Option sets (2–7 choices) use ToggleGroup, Field(), fieldVariants, Label()

### Community 72 - "Creating a skill"
Cohesion: 0.18
Nodes (11): Anatomy of a Skill, Capture Intent, Creating a skill, Interview and Research, Principle of Lack of Surprise, Progressive Disclosure, Skill Writing Guide, Test Cases (+3 more)

### Community 73 - "tests/e2e/ Playwright Suite"
Cohesion: 0.22
Nodes (11): Implementation status, Command Palette (Fifth Pass), E2E Verification Run 2026-09-21, Phase 6 Verification Suite (Third Pass), Transient-Surface Contract, Tabs & Context Panel (Sixth Pass), Spec §5.5 Dialog/Popover/Menu/Tab/Context-Panel Contract, FR-12 Workspace Interaction Surfaces, Spec §12 Implementation & Screen Verification Status (+3 more)

### Community 74 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (5): ref_base_ui_react_navigation_menu, NavigationMenu(), NavigationMenuLink(), NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 75 - "Intent: <short name>"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: <short name>, Open questions, Out of scope, Problem, Proposed outcome (+1 more)

### Community 76 - "Intent: Note Tagging"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: Note Tagging, Non-goals, Open questions, Problem / unmet need, Proposed outcome (+1 more)

### Community 77 - "Base vs Radix"
Cohesion: 0.20
Nodes (10): Accordion, Base vs Radix, Button/trigger as non-button element (base only, nativeButton), Button / trigger as non-button element (base only), Contents, Select, Select — multiple selection and object values (base only), Slider (+2 more)

### Community 78 - "improve_description.py"
Cohesion: 0.24
Nodes (9): _call_claude(), improve_description(), main(), Path, Improve a skill description based on eval results. Takes eval results (from…, Run `claude -p` with the prompt on stdin and return the text response. Prompt…, Call Claude to improve the description based on eval results., argparse (+1 more)

### Community 79 - "Plan §8 Recorded Drift From Plan"
Cohesion: 0.20
Nodes (10): firestore.rules (Default-Deny), src/proxy.ts Middleware, Consolidated Domain/Action Files Decision, Plan §8 Recorded Drift From Plan, FirebaseUI Alternative Rejected, Blanket-Deny Firestore Rules Decision, middleware.ts to proxy.ts Rename (Next.js 16), Literal SM-2 EF' Implementation (+2 more)

### Community 80 - "layout.tsx"
Cohesion: 0.20
Nodes (7): nextConfig, next, ref_next_font_google, src_app_globals, geistMono, geistSans, metadata

### Community 81 - "rich-text.tsx"
Cohesion: 0.20
Nodes (9): @tiptap/react, @tiptap/starter-kit, controls, emptyDoc, extensions, RichText(), RichTextEditor(), RichValue (+1 more)

### Community 82 - "Commands"
Cohesion: 0.22
Nodes (9): `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, `diff` — Check for updates, `docs` — Get component documentation URLs, `info` — Project information, `init` — Initialize or create a project, `search` — Search registries (+1 more)

### Community 83 - "Customization & Theming"
Cohesion: 0.22
Nodes (8): Adding Custom Colors, Border Radius, Color Variables, Contents, How It Works (CSS variables to utilities), Customization & Theming, Dark Mode, How It Works

### Community 84 - "shadcn/ui"
Cohesion: 0.22
Nodes (9): Component Docs, Examples, and Usage, Current Project Context, Detailed References, Key Fields, Key Patterns, Principles, Quick Reference, shadcn/ui (+1 more)

### Community 85 - "Process"
Cohesion: 0.22
Nodes (9): Process, Step 1: Read Comparison Result, Step 2: Read Both Skills, Step 3: Read Both Transcripts, Step 4: Analyze Instruction Following, Step 5: Identify Winner Strengths, Step 6: Identify Loser Weaknesses, Step 7: Generate Improvement Suggestions (+1 more)

### Community 86 - "Description Optimization"
Cohesion: 0.22
Nodes (9): Eval Set Review HTML Template, Eval Viewer (viewer.html), Description Optimization, How skill triggering works, Package and Present (only if `present_files` tool is available), Step 1: Generate trigger eval queries, Step 2: Review with user, Step 3: Run the optimization loop (+1 more)

### Community 87 - "Intent: Recall — Community Exam Prep Platform"
Cohesion: 0.22
Nodes (9): Affected users and systems, Constraints, Intent: Recall — Community Exam Prep Platform, Open questions, Proposed outcome, Related, Resolved Decisions, MCP Auth & API Key Architecture (+1 more)

### Community 88 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, emulators, format, lint, start, test (+1 more)

### Community 89 - "Implementation Plan: Recall — Collaborative Private Workspac"
Cohesion: 0.22
Nodes (9): 1.1 Architectural Layers, 1.2 System Boundary Rules, 1. Architecture & Dependency Boundaries, 2. File Inventory Across Phases, 4. Automated Testing Matrix, 5. Risks, Breakage Points & Mitigations, 6. Traceability Matrix, 7. Approval & Sign-Off Gate (+1 more)

### Community 90 - "class-variance-authority"
Cohesion: 0.36
Nodes (7): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, class-variance-authority, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 93 - "AI-Native SDLC Skill (Overview)"
Cohesion: 0.25
Nodes (8): Intent Template, Plan Template, Spec Template, AI-Native SDLC Skill (Overview), Playbook: Plan Mode, Playbook: Requirements and design, Plan Mode (Stage 3), Requirements & Design (Stage 2)

### Community 94 - "Tools"
Cohesion: 0.25
Nodes (8): `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, `shadcn:search_items_in_registries`, `shadcn:view_items_in_registries`, Tools

### Community 95 - "message.tsx"
Cohesion: 0.29
Nodes (3): Message rows use Message, Message(), MessageGroup()

### Community 96 - "bubble.tsx"
Cohesion: 0.39
Nodes (7): Message surfaces use Bubble, Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 97 - "tabs.tsx"
Cohesion: 0.36
Nodes (7): TabsTrigger must be inside TabsList, ref_base_ui_react_tabs, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

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

### Community 106 - "add command"
Cohesion: 0.47
Nodes (6): add command, `add` — Add components, Dry-Run Mode, Smart Merge from Upstream, Checking for Updates, shadcn:get_add_command_for_items tool

### Community 109 - "RTK - Rust Token Killer (Google Antigravity)"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 110 - "Capture Intent (Stage 1)"
Cohesion: 0.40
Nodes (5): Note Tagging Intent (Eval Fixture), Playbook: Capture as intent.md, Playbook: Closing the loop on metrics, Capture Intent (Stage 1), Maintain / Close the Loop (Stage 10)

### Community 111 - "Colors"
Cohesion: 0.40
Nodes (5): Brand & Accent, Colors, Semantic, Surface, Text

### Community 112 - "Responsive Behavior"
Cohesion: 0.40
Nodes (5): Breakpoints, Collapsing Strategy, Image Behavior, Responsive Behavior, Touch Targets

### Community 113 - "Typography"
Cohesion: 0.40
Nodes (5): Font Family, Hierarchy, Note on Font Substitutes, Principles, Typography

### Community 114 - "tooltip.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_tooltip, TooltipContent(), TooltipTrigger()

### Community 116 - "proxy.ts"
Cohesion: 0.40
Nodes (3): ref_next_server, config, protectedPrefixes

### Community 118 - "useIsMobile()"
Cohesion: 0.40
Nodes (4): 5.4 Sidebar contract and Fluid Functionalism reference, Sidebar migration and rollout boundary, SidebarProvider(), useIsMobile()

### Community 119 - "changeObject()"
Cohesion: 0.60
Nodes (5): changeObject(), ObjectDetail(), act(), ObjectList(), act()

### Community 120 - "RTK (Rust Token Killer)"
Cohesion: 0.50
Nodes (4): rtk discover, rtk gain, rtk proxy, RTK (Rust Token Killer)

### Community 121 - "Icons"
Cohesion: 0.50
Nodes (3): Icons, Icons in Button use data-icon attribute, Pass icons as component objects, not string keys

### Community 122 - "Layout"
Cohesion: 0.50
Nodes (4): Grid & Container, Layout, Spacing System, Whitespace Philosophy

## Ambiguous Edges - Review These
- `shadcn CLI Reference` → `shadcn/ui Agent Interface Config`  [AMBIGUOUS]
  .agents/skills/shadcn/agents/openai.yml · relation: references
- `Claude.com Design Analysis System` → `Spec §5 Design System & UX Standards`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **578 isolated node(s):** `CLI`, `Component Docs, Examples, and Usage`, `Current Project Context`, `Detailed References`, `Key Fields` (+573 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 930 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `shadcn CLI Reference` and `shadcn/ui Agent Interface Config`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Claude.com Design Analysis System` and `Spec §5 Design System & UX Standards`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Button()` connect `lucide-react` to `Technical Specification: Recall — Community Exam Prep Platfo`, `toast.tsx`, `menubar.tsx`, `api-keys-card.tsx`, `react`, `sidebar.tsx`, `workspace-frame.tsx`, `questionnaire.tsx`, `combobox.tsx`, `input-group.tsx`, `carousel.tsx`, `attachment.tsx`, `empty.tsx`, `domain/recall.ts`, `alert-dialog.tsx`, `Component Selection`, `sheet.tsx`, `field.tsx`, `Base vs Radix`, `rich-text.tsx`, `pagination.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `Component Selection` connect `Component Selection` to `item.tsx`, `toast.tsx`, `menubar.tsx`, `api-keys-card.tsx`, `react`, `sidebar.tsx`, `lucide-react`, `cn`, `input-group.tsx`, `context-menu.tsx`, `workspace-skeleton.tsx`, `Forms use FieldGroup + Field`, `attachment.tsx`, `empty.tsx`, `Composition: asChild (radix) vs render (base)`, `Chat & Messaging → [chat.md](./rules/chat.md)`, `navigation-menu.tsx`, `shadcn/ui`, `class-variance-authority`, `pagination.tsx`, `table.tsx`, `message.tsx`, `bubble.tsx`, `tabs.tsx`, `progress.tsx`, `accordion.tsx`, `alert.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `shadcn Skill` connect `shadcn Skill` to `Styling & Customization Rules`, `Agents CLI`, `Customization & Theming`, `shadcn/ui`, `shadcn/ui Rules (Project Binding)`, `Icons`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `Component Selection` (e.g. with `Accordion()` and `Alert()`) actually correct?**
  _`Component Selection` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `Button()` (e.g. with `Button / trigger as non-button element (base only)` and `Buttons inside inputs use InputGroup + InputGroupAddon`) actually correct?**
  _`Button()` has 9 INFERRED edges - model-reasoned connections that need verification._