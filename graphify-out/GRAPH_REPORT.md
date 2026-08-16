# Graph Report - notes-app  (2026-08-16)

## Corpus Check
- 823 files · ~6,652,819 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 6383 nodes · 26328 edges · 190 communities (177 shown, 13 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 3691 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27231b7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- consolidate-reverse-capture-artifacts.mjs
- audit-capacities-visual.mjs
- devDependencies
- reverse-engineering/manifest.json
- cn
- storing83139.js
- biome.json
- workspace-shell.tsx
- reverse-engineering-capture.mjs
- extract-capacities-reference.mjs
- compilerOptions
- object-type-workspace.tsx
- workspace-audit-data.ts
- check-graphify.mjs
- workspace-navigation.ts
- sb
- reference/manifest.json
- next-env.d.ts
- postcss.config.mjs
- pdfjs83139.js
- LocationManager83139.js
- setup
- l
- push
- AppMenu83139.js
- shortcuts83139.js
- runtime-core.esm-bundler83139.js
- BlockList83139.js
- constructor
- V
- add
- n
- addEventListener
- D
- innerExtract
- V
- RenderIcon83139.js
- error
- PasswordStrengthIndicator83139.js
- render
- i
- check
- vue-router83139.js
- Interactable83139.js
- match
- src83139.js
- PDFViewer83139.js
- startOf
- _grabArticle
- Ls
- c
- T
- Requirements
- ADDED Requirements
- dist83139.js
- Requirements
- ADDED Requirements
- push
- TN
- updateProperties
- notificationManager831392.js
- constructor
- Qx
- D
- t
- ADDED Requirements
- _baseFor83139.js
- _baseClone83139.js
- Mt
- lR
- embeddingNavigation83139.js
- t
- _baseProperty83139.js
- _baseUniq83139.js
- xe
- _g
- get
- extract-capacities-assets.mjs
- ADDED Requirements
- constructor
- Rv
- S6
- ADDED Requirements
- ADDED Requirements
- tm
- ADDED Requirements
- nT
- scripts
- _l
- Object Model
- ki
- PS
- me
- updateMode
- Design
- Decisions
- Decisions
- implement-workspace-sidebar/design.md
- emoji83139.js
- Nh
- emit
- tde
- Reverse-Engineering Evidence Cycle
- Contributing
- Decisions
- ADDED Requirements
- i
- U3
- ADDED Requirements
- tr
- on
- jh
- Architecture
- AI Workflows
- add-production-ci-cd-pipeline/design.md
- implement-object-list-surface/design.md
- Deployment
- Validation Sources
- ADDED Requirements
- Object Studio Foundation
- External Product Knowledge Summary
- add-generic-objectives/proposal.md
- add-recurring-commitment-tracking/proposal.md
- define-minimalist-ui-foundation/proposal.md
- define-object-studio-study-foundation/design.md
- implement-object-list-surface/proposal.md
- implement-workspace-sidebar/proposal.md
- Security
- Release Process
- Capacities desktop sidebar audit — 2026-08-15
- Testing
- add-recurring-commitment-tracking/tasks.md
- add-generic-objectives/tasks.md
- add-production-ci-cd-pipeline/proposal.md
- define-object-studio-study-foundation/proposal.md
- write
- Capacities Knowledge Graph Source
- Obsidian Knowledge Graph Source
- Readwise / Reader Knowledge Graph Source
- OpenSpec
- Capacities context panel parity
- Q: What is the measured Capacities sidebar visual contract?
- Q: Which Capacities sidebar interactions must remain functional?
- Q: Como estilizar o grid responsivo do workspace Capacities sem workspace-shell.module.css?
- Q: Como funciona o ciclo completo das abas e do ultimo painel contextual?
- Q: Qual e o contrato visual medido do painel contextual do Capacities em 1128x912?
- Q: Qual fonte canonica governa o painel contextual e como preservar sua paridade?
- Q: Quais estados do painel contextual precisam de teste de regressao?
- Q: Há CSS de outras páginas autenticadas do Capacities que ainda não foi baixado?
- Q: Como as abas do painel de contexto do Capacities se comportam?
- Requirement: Local Verification Command
- define-minimalist-ui-foundation/tasks.md
- implement-object-list-surface/tasks.md
- implement-workspace-sidebar/tasks.md
- package.json
- Object Type Page (Local)
- ci
- README.md
- addEditToolbar
- External Knowledge Base Snapshots
- Reverse Engineering Knowledge Base
- install-recommendations.ps1
- AGENTS.md
- capacities-sidebar-parity.md
- workspace-tailwind-layout.md
- playwright
- @testing-library/dom
- typescript
- @vitejs/plugin-react
- @vitest/coverage-v8
- capture/README.md
- gne
- e
- to
- button.tsx
- getPrimaryTimePatternThroughCache
- Browser Recovery Runbook
- ad
- xn
- v0
- isValidDate
- rM
- qc
- zte

## God Nodes (most connected - your core abstractions)
1. `setup()` - 1104 edges
2. `n()` - 281 edges
3. `push()` - 265 edges
4. `a()` - 253 edges
5. `e()` - 252 edges
6. `r()` - 203 edges
7. `setup()` - 202 edges
8. `o()` - 186 edges
9. `slice()` - 175 edges
10. `Ht()` - 168 edges

## Surprising Connections (you probably didn't know these)
- `main()` --indirect_call--> `ref()`  [INFERRED]
  scripts/extract-capacities-assets.mjs → reverse-engineering/reference/assets/scripts/pdfjs83139.js
- `setup()` --indirect_call--> `cs()`  [INFERRED]
  reverse-engineering/reference/assets/scripts/BlockList83139.js → reverse-engineering/reference/assets/scripts/shortcuts83139.js
- `setup()` --indirect_call--> `hs()`  [INFERRED]
  reverse-engineering/reference/assets/scripts/BlockList83139.js → reverse-engineering/reference/assets/scripts/shortcuts83139.js
- `setup()` --indirect_call--> `Ts()`  [INFERRED]
  reverse-engineering/reference/assets/scripts/BlockList83139.js → reverse-engineering/reference/assets/scripts/shortcuts83139.js
- `setup()` --indirect_call--> `us()`  [INFERRED]
  reverse-engineering/reference/assets/scripts/BlockList83139.js → reverse-engineering/reference/assets/scripts/shortcuts83139.js

## Import Cycles
- None detected.

## Communities (190 total, 13 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, lucide-react, next, dependencies, class-variance-authority, clsx, lucide-react (+17 more)

### Community 1 - "consolidate-reverse-capture-artifacts.mjs"
Cohesion: 0.13
Nodes (42): item(), appendToJsonl(), buildConsolidatedTransitions(), buildKeyboardPatterns(), buildNetworkPatterns(), buildRoutePages(), buildStateInventory(), buildUnknowns() (+34 more)

### Community 2 - "audit-capacities-visual.mjs"
Cohesion: 0.06
Nodes (27): artifactsDir, beforePath, chatPanel, consoleErrors, correctedPath, dayPanel, designTokens, diffPath (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): babel-plugin-react-compiler, @biomejs/biome, jsdom, devDependencies, babel-plugin-react-compiler, @biomejs/biome, jsdom, sharp (+17 more)

### Community 4 - "reverse-engineering/manifest.json"
Cohesion: 0.07
Nodes (29): assets, confidence, counts, files, source, status, components, accessibility (+21 more)

### Community 5 - "cn"
Cohesion: 0.12
Nodes (23): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+15 more)

### Community 6 - "storing83139.js"
Cohesion: 0.01
Nodes (183): n(), ./esm83139.js, rB(), aB(), abort(), _addCheck(), args(), assert() (+175 more)

### Community 7 - "biome.json"
Cohesion: 0.05
Nodes (36): source, assist, actions, css, parser, next, react, files (+28 more)

### Community 8 - "workspace-shell.tsx"
Cohesion: 0.09
Nodes (14): ContextPaletteItem, contextPaletteItems, contextPanelTrack, ContextTabId, contextTabs, monthCalendarDays, monthWeekdays, navigationToneSurfaceClasses (+6 more)

### Community 9 - "reverse-engineering-capture.mjs"
Cohesion: 0.16
Nodes (21): buildRouteRecord(), captureAccessibilitySnapshot(), captureDir, captureInteractionContext(), captureStorage(), defaultKeyboardKeys, describeTransition(), flattenRequest() (+13 more)

### Community 10 - "extract-capacities-reference.mjs"
Cohesion: 0.17
Nodes (19): allElements, attributesFor(), designTokens, dom, elementIdByElement, elements, indexByElement, isRelevant() (+11 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 12 - "object-type-workspace.tsx"
Cohesion: 0.21
Nodes (10): CapacitiesSidebarIcon(), CapacitiesSidebarIconName, IconPath, paths, iconNames, ObjectTypeCard(), ObjectTypeWorkspace(), typeToneClasses (+2 more)

### Community 13 - "workspace-audit-data.ts"
Cohesion: 0.20
Nodes (12): AuditLoadProgress, AuditLoadResult, AuditMessage, AuditState, cloneFixture(), isCompleteFixture(), loadWorkspaceAuditData(), nextTurn() (+4 more)

### Community 14 - "check-graphify.mjs"
Cohesion: 0.20
Nodes (10): fail(), failures, graphDir, graphPath, htmlPath, manifestPath, readJson(), reportPath (+2 more)

### Community 15 - "workspace-navigation.ts"
Cohesion: 0.16
Nodes (11): NavigationLink(), WorkspaceShell(), getObjectTypeNavigationItem(), isNavigationItemActive(), NavigationGroup, navigationGroups, NavigationIcon, NavigationItem (+3 more)

### Community 16 - "sb"
Cohesion: 0.08
Nodes (28): add(), Jv(), Kv(), makeRe(), nw(), sb(), tw(), ty() (+20 more)

### Community 17 - "reference/manifest.json"
Cohesion: 0.40
Nodes (4): kind, reference, routes, updatedAt

### Community 22 - "pdfjs83139.js"
Cohesion: 0.01
Nodes (97): addChangedExistingAnnotation(), addDeletedAnnotationElement(), annotationStorage(), bbox(), beginMarkedContentProps(), beginText(), capPixels(), ce() (+89 more)

### Community 23 - "LocationManager83139.js"
Cohesion: 0.02
Nodes (120): V(), g(), h(), m(), T(), v(), w(), $A() (+112 more)

### Community 24 - "setup"
Cohesion: 0.01
Nodes (241): ue(), zo(), ag(), bV(), dispatchEvent(), F7(), FF(), Hee() (+233 more)

### Community 25 - "l"
Cohesion: 0.13
Nodes (126): be(), de(), Se(), setup(), O(), setup(), so(), S() (+118 more)

### Community 26 - "push"
Cohesion: 0.03
Nodes (201): ch(), ih(), Ja(), vh(), $0(), A0(), Ace(), add() (+193 more)

### Community 27 - "AppMenu83139.js"
Cohesion: 0.04
Nodes (125): $a(), Ai(), an(), Ar(), At(), bi(), bn(), Br() (+117 more)

### Community 28 - "shortcuts83139.js"
Cohesion: 0.02
Nodes (120): ke(), ac(), Af(), and(), ay(), bc(), bf(), bh() (+112 more)

### Community 29 - "runtime-core.esm-bundler83139.js"
Cohesion: 0.04
Nodes (160): setup(), eO(), kF(), B(), be(), concat(), constructor(), deleteProperty() (+152 more)

### Community 30 - "BlockList83139.js"
Cohesion: 0.04
Nodes (109): Me(), xe(), ac(), __addSublanguage(), Ao(), Ar(), Bi(), bo() (+101 more)

### Community 31 - "constructor"
Cohesion: 0.08
Nodes (37): Ho(), Uo(), addBindings(), Bo(), checkIntentionality(), clean(), Co(), constructor() (+29 more)

### Community 32 - "V"
Cohesion: 0.09
Nodes (83): lr(), setup(), setup(), AK(), ED(), $k(), lA(), LN() (+75 more)

### Community 33 - "add"
Cohesion: 0.04
Nodes (104): add(), addEditor(), addMissingCanvas(), addNewEditor(), addOrRebuild(), addToAnnotationStorage(), addUndoableEditor(), attach() (+96 more)

### Community 34 - "n"
Cohesion: 0.05
Nodes (139): a(), sv(), o(), zo(), D(), Ht(), zt(), kb() (+131 more)

### Community 35 - "addEventListener"
Cohesion: 0.04
Nodes (98): A(), addAlphaFilter(), addAltText(), addButton(), addButtonBefore(), addColorPicker(), addCommands(), addComment() (+90 more)

### Community 36 - "D"
Cohesion: 0.06
Nodes (57): D(), every(), filter(), find(), findLast(), findLastIndex(), H(), map() (+49 more)

### Community 37 - "innerExtract"
Cohesion: 0.07
Nodes (69): addTag(), addTags(), ak(), assign(), checkAndReturnWithFollowingPattern(), checkAndReturnWithoutFollowingPattern(), cj(), ck() (+61 more)

### Community 38 - "V"
Cohesion: 0.06
Nodes (89): applyTransferMapsToBitmap(), applyTransferMapsToCanvas(), beginAnnotation(), beginDrawing(), beginGroup(), beginSMaskMode(), bn(), checkSMaskState() (+81 more)

### Community 39 - "RenderIcon83139.js"
Cohesion: 0.04
Nodes (81): E(), M(), mt(), S(), T(), w(), x(), findIndex() (+73 more)

### Community 40 - "error"
Cohesion: 0.06
Nodes (61): Ky(), _4(), are(), aue(), Ay(), Bae(), bw(), By() (+53 more)

### Community 41 - "PasswordStrengthIndicator83139.js"
Cohesion: 0.06
Nodes (100): Ae(), je(), Oe(), $r(), ui(), Gn(), s(), ./IconPickerEmoji83139.js (+92 more)

### Community 42 - "render"
Cohesion: 0.03
Nodes (78): abort(), _abortOperatorList(), _abortRequest(), addLinkAnnotations(), addNativeFontFace(), _bindLink(), _bindNamedAction(), _bindResetFormAction() (+70 more)

### Community 43 - "i"
Cohesion: 0.07
Nodes (68): g(), m(), p(), u(), f(), i(), n(), qv() (+60 more)

### Community 44 - "check"
Cohesion: 0.05
Nodes (58): al(), At(), bm(), bt(), catchall(), check(), cl(), clone() (+50 more)

### Community 45 - "vue-router83139.js"
Cohesion: 0.08
Nodes (52): te(), kn(), Pe(), Z(), An(), A(), at(), B() (+44 more)

### Community 46 - "Interactable83139.js"
Cohesion: 0.12
Nodes (59): o(), Ae(), at(), B(), be(), bt(), ce(), ct() (+51 more)

### Community 47 - "match"
Cohesion: 0.07
Nodes (67): aB(), Az(), bB(), BR(), braceExpand(), bz(), cz(), DB() (+59 more)

### Community 48 - "src83139.js"
Cohesion: 0.05
Nodes (24): window(), ce(), clamp(), cn(), displayable(), dn(), Er(), formatHsl() (+16 more)

### Community 49 - "PDFViewer83139.js"
Cohesion: 0.03
Nodes (116): m(), p(), Aa(), abort(), al(), Ao(), at(), attach() (+108 more)

### Community 50 - "startOf"
Cohesion: 0.04
Nodes (72): Ei(), abutsStart(), addDay(), addHour(), addMinute(), addMonth(), after(), before() (+64 more)

### Community 51 - "_grabArticle"
Cohesion: 0.08
Nodes (54): _clean(), _cleanClasses(), _cleanConditionally(), _cleanHeaders(), _cleanMatchedNodes(), _cleanStyles(), _everyNode(), _fixLazyImages() (+46 more)

### Community 52 - "Ls"
Cohesion: 0.13
Nodes (29): bs(), _c(), fc(), Fs(), gc(), Gs(), hc(), hs() (+21 more)

### Community 53 - "c"
Cohesion: 0.16
Nodes (42): a(), add(), addText(), b(), Bn(), C(), d(), eo() (+34 more)

### Community 54 - "T"
Cohesion: 0.07
Nodes (33): add(), B(), bv(), default(), describe(), ea(), Fm(), has() (+25 more)

### Community 55 - "Requirements"
Cohesion: 0.05
Nodes (43): Purpose, Recurring Commitments Specification, Requirement: Active Period Progress, Requirement: Completed Period Outcome, Requirement: Consistency And History, Requirement: Expected Progress And Pace Status, Requirement: Explicit Carryover, Requirement: Period And Cumulative Balance (+35 more)

### Community 56 - "ADDED Requirements"
Cohesion: 0.05
Nodes (42): ADDED Requirements, Purpose, Requirement: Active Period Progress, Requirement: Completed Period Outcome, Requirement: Consistency And History, Requirement: Expected Progress And Pace Status, Requirement: Explicit Carryover, Requirement: Period And Cumulative Balance (+34 more)

### Community 57 - "dist83139.js"
Cohesion: 0.06
Nodes (17): addListener(), addWindowListener(), clearAllCookies(), clearCookies(), delete(), get(), notifyListeners(), patch() (+9 more)

### Community 58 - "Requirements"
Cohesion: 0.05
Nodes (39): Objectives Specification, Purpose, Requirement: Objective As Configured Object Type, Requirement: Objective Context, Requirement: Objective Identity And Classification, Requirement: Objective Lifecycle, Requirement: Objective Preparation Progress, Requirement: Objective Requirements And Topics (+31 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Purpose, Requirement: Objective As Configured Object Type, Requirement: Objective Context, Requirement: Objective Identity And Classification, Requirement: Objective Lifecycle, Requirement: Objective Preparation Progress, Requirement: Objective Requirements And Topics (+30 more)

### Community 60 - "push"
Cohesion: 0.06
Nodes (43): adjascentGlobstarOptimize(), c1(), clearSelection(), copyIn(), cQ(), #d(), _delayedTapMove(), deselect() (+35 more)

### Community 61 - "TN"
Cohesion: 0.18
Nodes (26): m(), ep(), Pt(), bn(), DN(), en(), eP(), FN() (+18 more)

### Community 62 - "updateProperties"
Cohesion: 0.06
Nodes (45): clone(), commentSelection(), createDrawerInstance(), createDrawingOptions(), defaultProperties(), defaultSVGProperties(), _drawMove(), end() (+37 more)

### Community 63 - "notificationManager831392.js"
Cohesion: 0.20
Nodes (16): a(), c(), d(), f(), g(), h(), m(), p() (+8 more)

### Community 64 - "constructor"
Cohesion: 0.05
Nodes (54): addEditListeners(), addHighlightArea(), addProgressiveDoneListener(), addProgressiveReadListener(), addProgressListener(), addRangeListener(), ae(), _bindJSAction() (+46 more)

### Community 65 - "Qx"
Cohesion: 0.13
Nodes (18): Ax(), cD(), Ex(), f_e(), Fx(), getSelection(), kx(), Lx() (+10 more)

### Community 66 - "D"
Cohesion: 0.07
Nodes (35): beginImageData(), beginInlineImage(), box(), create(), _createCanvas(), _createSVG(), Ct(), D() (+27 more)

### Community 67 - "t"
Cohesion: 0.08
Nodes (43): Q(), setup(), AD(), addEventListener(), b1(), cameraExperience(), d1(), defaults() (+35 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: Gemini Secret Boundary, Requirement: Page-Aware Document Extraction, Requirement: Registered Source Content, Requirement: Review Before Save, Requirement: Role-Specific Structured Extraction, Requirement: Source Registration And Classification, Requirement: Structured Gemini Suggestions (+20 more)

### Community 69 - "_baseFor83139.js"
Cohesion: 0.10
Nodes (13): b(), ct(), dt(), he(), J(), K(), lt(), me() (+5 more)

### Community 70 - "_baseClone83139.js"
Cohesion: 0.14
Nodes (27): ae(), ce(), E(), fe(), ie(), k(), me(), oe() (+19 more)

### Community 71 - "Mt"
Cohesion: 0.04
Nodes (105): _e(), C(), p(), Kt(), ace(), Aj(), Bj(), deprecate() (+97 more)

### Community 72 - "lR"
Cohesion: 0.09
Nodes (25): dtFormatter(), eras(), formatDateTime(), formatDateTimeParts(), formatInterval(), ianaName(), lR(), meridiems() (+17 more)

### Community 73 - "embeddingNavigation83139.js"
Cohesion: 0.25
Nodes (16): a(), e(), i(), o(), r(), t(), b(), d() (+8 more)

### Community 74 - "t"
Cohesion: 0.15
Nodes (24): be(), c(), cr(), en(), fn(), fr(), gr(), hr() (+16 more)

### Community 75 - "_baseProperty83139.js"
Cohesion: 0.17
Nodes (18): c(), R(), w(), wt(), b(), C(), D(), g() (+10 more)

### Community 76 - "_baseUniq83139.js"
Cohesion: 0.20
Nodes (21): te(), O(), b(), C(), F(), G(), H(), I() (+13 more)

### Community 77 - "xe"
Cohesion: 0.24
Nodes (18): E(), xe(), ye(), K(), A(), de(), F(), j() (+10 more)

### Community 78 - "_g"
Cohesion: 0.13
Nodes (22): ag(), Bg(), Cg(), dg(), Eg(), fg(), _g(), gg() (+14 more)

### Community 79 - "get"
Cohesion: 0.11
Nodes (21): constructor(), emit(), F(), get(), Hg(), meta(), ng(), nu() (+13 more)

### Community 80 - "extract-capacities-assets.mjs"
Cohesion: 0.15
Nodes (20): ref(), cwd, hydrateAsset(), inferType(), localFallbackDirectories, main(), manifestFromEntries(), manifestPath (+12 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Purpose, Requirement: Canonical Visual Foundation, Requirement: Content-First Minimalism, Requirement: Gated UI Delivery, Requirement: Responsive And Accessible Baseline, Requirement: Reusable Interaction Primitives, Requirement: Semantic Visual Roles (+10 more)

### Community 82 - "constructor"
Cohesion: 0.11
Nodes (29): bitLength(), _block(), calculate(), clamp(), concat(), constructor(), create(), digest() (+21 more)

### Community 83 - "Rv"
Cohesion: 0.20
Nodes (16): Av(), ey(), ig(), kg(), kv(), lv(), ly(), Mv() (+8 more)

### Community 84 - "S6"
Cohesion: 0.18
Nodes (19): _6(), b6(), C6(), eme(), f6(), fme(), g6(), h6() (+11 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Branch Protection Source Files, Requirement: Dependency Maintenance, Requirement: Deployment Boundary, Requirement: Pull Request Quality Gates, Requirement: Security Validation, Scenario: Cloud deployment is added, Scenario: Code scanning (+9 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Configurable Object Types, Requirement: Cross-Type Organization, Requirement: Generic Object Records, Requirement: Property-Based Object View, Requirement: Structured Object Relations, Requirement: Workflow Behavior Over Generic Objects, Scenario: Add a workflow preset (+9 more)

### Community 87 - "tm"
Cohesion: 0.11
Nodes (20): Aa(), array(), Dd(), dm(), hm(), jc(), ka(), lp() (+12 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Purpose, Requirement: Accessible Sidebar Controls, Requirement: Active Destination, Requirement: Responsive Navigation, Requirement: Workspace Identity, Requirement: Workspace Navigation Region, Scenario: Close navigation on mobile (+8 more)

### Community 89 - "nT"
Cohesion: 0.10
Nodes (25): b0(), C0(), daysInYear(), due(), eue(), getUTCDate(), getUTCDay(), getUTCFullYear() (+17 more)

### Community 90 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, format:check, graphify:check, graphify:update, lint (+8 more)

### Community 91 - "_l"
Cohesion: 0.16
Nodes (16): A(), bl(), D(), gl(), _l(), lc(), normalize(), overwrite() (+8 more)

### Community 92 - "Object Model"
Cohesion: 0.13
Nodes (14): Activity Records, Customization Model, Flashcard, Flashcard Review, Foundation Filters, Object Model, Potential Object Types, Principles (+6 more)

### Community 93 - "ki"
Cohesion: 0.23
Nodes (12): ae(), b(), ie(), ki(), l(), ne(), oe(), rn() (+4 more)

### Community 94 - "PS"
Cohesion: 0.13
Nodes (16): Fi(), a1(), ate(), dx(), ite(), PS(), rte(), u1() (+8 more)

### Community 95 - "me"
Cohesion: 0.19
Nodes (13): br(), dt(), f(), fe(), h(), he(), m(), me() (+5 more)

### Community 96 - "updateMode"
Cohesion: 0.05
Nodes (55): addFakeAnnotation(), addLayer(), addNewEditorFromKeyboard(), commentButtonPositionInPage(), commentData(), createOrUpdatePopup(), _createPopup(), de() (+47 more)

### Community 97 - "Design"
Cohesion: 0.14
Nodes (13): Acceptance Gate, Color, Components, Composition, Design, Do Not, Interaction And Motion, Principles (+5 more)

### Community 98 - "Decisions"
Cohesion: 0.14
Nodes (13): Assessments provide evidence; results conclude outcomes, Context, Custom outcomes remain first-class, Decisions, Goals / Non-Goals, Lifecycle and result remain separate, Objective represents the outcome, not the work, Open Questions (+5 more)

### Community 99 - "Decisions"
Cohesion: 0.14
Nodes (13): Compare progress with both the endpoint and the current expected position, Context, Decisions, Goals / Non-Goals, Keep active-period and completed-period concepts separate, Keep consistency transparent, Make carryover explicit, Open Questions (+5 more)

### Community 100 - "implement-workspace-sidebar/design.md"
Cohesion: 0.14
Nodes (13): Accessibility And Evidence, Active state is semantic, Context, Decisions, Goals / Non-Goals, Identity stays compact, Migration Plan, Mobile uses the same navigation model (+5 more)

### Community 101 - "emoji83139.js"
Cohesion: 0.17
Nodes (11): ./data83139.js, ./data831392.js, ./data831393.js, ./data831394.js, ./data831395.js, l(), ./messages83139.js, ./messages831392.js (+3 more)

### Community 102 - "Nh"
Cohesion: 0.24
Nodes (13): cV(), dV(), gV(), hV(), lV(), mV(), oV(), pV() (+5 more)

### Community 103 - "emit"
Cohesion: 0.10
Nodes (37): addNamespaces(), addResource(), addResourceBundle(), addResources(), changeLanguage(), clone(), cloneInstance(), dir() (+29 more)

### Community 104 - "tde"
Cohesion: 0.08
Nodes (88): setup(), Se(), Ze(), de(), le(), ue(), Z(), b() (+80 more)

### Community 105 - "Reverse-Engineering Evidence Cycle"
Cohesion: 0.14
Nodes (13): 10) Next delta, 11) Capture artifact schema, 12) Automated local evidence capture, 1) Discover, 2) Record, 3) Structure evidence, 4) Query existing knowledge, 5) Derive requirements (+5 more)

### Community 106 - "Contributing"
Cohesion: 0.15
Nodes (12): Branch Naming, CI And Merge, Commit, Contributing, Git Workflow, Local Development, Production Promotion, Pull Request (+4 more)

### Community 107 - "Decisions"
Cohesion: 0.15
Nodes (12): Context, Decisions, Documentation precedes component implementation, Evidence gates advancement, Existing primitives remain the default, Goals / Non-Goals, Migration Plan, Minimalism is content-first, not feature removal (+4 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: Focused Study Session, Requirement: Immutable Question Attempts, Requirement: Packaged Study Object Types, Requirement: Study Filters And Weakness Analytics, Scenario: Complete a study session, Scenario: Create a study goal, Scenario: Filter study objects (+4 more)

### Community 109 - "i"
Cohesion: 0.21
Nodes (12): a(), an(), bt(), ct(), d(), _e(), i(), qe() (+4 more)

### Community 110 - "U3"
Cohesion: 0.11
Nodes (30): _8(), A8(), ame(), b8(), dme(), E8(), f8(), g8() (+22 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Object List Controls, Requirement: Responsive Object List Geometry, Requirement: Route-Aware Object Type Surface, Requirement: Shared Object Type Contract, Scenario: Inspect the type toolbar, Scenario: Open a populated type (+3 more)

### Community 112 - "tr"
Cohesion: 0.25
Nodes (9): ai(), fi(), g(), li(), pi(), rr(), tr(), vr() (+1 more)

### Community 113 - "on"
Cohesion: 0.13
Nodes (18): ar(), copy(), ei(), ft(), ir(), it(), jr(), k() (+10 more)

### Community 114 - "jh"
Cohesion: 0.14
Nodes (15): jh(), _getInvalidInput(), _getOrReturnCtx(), _getType(), JU(), _parseAsync(), _processInputParams(), qU() (+7 more)

### Community 115 - "Architecture"
Cohesion: 0.18
Nodes (10): Application Data, Architecture, Enforcement, Foundation Persistence Decision, Gemini Boundary, Intent, Next.js Guidance, Provider Boundaries (+2 more)

### Community 116 - "AI Workflows"
Cohesion: 0.18
Nodes (10): AI Workflows, Answer-Key Extraction And Matching, Document Processing Pipeline, Flashcard Generation, Guardrails, Question Extraction, Role Of Gemini, Scheduling Boundary (+2 more)

### Community 117 - "add-production-ci-cd-pipeline/design.md"
Cohesion: 0.18
Nodes (10): Context, Decisions, Goals / Non-Goals, Keep security as a separate workflow, Migration Plan, Mirror CI with repository scripts, Open Questions, Risks / Trade-offs (+2 more)

### Community 118 - "implement-object-list-surface/design.md"
Cohesion: 0.18
Nodes (10): Context, Decisions, Goals / Non-Goals, Navigation data owns route identity, One composed surface owns all type pages, Reference counts constrain seeded results, Rendered behavior is the replication boundary, Responsive Geometry (+2 more)

### Community 119 - "Deployment"
Cohesion: 0.20
Nodes (9): Build, CI/CD Boundary, Cloud Authentication, Deployment, Deployment Triggers, Environments, Recommended Delivery Flow, Rollback (+1 more)

### Community 120 - "Validation Sources"
Cohesion: 0.20
Nodes (9): Catalog, Exclusions, And Unavailable Sources, Completion Evidence, First End-to-End Validation Set, Historical DATAPREV Corpus, Ingestion Rules, Purpose, Related PPSA Proofs, Source Classification (+1 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Deterministic Daily Question Target, Requirement: FSRS Flashcard Scheduling, Requirement: Today View, Scenario: Calculate the target, Scenario: Open the Today view, Scenario: Override the target, Scenario: Rate a flashcard review (+1 more)

### Community 122 - "Object Studio Foundation"
Cohesion: 0.22
Nodes (8): Core Workflow, Foundation Scope, Initial User, Non-Goals, Object Studio Foundation, Product Boundaries, Product Promise, Success Criteria

### Community 123 - "External Product Knowledge Summary"
Cohesion: 0.22
Nodes (8): Capacities, Corpus Coverage, Evidence, External Product Knowledge Summary, Obsidian, Product Boundary, Readwise / Reader, Shared Concepts

### Community 124 - "add-generic-objectives/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 125 - "add-recurring-commitment-tracking/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 126 - "define-minimalist-ui-foundation/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 127 - "define-object-studio-study-foundation/design.md"
Cohesion: 0.22
Nodes (8): AI Generation Flow, Architecture Boundary, Customization Foundation, Domain Shape, Overview, Reference Model, Scheduling, Verification Strategy

### Community 128 - "implement-object-list-surface/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 129 - "implement-workspace-sidebar/proposal.md"
Cohesion: 0.22
Nodes (8): Capabilities, Dependencies And Sequencing, Impact, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 130 - "Security"
Cohesion: 0.22
Nodes (8): Agent Work, Application Expectations, Dependencies, GitHub Actions Supply Chain, Reporting, Secrets, Security, Static Analysis

### Community 131 - "Release Process"
Cohesion: 0.25
Nodes (7): Branch Flow, Changelog, OpenSpec Flow, Release Process, Release Readiness, Rollback, Versioning

### Community 132 - "Capacities desktop sidebar audit — 2026-08-15"
Cohesion: 0.25
Nodes (7): Acceptance evidence, Capacities desktop sidebar audit — 2026-08-15, Custom sections, Object-type row behavior, Pinned section behavior, Structure and geometry, Visual states

### Community 133 - "Testing"
Cohesion: 0.25
Nodes (7): CI, Coverage, Current State, Definition Of Done, Local Verification, Testing, Verification Loop

### Community 134 - "add-recurring-commitment-tracking/tasks.md"
Cohesion: 0.25
Nodes (7): 1. Commitment And Period Foundations, 2. Current Progress And Period Outcomes, 3. Expected Progress And Required Pace, 4. Carryover And Target Revisions, 5. History, Balance, And Consistency, 6. Product Integration, 7. Verification

### Community 135 - "add-generic-objectives/tasks.md"
Cohesion: 0.29
Nodes (6): 1. Objective Foundations, 2. Requirements And Preparation Context, 3. Assessments And Results, 4. Objective Progress, 5. Objective-Centered Experience, 6. Verification

### Community 136 - "add-production-ci-cd-pipeline/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Modified Capabilities, New Capabilities, Non-Goals, What Changes, Why

### Community 137 - "define-object-studio-study-foundation/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, New Capabilities, Non-Goals, Supporting Docs, What Changes, Why

### Community 138 - "write"
Cohesion: 0.16
Nodes (18): addToNumericResult(), Dx(), emitNamedEntityData(), emitNotTerminatedNamedEntity(), emitNumericEntity(), end(), jae(), startEntity() (+10 more)

### Community 139 - "Capacities Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Capacities Knowledge Graph Source, Entities, Features, Graph Interpretation, Workflows

### Community 140 - "Obsidian Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Entities, Graph Interpretation, Obsidian Knowledge Graph Source, Topics, Workflows

### Community 141 - "Readwise / Reader Knowledge Graph Source"
Cohesion: 0.33
Nodes (5): Entities, Features, Graph Interpretation, Readwise / Reader Knowledge Graph Source, Workflows

### Community 142 - "OpenSpec"
Cohesion: 0.33
Nodes (5): Change Inventory, OpenSpec, Structure, UI Delivery Checkpoints, Working Agreement

### Community 143 - "Capacities context panel parity"
Cohesion: 0.40
Nodes (4): Capacities context panel parity, Interaction contract, Measured desktop contract, Required evidence

### Community 144 - "Q: What is the measured Capacities sidebar visual contract?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What is the measured Capacities sidebar visual contract?, Source Nodes

### Community 145 - "Q: Which Capacities sidebar interactions must remain functional?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which Capacities sidebar interactions must remain functional?, Source Nodes

### Community 146 - "Q: Como estilizar o grid responsivo do workspace Capacities sem workspace-shell.module.css?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Como estilizar o grid responsivo do workspace Capacities sem workspace-shell.module.css?, Source Nodes

### Community 147 - "Q: Como funciona o ciclo completo das abas e do ultimo painel contextual?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Como funciona o ciclo completo das abas e do ultimo painel contextual?, Source Nodes

### Community 148 - "Q: Qual e o contrato visual medido do painel contextual do Capacities em 1128x912?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Qual e o contrato visual medido do painel contextual do Capacities em 1128x912?, Source Nodes

### Community 149 - "Q: Qual fonte canonica governa o painel contextual e como preservar sua paridade?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Qual fonte canonica governa o painel contextual e como preservar sua paridade?, Source Nodes

### Community 150 - "Q: Quais estados do painel contextual precisam de teste de regressao?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Quais estados do painel contextual precisam de teste de regressao?, Source Nodes

### Community 151 - "Q: Há CSS de outras páginas autenticadas do Capacities que ainda não foi baixado?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Há CSS de outras páginas autenticadas do Capacities que ainda não foi baixado?, Source Nodes

### Community 152 - "Q: Como as abas do painel de contexto do Capacities se comportam?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Como as abas do painel de contexto do Capacities se comportam?, Source Nodes

### Community 153 - "Requirement: Local Verification Command"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Local Verification Command, Scenario: Developer runs local verification, Scenario: Developer runs page tests

### Community 154 - "define-minimalist-ui-foundation/tasks.md"
Cohesion: 0.40
Nodes (4): 1. Foundation Audit, 2. Canonical Design Guidance, 3. OpenSpec Foundation, 4. Review Gate

### Community 155 - "implement-object-list-surface/tasks.md"
Cohesion: 0.40
Nodes (4): 1. Route Contract, 2. Object List Surface, 3. Verification, 4. Graph Knowledge

### Community 156 - "implement-workspace-sidebar/tasks.md"
Cohesion: 0.40
Nodes (4): 1. Spec And Fixture, 2. Sidebar Implementation, 3. Verification, 4. Review Gate

### Community 157 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

### Community 158 - "Object Type Page (Local)"
Cohesion: 0.40
Nodes (4): Evidence link, Object Type Page (Local), Route, State behavior

### Community 159 - "ci"
Cohesion: 0.25
Nodes (8): ci(), toHTTP(), toISOWeekDate(), toRFC2822(), toSQL(), toSQLDate(), toSQLTime(), toUTC()

### Community 160 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 161 - "addEditToolbar"
Cohesion: 0.20
Nodes (10): addCommentButton(), addCommentButtonInToolbar(), addEditToolbar(), addStandaloneCommentButton(), comment(), description(), removeCommentButtonFromToolbar(), removeStandaloneCommentButton() (+2 more)

### Community 164 - "install-recommendations.ps1"
Cohesion: 0.43
Nodes (4): Ensure-Bun(), Has-Network(), Install-BunFromScript(), Test-Command()

### Community 177 - "gne"
Cohesion: 0.50
Nodes (4): kf(), gne(), Nv(), Vy()

### Community 178 - "e"
Cohesion: 0.05
Nodes (67): e(), Jy(), $a(), _addString(), Az(), ble(), clear(), cm() (+59 more)

### Community 179 - "to"
Cohesion: 0.20
Nodes (11): io(), no(), ao(), bee(), Fee(), Ree(), ro(), to() (+3 more)

### Community 180 - "button.tsx"
Cohesion: 0.67
Nodes (3): Button, ButtonProps, buttonVariants

### Community 181 - "getPrimaryTimePatternThroughCache"
Cohesion: 0.25
Nodes (9): getPrimaryTimePatternThroughCache(), innerPattern(), innerPatternHasChange(), pattern(), patternFlags(), patternLeftBoundary(), primaryPatternLeftBoundary(), primaryPrefix() (+1 more)

### Community 182 - "Browser Recovery Runbook"
Cohesion: 0.25
Nodes (7): Browser Recovery Runbook, Histórico, Objetivo, Procedimento operacional, Regras de prioridade, Resultado esperado, Situação aplicada

### Community 183 - "ad"
Cohesion: 0.29
Nodes (8): od(), ad(), dd(), fd(), hD(), md(), pd(), ud()

### Community 184 - "xn"
Cohesion: 0.25
Nodes (8): bn(), Jn(), qn(), Un(), x(), xn(), yn(), Zn()

### Community 186 - "v0"
Cohesion: 0.25
Nodes (8): d0(), E0(), fromFormat(), fromString(), jue(), mue(), v0(), w0()

### Community 187 - "isValidDate"
Cohesion: 0.08
Nodes (32): addUnit(), applyDateOperation(), bk(), dateWithoutTimezoneAdjustment(), dstEnd(), dstStart(), getDate(), getDay() (+24 more)

### Community 191 - "rM"
Cohesion: 0.40
Nodes (5): Qoe(), rM(), Xj(), Yoe(), Zoe()

### Community 192 - "qc"
Cohesion: 0.40
Nodes (5): Ax(), jie(), kx(), qc(), ux()

### Community 193 - "zte"
Cohesion: 0.22
Nodes (9): hte(), hu(), jte(), kte(), Ou(), qte(), Vte(), Xte() (+1 more)

## Knowledge Gaps
- **746 isolated node(s):** `Objetivo`, `Situação aplicada`, `Regras de prioridade`, `Procedimento operacional`, `Resultado esperado` (+741 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setup()` connect `setup` to `storing83139.js`, `write`, `sb`, `LocationManager83139.js`, `l`, `push`, `AppMenu83139.js`, `shortcuts83139.js`, `runtime-core.esm-bundler83139.js`, `BlockList83139.js`, `constructor`, `V`, `ci`, `n`, `D`, `innerExtract`, `RenderIcon83139.js`, `error`, `PasswordStrengthIndicator83139.js`, `i`, `check`, `vue-router83139.js`, `Interactable83139.js`, `match`, `src83139.js`, `PDFViewer83139.js`, `startOf`, `e`, `Ls`, `c`, `gne`, `T`, `ad`, `to`, `v0`, `isValidDate`, `push`, `TN`, `rM`, `qc`, `Qx`, `D`, `t`, `zte`, `Mt`, `lR`, `embeddingNavigation83139.js`, `xe`, `_g`, `get`, `constructor`, `Rv`, `S6`, `tm`, `nT`, `ki`, `PS`, `Nh`, `emit`, `tde`, `U3`, `jh`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `De()` connect `RenderIcon83139.js` to `V`, `tde`, `src83139.js`, `PDFViewer83139.js`, `pdfjs83139.js`, `LocationManager83139.js`, `setup`, `l`, `AppMenu83139.js`, `BlockList83139.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `item()` connect `consolidate-reverse-capture-artifacts.mjs` to `n`, `storing83139.js`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 831 inferred relationships involving `setup()` (e.g. with `Q()` and `ue()`) actually correct?**
  _`setup()` has 831 INFERRED edges - model-reasoned connections that need verification._
- **Are the 139 inferred relationships involving `n()` (e.g. with `_7()` and `ad()`) actually correct?**
  _`n()` has 139 INFERRED edges - model-reasoned connections that need verification._
- **Are the 143 inferred relationships involving `a()` (e.g. with `cn()` and `H()`) actually correct?**
  _`a()` has 143 INFERRED edges - model-reasoned connections that need verification._
- **Are the 75 inferred relationships involving `e()` (e.g. with `wt()` and `ze()`) actually correct?**
  _`e()` has 75 INFERRED edges - model-reasoned connections that need verification._