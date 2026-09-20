# Graph Report - notes-app  (2026-09-19)

## Corpus Check
- 138 files · ~84,410 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .rules 1, .ico 1)

## Summary
- 1334 nodes · 2017 edges · 106 communities (81 shown, 25 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 224 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58c5b936`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.tsx
- toast.tsx
- item.tsx
- menubar.tsx
- output
- Technical Specification: Recall — Community Exam Prep Platform
- app/page.tsx
- Next.js App Layout
- Skill Creator
- sidebar.tsx
- class-variance-authority
- Process
- biome.json
- README.md
- graphify (rules)
- Anthropic AI-Native SDLC
- combobox.tsx
- Serena Project Config
- generate_review.py
- actions/recall.ts
- run_loop.py
- package.json
- components.json
- dependencies
- card.tsx
- Button
- compilerOptions
- Specification: <short name>
- package_skill.py
- run_eval.py
- questionnaire.tsx
- Grader Agent
- aggregate_benchmark.py
- command.tsx
- sheet.tsx
- Process
- context-menu.tsx
- carousel.tsx
- study-panel.tsx
- react
- drawer.tsx
- cn
- chart.tsx
- Plan: <short name>
- attachment.tsx
- message-scroller.tsx
- Styling & Customization
- Commands
- Tools
- DESING.md
- alert-dialog.tsx
- docs.md
- Items always inside their Group component
- Component Selection
- select.tsx
- devDependencies
- Intent: <short name>
- Intent: Note Tagging
- Component Structure → [composition.md](./rules/composition.md)
- JSON Schemas
- improve_description.py
- Intent: Recall — Community Exam Prep Platform
- Customization & Theming
- Registry Authoring and Addresses
- Base vs Radix
- Implementation Plan: Recall — Collaborative Private Workspace & Exam Prep Platform
- login/page.tsx
- pagination.tsx
- table.tsx
- bubble.tsx
- Component Composition
- Components
- scripts
- 3. Phased Implementation Roadmap
- avatar.tsx
- popover.tsx
- progress.tsx
- lucide-react
- ReviewHandler
- accordion.tsx
- RTK - Rust Token Killer (Google Antigravity)
- shadcn CLI Reference
- Customizing Components
- Colors
- Responsive Behavior
- Typography
- collapsible.tsx
- radio-group.tsx
- tooltip.tsx
- admin.ts
- input-otp.tsx
- resizable.tsx
- useIsMobile
- Official Anthropic source map
- Layout
- hover-card.tsx
- scroll-area.tsx
- slider.tsx
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- ref_next_image

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `Component Selection` - 46 edges
3. `react` - 44 edges
4. `Button()` - 32 edges
5. `lucide-react` - 29 edges
6. `Items always inside their Group component` - 25 edges
7. `Component Structure → [composition.md](./rules/composition.md)` - 21 edges
8. `output` - 18 edges
9. `class-variance-authority` - 17 edges
10. `compilerOptions` - 16 edges

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
- **Next.js Agent Rules Generation Flow** — agents, claude, node_modules_next_dist_server_lib_generate_agent_files [EXTRACTED 0.85]
- **Default Next.js Template Assets** — src_app_page, public_next, public_vercel, public_globe, public_file, public_window [INFERRED 0.50]

## Communities (106 total, 25 thin omitted)

### Community 1 - "toast.tsx"
Cohesion: 0.05
Nodes (22): Toast notifications follow the project base, CLI, Component Docs, Examples, and Usage, Critical Rules, Current Project Context, Detailed References, Icons → [icons.md](./rules/icons.md), Key Fields (+14 more)

### Community 2 - "item.tsx"
Cohesion: 0.07
Nodes (17): System notes and dividers use Marker, ref_base_ui_react_merge_props, ref_base_ui_react_separator, ref_base_ui_react_use_render, Breadcrumb(), BreadcrumbLink(), ButtonGroup(), buttonGroupVariants (+9 more)

### Community 3 - "menubar.tsx"
Cohesion: 0.07
Nodes (19): Icons, Icons in Button use data-icon attribute, No sizing classes on icons inside components, Pass icons as component objects, not string keys, ref_base_ui_react_menu, ref_base_ui_react_menubar, DropdownMenuContent(), DropdownMenuItem() (+11 more)

### Community 4 - "output"
Cohesion: 0.05
Nodes (36): includeDiffs, includeLogs, includeLogsCount, sortByChanges, sortByChangesMaxCommits, ignore, customPatterns, useDefaultPatterns (+28 more)

### Community 5 - "Technical Specification: Recall — Community Exam Prep Platform"
Cohesion: 0.05
Nodes (37): 10. Target Directory Structure, 11. Acceptance Summary, 12. Implementation and screen verification status, 1. Summary & Scope, 2.1 Functional, 2.2 Non-Functional, 2.3 Users and flows, 2.4.1 Concrete Empty States (+29 more)

### Community 7 - "Next.js App Layout"
Cohesion: 0.20
Nodes (7): nextConfig, next, ref_next_font_google, src_app_globals, geistMono, geistSans, metadata

### Community 8 - "Skill Creator"
Cohesion: 0.06
Nodes (34): Advanced: Blind comparison, Anatomy of a Skill, Capture Intent, Claude.ai-specific instructions, Communicating with the user, Cowork-Specific Instructions, Creating a skill, Description Optimization (+26 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.08
Nodes (9): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+1 more)

### Community 10 - "class-variance-authority"
Cohesion: 0.10
Nodes (18): TabsTrigger must be inside TabsList, ref_base_ui_react_navigation_menu, ref_base_ui_react_tabs, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, class-variance-authority, NavigationMenu(), NavigationMenuLink() (+10 more)

### Community 11 - "Process"
Cohesion: 0.07
Nodes (27): Analyzing Benchmark Results, Categories for Suggestions, Guidelines, Guidelines, Inputs, Inputs, Output Format, Post-hoc Analyzer Agent (+19 more)

### Community 12 - "biome.json"
Cohesion: 0.07
Nodes (26): source, assist, actions, css, parser, next, react, files (+18 more)

### Community 13 - "README.md"
Cohesion: 0.21
Nodes (6): AI-Native SDLC Skill, Contents, Suggested project installation, Next.js Framework, Vercel Platform, generate-agent-files.js

### Community 15 - "Anthropic AI-Native SDLC"
Cohesion: 0.08
Nodes (24): 10. Maintain / Close the Loop, 1. Capture Intent, 2. Requirements & Design, 3. Plan Mode, 4. Build, 5. Feedback Loop & Verification, 6. Continuous Evals, 7. PR Review (+16 more)

### Community 16 - "combobox.tsx"
Cohesion: 0.10
Nodes (6): @base-ui/react, InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput()

### Community 19 - "generate_review.py"
Cohesion: 0.14
Nodes (22): build_run(), embed_file(), find_runs(), _find_runs_recursive(), generate_html(), get_mime_type(), _kill_port(), load_previous_iteration() (+14 more)

### Community 20 - "actions/recall.ts"
Cohesion: 0.16
Nodes (17): ref_next_headers, ref_node_assert_strict, ref_node_test, zod, idSchema, saveObject(), ObjectEditor(), formats (+9 more)

### Community 21 - "run_loop.py"
Cohesion: 0.12
Nodes (18): generate_html(), main(), Generate HTML report from loop output data. If auto_refresh is True, adds a…, Generate an HTML report from run_loop.py output. Takes the JSON output from…, main(), Path, Run the eval + improve loop until all pass or max iterations reached. Combines…, Split eval set into train and test sets, stratified by should_trigger. (+10 more)

### Community 22 - "package.json"
Cohesion: 0.09
Nodes (22): name, packageManager, private, version, babel-plugin-react-compiler, @biomejs/biome, date-fns, firebase (+14 more)

### Community 23 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, firebase (+14 more)

### Community 25 - "card.tsx"
Cohesion: 0.24
Nodes (9): ref_next_link, Badge(), badgeVariants, Card(), CardContent(), CardHeader(), CardTitle(), objectIcon (+1 more)

### Community 26 - "Button"
Cohesion: 0.18
Nodes (20): Buttons inside inputs use InputGroup + InputGroupAddon, Contents, Field validation and disabled states, Forms & Inputs, Forms use FieldGroup + Field, InputGroup requires InputGroupInput/InputGroupTextarea, Option sets (2–7 choices) use ToggleGroup, Forms & Inputs → [forms.md](./rules/forms.md) (+12 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 28 - "Specification: <short name>"
Cohesion: 0.11
Nodes (17): Acceptance summary, Data and integrations, FR-1: <name>, Functional requirements, In scope, Migration / rollout considerations, Non-functional requirements, Objective (+9 more)

### Community 29 - "package_skill.py"
Cohesion: 0.14
Nodes (16): main(), package_skill(), Path, Skill Packager - Creates a distributable .skill file of a skill folder Usage:…, Check if a path should be excluded from packaging., Package a skill folder into a .skill file. Args: skill_path: Path to the skill…, should_exclude(), Basic validation of a skill (+8 more)

### Community 30 - "run_eval.py"
Cohesion: 0.15
Nodes (16): find_project_root(), main(), Path, Run the full eval set and return results., Run trigger evaluation for a skill description. Tests whether a skill's…, Find the project root by walking up from cwd looking for .claude/. Mimics how…, Run a single query and return whether the skill was triggered. Creates a…, run_eval() (+8 more)

### Community 31 - "questionnaire.tsx"
Cohesion: 0.14
Nodes (6): ref_shadcn_react_questionnaire, buttonVariants, QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit()

### Community 32 - "Grader Agent"
Cohesion: 0.12
Nodes (16): Field Descriptions, Grader Agent, Grading Criteria, Guidelines, Inputs, Output Format, Process, Role (+8 more)

### Community 33 - "aggregate_benchmark.py"
Cohesion: 0.17
Nodes (15): aggregate_results(), calculate_stats(), generate_benchmark(), generate_markdown(), load_run_results(), main(), Path, Aggregate run results into summary statistics. Returns run_summary with stats… (+7 more)

### Community 34 - "command.tsx"
Cohesion: 0.15
Nodes (5): cmdk, Command(), DialogContent(), DialogDescription(), DialogHeader()

### Community 35 - "sheet.tsx"
Cohesion: 0.14
Nodes (11): Composition: asChild (radix) vs render (base), ref_base_ui_react_dialog, AlertDialogTrigger(), DialogClose(), DialogTrigger(), DropdownMenuTrigger(), SheetClose(), SheetContent() (+3 more)

### Community 36 - "Process"
Cohesion: 0.13
Nodes (14): Blind Comparator Agent, Field Descriptions, Guidelines, Inputs, Output Format, Process, Role, Step 1: Read Both Outputs (+6 more)

### Community 38 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): embla-carousel-react, CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 39 - "study-panel.tsx"
Cohesion: 0.33
Nodes (14): addMember(), authorized(), changeObject(), createSpace(), finishSession(), loadSession(), saveSessionAnswer(), snapshot() (+6 more)

### Community 40 - "react"
Cohesion: 0.18
Nodes (6): FieldSet + FieldLegend for grouping related fields, react, FieldLabel(), FieldLegend(), FieldSet(), Label()

### Community 41 - "drawer.tsx"
Cohesion: 0.15
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 42 - "cn"
Cohesion: 0.14
Nodes (4): ref_base_ui_react_switch, cn, NativeSelect(), NativeSelectProps

### Community 43 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 44 - "Plan: <short name>"
Cohesion: 0.15
Nodes (12): Alternatives considered, Approval gate, Architecture and dependencies, Data / migration work, Files / modules that change, Implementation order, Likely breakage points, Plan: <short name> (+4 more)

### Community 45 - "attachment.tsx"
Cohesion: 0.19
Nodes (6): Attachments use Attachment, Attachment(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 46 - "message-scroller.tsx"
Cohesion: 0.24
Nodes (12): Chat & Messaging, Contents, Escape hatch: the scroller hooks, Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in, Chat & Messaging → [chat.md](./rules/chat.md), ref_shadcn_react_message_scroller, MessageScroller() (+4 more)

### Community 47 - "Styling & Customization"
Cohesion: 0.15
Nodes (13): Built-in variants first, className for layout only, Contents, No manual dark: color overrides, No raw color values for status/state indicators, No space-x-* / space-y-*, Prefer size-* over w-* h-* when equal, Prefer truncate shorthand (+5 more)

### Community 48 - "Commands"
Cohesion: 0.17
Nodes (12): `add` — Add components, `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, `diff` — Check for updates, `docs` — Get component documentation URLs, Dry-Run Mode, `info` — Project information (+4 more)

### Community 49 - "Tools"
Cohesion: 0.17
Nodes (11): Configuring Registries, Setup, `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, shadcn MCP Server (+3 more)

### Community 50 - "DESING.md"
Cohesion: 0.17
Nodes (11): Border Radius Scale, Decorative Depth, Do, Do's and Don'ts, Don't, Elevation & Depth, Iteration Guide, Known Gaps (+3 more)

### Community 52 - "docs.md"
Cohesion: 0.18
Nodes (10): `AGENTS.md`, `.agents/rules/` files, `CLAUDE.md` and `GEMINI.md`, `/docs`, `intent.md`, Intent workflow, Naming conventions, `README.md` (+2 more)

### Community 53 - "Items always inside their Group component"
Cohesion: 0.22
Nodes (6): Message rows use Message, Items always inside their Group component, ContextMenuGroup(), ContextMenuItem(), Message(), MessageGroup()

### Community 54 - "Component Selection"
Cohesion: 0.40
Nodes (11): Choosing between overlay components, No manual z-index on overlay components, Component Selection, AlertDialog(), Dialog(), Drawer(), DropdownMenu(), HoverCard() (+3 more)

### Community 55 - "select.tsx"
Cohesion: 0.20
Nodes (5): Workflow, ref_base_ui_react_select, SelectGroup(), SelectItem(), SelectLabel()

### Community 56 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, babel-plugin-react-compiler, @biomejs/biome, firebase-tools, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+3 more)

### Community 57 - "Intent: <short name>"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: <short name>, Open questions, Out of scope, Problem, Proposed outcome (+1 more)

### Community 58 - "Intent: Note Tagging"
Cohesion: 0.20
Nodes (9): Affected systems, Affected users, Constraints, Intent: Note Tagging, Non-goals, Open questions, Problem / unmet need, Proposed outcome (+1 more)

### Community 59 - "Component Structure → [composition.md](./rules/composition.md)"
Cohesion: 0.24
Nodes (10): Dialog, Sheet, and Drawer always need a Title, Component Structure → [composition.md](./rules/composition.md), CardDescription(), CardFooter(), CommandGroup(), CommandItem(), DialogTitle(), DrawerTitle() (+2 more)

### Community 60 - "JSON Schemas"
Cohesion: 0.20
Nodes (9): analysis.json, benchmark.json, comparison.json, evals.json, grading.json, history.json, JSON Schemas, metrics.json (+1 more)

### Community 61 - "improve_description.py"
Cohesion: 0.24
Nodes (9): _call_claude(), improve_description(), main(), Path, Improve a skill description based on eval results. Takes eval results (from…, Run `claude -p` with the prompt on stdin and return the text response. Prompt…, Call Claude to improve the description based on eval results., argparse (+1 more)

### Community 62 - "Intent: Recall — Community Exam Prep Platform"
Cohesion: 0.20
Nodes (10): Affected users and systems, Constraints, Implementation status, Intent: Recall — Community Exam Prep Platform, Open questions, Problem, Proposed outcome, Related (+2 more)

### Community 64 - "Customization & Theming"
Cohesion: 0.22
Nodes (9): Adding Custom Colors, Border Radius, Changing the Theme, Checking for Updates, Color Variables, Contents, Customization & Theming, Dark Mode (+1 more)

### Community 65 - "Registry Authoring and Addresses"
Cohesion: 0.22
Nodes (9): Address Schemes, Build and Verify, GitHub Registries, Include, Item Definitions, Mental Model, Registry Authoring and Addresses, Registry Dependencies (+1 more)

### Community 66 - "Base vs Radix"
Cohesion: 0.22
Nodes (9): Accordion, Base vs Radix, Button / trigger as non-button element (base only), Contents, Select, Select — multiple selection and object values (base only), Slider, ToggleGroup (+1 more)

### Community 67 - "Implementation Plan: Recall — Collaborative Private Workspace & Exam Prep Platform"
Cohesion: 0.22
Nodes (9): 1.1 Architectural Layers, 1.2 System Boundary Rules, 1. Architecture & Dependency Boundaries, 2. File Inventory Across Phases, 4. Automated Testing Matrix, 5. Risks, Breakage Points & Mitigations, 6. Traceability Matrix, 7. Approval & Sign-Off Gate (+1 more)

### Community 68 - "login/page.tsx"
Cohesion: 0.33
Nodes (6): ref_base_ui_react_input, ref_firebase_app, ref_firebase_auth, login(), LoginPage(), browserAuth()

### Community 71 - "bubble.tsx"
Cohesion: 0.39
Nodes (7): Message surfaces use Bubble, Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 72 - "Component Composition"
Cohesion: 0.25
Nodes (8): Avatar always needs AvatarFallback, Callouts use Alert, Card structure, Component Composition, Contents, Empty states use Empty component, Use existing components instead of custom markup, AvatarFallback()

### Community 73 - "Components"
Cohesion: 0.25
Nodes (8): Buttons, Cards & Containers, Components, CTA / Footer, Inputs & Forms, Tab / Filter, Tags / Badges, Top Navigation

### Community 74 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, emulators, format, lint, start, test

### Community 75 - "3. Phased Implementation Roadmap"
Cohesion: 0.29
Nodes (7): 3. Phased Implementation Roadmap, Phase 1: Auth & Tenant Isolation, Phase 2: Dynamic Object CRUD, TipTap Editor & Graph, Phase 3: SM-2 Spaced Repetition Engine, Phase 4: Simulated Exam Engine & Timers, Phase 5: Space-Scoped API Keys & MCP Server, Phase 6: E2E Hardening & Verification

### Community 79 - "lucide-react"
Cohesion: 0.33
Nodes (4): Button has no isPending or isLoading prop, ref_base_ui_react_checkbox, lucide-react, Spinner()

### Community 80 - "ReviewHandler"
Cohesion: 0.33
Nodes (3): Serves the review HTML and handles feedback saves. Regenerates the HTML on each…, ReviewHandler, BaseHTTPRequestHandler

### Community 82 - "RTK - Rust Token Killer (Google Antigravity)"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 83 - "shadcn CLI Reference"
Cohesion: 0.40
Nodes (5): Contents, Presets, shadcn CLI Reference, Switching Presets, Templates

### Community 84 - "Customizing Components"
Cohesion: 0.40
Nodes (5): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Customizing Components

### Community 85 - "Colors"
Cohesion: 0.40
Nodes (5): Brand & Accent, Colors, Semantic, Surface, Text

### Community 86 - "Responsive Behavior"
Cohesion: 0.40
Nodes (5): Breakpoints, Collapsing Strategy, Image Behavior, Responsive Behavior, Touch Targets

### Community 87 - "Typography"
Cohesion: 0.40
Nodes (5): Font Family, Hierarchy, Note on Font Substitutes, Principles, Typography

### Community 88 - "collapsible.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_collapsible, Collapsible(), CollapsibleTrigger()

### Community 89 - "radio-group.tsx"
Cohesion: 0.40
Nodes (4): ref_base_ui_react_radio, ref_base_ui_react_radio_group, RadioGroup(), RadioGroupItem()

### Community 90 - "tooltip.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_tooltip, TooltipContent(), TooltipTrigger()

### Community 91 - "admin.ts"
Cohesion: 0.40
Nodes (4): ref_firebase_admin_app, ref_firebase_admin_auth, ref_firebase_admin_firestore, server-only

### Community 94 - "useIsMobile"
Cohesion: 0.40
Nodes (4): 5.4 Sidebar contract and Fluid Functionalism reference, Sidebar migration and rollout boundary, SidebarProvider(), useIsMobile()

### Community 95 - "Official Anthropic source map"
Cohesion: 0.50
Nodes (3): AI-native SDLC Playbook, Notes on interpretation, Official Anthropic source map

### Community 96 - "Layout"
Cohesion: 0.50
Nodes (4): Grid & Container, Layout, Spacing System, Whitespace Philosophy

## Knowledge Gaps
- **489 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+484 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 831 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn` connect `cn` to `button.tsx`, `toast.tsx`, `item.tsx`, `menubar.tsx`, `sidebar.tsx`, `class-variance-authority`, `combobox.tsx`, `package.json`, `card.tsx`, `questionnaire.tsx`, `command.tsx`, `sheet.tsx`, `context-menu.tsx`, `carousel.tsx`, `react`, `drawer.tsx`, `chart.tsx`, `attachment.tsx`, `message-scroller.tsx`, `alert-dialog.tsx`, `Items always inside their Group component`, `select.tsx`, `login/page.tsx`, `pagination.tsx`, `table.tsx`, `bubble.tsx`, `avatar.tsx`, `popover.tsx`, `progress.tsx`, `lucide-react`, `accordion.tsx`, `radio-group.tsx`, `tooltip.tsx`, `input-otp.tsx`, `resizable.tsx`, `hover-card.tsx`, `scroll-area.tsx`, `slider.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `button.tsx`, `toast.tsx`, `item.tsx`, `menubar.tsx`, `sidebar.tsx`, `class-variance-authority`, `combobox.tsx`, `actions/recall.ts`, `package.json`, `card.tsx`, `questionnaire.tsx`, `command.tsx`, `sheet.tsx`, `context-menu.tsx`, `carousel.tsx`, `study-panel.tsx`, `drawer.tsx`, `cn`, `chart.tsx`, `attachment.tsx`, `message-scroller.tsx`, `alert-dialog.tsx`, `Items always inside their Group component`, `select.tsx`, `login/page.tsx`, `pagination.tsx`, `table.tsx`, `bubble.tsx`, `avatar.tsx`, `popover.tsx`, `input-otp.tsx`, `useIsMobile`, `scroll-area.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `button.tsx`, `toast.tsx`, `menubar.tsx`, `Technical Specification: Recall — Community Exam Prep Platform`, `app/page.tsx`, `sidebar.tsx`, `combobox.tsx`, `actions/recall.ts`, `card.tsx`, `questionnaire.tsx`, `command.tsx`, `sheet.tsx`, `carousel.tsx`, `study-panel.tsx`, `attachment.tsx`, `message-scroller.tsx`, `alert-dialog.tsx`, `Component Selection`, `Base vs Radix`, `login/page.tsx`, `pagination.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `Component Selection` (e.g. with `Accordion()` and `Alert()`) actually correct?**
  _`Component Selection` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `Button()` (e.g. with `Button / trigger as non-button element (base only)` and `Buttons inside inputs use InputGroup + InputGroupAddon`) actually correct?**
  _`Button()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _489 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `toast.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._