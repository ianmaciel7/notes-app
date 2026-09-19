# Graph Report - notes-app  (2026-09-18)

## Corpus Check
- 288 files · ~117,925 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .rules 2, .resolved 1)

## Summary
- 2156 nodes · 3132 edges · 189 communities (140 shown, 49 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c425413`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- Historical Agent Governance, Subagent Architecture & Recovery Roadmap
- context-menu.tsx
- navigation-menu.tsx
- menubar.tsx
- package.json
- biome.json
- components.json
- question.tsx
- compilerOptions
- dependencies
- card.tsx
- drawer.tsx
- carousel.tsx
- alert-dialog.tsx
- chart.tsx
- [examId]/page.tsx
- auth.ts
- toggle-group.tsx
- single-choice-question.tsx
- App Hosting CLI Commands
- getAuthErrorMessage
- attachment.tsx
- What You Must Do When Invoked
- proxy.ts
- Tool Reference
- item.tsx
- useI18n
- post-checkout
- skill.md
- post-commit
- user-nav.test.tsx
- graphify reference: extra exports and benchmark
- Deterministic Rules for Migration
- Task 5 Report
- shadcn/ui Rules
- graphify.md
- collapsible.tsx
- i18n-provider.tsx
- devDependencies
- sign-in-auth-screen.tsx
- graphify reference: query, path, explain
- tooling.md
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- Native SQL Operations
- AGENTS.md
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- Firebase Remote Config iOS Setup Guide
- Mutations
- app/layout.tsx
- toast.tsx
- Key Attributes
- Configuration Reference
- src_app_lang_dictionaries_en
- Security Reference
- src_app_lang_dictionaries_haslocale
- ref_proxy
- sms-multi-factor-assertion-form.tsx
- ref_dictionaries
- Firebase Crashlytics iOS Setup Guide
- question.ts
- src_app_lang_dictionaries_pt_br
- case-study-layout.tsx
- breadcrumb.tsx
- Schema Reference
- scripts
- firebase-basics/SKILL.md
- index.js
- 1. Vector Similarity Search (Semantic)
- client.ts
- vitest.config.ts
- ref_testing_library_jest_dom_vitest
- Firestore Web SDK Usage Guide
- Firebase Authentication Web SDK
- cn
- ref_routing
- Task 4 Report — App-Owned Message Catalog Lookups
- class-variance-authority
- ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️
- Firestore Indexes Reference
- src_lib_i18n_index_getautherrormessage
- Advanced Validation for Business Logic
- ⛔️ CRITICAL RULES & ENVIRONMENT CHECKS
- Step-by-Step Migration Execution
- Web SDK
- Firebase SQL Connect
- Writing Data
- Native SQL Examples
- Cloud Functions Integration Reference
- Realtime Reference
- iOS SDK
- Templates
- combobox.tsx
- Flutter & Firebase Setup Guide
- Flutter SDK
- Firebase AI Logic Basics
- 🛠️ Firebase Android Setup Guide
- firebase-data-connect/SKILL.md
- Android SDK Usage (Enterprise Native Mode)
- ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️
- main.swift
- AppMessages
- src_lib_i18n_index_usei18n
- select.tsx
- ref_next_root_params
- CEL Expressions
- Admin Node SDK
- Android SDK
- Cloud Firestore on Android (Kotlin)
- Firebase Functions V1 vs V2 Signature Mapping
- firebase-auth-basics/SKILL.md
- Firebase Authentication on Android (Kotlin)
- ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️
- firebase-basics/references/ios_setup.md
- Document Data Model
- Firestore Indexes Reference
- Web SDK Usage (Enterprise Native Mode)
- Firebase AI Logic iOS Setup Guide
- Firebase AI Logic on Android (Kotlin)
- Basic Checks
- Alternative: Manual MCP Configuration (Project Scope)
- Context7
- Manual Initialization
- Authorization Patterns
- Flutter Setup for Firebase AI Logic
- Firebase AI Logic Basics
- Core Capabilities
- Firebase Auth & Google Sign-In for Flutter
- Cloud Firestore in Flutter
- Cloud Firestore in Flutter
- Manual Initialization
- 1. Instance Selection and Edition Detection
- Assessment: Security Validator (Red Team Edition)
- App Check Debug Tokens for Local Development & CI/CD
- Workflow
- Firebase Local Environment Setup
- Recommended: Global Setup
- Recommended: Global Setup
- Firebase Web Setup Guide
- 1. Local Prototyping: Data Seeding
- Queries
- Antigravity Setup
- Recommended Method: Using Plugins
- Cursor Setup
- resizable.tsx
- Android Studio Setup
- dictionaries.ts
- Package.swift
- Detailed Findings by Worktree Group
- popover.tsx
- seed-exams.ts
- System Prompt
- lucide-react
- react
- System Prompt
- System Prompt
- System Prompt
- System Prompt
- no-index.md
- ref_lib_i18n
- Q: Explain the data folder using the Next.js data security guide and this repository architecture
- progress.tsx
- exam-actions.ts
- src_hooks_use_i18n_usei18n
- Internationalization (Next.js App Router)
- Instruction Scoping Guidelines
- accordion.tsx
- Knowledge Retention & Persistence Rule
- portable-paths.md
- native-select.tsx
- prefer-batch-operations.md
- subagent-orchestration.md

## God Nodes (most connected - your core abstractions)
1. `react` - 70 edges
2. `useI18n()` - 62 edges
3. `cn` - 61 edges
4. `lucide-react` - 39 edges
5. `Button()` - 28 edges
6. `getAuthErrorMessage()` - 27 edges
7. `@firebase-oss/ui-react` - 17 edges
8. `class-variance-authority` - 17 edges
9. `hasLocale()` - 17 edges
10. `getDictionary()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Mutation Fields (DML)` --references--> `DELETE()`  [INFERRED]
  .agents/skills/firebase-data-connect/reference/native_sql.md → src/app/api/session/route.ts
- `Concerns` --references--> `I18nProvider()`  [INFERRED]
  .superpowers/sdd/2026-09-17-extract-user-facing-messages-i18n/task-4-report.md → src/components/i18n-provider.tsx
- `Boundary with Firebase UI Translations` --references--> `useI18n()`  [INFERRED]
  docs/i18n-message-inventory.md → src/components/i18n-provider.tsx
- `Cache Components` --references--> `AuthGate()`  [INFERRED]
  docs/FIREBASE_AUTHENTICATION.md → src/components/auth/auth-gate.tsx
- `Fix Round 1 — Review Findings` --references--> `AuthGate()`  [INFERRED]
  .superpowers/sdd/2026-09-17-extract-user-facing-messages-i18n/task-2-report.md → src/components/auth/auth-gate.tsx

## Import Cycles
- None detected.

## Communities (189 total, 49 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.05
Nodes (20): ref_base_ui_react_tooltip, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar(), SidebarContext (+12 more)

### Community 1 - "Historical Agent Governance, Subagent Architecture & Recovery Roadmap"
Cohesion: 0.15
Nodes (12): 1. How Agents and Subagents Were Managed, 2. Historical Subagent Roles & Delegation Matrix, 3. Historical Skills & Governance Mechanisms, 4. Recovery & Restoration Plan for `feature/home`, A. Key Skills, A. The 3-Tier Instruction Hierarchy, B. Key Domain & Governance Rules, Historical Agent Governance, Subagent Architecture & Recovery Roadmap (+4 more)

### Community 3 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): ref_base_ui_react_navigation_menu, NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 4 - "menubar.tsx"
Cohesion: 0.06
Nodes (21): ref_base_ui_react_avatar, ref_base_ui_react_menu, ref_base_ui_react_menubar, Avatar(), AvatarFallback(), DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup() (+13 more)

### Community 5 - "package.json"
Cohesion: 0.08
Nodes (25): name, packageManager, private, version, babel-plugin-react-compiler, @biomejs/biome, concurrently, date-fns (+17 more)

### Community 6 - "biome.json"
Cohesion: 0.07
Nodes (27): source, assist, actions, css, parser, next, react, files (+19 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 8 - "question.tsx"
Cohesion: 0.10
Nodes (26): react-day-picker, ref_shadcn_react_questionnaire, ExamQuestionnaireProps, ExamQuestionOption, ExamQuestionType, buttonVariants, Calendar(), Empty() (+18 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, firebase (+17 more)

### Community 11 - "card.tsx"
Cohesion: 0.15
Nodes (15): ref_next_navigation, ForgotPasswordPage(), ForgotPasswordAuthScreen(), MultiFactorAuthAssertionScreen(), MultiFactorAuthEnrollmentScreenProps, PersonalNoteCard(), PersonalNoteCardProps, questions (+7 more)

### Community 12 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 13 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): embla-carousel-react, Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 15 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 16 - "[examId]/page.tsx"
Cohesion: 0.14
Nodes (18): Authentication flow, Authorization rule, Cache Components, Firebase Authentication, Local development, Production checklist, ref_next_link, ExamContent() (+10 more)

### Community 17 - "auth.ts"
Cohesion: 0.16
Nodes (19): ref_firebase_admin_storage, ref_next_cache, ref_next_headers, ref_server_only, DELETE(), invalidateCacheTag(), isValidOrigin(), POST() (+11 more)

### Community 18 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (6): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 19 - "single-choice-question.tsx"
Cohesion: 0.16
Nodes (14): ref_base_ui_react_checkbox, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_use_render, MultiChoiceQuestion(), MultiChoiceQuestionProps, SingleChoiceQuestion(), SingleChoiceQuestionProps (+6 more)

### Community 20 - "App Hosting CLI Commands"
Cohesion: 0.06
Nodes (30): App Hosting CLI Commands, Automated deployment via GitHub (CI/CD), Backend Management, Initialization, `npx -y firebase-tools@latest apphosting:backends:create`, `npx -y firebase-tools@latest apphosting:backends:delete <backend-id>`, `npx -y firebase-tools@latest apphosting:backends:get <backend-id>`, `npx -y firebase-tools@latest apphosting:backends:list` (+22 more)

### Community 21 - "getAuthErrorMessage"
Cohesion: 0.22
Nodes (12): ForgotPasswordAuthForm(), onSubmit(), SignInAuthForm(), onSubmit(), SignUpAuthForm(), onSubmit(), SignUpAuthScreen(), dictionaries (+4 more)

### Community 22 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 24 - "proxy.ts"
Cohesion: 0.27
Nodes (9): ref_next_experimental_testing_server, ref_next_server, supportedLocales, authPaths, config, isAuthPath(), localeCookieOptions, negotiateLocale() (+1 more)

### Community 25 - "Tool Reference"
Cohesion: 0.14
Nodes (12): Call examples, Item fields, MCP server, Pagination, Response, Search behavior, Tool Reference, Gotchas (+4 more)

### Community 26 - "item.tsx"
Cohesion: 0.15
Nodes (6): ref_base_ui_react_separator, Item(), ItemMedia(), itemMediaVariants, itemVariants, Separator()

### Community 27 - "useI18n"
Cohesion: 0.18
Nodes (9): GithubSignInButtonProps, useI18n(), ExamQuestionnaire(), Pagination(), PaginationEllipsis(), PaginationLinkProps, PaginationNext(), PaginationPrevious() (+1 more)

### Community 31 - "user-nav.test.tsx"
Cohesion: 0.17
Nodes (10): @testing-library/react, @testing-library/user-event, vitest, getMessage(), I18nProvider(), ExamQuestion, questions, mockPush (+2 more)

### Community 32 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 33 - "Deterministic Rules for Migration"
Cohesion: 0.07
Nodes (27): 1. Per-Function Configuration, 2. Global Configuration (`setGlobalOptions`), 3. Migrating Environment Configurations (`functions.config()`), Advanced Interpolation & Logic, Built-ins, Common Property Translations, Deterministic Rules for Migration, Initialization & Scope (+19 more)

### Community 34 - "Task 5 Report"
Cohesion: 0.22
Nodes (8): Changes, Commit, Concerns, Fix Validation Output, Round 1 Fix, Status, Task 5 Report, Validation

### Community 35 - "shadcn/ui Rules"
Cohesion: 0.20
Nodes (9): Component architecture, Configuration and dependencies, Existing patterns to preserve, Icons and content, Next.js and repository constraints, Project source of truth, shadcn/ui Rules, Styling and composition (+1 more)

### Community 38 - "i18n-provider.tsx"
Cohesion: 0.27
Nodes (7): I18nContext, I18nContextValue, I18nProviderProps, localeCookieName, localeHeaderName, MessageKey, NestedMessageKey

### Community 39 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, babel-plugin-react-compiler, @biomejs/biome, concurrently, jsdom, @ladle/react, tailwindcss, @tailwindcss/postcss (+9 more)

### Community 40 - "sign-in-auth-screen.tsx"
Cohesion: 0.17
Nodes (15): ref_firebase_auth, SignInPage(), SignUpPage(), AuthGate(), ui, GithubSignInButton(), GoogleSignInButton(), SignInAuthScreen() (+7 more)

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

### Community 49 - "Native SQL Operations"
Cohesion: 0.22
Nodes (8): Core Agent Constraints, Mutation Fields (DML), Native SQL Operations, Native SQL Root Fields, PostgreSQL Extensions, Query Fields (Read-Only), ⚠️ Security: Stored Procedures & Dynamic SQL, Syntax rules & limitations

### Community 50 - "AGENTS.md"
Cohesion: 0.11
Nodes (18): Component architecture, Configuration and dependencies, Documentation and agent resources, Existing patterns to preserve, Graphify Rules, Icons and content, Knowledge Retention & Persistence Rule, Next.js and repository constraints (+10 more)

### Community 55 - "Firebase Remote Config iOS Setup Guide"
Cohesion: 0.07
Nodes (25): Add Dependencies to Gradle Build, App-level `build.gradle.kts` (`<project>/<app-module>/build.gradle.kts`), Fetch and Activate Values, Firebase Remote Config Android Setup Guide, Follow up Steps, Project and App Setup, Project-level `build.gradle.kts` (`<project>/build.gradle.kts`), Set In-App Defaults (+17 more)

### Community 56 - "Mutations"
Cohesion: 0.11
Nodes (18): Contents, Create, Create with Server Values, Delete, Embedded Queries, Filtered Updates/Deletes (User-Owned), Generated Fields, Key Scalars (+10 more)

### Community 58 - "app/layout.tsx"
Cohesion: 0.07
Nodes (23): nextConfig, next, ref_next_font_google, next-themes, src_app_globals, geistMono, geistSans, metadata (+15 more)

### Community 59 - "toast.tsx"
Cohesion: 0.14
Nodes (3): ref_base_ui_react_toast, toast, ToastClose()

### Community 60 - "Key Attributes"
Cohesion: 0.08
Nodes (23): `cleanUrls` (Optional), Full Example, `headers` (Optional), Hosting Configuration (`firebase.json`), `ignore` (Optional), Key Attributes, `public` (Required), `redirects` (Optional) (+15 more)

### Community 61 - "Configuration Reference"
Cohesion: 0.08
Nodes (24): Breaking Changes, CI/CD Integration, Cloud SQL Configuration, Configuration Reference, Connect from SDK, connector.yaml, Contents, dataconnect.yaml (+16 more)

### Community 63 - "Security Reference"
Cohesion: 0.13
Nodes (14): Access Levels, Anti-Patterns, @auth Directive, Authorization Data Lookup, @check, @check and @redact, Contents, ❌ Don't Pass User ID as Variable (+6 more)

### Community 67 - "sms-multi-factor-assertion-form.tsx"
Cohesion: 0.13
Nodes (15): MultiFactorAuthAssertionForm(), MultiFactorAuthAssertionFormProps, PhoneMultiFactorInfo, SmsMultiFactorAssertionForm(), SmsMultiFactorAssertionFormProps, SmsMultiFactorAssertionPhoneForm(), SmsMultiFactorAssertionPhoneFormProps, SmsMultiFactorAssertionVerifyForm() (+7 more)

### Community 69 - "Firebase Crashlytics iOS Setup Guide"
Cohesion: 0.08
Nodes (21): Add Dependencies to Gradle Build, App-level `build.gradle.kts` (`<project>/<app-module>/build.gradle.kts`), Firebase Crashlytics Android Setup Guide, Follow up Steps, Optional: Add custom debugging information, Optional: Install the NDK SDK to capture native crashes, Project and App Setup, Project-level `build.gradle.kts` (`<project>/build.gradle.kts`) (+13 more)

### Community 70 - "question.ts"
Cohesion: 0.15
Nodes (15): DndQuestionProps, getPracticeQuestions(), getSimulationQuestions(), QuestionFilterOptions, CaseStudyAnswer, CaseStudyTab, DragAndDropAnswer, DragAndDropItem (+7 more)

### Community 72 - "case-study-layout.tsx"
Cohesion: 0.20
Nodes (13): ref_base_ui_react_tabs, CaseStudyLayout(), CaseStudyLayoutProps, MarkdownPrompt(), MarkdownPromptProps, renderInlineFormatting(), renderTextBlocks(), Tabs() (+5 more)

### Community 74 - "Schema Reference"
Cohesion: 0.10
Nodes (20): @col, Contents, Core Directives, Customizing Tables, Data Types, @default, Defining Types, Enumerations (+12 more)

### Community 75 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, dev:all, firebase:emulators, firebase:emulators:exec, format, ladle (+5 more)

### Community 76 - "firebase-basics/SKILL.md"
Cohesion: 0.11
Nodes (11): Exploring Commands, Initialization, Refresh Android Studio Local Environment, Refresh Antigravity Local Environment, Refresh Claude Code Local Environment, Refresh Gemini CLI Local Environment, Refresh Other Local Environment, Common Issues (+3 more)

### Community 77 - "index.js"
Cohesion: 0.33
Nodes (4): logger, { onRequest }, ref_firebase_functions_logger, ref_firebase_functions_v2_https

### Community 78 - "1. Vector Similarity Search (Semantic)"
Cohesion: 0.11
Nodes (17): 1. Query Formats (`queryFormat` argument), 1. Vector Similarity Search (Semantic), 2. Full-Text Search (Lexical), 2. Relevance Thresholding (`relevanceThreshold` and `_metadata.relevance`), A. Auto-Embedding Search, A. Generation on Insert, Automatic Embedding Generation (`_embed` server value), B. Custom Vector Search (+9 more)

### Community 79 - "client.ts"
Cohesion: 0.09
Nodes (23): dependencies, firebase-functions, engines, node, name, private, ref_firebase_app, ref_firebase_database (+15 more)

### Community 82 - "Firestore Web SDK Usage Guide"
Cohesion: 0.12
Nodes (16): Add a Document with Auto-ID (`addDoc`), Firestore Web SDK Usage Guide, Get a Single Document (`getDoc`), Get Multiple Documents (`getDocs`), Handle Changes (Added/Modified/Removed), Initialization, Listen to a Document/Query (`onSnapshot`), Order and Limit (+8 more)

### Community 84 - "Firebase Authentication Web SDK"
Cohesion: 0.13
Nodes (15): Connect to Emulator, Email Link Authentication, Firebase Authentication Web SDK, Initialization, Observe Auth State, Sign In Anonymously, Sign In with Apple (Popup), Sign In with Facebook (Popup) (+7 more)

### Community 85 - "cn"
Cohesion: 0.10
Nodes (5): ref_base_ui_react_preview_card, ref_base_ui_react_scroll_area, ref_base_ui_react_slider, ref_base_ui_react_switch, cn

### Community 87 - "Task 4 Report — App-Owned Message Catalog Lookups"
Cohesion: 0.33
Nodes (5): Concerns, Scope confirmation, Status, Task 4 Report — App-Owned Message Catalog Lookups, Validation

### Community 88 - "class-variance-authority"
Cohesion: 0.14
Nodes (10): ref_base_ui_react_merge_props, class-variance-authority, Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants, ButtonGroup(), buttonGroupVariants (+2 more)

### Community 89 - "⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️"
Cohesion: 0.13
Nodes (14): 1. Import and Initialize, 2. Type-Safe Data Models (Codable), 3. Basic CRUD Operations, 4. Pipeline Queries, 5. Realtime Listeners in SwiftUI (Lifecycle Best Practices), ⛔️ CRITICAL RULE: NO FirebaseFirestoreSwift ⛔️, ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️, Examples (+6 more)

### Community 90 - "Firestore Indexes Reference"
Cohesion: 0.13
Nodes (15): 1. High Write Rates (Sequential Values), 2. Large String/Map/Array Fields, 3. TTL Fields, Automatic vs. Manual Management, Best Practices & Exemptions, CLI Commands, Composite Indexes, Config files (+7 more)

### Community 92 - "Advanced Validation for Business Logic"
Cohesion: 0.13
Nodes (14): 3. Strict Path and Relationship Scoping, 4. Secure Counter Updates, 5. **CRITICAL** Ensure Application Validity, Advanced Validation for Business Logic, Critical Constraints, Critical Directives for Secure Generation, **CRITICAL** RBAC Guidelines, Firestore Security Rules Creation (+6 more)

### Community 93 - "⛔️ CRITICAL RULES & ENVIRONMENT CHECKS"
Cohesion: 0.13
Nodes (14): 1. The Anti-Ruby Mandate, 2. Modern Xcode Folder Synchronization, 3. Allowed Scripting Languages, 4. Toolchain Verification, 5. Mandatory Linker Flags for Static Frameworks (Firebase), **CRITICAL: Always Use Latest SDK Version**, ⛔️ CRITICAL RULES & ENVIRONMENT CHECKS, Empty Directory Workflow (+6 more)

### Community 94 - "Step-by-Step Migration Execution"
Cohesion: 0.14
Nodes (13): 1. Declarative IAM & APIs (Zero-Local-Overhead), 2. Global Parameter Access Restriction, 3. V2 Concurrency & Cost Parity, Core Rules & Constraints, Extension to Functions Codebase & npm Package Migration, Overview, Step 1: Inventory Extension Resources, Step 2: Configure `package.json` (+5 more)

### Community 95 - "Web SDK"
Cohesion: 0.14
Nodes (14): Best Practices for Agents, Calling Operations, Client-Side Caching, Data Type Mapping Reference, Initialization, Installation, Resilient Enum Handling, Subscriptions (Realtime) (+6 more)

### Community 96 - "Firebase SQL Connect"
Cohesion: 0.14
Nodes (14): 1. Define Data Model (`schema/schema.gql`), 2. Define Authorized Operations (`connector/queries.gql`, `connector/mutations.gql`), 3. Use type-safe SDK in your apps, Deployment & CLI, Development Workflow, Examples, Feature Capability Map, Firebase SQL Connect (+6 more)

### Community 97 - "Writing Data"
Cohesion: 0.14
Nodes (13): Add a Document with Auto-ID, Get a Single Document, Get Multiple Documents, Order and Limit, Pipeline Queries, Python SDK Usage, Queries, Reading Data (+5 more)

### Community 98 - "Native SQL Examples"
Cohesion: 0.10
Nodes (20): Advanced aggregation with RANK, Advanced CTE with upserts (atomic get-or-create), Basic SELECT with field aliasing, Basic UPDATE, Blog with Permissions, E-Commerce Store, Examples, Movie Review App (+12 more)

### Community 99 - "Cloud Functions Integration Reference"
Cohesion: 0.15
Nodes (12): Accessing User Authentication Context, Auth Context Mappings, Auth Extraction Example, Cloud Functions Integration Reference, Comprehensive Example, Core Trigger Configuration, 🚨 Critical Infinite Loop Constraint, Event Filtering (+4 more)

### Community 100 - "Realtime Reference"
Cohesion: 0.15
Nodes (12): CEL Bindings in Conditions, Combining Multiple @refresh Directives, Common Patterns, Contents, Explicit Mutation Signals (`onMutationExecuted`), Implicit Entity Refresh signals, `mutation` — The Triggering Event, Realtime Reference (+4 more)

### Community 101 - "iOS SDK"
Cohesion: 0.15
Nodes (12): Basic Query, Best Practices for Agents, Calling Operations, Client-Side Caching, Data Type Mapping Reference, Dependencies (Package.swift or SPM), Initialization, iOS SDK (+4 more)

### Community 102 - "Templates"
Cohesion: 0.15
Nodes (12): Basic CRUD Schema, Client Subscribe (Web), connector.yaml Template, dataconnect.yaml Template, Event-Driven Refresh, Firebase Init Commands, Many-to-Many Relationship, Realtime Query Templates (+4 more)

### Community 103 - "combobox.tsx"
Cohesion: 0.05
Nodes (15): @base-ui/react, ref_base_ui_react_dialog, cmdk, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+7 more)

### Community 104 - "Flutter & Firebase Setup Guide"
Cohesion: 0.17
Nodes (11): 1. Re-running `flutterfire configure` Upon Renaming, 2. Platform-Specific Build Requirements, 3. Web CORS Best Practices, 4. Elaborating on `WidgetsFlutterBinding.ensureInitialized()`, Flutter & Firebase Setup Guide, Prerequisites, Step 1: Create a Flutter Project, Step 2: Configure Firebase (+3 more)

### Community 105 - "Flutter SDK"
Cohesion: 0.17
Nodes (12): Basic Query, Best Practices for Agents, Calling Operations, Client-Side Caching, Data Type Mapping Reference, Flutter SDK, Imports, Initialization (+4 more)

### Community 106 - "Firebase AI Logic Basics"
Cohesion: 0.18
Nodes (11): Advanced Features, Firebase AI Logic Basics, Initialization Code References, Installation, On-Device AI (Hybrid), Overview, Prerequisites, References (+3 more)

### Community 107 - "🛠️ Firebase Android Setup Guide"
Cohesion: 0.18
Nodes (10): 0. Create an Android application, 1. Create a Firebase Project, 2. Register Your Android App, 3. Download `google-services.json`, Before running these commands, ensure you are authenticated: `npx -y firebase-tools@latest login` (or `npx -y firebase-tools@latest login --no-localhost` on remote servers), Fetch the configuration file using the App ID (which is printed in the output of the previous command): `npx -y firebase-tools@latest apps:sdkconfig ANDROID <APP_ID> --project <PROJECT_ID>` *Example output extraction to file:* ` # (Output must be saved as app/google-services.json)`, 🛠️ Firebase Android Setup Guide, Manual Verification (+2 more)

### Community 108 - "firebase-data-connect/SKILL.md"
Cohesion: 0.18
Nodes (6): 2. Production: Admin SDK Bulk Operations, 3. Production: Bulk Operations via raw SQL, 🚨 Critical SQL Operations Constraint, Data Seeding & Bulk Operations Reference, SDK Bulk APIs Features:, SDK Bulk Operations Example

### Community 109 - "Android SDK Usage (Enterprise Native Mode)"
Cohesion: 0.18
Nodes (10): 1. Initialization, 2. Decision Framework: Mandatory Pipeline Architecture, 3. Pipeline Examples, 4. Real-Time Listener & Document Operations, Add Dependencies, Android SDK Usage (Enterprise Native Mode), Full-Text Search, Initialize Firestore (+2 more)

### Community 110 - "⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️"
Cohesion: 0.18
Nodes (10): 1. Import and Initialize, 2. Type-Safe Data Models (Codable), 3. Writing Data (Modern Concurrency & Codable), 4. Reading Data (Modern Concurrency & Codable), 5. Realtime Listeners in SwiftUI (Lifecycle Best Practices), ⛔️ CRITICAL RULE: NO FirebaseFirestoreSwift ⛔️, ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️, Firebase Firestore iOS Setup Guide (+2 more)

### Community 111 - "main.swift"
Cohesion: 0.33
Nodes (10): addCrashlyticsRunScriptBuildPhase(), hasCrashlyticsRunScriptBuildPhase(), isUserScriptSandboxingEnabled(), main(), setDwarfWithDsymDebugInformationFormat(), Bool, Foundation, PathKit (+2 more)

### Community 112 - "AppMessages"
Cohesion: 0.10
Nodes (17): Architecture, Configuration, Data access and security, Structure, Subagents and agent automation, App-Owned Production Literals, Authentication Error Normalization, Boundary with Firebase UI Translations (+9 more)

### Community 116 - "CEL Expressions"
Cohesion: 0.40
Nodes (5): auth.token Fields, Available Bindings, CEL Expressions, Expression Examples, Using eq_expr in Filters

### Community 117 - "Admin Node SDK"
Cohesion: 0.20
Nodes (9): 1. Impersonating an Unauthenticated User, 2. Impersonating a Specific User (Cloud Functions), 3. Impersonating a Specific User (Plain HTTP), 4. Running with Unrestricted Access, Admin Node SDK, Best Practices for Agents, Configuration in `connector.yaml`, Generation (+1 more)

### Community 118 - "Android SDK"
Cohesion: 0.20
Nodes (10): Android SDK, Basic Query, Best Practices for Agents, Calling Operations, Client-Side Caching, Data Type Mapping Reference, Dependencies (build.gradle.kts), Initialization (+2 more)

### Community 119 - "Cloud Firestore on Android (Kotlin)"
Cohesion: 0.20
Nodes (9): 1. Add Dependencies, 2. Initialize Firestore, 3. Add Data, 4. Read Data, 5. Update Data, 6. Delete Data, Cloud Firestore on Android (Kotlin), Enable Firestore via CLI (+1 more)

### Community 120 - "Firebase Functions V1 vs V2 Signature Mapping"
Cohesion: 0.22
Nodes (8): Auth (Blocking), Cloud Firestore, Cloud Pub/Sub, Cloud Storage, Cloud Tasks, Firebase Functions V1 vs V2 Signature Mapping, HTTP / Callables, Realtime Database

### Community 121 - "firebase-auth-basics/SKILL.md"
Cohesion: 0.22
Nodes (5): Core Concepts, Identity Providers, Prerequisites, Tokens, Users

### Community 122 - "Firebase Authentication on Android (Kotlin)"
Cohesion: 0.22
Nodes (9): 1, Enable Authentication via CLI, 2. Add Dependencies, 3. Initialize FirebaseAuth, 4. Check Current Auth State, 5. Sign Up New Users (Email/Password), 6. Sign In Existing Users (Email/Password), 7. Sign Out, Firebase Authentication on Android (Kotlin) (+1 more)

### Community 123 - "⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️"
Cohesion: 0.22
Nodes (8): 1. Import and Initialize, 2. Authentication State, 3. Email and Password Authentication (Modern Concurrency), 4. Sign Out, ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️, Firebase Auth iOS Setup Guide, Sign In, Sign Up

### Community 124 - "firebase-basics/references/ios_setup.md"
Cohesion: 0.22
Nodes (8): 1. Create a Firebase Project and App (Automated), 2. Installation (Automated via Swift Package Manager CLI), 3. Initialization, AppDelegate (Traditional / UIKit), ⛔️ CRITICAL RULE: INITIALIZATION ORDER ⛔️, ⛔️ CRITICAL RULE: STATE MANAGEMENT (OBSERVATION VS COMBINE) ⛔️, Firebase iOS Setup Guide, SwiftUI (Modern - SAFE PATTERN)

### Community 125 - "Document Data Model"
Cohesion: 0.22
Nodes (8): Collection Group Support, Collections, Document Data Model, Documents, Examples, Firestore Data Model Reference, Subcollections, Use Cases

### Community 126 - "Firestore Indexes Reference"
Cohesion: 0.22
Nodes (9): CLI Commands, Config files, Firestore Indexes Reference, Index Density, Index Ordering, Index Structure, Management, Query Support Examples (+1 more)

### Community 127 - "Web SDK Usage (Enterprise Native Mode)"
Cohesion: 0.22
Nodes (8): 1. Initialization, 2. Decision Framework: Pipelines vs. Standard Queries, 3. Pipeline Examples, 4. Real-Time Listener & Document Operations, Full-Text Search, Relational Joins Pattern, Rules & Accountability, Web SDK Usage (Enterprise Native Mode)

### Community 128 - "Firebase AI Logic iOS Setup Guide"
Cohesion: 0.25
Nodes (7): 1. Import and Initialize, 2. SwiftUI Integration (Best Practices), 3. Safety Settings, Advanced Features, Chat Session (Multi-turn), Firebase AI Logic iOS Setup Guide, Function Calling (Tools)

### Community 129 - "Firebase AI Logic on Android (Kotlin)"
Cohesion: 0.25
Nodes (8): 0. Enable Firebase AI Logic via CLI, 1. Add Dependencies, 2. Initialize and Generate Content, 3. Multimodal Input (Text and Images), 4. Chat Session (Multi-turn), 5. Streaming Responses, Firebase AI Logic on Android (Kotlin), Jetpack Compose (Modern)

### Community 130 - "Basic Checks"
Cohesion: 0.25
Nodes (7): Authentication in Security Rules, Basic Checks, Check if user is signed in, Check if user owns the data, Check if user owns the document (field-based), Example: Email Verification Check, Token Properties

### Community 131 - "Alternative: Manual MCP Configuration (Project Scope)"
Cohesion: 0.25
Nodes (7): 1. Configure and Verify Firebase MCP Server, 1. Install and Verify Firebase Extension, 2. Restart and Verify Connection, 2. Restart and Verify Connection, Alternative: Manual MCP Configuration (Project Scope), Gemini CLI Setup, Recommended: Installing Extensions

### Community 132 - "Context7"
Cohesion: 0.18
Nodes (10): Context7, Examples, FastAPI dependency injection, Next.js routing documentation, Overview, React hooks documentation, Step 1: Search for the Library, Step 2: Fetch Documentation (+2 more)

### Community 133 - "Manual Initialization"
Cohesion: 0.25
Nodes (8): 1. Create a Firestore Enterprise Database, 2. Create `firebase.json`, 2. Create `firestore.rules`, 3. Create `firestore.indexes.json`, Deploy rules and indexes, Local Emulation, Manual Initialization, Provisioning Firestore Enterprise Native Mode

### Community 134 - "Authorization Patterns"
Cohesion: 0.40
Nodes (5): Authorization Patterns, Public Data with Filters, Role-Based Access, Tiered Access (Pro Content), User-Owned Resources

### Community 135 - "Flutter Setup for Firebase AI Logic"
Cohesion: 0.29
Nodes (6): Chat Session, Flutter Setup for Firebase AI Logic, Initialization, Installation, Text Generation, Usage

### Community 136 - "Firebase AI Logic Basics"
Cohesion: 0.29
Nodes (7): Advanced Features, Chat Session (Multi-turn), Core Capabilities, Firebase AI Logic Basics, Initialization Pattern, Multimodal (Text + Images/Audio/Video/PDF input), Streaming Responses

### Community 137 - "Core Capabilities"
Cohesion: 0.29
Nodes (7): Chat Session (Multi-turn), Core Capabilities, Generate Images with Nano Banana, Multimodal (Text + Images/Audio/Video/PDF input), Search Grounding with the built in googleSearch tool, Streaming Responses, Text-Only Generation

### Community 138 - "Firebase Auth & Google Sign-In for Flutter"
Cohesion: 0.29
Nodes (7): 1. `google_sign_in` 7.2.0 API Changes, 2. Initialization & Web Hang/Crash Pitfalls, 3. Web Logout Crashes, 4. Prototyping Workaround: Bypassing Firestore Composite Indices, 5. Robust `AuthService` Boilerplate, 6. Troubleshooting `auth/unauthorized-domain` on Flutter Web, Firebase Auth & Google Sign-In for Flutter

### Community 139 - "Cloud Firestore in Flutter"
Cohesion: 0.29
Nodes (6): 1. Setup, 2. Best Practices: Type-Safe Models, 3. The Service Layer, 4. Listening to Streams in the UI (`StreamBuilder`), Cloud Firestore in Flutter, Initialization & References

### Community 140 - "Cloud Firestore in Flutter"
Cohesion: 0.29
Nodes (6): 1. Setup, 2. Best Practices: Type-Safe Models, 3. The Service Layer, 4. Listening to Streams in the UI (`StreamBuilder`), Cloud Firestore in Flutter, Initialization & References

### Community 141 - "Manual Initialization"
Cohesion: 0.29
Nodes (7): 1. Create `firebase.json`, 2. Create `firestore.rules`, 3. Create `firestore.indexes.json`, Deploy database, rules and indexes, Local Emulation, Manual Initialization, Provisioning Cloud Firestore

### Community 142 - "1. Instance Selection and Edition Detection"
Cohesion: 0.29
Nodes (7): 1. Instance Selection and Edition Detection, 2. Specialized Guides, A. Instance Found, B. No Instance Found (or New Requested), Cloud Firestore Database and Operations, Enterprise Edition / Native Mode (`references/enterprise/`), Standard Edition (`references/standard/`)

### Community 143 - "Assessment: Security Validator (Red Team Edition)"
Cohesion: 0.29
Nodes (6): Admin Bootstrapping & Privileges:, Assessment: Security Validator (Red Team Edition), Mandatory Audit Checklist:, Overview, Scoring Criteria, Scoring Criteria (1-5):

### Community 144 - "App Check Debug Tokens for Local Development & CI/CD"
Cohesion: 0.33
Nodes (6): App Check, App Check Debug Tokens for Local Development & CI/CD, CI/CD Pipelines (Pre-Provisioned), Local Development (Auto-Generated), Remote Config, Security & Production

### Community 145 - "Workflow"
Cohesion: 0.33
Nodes (6): 1. Provisioning, 2. Client Setup & Usage, 3. Security Rules, Option 1. Enabling Authentication via CLI, Option 2. Enabling Authentication in Console, Workflow

### Community 146 - "Firebase Local Environment Setup"
Cohesion: 0.33
Nodes (5): 1. Verify Node.js, 2. Verify Firebase CLI, 3. Verify Firebase Authentication, 4. Install Agent Skills and MCP Server, Firebase Local Environment Setup

### Community 147 - "Recommended: Global Setup"
Cohesion: 0.33
Nodes (5): 1. Install and Verify Firebase Skills, 2. Configure and Verify Firebase MCP Server, 3. Restart and Verify Connection, GitHub Copilot Setup, Recommended: Global Setup

### Community 148 - "Recommended: Global Setup"
Cohesion: 0.33
Nodes (5): 1. Install and Verify Firebase Skills, 2. Configure and Verify Firebase MCP Server, 3. Restart and Verify Connection, Other Agents Setup, Recommended: Global Setup

### Community 149 - "Firebase Web Setup Guide"
Cohesion: 0.33
Nodes (5): 1. Create a Firebase Project and App, 2. Installation, 3. Initialization, 4. Using Services, Firebase Web Setup Guide

### Community 150 - "1. Local Prototyping: Data Seeding"
Cohesion: 0.33
Nodes (6): 1. Local Prototyping: Data Seeding, Resetting Seed Data, ⚠️ Seeding Directives Rule, Seeding Independent Tables (FK Order), Seeding Related Tables (Nested Relational Inserts), The `seed_data.gql` Workflow

### Community 151 - "Queries"
Cohesion: 0.25
Nodes (8): Aliases, Basic Query, Expression Operators (Compare with Server Values), Filter Operators, List with Filtering, Logical Operators, Queries, Relational Queries

### Community 152 - "Antigravity Setup"
Cohesion: 0.40
Nodes (4): 1. Install and Verify Firebase Skills, 2. Configure and Verify Firebase MCP Server, 3. Restart and Verify Connection, Antigravity Setup

### Community 153 - "Recommended Method: Using Plugins"
Cohesion: 0.40
Nodes (4): 1. Install and Verify Plugins, 2. Restart and Verify Connection, Claude Code Setup, Recommended Method: Using Plugins

### Community 154 - "Cursor Setup"
Cohesion: 0.40
Nodes (4): 1. Install and Verify Firebase Skills, 2. Configure and Verify Firebase MCP Server, 3. Restart and Verify Connection, Cursor Setup

### Community 157 - "Android Studio Setup"
Cohesion: 0.50
Nodes (3): Android Studio Setup, MCP Setup, Skills Installation

### Community 159 - "dictionaries.ts"
Cohesion: 0.22
Nodes (14): ref_next_image, generateMetadata(), LocaleLayout(), AuthenticatedHome(), Home(), SpaceI18nWrapper(), dictionaryLoaders, getDictionary() (+6 more)

### Community 162 - "Detailed Findings by Worktree Group"
Cohesion: 0.20
Nodes (9): Detailed Findings by Worktree Group, Executive Summary, Git Worktrees Comprehensive Audit & Porting Roadmap, Group 1: Scaffolding, Governance & Early Parity (`old`, `old-1`, `old-2`), Group 2: Advanced Workspace Architecture & Backend Services (`old-3`, `old-4`, `old-5`), Group 3: Modern Editor Subsystems & Flashcard Application (`old-6`, `old-7`, `old-8`), Immediate Cleanup Action Plan, Strategic Porting Roadmap (+1 more)

### Community 164 - "seed-exams.ts"
Cohesion: 0.15
Nodes (10): ref_firebase_admin_app, ref_firebase_admin_auth, ref_firebase_admin_firestore, ref_node_fs, ref_node_path, db, FixtureData, auth (+2 more)

### Community 165 - "System Prompt"
Cohesion: 0.40
Nodes (4): Review Methodology & Verification Checklist, Review Output Format, System Prompt, When to Prefer This Agent (Orchestration Guidance)

### Community 166 - "lucide-react"
Cohesion: 0.10
Nodes (17): ref_base_ui_react_button, @ladle/react, lucide-react, ref_shadcn_react_message_scroller, GoogleSignInButtonProps, DndQuestion(), HotspotQuestion(), HotspotQuestionProps (+9 more)

### Community 167 - "react"
Cohesion: 0.15
Nodes (17): ref_base_ui_react_input, @firebase-oss/ui-core, @firebase-oss/ui-react, ref_hookform_resolvers_standard_schema, react, react-hook-form, Policies(), SignUpAuthScreenProps (+9 more)

### Community 168 - "System Prompt"
Cohesion: 0.40
Nodes (4): Output & Reporting Format, System Prompt, Testing Standards & Conventions, When to Prefer This Agent (Orchestration Guidance)

### Community 169 - "System Prompt"
Cohesion: 0.50
Nodes (3): Core Capabilities & Associated Skills, Engineering Guidelines & Safety Rules, System Prompt

### Community 170 - "System Prompt"
Cohesion: 0.33
Nodes (5): Core Capabilities & Associated Skills, Preferred Investigation Hierarchy & Tool Preferences, Research Guidelines & Best Practices, System Prompt, When to Prefer This Agent (Orchestration Guidance)

### Community 171 - "System Prompt"
Cohesion: 0.40
Nodes (4): Component Architecture & Styling Rules, System Prompt, Verification Checklist, When to Prefer This Agent (Orchestration Guidance)

### Community 174 - "Q: Explain the data folder using the Next.js data security guide and this repository architecture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Explain the data folder using the Next.js data security guide and this repository architecture, Source Nodes

### Community 176 - "exam-actions.ts"
Cohesion: 0.14
Nodes (23): ExamPractice(), PracticeLabels, saveQuestionNote(), recordQuestionAttempt(), toggleQuestionBookmark(), updateStudyGoals(), getActionUserId(), recordAttemptAction() (+15 more)

### Community 178 - "Internationalization (Next.js App Router)"
Cohesion: 0.33
Nodes (5): Code Language Rule, Internationalization (Next.js App Router), Code Language Rule, Internationalization (Next.js App Router), generateStaticParams()

### Community 179 - "Instruction Scoping Guidelines"
Cohesion: 0.40
Nodes (4): 1. When to put in `AGENTS.md` (Root / Universal), 2. When to create a Rule (`.agents/rules/<name>.md`), 3. When to create a Skill (`.agents/skills/<name>/SKILL.md`), Instruction Scoping Guidelines

### Community 183 - "Knowledge Retention & Persistence Rule"
Cohesion: 0.40
Nodes (4): Canonical Locations for Reuse, Core Directive, Knowledge Retention & Persistence Rule, Quality & Traceability Checklist

## Knowledge Gaps
- **944 isolated node(s):** `PackageDescription`, `Foundation`, `PathKit`, `$schema`, `enabled` (+939 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1313 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Explain the data folder using the Next.js data security guide and this repository architecture" -> `private`, `actions`, `clientKind`, `components.json`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DELETE()` connect `auth.ts` to `Native SQL Operations`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `Mutation Fields (DML)` connect `Native SQL Operations` to `auth.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `useI18n()` (e.g. with `Boundary with Firebase UI Translations` and `Internationalization (i18n)`) actually correct?**
  _`useI18n()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PackageDescription`, `Foundation`, `PathKit` to the rest of the system?**
  _944 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05442176870748299 - nodes in this community are weakly interconnected._
- **Should `context-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `menubar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06290471785383904 - nodes in this community are weakly interconnected._