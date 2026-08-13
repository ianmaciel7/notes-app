# Graph Report - notes-app  (2026-08-13)

## Corpus Check
- 91 files · ~81,147 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 772 nodes · 1231 edges · 62 communities (56 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `195037f9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint
- What You Must Do When Invoked
- utils.ts
- Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification
- graphify reference: extra exports and benchmark
- Obsidian Feature and Functionality Landscape
- Obsidian Feature and Functionality Landscape
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- README.md
- biome.json
- compilerOptions
- dependencies
- devDependencies
- menubar.tsx
- command.tsx
- AGENTS.md
- postcss.config.mjs
- cn
- sidebar.tsx
- components.json
- questionnaire.tsx
- combobox.tsx
- context-menu.tsx
- drawer.tsx
- carousel.tsx
- field.tsx
- alert-dialog.tsx
- chart.tsx
- item.tsx
- toast.tsx
- attachment.tsx
- sheet.tsx
- navigation-menu.tsx
- button.tsx
- pagination.tsx
- table.tsx
- breadcrumb.tsx
- card.tsx
- empty.tsx
- avatar.tsx
- bubble.tsx
- message.tsx
- alert.tsx
- useSidebar
- tabs.tsx
- input-otp.tsx
- marker.tsx
- native-select.tsx
- tooltip.tsx
- SidebarProvider

## God Nodes (most connected - your core abstractions)
1. `cn()` - 359 edges
2. `Button()` - 16 edges
3. `compilerOptions` - 16 edges
4. `What You Must Do When Invoked` - 12 edges
5. `/graphify` - 10 edges
6. `buttonVariants` - 9 edges
7. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
8. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
9. `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` - 8 edges
10. `Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (62 total, 6 thin omitted)

### Community 0 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 1 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 2 - "Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint"
Cohesion: 0.11
Nodes (18): Add-on ecosystem, Biggest technical risks, Collection data model, packages, templates, and media, Core algorithm choices, Executive summary, FSRS model, Licensing, trademark and privacy, Media and CDN architecture (+10 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "utils.ts"
Cohesion: 0.06
Nodes (24): AspectRatio(), Badge(), badgeVariants, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Checkbox() (+16 more)

### Community 5 - "Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification"
Cohesion: 0.22
Nodes (8): API, integrations, and extensibility, Backend architecture, storage, sync, and conflict resolution, Data model and interaction flows, Executive summary, Implementation roadmap and MVP priorities, Open-source implementations and reusable components, Product surface and feature inventory, Recreating Notion: Complete Product, Data, UX, API, and Architecture Specification

### Community 6 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 7 - "Obsidian Feature and Functionality Landscape"
Cohesion: 0.25
Nodes (7): Architecture and comprehensive capability map, Developer API and community ecosystem, Executive summary, Mobile and platform capabilities, Obsidian Feature and Functionality Landscape, Official plugins and high-value native workflows, Sync, Publish, and pricing

### Community 8 - "Obsidian Feature and Functionality Landscape"
Cohesion: 0.25
Nodes (7): Architecture and comprehensive capability map, Developer API and community ecosystem, Executive summary, Mobile and platform capabilities, Obsidian Feature and Functionality Landscape, Official plugins and high-value native workflows, Sync, Publish, and pricing

### Community 9 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 10 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 11 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 12 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 16 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 17 - "biome.json"
Cohesion: 0.05
Nodes (37): source, assist, actions, css, parser, next, react, files (+29 more)

### Community 18 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 19 - "dependencies"
Cohesion: 0.05
Nodes (37): @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react (+29 more)

### Community 20 - "devDependencies"
Cohesion: 0.07
Nodes (27): babel-plugin-react-compiler, @biomejs/biome, devDependencies, babel-plugin-react-compiler, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node (+19 more)

### Community 21 - "menubar.tsx"
Cohesion: 0.09
Nodes (26): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+18 more)

### Community 22 - "command.tsx"
Cohesion: 0.08
Nodes (24): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+16 more)

### Community 27 - "cn"
Cohesion: 0.12
Nodes (25): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Kbd(), KbdGroup(), Progress(), ProgressIndicator() (+17 more)

### Community 28 - "sidebar.tsx"
Cohesion: 0.09
Nodes (21): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+13 more)

### Community 29 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 30 - "questionnaire.tsx"
Cohesion: 0.13
Nodes (18): buttonVariants, Calendar(), CalendarDayButton(), Questionnaire(), QuestionnaireActions(), QuestionnaireChoice(), QuestionnaireChoiceDescription(), QuestionnaireChoices() (+10 more)

### Community 31 - "combobox.tsx"
Cohesion: 0.11
Nodes (15): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+7 more)

### Community 32 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubTrigger() (+1 more)

### Community 33 - "drawer.tsx"
Cohesion: 0.14
Nodes (10): DrawerContent(), DrawerContext, DrawerContextProps, DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerSwipeHandle() (+2 more)

### Community 34 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 35 - "field.tsx"
Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 36 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 37 - "chart.tsx"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 38 - "item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 39 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 40 - "attachment.tsx"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 41 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 42 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuPositioner(), NavigationMenuTrigger() (+1 more)

### Community 43 - "button.tsx"
Cohesion: 0.25
Nodes (6): Button(), MessageScroller(), MessageScrollerButton(), MessageScrollerContent(), MessageScrollerItem(), MessageScrollerViewport()

### Community 44 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 45 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 46 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 47 - "card.tsx"
Cohesion: 0.25
Nodes (7): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 48 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 49 - "avatar.tsx"
Cohesion: 0.29
Nodes (6): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 50 - "bubble.tsx"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 51 - "message.tsx"
Cohesion: 0.29
Nodes (6): Message(), MessageAvatar(), MessageContent(), MessageFooter(), MessageGroup(), MessageHeader()

### Community 52 - "alert.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 53 - "useSidebar"
Cohesion: 0.33
Nodes (6): Sidebar(), SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar()

### Community 54 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 55 - "input-otp.tsx"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 56 - "marker.tsx"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

### Community 57 - "native-select.tsx"
Cohesion: 0.40
Nodes (4): NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps

### Community 59 - "tooltip.tsx"
Cohesion: 0.50
Nodes (3): Tooltip(), TooltipContent(), TooltipTrigger()

## Knowledge Gaps
- **228 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+223 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `menubar.tsx`, `command.tsx`, `sidebar.tsx`, `questionnaire.tsx`, `combobox.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `field.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `sheet.tsx`, `navigation-menu.tsx`, `button.tsx`, `pagination.tsx`, `table.tsx`, `breadcrumb.tsx`, `card.tsx`, `empty.tsx`, `avatar.tsx`, `bubble.tsx`, `message.tsx`, `alert.tsx`, `useSidebar`, `tabs.tsx`, `input-otp.tsx`, `marker.tsx`, `native-select.tsx`, `tooltip.tsx`, `SidebarProvider`?**
  _High betweenness centrality (0.369) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _228 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Recreating an Anki-Class Spaced-Repetition Application: Architecture, Formats, Algorithms, Sync, Extensions, Security, and Implementation Blueprint` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05537098560354374 - nodes in this community are weakly interconnected._