# Graph Report - notes-app  (2026-09-17)

## Corpus Check
- 98 files · ~35,303 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .ico 1, .css 1)

## Summary
- 776 nodes · 985 edges · 67 communities (41 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2407b047`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- package.json
- combobox.tsx
- navigation-menu.tsx
- menubar.tsx
- biome.json
- lucide-react
- components.json
- questionnaire.tsx
- compilerOptions
- dependencies
- context-menu.tsx
- drawer.tsx
- carousel.tsx
- alert-dialog.tsx
- chart.tsx
- field.tsx
- cn
- attachment.tsx
- toast.tsx
- card.tsx
- item.tsx
- What You Must Do When Invoked
- devDependencies
- Tool Reference
- layout.tsx
- language.md
- post-checkout
- skill.md
- post-commit
- toggle-group.tsx
- graphify reference: extra exports and benchmark
- select.tsx
- Task 5 Report
- shadcn/ui Rules
- graphify.md
- collapsible.tsx
- react
- scripts
- marker.tsx
- graphify reference: query, path, explain
- tooling.md
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- pagination.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- notes-app
- This is NOT the Next.js you know
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- avatar.tsx
- button-group.tsx
- message-scroller.tsx
- empty.tsx
- tabs.tsx
- class-variance-authority
- bubble.tsx
- button.tsx
- input-otp.tsx
- resizable.tsx

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 42 edges
3. `lucide-react` - 24 edges
4. `Button()` - 17 edges
5. `class-variance-authority` - 17 edges
6. `compilerOptions` - 16 edges
7. `What You Must Do When Invoked` - 12 edges
8. `scripts` - 10 edges
9. `/graphify` - 10 edges
10. `shadcn/ui Rules` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Calendar()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/calendar.tsx → src/components/ui/button.tsx
- `QuestionnaireNext()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/questionnaire.tsx → src/components/ui/button.tsx
- `QuestionnairePrevious()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/questionnaire.tsx → src/components/ui/button.tsx
- `QuestionnaireSkip()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/questionnaire.tsx → src/components/ui/button.tsx
- `QuestionnaireSubmit()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/questionnaire.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (67 total, 26 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.05
Nodes (21): ref_base_ui_react_dialog, ref_base_ui_react_tooltip, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar() (+13 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (18): name, packageManager, private, version, babel-plugin-react-compiler, @biomejs/biome, concurrently, date-fns (+10 more)

### Community 2 - "combobox.tsx"
Cohesion: 0.08
Nodes (10): @base-ui/react, ref_base_ui_react_input, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+2 more)

### Community 3 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): ref_base_ui_react_navigation_menu, NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 4 - "menubar.tsx"
Cohesion: 0.08
Nodes (15): ref_base_ui_react_menu, ref_base_ui_react_menubar, DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+7 more)

### Community 5 - "biome.json"
Cohesion: 0.07
Nodes (26): source, assist, actions, css, parser, next, react, files (+18 more)

### Community 6 - "lucide-react"
Cohesion: 0.06
Nodes (10): ref_base_ui_react_accordion, ref_base_ui_react_checkbox, cmdk, lucide-react, Dialog(), DialogContent(), DialogDescription(), DialogHeader() (+2 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "questionnaire.tsx"
Cohesion: 0.13
Nodes (7): ref_shadcn_react_questionnaire, buttonVariants, Calendar(), QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit()

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, input-otp (+10 more)

### Community 12 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 13 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): embla-carousel-react, CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 15 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 17 - "field.tsx"
Cohesion: 0.16
Nodes (3): Field(), fieldVariants, Label()

### Community 18 - "cn"
Cohesion: 0.04
Nodes (9): ref_base_ui_react_popover, ref_base_ui_react_preview_card, ref_base_ui_react_progress, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_scroll_area, ref_base_ui_react_slider, ref_base_ui_react_switch (+1 more)

### Community 19 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 21 - "card.tsx"
Cohesion: 0.25
Nodes (5): ref_next_image, Card(), CardContent(), CardFooter(), CardHeader()

### Community 22 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, babel-plugin-react-compiler, @biomejs/biome, concurrently, @ladle/react, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 25 - "Tool Reference"
Cohesion: 0.14
Nodes (12): Call examples, Item fields, MCP server, Pagination, Response, Search behavior, Tool Reference, Gotchas (+4 more)

### Community 26 - "layout.tsx"
Cohesion: 0.20
Nodes (7): nextConfig, next, ref_next_font_google, src_app_globals, geistMono, geistSans, metadata

### Community 31 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (6): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 32 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 34 - "Task 5 Report"
Cohesion: 0.22
Nodes (8): Changes, Commit, Concerns, Fix Validation Output, Round 1 Fix, Status, Task 5 Report, Validation

### Community 35 - "shadcn/ui Rules"
Cohesion: 0.20
Nodes (9): Component architecture, Configuration and dependencies, Existing patterns to preserve, Icons and content, Next.js and repository constraints, Project source of truth, shadcn/ui Rules, Styling and composition (+1 more)

### Community 38 - "react"
Cohesion: 0.20
Nodes (6): @ladle/react, react, ButtonStoryProps, iconSizes, Sizes, Variants

### Community 39 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:all, format, ladle, ladle:build, ladle:preview (+2 more)

### Community 40 - "marker.tsx"
Cohesion: 0.27
Nodes (6): ref_base_ui_react_merge_props, ref_base_ui_react_use_render, Badge(), badgeVariants, Marker(), markerVariants

### Community 41 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 46 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 47 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 48 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 49 - "notes-app"
Cohesion: 0.22
Nodes (7): Architecture, Configuration, Structure, Commands, Getting started, notes-app, Project layout

### Community 50 - "This is NOT the Next.js you know"
Cohesion: 0.50
Nodes (3): Documentation and agent resources, Project context, This is NOT the Next.js you know

### Community 56 - "button-group.tsx"
Cohesion: 0.32
Nodes (4): ref_base_ui_react_separator, ButtonGroup(), buttonGroupVariants, Separator()

### Community 60 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): ref_base_ui_react_tabs, TabsList(), tabsListVariants

### Community 61 - "class-variance-authority"
Cohesion: 0.33
Nodes (3): class-variance-authority, Alert(), alertVariants

### Community 62 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 63 - "button.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_button, react-day-picker, Button()

## Knowledge Gaps
- **211 isolated node(s):** `Project source of truth`, `Component architecture`, `Styling and composition`, `Icons and content`, `Existing patterns to preserve` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 550 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn` connect `cn` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `lucide-react`, `questionnaire.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `table.tsx`, `field.tsx`, `attachment.tsx`, `toast.tsx`, `card.tsx`, `item.tsx`, `toggle-group.tsx`, `select.tsx`, `marker.tsx`, `pagination.tsx`, `avatar.tsx`, `button-group.tsx`, `message-scroller.tsx`, `breadcrumb.tsx`, `empty.tsx`, `tabs.tsx`, `class-variance-authority`, `bubble.tsx`, `button.tsx`, `input-otp.tsx`, `resizable.tsx`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `lucide-react`, `questionnaire.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `table.tsx`, `field.tsx`, `cn`, `attachment.tsx`, `toast.tsx`, `card.tsx`, `item.tsx`, `toggle-group.tsx`, `select.tsx`, `marker.tsx`, `pagination.tsx`, `avatar.tsx`, `message-scroller.tsx`, `breadcrumb.tsx`, `class-variance-authority`, `bubble.tsx`, `button.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `input-otp.tsx`, `package.json`, `combobox.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `select.tsx`, `react`, `sidebar.tsx`, `questionnaire.tsx`, `context-menu.tsx`, `carousel.tsx`, `pagination.tsx`, `toast.tsx`, `message-scroller.tsx`, `breadcrumb.tsx`, `button.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `Project source of truth`, `Component architecture`, `Styling and composition` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.053061224489795916 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `combobox.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._