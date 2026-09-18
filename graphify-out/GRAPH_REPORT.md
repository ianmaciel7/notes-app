# Graph Report - notes-app  (2026-09-17)

## Corpus Check
- 228 files · ~91,853 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .resolved 1, .rules 1)

## Summary
- 1857 nodes · 2325 edges · 161 communities (125 shown, 36 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b0f08dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- package.json
- context-menu.tsx
- navigation-menu.tsx
- menubar.tsx
- biome.json
- dialog.tsx
- components.json
- question.tsx
- compilerOptions
- dependencies
- getCurrentUser
- drawer.tsx
- useI18n
- alert-dialog.tsx
- chart.tsx
- cn
- button-group.tsx
- toggle-group.tsx
- combobox.tsx
- App Hosting CLI Commands
- input-group.tsx
- attachment.tsx
- What You Must Do When Invoked
- client.ts
- Tool Reference
- item.tsx
- layout.tsx
- post-checkout
- skill.md
- post-commit
- button.tsx
- graphify reference: extra exports and benchmark
- Deterministic Rules for Migration
- Task 5 Report
- shadcn/ui Rules
- graphify.md
- collapsible.tsx
- types.ts
- devDependencies
- react
- graphify reference: query, path, explain
- tooling.md
- postcss.config.mjs
- ref_base_ui_react_direction_provider
- auth-gate.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- auth.ts
- This is NOT the Next.js you know
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- Firebase Remote Config iOS Setup Guide
- Mutations
- table.tsx
- functions/package.json
- class-variance-authority
- Key Attributes
- Configuration Reference
- question.test.tsx
- Security Reference
- bubble.tsx
- ref_proxy
- button.stories.tsx
- ref_dictionaries
- Firebase Crashlytics iOS Setup Guide
- progress.tsx
- message-scroller.tsx
- Task 2 Report — Locale Routing and Server Dictionaries
- Q: Explain the data folder using the Next.js data security guide and this repository architecture
- Schema Reference
- radio-group.tsx
- firebase-basics/SKILL.md
- index.js
- 1. Vector Similarity Search (Semantic)
- lucide-react
- vitest.config.ts
- ref_testing_library_jest_dom_vitest
- Firestore Web SDK Usage Guide
- proxy.ts
- Firebase Authentication Web SDK
- i18n Message Inventory
- ref_routing
- hover-card.tsx
- Code Language Rule
- ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️
- Firestore Indexes Reference
- src_lib_i18n_index_usei18n
- Advanced Validation for Business Logic
- ⛔️ CRITICAL RULES & ENVIRONMENT CHECKS
- Step-by-Step Migration Execution
- Web SDK
- Firebase SQL Connect
- Writing Data
- Examples
- Cloud Functions Integration Reference
- Realtime Reference
- iOS SDK
- Templates
- scripts
- Flutter & Firebase Setup Guide
- Flutter SDK
- Firebase AI Logic Basics
- 🛠️ Firebase Android Setup Guide
- firebase-data-connect/SKILL.md
- Android SDK Usage (Enterprise Native Mode)
- ⛔️ CRITICAL RULE: NO INLINE INITIALIZATION ⛔️
- main.swift
- Architecture
- select.tsx
- command.tsx
- sheet.tsx
- Native SQL Operations
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
- Native SQL Examples
- Manual Initialization
- empty.tsx
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
- accordion.tsx
- Antigravity Setup
- Recommended Method: Using Plugins
- Cursor Setup
- resizable.tsx
- Android Studio Setup
- next
- Package.swift

## God Nodes (most connected - your core abstractions)
1. `cn` - 61 edges
2. `react` - 55 edges
3. `useI18n()` - 33 edges
4. `lucide-react` - 25 edges
5. `Button()` - 21 edges
6. `class-variance-authority` - 17 edges
7. `compilerOptions` - 16 edges
8. `Firebase Authentication Web SDK` - 15 edges
9. `scripts` - 13 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Scope` --references--> `AppMessages`  [INFERRED]
  docs/i18n-message-inventory.md → src/lib/i18n/types.ts
- `Authentication flow` --references--> `getCurrentUser()`  [INFERRED]
  docs/FIREBASE_AUTHENTICATION.md → src/data/auth.ts
- `Changes` --references--> `I18nProvider()`  [INFERRED]
  .superpowers/sdd/2026-09-17-extract-user-facing-messages-i18n/task-3-report.md → src/lib/i18n/provider.tsx
- `Concerns` --references--> `I18nProvider()`  [INFERRED]
  .superpowers/sdd/2026-09-17-extract-user-facing-messages-i18n/task-4-report.md → src/lib/i18n/provider.tsx
- `Changes` --references--> `useI18n()`  [INFERRED]
  .superpowers/sdd/2026-09-17-extract-user-facing-messages-i18n/task-3-report.md → src/lib/i18n/provider.tsx

## Import Cycles
- None detected.

## Communities (161 total, 36 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.06
Nodes (17): ref_base_ui_react_input, ref_base_ui_react_tooltip, Input(), Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants (+9 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (23): name, packageManager, private, version, babel-plugin-react-compiler, @biomejs/biome, concurrently, date-fns (+15 more)

### Community 3 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): ref_base_ui_react_navigation_menu, NavigationMenuTrigger(), navigationMenuTriggerStyle

### Community 4 - "menubar.tsx"
Cohesion: 0.08
Nodes (15): ref_base_ui_react_menu, ref_base_ui_react_menubar, DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+7 more)

### Community 5 - "biome.json"
Cohesion: 0.07
Nodes (26): source, assist, actions, css, parser, next, react, files (+18 more)

### Community 6 - "dialog.tsx"
Cohesion: 0.17
Nodes (7): ref_base_ui_react_dialog, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle()

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 8 - "question.tsx"
Cohesion: 0.19
Nodes (13): ref_shadcn_react_questionnaire, ExamQuestionnaireProps, ExamQuestionOption, ExamQuestionType, Questionnaire(), QuestionnaireActions(), QuestionnaireChoice(), QuestionnaireChoices() (+5 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cmdk, cn, date-fns, embla-carousel-react, firebase (+17 more)

### Community 11 - "getCurrentUser"
Cohesion: 0.14
Nodes (16): Authentication flow, Authorization rule, Cache Components, Firebase Authentication, Local development, Production checklist, AuthenticatedHome(), AuthGate() (+8 more)

### Community 12 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): ref_base_ui_react_drawer, DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 13 - "useI18n"
Cohesion: 0.05
Nodes (27): ref_base_ui_react_toast, embla-carousel-react, ExamQuestionnaire(), Breadcrumb(), BreadcrumbEllipsis(), Carousel(), CarouselApi, CarouselContent() (+19 more)

### Community 15 - "chart.tsx"
Cohesion: 0.19
Nodes (11): recharts, ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 16 - "cn"
Cohesion: 0.09
Nodes (4): ref_base_ui_react_scroll_area, ref_base_ui_react_slider, ref_base_ui_react_switch, cn

### Community 17 - "button-group.tsx"
Cohesion: 0.32
Nodes (4): ref_base_ui_react_separator, ButtonGroup(), buttonGroupVariants, Separator()

### Community 18 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (6): ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 20 - "App Hosting CLI Commands"
Cohesion: 0.06
Nodes (30): App Hosting CLI Commands, Automated deployment via GitHub (CI/CD), Backend Management, Initialization, `npx -y firebase-tools@latest apphosting:backends:create`, `npx -y firebase-tools@latest apphosting:backends:delete <backend-id>`, `npx -y firebase-tools@latest apphosting:backends:get <backend-id>`, `npx -y firebase-tools@latest apphosting:backends:list` (+22 more)

### Community 21 - "input-group.tsx"
Cohesion: 0.24
Nodes (7): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), Textarea()

### Community 22 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 24 - "client.ts"
Cohesion: 0.22
Nodes (8): ref_firebase_app, ref_firebase_firestore, ui, auth, db, firebaseApp, firebaseConfig, functions

### Community 25 - "Tool Reference"
Cohesion: 0.14
Nodes (12): Call examples, Item fields, MCP server, Pagination, Response, Search behavior, Tool Reference, Gotchas (+4 more)

### Community 26 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 27 - "layout.tsx"
Cohesion: 0.19
Nodes (13): ref_next_font_google, ref_next_navigation, src_app_globals, dictionaryLoaders, src_app_lang_dictionaries_en, getDictionary(), isSupportedLocale(), geistMono (+5 more)

### Community 31 - "button.tsx"
Cohesion: 0.23
Nodes (9): ref_base_ui_react_button, react-day-picker, Button(), buttonVariants, Calendar(), QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip() (+1 more)

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

### Community 38 - "types.ts"
Cohesion: 0.24
Nodes (11): messages, getMessage(), I18nContext, I18nContextValue, I18nProvider(), I18nProviderProps, AppMessages, Locale (+3 more)

### Community 39 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, babel-plugin-react-compiler, @biomejs/biome, concurrently, jsdom, @ladle/react, tailwindcss, @tailwindcss/postcss (+8 more)

### Community 40 - "react"
Cohesion: 0.06
Nodes (41): ref_firebase_auth, @firebase-oss/ui-core, @firebase-oss/ui-react, ref_hookform_resolvers_standard_schema, input-otp, ref_next_image, react, react-hook-form (+33 more)

### Community 41 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 45 - "auth-gate.tsx"
Cohesion: 0.36
Nodes (3): vitest, syncSession(), localePath()

### Community 46 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 47 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 48 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 49 - "auth.ts"
Cohesion: 0.25
Nodes (10): ref_firebase_admin_app, ref_firebase_admin_auth, ref_next_headers, ref_server_only, POST(), CurrentUser, SESSION_COOKIE, sessionCookieOptions (+2 more)

### Community 50 - "This is NOT the Next.js you know"
Cohesion: 0.50
Nodes (3): Documentation and agent resources, Project context, This is NOT the Next.js you know

### Community 55 - "Firebase Remote Config iOS Setup Guide"
Cohesion: 0.07
Nodes (25): Add Dependencies to Gradle Build, App-level `build.gradle.kts` (`<project>/<app-module>/build.gradle.kts`), Fetch and Activate Values, Firebase Remote Config Android Setup Guide, Follow up Steps, Project and App Setup, Project-level `build.gradle.kts` (`<project>/build.gradle.kts`), Set In-App Defaults (+17 more)

### Community 56 - "Mutations"
Cohesion: 0.07
Nodes (26): Aliases, Basic Query, Contents, Create, Create with Server Values, Delete, Embedded Queries, Expression Operators (Compare with Server Values) (+18 more)

### Community 58 - "functions/package.json"
Cohesion: 0.25
Nodes (7): dependencies, firebase-functions, engines, node, name, private, firebase-functions

### Community 59 - "class-variance-authority"
Cohesion: 0.16
Nodes (6): ref_base_ui_react_tabs, class-variance-authority, Alert(), alertVariants, TabsList(), tabsListVariants

### Community 60 - "Key Attributes"
Cohesion: 0.08
Nodes (23): `cleanUrls` (Optional), Full Example, `headers` (Optional), Hosting Configuration (`firebase.json`), `ignore` (Optional), Key Attributes, `public` (Required), `redirects` (Optional) (+15 more)

### Community 61 - "Configuration Reference"
Cohesion: 0.08
Nodes (24): Breaking Changes, CI/CD Integration, Cloud SQL Configuration, Configuration Reference, Connect from SDK, connector.yaml, Contents, dataconnect.yaml (+16 more)

### Community 62 - "question.test.tsx"
Cohesion: 0.29
Nodes (5): @testing-library/react, @testing-library/user-event, src_app_lang_dictionaries_pt_br, ExamQuestion, questions

### Community 63 - "Security Reference"
Cohesion: 0.08
Nodes (24): Access Levels, Anti-Patterns, @auth Directive, auth.token Fields, Authorization Data Lookup, Authorization Patterns, Available Bindings, CEL Expressions (+16 more)

### Community 64 - "bubble.tsx"
Cohesion: 0.16
Nodes (10): ref_base_ui_react_merge_props, ref_base_ui_react_use_render, Badge(), badgeVariants, Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants (+2 more)

### Community 67 - "button.stories.tsx"
Cohesion: 0.29
Nodes (5): @ladle/react, ButtonStoryProps, iconSizes, Sizes, Variants

### Community 69 - "Firebase Crashlytics iOS Setup Guide"
Cohesion: 0.08
Nodes (21): Add Dependencies to Gradle Build, App-level `build.gradle.kts` (`<project>/<app-module>/build.gradle.kts`), Firebase Crashlytics Android Setup Guide, Follow up Steps, Optional: Add custom debugging information, Optional: Install the NDK SDK to capture native crashes, Project and App Setup, Project-level `build.gradle.kts` (`<project>/build.gradle.kts`) (+13 more)

### Community 72 - "Task 2 Report — Locale Routing and Server Dictionaries"
Cohesion: 0.12
Nodes (14): next-themes, FirebaseProvider(), ThemeProvider(), Files changed for Task 2, Notes, Scope completed, Task 2 Report — Locale Routing and Server Dictionaries, Validation (+6 more)

### Community 73 - "Q: Explain the data folder using the Next.js data security guide and this repository architecture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Explain the data folder using the Next.js data security guide and this repository architecture, Source Nodes

### Community 74 - "Schema Reference"
Cohesion: 0.10
Nodes (20): @col, Contents, Core Directives, Customizing Tables, Data Types, @default, Defining Types, Enumerations (+12 more)

### Community 76 - "firebase-basics/SKILL.md"
Cohesion: 0.11
Nodes (11): Exploring Commands, Initialization, Refresh Android Studio Local Environment, Refresh Antigravity Local Environment, Refresh Claude Code Local Environment, Refresh Gemini CLI Local Environment, Refresh Other Local Environment, Common Issues (+3 more)

### Community 78 - "1. Vector Similarity Search (Semantic)"
Cohesion: 0.11
Nodes (17): 1. Query Formats (`queryFormat` argument), 1. Vector Similarity Search (Semantic), 2. Full-Text Search (Lexical), 2. Relevance Thresholding (`relevanceThreshold` and `_metadata.relevance`), A. Auto-Embedding Search, A. Generation on Insert, Automatic Embedding Generation (`_embed` server value), B. Custom Vector Search (+9 more)

### Community 79 - "lucide-react"
Cohesion: 0.22
Nodes (3): ref_base_ui_react_checkbox, lucide-react, NativeSelectProps

### Community 82 - "Firestore Web SDK Usage Guide"
Cohesion: 0.12
Nodes (16): Add a Document with Auto-ID (`addDoc`), Firestore Web SDK Usage Guide, Get a Single Document (`getDoc`), Get Multiple Documents (`getDocs`), Handle Changes (Added/Modified/Removed), Initialization, Listen to a Document/Query (`onSnapshot`), Order and Limit (+8 more)

### Community 83 - "proxy.ts"
Cohesion: 0.36
Nodes (7): ref_next_experimental_testing_server, ref_next_server, config, isSupportedLocale(), localeCookieOptions, negotiateLocale(), proxy()

### Community 84 - "Firebase Authentication Web SDK"
Cohesion: 0.13
Nodes (15): Connect to Emulator, Email Link Authentication, Firebase Authentication Web SDK, Initialization, Observe Auth State, Sign In Anonymously, Sign In with Apple (Popup), Sign In with Facebook (Popup) (+7 more)

### Community 85 - "i18n Message Inventory"
Cohesion: 0.29
Nodes (6): App-owned production literals, Firebase UI ownership and exception handling, i18n Message Inventory, New app-owned error coverage, Scope, Shared-primitive accessibility text

### Community 88 - "Code Language Rule"
Cohesion: 0.50
Nodes (3): Code Language Rule, Internationalization (Next.js App Router), generateStaticParams()

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

### Community 98 - "Examples"
Cohesion: 0.15
Nodes (12): Blog with Permissions, E-Commerce Store, Examples, Movie Review App, Mutations, Operations, Operations with Role Checks, Queries (+4 more)

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

### Community 103 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, dev:all, firebase:emulators, firebase:emulators:exec, format, ladle (+5 more)

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

### Community 112 - "Architecture"
Cohesion: 0.18
Nodes (8): Architecture, Configuration, Data access and security, Structure, Commands, Getting started, notes-app, Project layout

### Community 115 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle()

### Community 116 - "Native SQL Operations"
Cohesion: 0.20
Nodes (9): Core Agent Constraints, Mutation Fields (DML), Native SQL Operations, Native SQL Root Fields, PostgreSQL Extensions, Query Fields (Read-Only), ⚠️ Security: Stored Procedures & Dynamic SQL, Syntax rules & limitations (+1 more)

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

### Community 132 - "Native SQL Examples"
Cohesion: 0.25
Nodes (8): Advanced aggregation with RANK, Advanced CTE with upserts (atomic get-or-create), Basic SELECT with field aliasing, Basic UPDATE, Multi-statement Transactions, Native SQL Examples, UPDATE with RETURNING and Auth Context, Use of extensions (e.g. PostGIS for geospatial data)

### Community 133 - "Manual Initialization"
Cohesion: 0.25
Nodes (8): 1. Create a Firestore Enterprise Database, 2. Create `firebase.json`, 2. Create `firestore.rules`, 3. Create `firestore.indexes.json`, Deploy rules and indexes, Local Emulation, Manual Initialization, Provisioning Firestore Enterprise Native Mode

### Community 134 - "empty.tsx"
Cohesion: 0.29
Nodes (6): Empty(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

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

## Knowledge Gaps
- **849 isolated node(s):** `PackageDescription`, `Foundation`, `PathKit`, `$schema`, `enabled` (+844 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1188 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Explain the data folder using the Next.js data security guide and this repository architecture" -> `private`, `actions`, `clientKind`, `components.json`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DELETE()` connect `Native SQL Operations` to `auth.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useI18n()` (e.g. with `Changes` and `Changes`) actually correct?**
  _`useI18n()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PackageDescription`, `Foundation`, `PathKit` to the rest of the system?**
  _849 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06341463414634146 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `context-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `menubar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._