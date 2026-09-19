# Technical Specification: Community Exam Prep Platform

- Author: Project team
- Created: 2026-09-19
- Updated: 2026-09-19
- Status: draft — pending engineering review (see §9, Areas of Concern)
- Related: [Intent](intent.md)

## 1. Summary & Scope

This specification turns [intent.md](intent.md) into requirements and a design/technical plan that engineering can build from. It covers the MVP object model (`Questions`, `Exams`, `Tags`, `Collections`, `Notes`, `Citations`), the Space-based multi-tenant architecture, the spaced-repetition study loop, and the read-only MCP surface. It does **not** cover monetization, voting, discussion threads, or the deferred question formats (`ordering`, `hotspot`, `simulation`) beyond reserving their schema slot.

A companion visual exploration (Space Home, Question object detail with links/backlinks, Study Session, Spaced-Repetition Review Queue) is being produced alongside this document as a Design artifact for the same review pass.

## 2. Requirements

### 2.1 Functional

- **FR-1 Spaces** — every object belongs to exactly one Space; a user can own or belong to multiple Spaces.
- **FR-2 Objects** — `question`, `exam`, `tag`, `collection`, `note`, `citation` are first-class, independently addressable objects with a shared content shell (TipTap JSON body).
- **FR-3 Graph linking** — any object can be bidirectionally linked to any other object (e.g. Question ↔ Citation, Question ↔ Note) with a typed relation, without a schema migration per new relation type.
- **FR-4 Question formats** — MVP UI supports `single-choice`, `multiple-choice`, `fill-blank`, `matching`. `ordering`, `hotspot`, `simulation` exist as a reserved discriminator value only — no authoring UI, no study-mode renderer, no Server Action accepts them as a submitted attempt.
- **FR-5 Spaced repetition** — missed questions enter a review queue; the schedule (interval, ease factor, next review date) is computed server-side.
- **FR-6 Community browsing** — browsing and reading community-authored public content requires no account and no payment.
- **FR-7 MCP read surface** — an MCP-compatible client can query `Questions`, `Notes`, `Citations` for a study session. No write, admin, or user-state tool is exposed in v1.
- **FR-8 Backlinks navigation** — from any object's page, a user can see every other object that links to it, not only the ones it links out to.

### 2.2 Non-Functional

- **NFR-1 Tenant isolation** — a user must never be able to read or enumerate another Space's private objects through the UI, Server Actions, or MCP.
- **NFR-2 Document size** — no Firestore document may approach the 1 MiB limit; large relation fan-out lives in `object_links`, never as arrays on the object.
- **NFR-3 Accessibility** — WCAG 2.1 AA: real semantic controls (`button`, `a[href]`, labelled inputs), 4.5:1 text contrast, visible focus states, 44px touch targets.
- **NFR-4 Free tier availability** — public content reads must not require a paid plan or degrade behind a paywall.

## 3. Architecture Overview

The platform is a Next.js (App Router) web application functioning as a graph-based Personal Knowledge Management (PKM) and exam-prep system. It uses a multi-tenant, Space-based architecture on Firebase (Firestore, Auth, App Hosting). The core UI pattern is an object-oriented, block-based editor, in the spirit of Capacities' fluid object navigation.

## 4. Technology Stack

- **Framework:** Next.js (React 19), App Router.
- **Language:** TypeScript.
- **Package Manager:** pnpm.
- **Styling:** Tailwind CSS v4.
- **Base UI:** shadcn/ui (already scaffolded — see §5) on top of `@base-ui/react` primitives.
- **Rich Text / Block Editor:** TipTap (headless, custom UI).
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth (Email/Password, Magic Link, Google).
- **Hosting & CI/CD:** Firebase App Hosting.

> **Update 2026-09-19:** the "Fluid Functionalism" registry is now wired in — `components.json` has `registries: { "@fluid": "https://www.fluidfunctionalism.com/r/{name}.json" }`, and the install pulled in ~15 new dependencies (Radix UI primitives, `framer-motion`, `cmdk`, `date-fns`, `embla-carousel-react`, `recharts`, `pdfjs-dist`, `react-day-picker`, `react-resizable-panels`, `input-otp`, `@shadcn/react`) plus 71 new files under `src/components/ui/`, `src/components/fluid-hover-highlight.tsx`, and supporting `src/lib`/`src/hooks` utilities. `pnpm install`, `tsc --noEmit`, and `pnpm build` all pass. "Shoogle" was not adopted. See §9.4 for the state of the security review this still needs.

## 5. Design System & UX Standards

### 5.1 Current baseline (already in the repo — this is the real starting point)

- `components.json`: shadcn `style: "base-nova"`, `baseColor: "neutral"`, CSS variables on, Lucide icons, no external registries configured.
- `src/app/globals.css`: OKLCH token set (`--background`, `--foreground`, `--primary`, `--card`, `--sidebar-*`, `--chart-1..5`, `--radius` with derived `sm/md/lg/xl/2xl/3xl/4xl` scale) plus a `.dark` variant — a neutral, grayscale foundation with no brand hue defined yet.
- `src/components/ui/button.tsx`: a `cva`-driven `Button` on `@base-ui/react`'s primitive, with variants `default | outline | secondary | ghost | destructive | link` and sizes `xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg`, `focus-visible` ring, `aria-invalid` states, and icon-aware padding.

There is no separately documented brand guideline, security policy, or UX standards document in this repository today. This spec therefore treats the tokens and component conventions above as the de facto baseline and extends them, rather than inventing a policy that isn't there — see §9.1.

### 5.2 Proposed extension for object-oriented PKM

- Add a small **object-type accent layer** on top of the neutral base — one semantic token per object type (`--color-object-question`, `--object-exam`, `--object-note`, `--object-citation`, `--object-tag`, `--object-collection`) used only for identity chips, dots, and left-rail icons, never for full-surface theming. This preserves the existing neutral `base-nova` surfaces/typography.
- Capacities-style interaction patterns to build on existing primitives (no new UI kit required for MVP): an object detail page with a "Linked objects" panel and a "Backlinks" section (FR-8), a command palette (⌘K) for quick capture/search, and inline object chips inside the TipTap editor.
- A visual pass covering Space Home, Question object detail, Study Session, and the Spaced-Repetition Review Queue is being delivered as a separate Design artifact for this same review; treat it as illustrative of the layout/interaction direction, not as a pixel-locked spec.
- Accessibility follows NFR-3: every interactive mockup element maps to a real semantic element in implementation.

## 6. Database Schema (Graph-Ready Firestore)

To support polymorphic relations and bidirectional graph querying without hitting the 1 MiB document limit, the database uses a central edges collection.

### Collections

- `users` — user profile data and settings.
- `spaces` — the top-level tenant container. Every object belongs to a `spaceId`. Carries a `visibility` field (see §9.2) — **new** vs. the original draft, which only had `isPublic` on individual objects.
- `objects` — the primary content collection. Documents use a `type` discriminator.
  - Types: `question`, `exam`, `tag`, `collection`, `note`, `citation` (plus the reserved-only `ordering`, `hotspot`, `simulation` discriminator values, unused by any writer in v1).
  - Common fields: `id`, `spaceId`, `type`, `createdAt`, `updatedAt`, `content` (TipTap JSON), `visibility` (`private` | `space` | `public`; defaults to the owning Space's default — see §9.2).
- `object_links` (the graph edges) — relationships between any two objects.
  - Fields: `sourceId`, `targetId`, `relationType` (e.g. `references`, `belongs_to`), `spaceId`.
  - **Constraint (new):** `spaceId` on an edge MUST match the `spaceId` of both `sourceId` and `targetId`; this is enforced server-side (§9.4), never trusted from client input.
- `study_records` — tracks a user's spaced-repetition performance.
  - Fields: `userId`, `objectId` (Question ID), `nextReviewDate`, `interval`, `easeFactor`, `history`.

## 7. Interfaces & APIs

### 7.1 Server Actions (Next.js)

All secure business logic bypasses standard API routes in favor of Next.js Server Actions using the `firebase-admin` SDK.

- **Spaced Repetition Engine** — the client submits a study attempt; a Server Action runs the SM-2 algorithm, calculates `nextReviewDate`, and mutates `study_records` directly from the server.
- **Link mutations** — creating/removing an `object_links` edge is a Server Action, not a direct client Firestore write, so the cross-space constraint in §6 can be enforced in one place.
- Server Actions reject any `question`/study-attempt payload whose format is `ordering`, `hotspot`, or `simulation` (FR-4).

### 7.2 Model Context Protocol (MCP) Server

- **Endpoint:** `/api/mcp/route.ts` (Next.js Route Handler).
- **Transport:** Server-Sent Events (SSE) or standard HTTP POST.
- **Scope:** read-only access exposing `Questions`, `Notes`, `Citations`.
- **Auth (open in intent.md, addressed here as a requirement, not yet a decision):** the MCP layer MUST NOT accept unauthenticated requests as a way to reach private objects. At minimum it needs to (a) require a token identifying a user and evaluate the same visibility rules as §9.2, or (b) restrict itself to objects with `visibility: "public"` until per-user MCP auth is designed. Shipping it as an open, unauthenticated endpoint over all `objects` is not acceptable — see §9.4.

## 8. Security & Data Isolation

- **Firestore Security Rules** — strict tenant isolation by default. A user may read/write `objects` and `object_links` only where `spaceId` matches a Space they own or belong to.
- **Public viewing** — a document is additionally readable by anyone, authenticated or not, when its resolved `visibility` (§9.2) is `public`.
- **Route protection** — Next.js Middleware verifies the Firebase Auth token to protect private Space routes.
- **`object_links` symmetry** — a rule that only checks the edge's own `spaceId`/`visibility` is not sufficient; both endpoints' current visibility must be checked so a public Question can't be used to infer the existence of a private Note through an edge (§9.4).

## 9. Areas of Concern & Unresolved Conflicts

This section exists because the request behind this spec asked for explicit compliance with brand guidelines, security policy, and UX standards — and those don't exist as separate documents in this repository yet. Rather than inventing them, here is what was found, what's ambiguous, and what needs a decision before engineering starts.

1. **No documented brand/security/UX policy exists in this repo.** The only real "policy" today is the shadcn `base-nova` neutral token set and the `Button` component conventions (§5.1). This spec builds on those. If a brand or security policy exists outside this repository, it wasn't available here and should be reconciled against §5–§8 before implementation begins.
2. **"Free community browsing" vs. "strict tenant isolation" are in tension.** intent.md states both as hard constraints. A single `isPublic` boolean on `objects` (the original schema) can't express "this Question is public but the Note and Citation I privately linked to it are not." §6/§9.3 resolve this with a `visibility` field on both `spaces` and `objects`, but the exact default-inheritance rule (does a public Space make all its objects public, or only ones explicitly marked?) is a product decision, not an engineering one — **needs sign-off before the Firestore rules are written.**
3. **Recommended default (pending sign-off):** `note` and `citation` objects default to `private` regardless of their Space's visibility, since they represent personal annotations; only `question`, `exam`, `tag`, and `collection` can be `public`. This keeps the "seamlessly link a Question to a personal Note" vision (intent.md) from accidentally exposing private notes when a Question is shared.
4. **Third-party registry adopted 2026-09-19 — full review still outstanding.** "Fluid Functionalism" (`fluidfunctionalism.com`) is now wired into `components.json` (`registries.@fluid`) and 71 files landed from it. What's been checked so far: the packages actually installed in `node_modules` match `package.json` (no phantom/mismatched deps), `tsc --noEmit` is clean, and `pnpm build` compiles and prerenders successfully. What has **not** been done: a line-by-line security review of all 71 new files — only two were spot-checked (`src/components/fluid-hover-highlight.tsx`, `src/lib/springs.ts`), both well-documented `framer-motion`-based spring-animation code with no obfuscation, `eval`, or unexpected network calls. Before this registry is relied on for shipped UI, do the same review any new external dependency would get: skim the rest of the 71 files (especially anything touching network requests, `dangerouslySetInnerHTML`, or dynamic `eval`/`Function`), and pin the registry URL's response (or vendor the files) so a future `shadcn add` from `@fluid` can't silently pull different code later. "Shoogle" (`shoogle.dev`) was **not** adopted — nothing in this repo points at it.
5. **MCP auth is an open question in intent.md but a hard requirement here.** A read-oriented MCP endpoint that reaches `objects`/`object_links` without auth is a direct path to leaking private Notes/Citations if its query layer doesn't mirror the Firestore rules exactly. §7.2 states the minimum bar; the actual auth mechanism (API key per user? OAuth? public-only until then?) still needs a decision.
6. **`object_links` cross-space leakage.** If an edge's `spaceId` is ever set from client input independently of validating `sourceId`/`targetId`'s own `spaceId`, a crafted edge could link objects across spaces or let a public object "pull in" a private one through the graph UI. §6/§8 require this to be enforced in a Server Action, never in a client-writable path.
7. **Reserved question formats must be excluded end-to-end.** `ordering`, `hotspot`, `simulation` must be unreachable not just in the authoring/study UI but also in Server Action validation and MCP schema output, or they become a de facto unsupported-but-reachable surface.

## 10. Target Directory Structure

```text
/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Login and Registration routes
│   ├── (dashboard)/      # Protected Space/PKM routes
│   └── api/mcp/          # MCP Server Route Handlers
├── components/           # React Components
│   ├── editor/           # TipTap Custom Nodes and UI
│   └── ui/               # shadcn/ui components (base-nova)
├── lib/                  # Shared utilities
│   ├── firebase/         # Firebase Client SDK initialization
│   ├── firebase-admin/   # Firebase Admin SDK (Server only)
│   └── srs/              # Spaced Repetition Algorithm logic
├── actions/              # Next.js Server Actions
└── types/                # Global TypeScript definitions (Object types, schemas)
```

## 11. Sidebar Specification: Workspace Navigation Shell

### 11.1 Goal

The application MUST provide a workspace-oriented sidebar comparable to the mature sidebar found in `.worktrees/old-5`. It is not a simple navigation menu: it is the primary control surface for switching Spaces, opening objects, managing pinned content, launching creation flows, and opening contextual panels.

The implementation SHOULD be based on the composable shadcn/ui Sidebar primitives, but the product behavior MUST remain independent from the visual component library.

### 11.2 Layout

```text
SidebarProvider
└── AppSidebar
    ├── WorkspaceSwitcher
    │   ├── Current space
    │   ├── Search spaces
    │   ├── Create space
    │   ├── Rename space
    │   ├── Delete space
    │   └── Reorder spaces
    ├── PrimaryActions
    │   ├── New
    │   ├── Search
    │   ├── Explore
    │   ├── Calendar
    │   ├── Tasks
    │   └── Trash
    ├── Overview
    │   ├── Pinned items
    │   ├── Object-type sections
    │   ├── Collections/custom sections
    │   └── Section sorting
    ├── Contextual menus
    └── SidebarRail
```

### 11.3 Workspace switcher

The workspace switcher MUST support:

- opening and closing as a popover/dropdown;
- filtering Spaces by text;
- selecting the active Space;
- creating a Space through a dialog;
- renaming the active Space through a settings dialog;
- deleting a Space only after explicit confirmation;
- manual drag-and-drop ordering;
- an accessible empty state when no Space matches the search;
- closing automatically after selection on mobile;
- resetting temporary query, drag, and dialog state after completion.

Deleting MUST use a confirmation phrase or equivalent destructive-action guard. The UI MUST surface failures without silently closing the dialog.

### 11.4 Primary actions

Primary actions MUST be available from the sidebar and MUST expose both pointer and keyboard access. The default actions are:

- `new`: open the creation menu;
- `search`: open global search;
- `explore`: open the default exploration surface;
- `calendar`: open calendar;
- `tasks`: open tasks;
- `trash`: open deleted content.

The New menu MUST support searchable object types and keyboard navigation. Selecting an item either opens the matching creation dialog or navigates directly to the relevant creation route. Supported creation flows include files/uploads, links, queries, and tasks, with object-specific configuration.

### 11.5 Overview sections and object navigation

The overview MUST render:

- pinned entities;
- built-in object types;
- custom object types;
- collections and custom sections;
- manual or alphabetical ordering;
- active-row state;
- loading and empty states;
- section-level actions revealed on hover or focus.

Each row MUST support:

- normal click: open in the current main tab;
- modifier-click or explicit intent: open in a new main tab;
- side-panel intent: open in the contextual side panel;
- keyboard activation;
- accessible label and object-type icon;
- context menu access.

### 11.6 Context menus

Pinned entities, object types, and collections MUST expose context actions appropriate to their type. The common action catalog is:

- open;
- open in new tab;
- open in side panel;
- pin/unpin;
- change type;
- settings;
- share;
- present;
- export;
- import;
- copy Markdown;
- copy reference;
- duplicate;
- delete.

Destructive actions MUST be visually separated and require confirmation. Unsupported actions MUST be hidden instead of rendered as no-op menu items.

### 11.7 Navigation state model

The sidebar MUST be backed by a shared workspace context/provider rather than isolated local state. The provider owns:

- `activeSpaceId`;
- `activeEntityId`;
- `activeAction`;
- `mainTabs` and `mainValue`;
- `sideTabs` and `sideValue`;
- pinned entities;
- object-type order;
- custom sections;
- route restoration status;
- command palette/search visibility.

Navigation intent MUST distinguish:

```text
current      → replace/open in current main tab
new-tab      → create or activate a main tab
side-panel   → open or update the contextual side panel
```

### 11.8 URL and persistence behavior

On application startup, navigation MUST be restored in this order:

1. parse the current URL;
2. resolve the Space route segment;
3. resolve the main object/action segment;
4. restore stored main tabs for the active Space;
5. restore the side-panel value;
6. set the active entity/action;
7. mark route restoration complete;
8. persist future changes.

The initial implementation SHOULD use these storage keys for compatibility with the existing workspace controller:

- `knowledgeos.workspace.mainTabsState`;
- `knowledgeos.workspace.sidePanelState`;
- a Space-specific key for object-type order;
- a Space-specific key or repository record for pinned entity IDs.

The sidebar open/collapsed state MUST be persisted in the existing sidebar cookie mechanism or an equivalent stable preference. Persistence MUST NOT run before route restoration, otherwise the initial URL can be overwritten by stale client state.

### 11.9 Responsive behavior

Desktop MUST support:

- expanded sidebar;
- collapsed icon rail;
- hover/focus rail affordance;
- optional floating or inset variants;
- contextual side panel without replacing the main content.

Mobile MUST use a drawer/sheet variant. Selecting a navigation item SHOULD close the drawer automatically. All controls MUST remain keyboard accessible and expose visible focus states.

### 11.10 Drag-and-drop

Drag-and-drop MUST be limited to supported sortable containers:

- Spaces in the workspace switcher;
- pinned entities;
- object-type sections;
- custom collections where ordering is enabled.

The drag state MUST distinguish `before` and `after` positions, render a preview, preserve the original order until a valid drop, and reset on cancel, pointer exit, or completion. The persisted order MUST be validated against the current IDs before saving.

### 11.11 Instrumentation and debugging

Sidebar navigation SHOULD support an opt-in trace mode:

- enable with `debug:sidebar-navigation=true` in localStorage;
- record click/navigation events with label, entity, Space, and intent;
- emit a `sidebar-navigation:trace` browser event;
- cap stored entries at 200;
- never record private content bodies or credentials.

### 11.12 Required component boundaries

The recommended component structure is:

```text
components/workspace/
├── app-sidebar.tsx
├── app-sidebar-overview.tsx
├── app-sidebar-primary-actions.tsx
├── app-sidebar-sortable-dnd.tsx
├── app-sidebar-source-icon.tsx
├── app-sidebar-icons.tsx
├── app-sidebar-object-type-studio.tsx
└── app-sidebar-floating-nav.tsx

lib/
├── sidebar-navigation-trace.ts
├── workspace-sidebar-storage.ts
└── workspace-sidebar-pinned-storage.ts
```

The visual primitives in `components/ui/sidebar.tsx` MUST remain generic. Product-specific workspace behavior belongs in the `app-sidebar-*` components and the workspace controller/provider.

### 11.13 Acceptance criteria

- A user can switch, create, rename, reorder, and delete Spaces.
- A user can navigate to every primary action from the sidebar.
- A user can search and create any supported object type.
- Pinned entities and object-type sections can be reordered and persisted.
- Normal click, new-tab intent, and side-panel intent produce distinct navigation results.
- Refreshing the page preserves the active Space, main tabs, side panel, and sidebar preference.
- URL navigation takes precedence during initial restoration.
- The sidebar works in expanded, collapsed, and mobile drawer modes.
- Context menus expose only actions supported by the selected resource.
- Destructive operations require confirmation and display failures.
- Keyboard navigation, focus visibility, labels, and reduced-motion behavior meet NFR-3.
- Automated tests cover Space switching, creation, deletion, ordering, route restoration, primary actions, context menus, and navigation trace events.

## Related

- [Intent](intent.md)
- Design exploration (visual canvas): produced alongside this document in the same session.
