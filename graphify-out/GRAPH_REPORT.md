# Graph Report - notes-app  (2026-09-17)

## Corpus Check
- 100 files · ~35,614 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .ico 1, .css 1)

## Summary
- 782 nodes · 994 edges · 66 communities (38 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `378a7e21`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- package.json
- combobox.tsx
- navigation-menu.tsx
- menubar.tsx
- biome.json
- command.tsx
- components.json
- questionnaire.tsx
- compilerOptions
- dependencies
- layout.tsx
- drawer.tsx
- carousel.tsx
- alert-dialog.tsx
- chart.tsx
- cn
- item.tsx
- react
- progress.tsx
- toast.tsx
- card.tsx
- attachment.tsx
- What You Must Do When Invoked
- hover-card.tsx
- Tool Reference
- radio-group.tsx
- language.md
- post-checkout
- skill.md
- post-commit
- toggle-group.tsx
- graphify reference: extra exports and benchmark
- lucide-react
- Task 5 Report
- shadcn/ui Rules
- graphify.md
- collapsible.tsx
- button.stories.tsx
- devDependencies
- select.tsx
- graphify reference: query, path, explain
- tooling.md
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- pagination.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- Architecture
- This is NOT the Next.js you know
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- scripts
- message-scroller.tsx
- empty.tsx
- tabs.tsx
- accordion.tsx
- input-otp.tsx
- resizable.tsx
- button.tsx

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 43 edges
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

## Communities (66 total, 28 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.05
Nodes (20): ref_base_ui_react_tooltip, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar(), SidebarContext (+12 more)

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

### Community 6 - "command.tsx"
Cohesion: 0.11
Nodes (7): ref_base_ui_react_dialog, cmdk, Dialog(), DialogContent(), DialogDescription(), DialogHeader(), DialogTitle()

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "questionnaire.tsx"
Cohesion: 0.14
Nodes (6): ref_shadcn_react_questionnaire, buttonVariants, QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit()

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, input-otp (+11 more)

### Community 11 - "layout.tsx"
Cohesion: 0.17
Nodes (9): nextConfig, next, ref_next_font_google, next-themes, src_app_globals, geistMono, geistSans, metadata (+1 more)

### Community 12 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 13 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): embla-carousel-react, CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 15 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 16 - "cn"
Cohesion: 0.20
Nodes (3): ref_base_ui_react_slider, ref_base_ui_react_switch, cn

### Community 17 - "item.tsx"
Cohesion: 0.08
Nodes (9): ref_base_ui_react_separator, Field(), fieldVariants, Item(), ItemMedia(), itemMediaVariants, itemVariants, Label() (+1 more)

### Community 18 - "react"
Cohesion: 0.04
Nodes (5): ref_base_ui_react_avatar, ref_base_ui_react_context_menu, ref_base_ui_react_popover, ref_base_ui_react_scroll_area, react

### Community 21 - "card.tsx"
Cohesion: 0.25
Nodes (5): ref_next_image, Card(), CardContent(), CardFooter(), CardHeader()

### Community 22 - "attachment.tsx"
Cohesion: 0.06
Nodes (19): ref_base_ui_react_merge_props, ref_base_ui_react_use_render, class-variance-authority, Alert(), alertVariants, Attachment(), AttachmentMedia(), attachmentMediaVariants (+11 more)

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 25 - "Tool Reference"
Cohesion: 0.14
Nodes (12): Call examples, Item fields, MCP server, Pagination, Response, Search behavior, Tool Reference, Gotchas (+4 more)

### Community 31 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (6): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 32 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 33 - "lucide-react"
Cohesion: 0.18
Nodes (3): ref_base_ui_react_checkbox, lucide-react, NativeSelectProps

### Community 34 - "Task 5 Report"
Cohesion: 0.22
Nodes (8): Changes, Commit, Concerns, Fix Validation Output, Round 1 Fix, Status, Task 5 Report, Validation

### Community 35 - "shadcn/ui Rules"
Cohesion: 0.20
Nodes (9): Component architecture, Configuration and dependencies, Existing patterns to preserve, Icons and content, Next.js and repository constraints, Project source of truth, shadcn/ui Rules, Styling and composition (+1 more)

### Community 38 - "button.stories.tsx"
Cohesion: 0.29
Nodes (5): @ladle/react, ButtonStoryProps, iconSizes, Sizes, Variants

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, babel-plugin-react-compiler, @biomejs/biome, concurrently, @ladle/react, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

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

### Community 49 - "Architecture"
Cohesion: 0.20
Nodes (8): Architecture, Configuration, Data access and security, Structure, Commands, Getting started, notes-app, Project layout

### Community 50 - "This is NOT the Next.js you know"
Cohesion: 0.50
Nodes (3): Documentation and agent resources, Project context, This is NOT the Next.js you know

### Community 55 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:all, format, ladle, ladle:build, ladle:preview (+2 more)

### Community 59 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): ref_base_ui_react_tabs, TabsList(), tabsListVariants

### Community 63 - "button.tsx"
Cohesion: 0.33
Nodes (4): ref_base_ui_react_button, react-day-picker, Button(), Calendar()

## Knowledge Gaps
- **213 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `SidebarContextProps`, `DrawerContextProps` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 553 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Explain the data folder using the Next.js data security guide and this repository architecture" -> `private`, `actions`, `clientKind`, `components.json`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn` connect `cn` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `command.tsx`, `questionnaire.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `react`, `progress.tsx`, `toast.tsx`, `card.tsx`, `attachment.tsx`, `hover-card.tsx`, `radio-group.tsx`, `toggle-group.tsx`, `lucide-react`, `select.tsx`, `pagination.tsx`, `table.tsx`, `message-scroller.tsx`, `empty.tsx`, `tabs.tsx`, `accordion.tsx`, `input-otp.tsx`, `resizable.tsx`, `button.tsx`, `kbd.tsx`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `command.tsx`, `questionnaire.tsx`, `layout.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `card.tsx`, `attachment.tsx`, `toggle-group.tsx`, `lucide-react`, `button.stories.tsx`, `select.tsx`, `pagination.tsx`, `table.tsx`, `message-scroller.tsx`, `input-otp.tsx`, `button.tsx`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `button.stories.tsx`, `command.tsx`, `questionnaire.tsx`, `select.tsx`, `carousel.tsx`, `pagination.tsx`, `react`, `toast.tsx`, `attachment.tsx`, `message-scroller.tsx`, `accordion.tsx`, `input-otp.tsx`, `button.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05442176870748299 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `combobox.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._