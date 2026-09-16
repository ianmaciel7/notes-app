# Graph Report - notes-app  (2026-09-16)

## Corpus Check
- 88 files · ~33,666 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .ico 1, .css 1)

## Summary
- 644 nodes · 868 edges · 41 communities (22 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82d7620f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- package.json
- combobox.tsx
- lucide-react
- menubar.tsx
- biome.json
- command.tsx
- components.json
- questionnaire.tsx
- compilerOptions
- dependencies
- context-menu.tsx
- drawer.tsx
- carousel.tsx
- alert-dialog.tsx
- chart.tsx
- react
- item.tsx
- cn
- attachment.tsx
- navigation-menu.tsx
- card.tsx
- toast.tsx
- class-variance-authority
- pagination.tsx
- avatar.tsx
- radio-group.tsx
- post-checkout
- message-scroller.tsx
- post-commit
- empty.tsx
- progress.tsx
- tabs.tsx
- button.tsx
- alert.tsx
- collapsible.tsx
- hover-card.tsx
- slider.tsx
- postcss.config.mjs
- ref_base_ui_react_direction_provider

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 40 edges
3. `lucide-react` - 23 edges
4. `class-variance-authority` - 17 edges
5. `Button()` - 16 edges
6. `compilerOptions` - 16 edges
7. `buttonVariants` - 9 edges
8. `scripts` - 6 edges
9. `aliases` - 6 edges
10. `tailwind` - 6 edges

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

## Communities (41 total, 19 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.05
Nodes (20): ref_base_ui_react_tooltip, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar(), SidebarContext (+12 more)

### Community 1 - "package.json"
Cohesion: 0.04
Nodes (40): nextConfig, devDependencies, babel-plugin-react-compiler, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+32 more)

### Community 2 - "combobox.tsx"
Cohesion: 0.08
Nodes (10): @base-ui/react, ref_base_ui_react_input, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+2 more)

### Community 3 - "lucide-react"
Cohesion: 0.06
Nodes (6): ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_base_ui_react_select, input-otp, lucide-react, NativeSelectProps

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

### Community 16 - "react"
Cohesion: 0.06
Nodes (6): ref_base_ui_react_popover, ref_base_ui_react_scroll_area, react, Field(), fieldVariants, Label()

### Community 17 - "item.tsx"
Cohesion: 0.06
Nodes (18): ref_base_ui_react_merge_props, ref_base_ui_react_separator, ref_base_ui_react_use_render, Badge(), badgeVariants, Bubble(), BubbleReactions(), bubbleReactionsVariants (+10 more)

### Community 19 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 20 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): ref_base_ui_react_navigation_menu, NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 21 - "card.tsx"
Cohesion: 0.25
Nodes (5): ref_next_image, Card(), CardContent(), CardFooter(), CardHeader()

### Community 23 - "class-variance-authority"
Cohesion: 0.31
Nodes (7): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, class-variance-authority, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 33 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): ref_base_ui_react_tabs, TabsList(), tabsListVariants

### Community 35 - "button.tsx"
Cohesion: 0.40
Nodes (3): ref_base_ui_react_button, react-day-picker, Button()

## Knowledge Gaps
- **124 isolated node(s):** `SidebarContextProps`, `DrawerContextProps`, `CarouselApi`, `CarouselContextProps`, `CarouselOptions` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 444 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn` connect `cn` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `lucide-react`, `menubar.tsx`, `command.tsx`, `questionnaire.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `react`, `item.tsx`, `attachment.tsx`, `navigation-menu.tsx`, `card.tsx`, `toast.tsx`, `class-variance-authority`, `pagination.tsx`, `table.tsx`, `avatar.tsx`, `radio-group.tsx`, `message-scroller.tsx`, `empty.tsx`, `progress.tsx`, `tabs.tsx`, `button.tsx`, `alert.tsx`, `hover-card.tsx`, `slider.tsx`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `lucide-react`, `menubar.tsx`, `command.tsx`, `questionnaire.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `attachment.tsx`, `card.tsx`, `toast.tsx`, `class-variance-authority`, `pagination.tsx`, `table.tsx`, `avatar.tsx`, `message-scroller.tsx`, `button.tsx`, `alert.tsx`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `sidebar.tsx`, `package.json`, `combobox.tsx`, `button.tsx`, `menubar.tsx`, `command.tsx`, `questionnaire.tsx`, `context-menu.tsx`, `carousel.tsx`, `item.tsx`, `navigation-menu.tsx`, `toast.tsx`, `pagination.tsx`, `message-scroller.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `SidebarContextProps`, `DrawerContextProps`, `CarouselApi` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05442176870748299 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `combobox.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._