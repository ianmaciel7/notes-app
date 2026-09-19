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

> The originally proposed "Fluid Functionalism" registry and "Shoogle" component library are **not** currently wired into this stack (`components.json` has `"registries": {}`) and are flagged for a supply-chain review in §9 before any adoption.

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
4. **Third-party registries are a supply-chain risk, not yet adopted.** intent.md/the earlier draft named "Fluid Functionalism" (`fluidfunctionalism.com`) and "Shoogle" (`shoogle.dev`) as UI sources. `components.json` currently has `registries: {}` — nothing points at them. Pointing the shadcn CLI at an external registry pulls in and executes that party's components/CSS/build config inside this codebase. **Before adoption:** vet the registry's contents and provenance the same way any new dependency would be reviewed; do not add it to `components.json` as a blanket default without that review. This spec does not assume it will be adopted.
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

## Related

- [Intent](intent.md)
- Design exploration (visual canvas): produced alongside this document in the same session.
