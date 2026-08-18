# Graph Report - notes-app  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 701 nodes · 1226 edges · 40 communities (38 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64ddd89d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 37
- Community 38
- Community 46
- Community 48

## God Nodes (most connected - your core abstractions)
1. `cn()` - 359 edges
2. `main()` - 20 edges
3. `Button()` - 17 edges
4. `compilerOptions` - 16 edges
5. `scripts` - 11 edges
6. `main()` - 9 edges
7. `buttonVariants` - 9 edges
8. `include` - 7 edges
9. `Separator()` - 6 edges
10. `aliases` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Command()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandEmpty()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandGroup()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandInput()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (40 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (40): collect_code_metrics(), detect_ci_cd_pipelines(), detect_containers(), detect_monorepo(), detect_performance_markers(), detect_security_configs(), find_entry_points(), find_env_templates() (+32 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (39): @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (33): Input(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (25): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Kbd(), KbdGroup(), Progress(), ProgressIndicator() (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (26): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (30): @biomejs/biome, devDependencies, @biomejs/biome, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (23): allowedCodeExt, allowedDocExt, allowedSpecialFiles, BUILD_AFTER_SYNC, cleanWorkspace(), collectBranch(), DEFAULT_BRANCHES, fileExists() (+15 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): source, assist, actions, enabled, files, ignoreUnknown, formatter, enabled (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (31): Button(), buttonVariants, Calendar(), CalendarDayButton(), MessageScroller(), MessageScrollerButton(), MessageScrollerContent(), MessageScrollerItem() (+23 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (7): geistMono, geistSans, metadata, LocaleLayoutProps, locales, routing, config

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubTrigger() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (10): DrawerContent(), DrawerContext, DrawerContextProps, DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerSwipeHandle() (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (29): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+21 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): Message(), MessageAvatar(), MessageContent(), MessageFooter(), MessageGroup(), MessageHeader()

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 24 - "Community 24"
Cohesion: 0.05
Nodes (26): AspectRatio(), Badge(), badgeVariants, Checkbox(), HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot() (+18 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuPositioner(), NavigationMenuTrigger() (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (7): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (6): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 33 - "Community 33"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 37 - "Community 37"
Cohesion: 0.53
Nodes (4): configureProjectAfterInstall(), installWithPip(), installWithUv(), run()

### Community 38 - "Community 38"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

## Knowledge Gaps
- **135 isolated node(s):** `LocaleLayoutProps`, `DrawerContextProps`, `CarouselApi`, `CarouselContextProps`, `CarouselOptions` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 3` to `Community 2`, `Community 4`, `Community 7`, `Community 11`, `Community 12`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 38`?**
  _High betweenness centrality (0.392) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `LocaleLayoutProps`, `DrawerContextProps`, `CarouselApi` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06747638326585695 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._