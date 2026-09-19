# Technical Specification: Community Exam Prep Platform

- Author: Project team
- Created: 2026-09-19
- Status: draft

## 1. Architecture Overview
The platform is a Next.js web application functioning as a Graph-based Personal Knowledge Management (PKM) and exam preparation system. It employs a multi-tenant, space-based architecture utilizing Firebase services for database, authentication, and hosting. The core UI pattern is an object-oriented, block-based editor inspired by Capacities.

## 2. Technology Stack
- **Framework:** Next.js (React 19) - App Router.
- **Language:** TypeScript.
- **Package Manager:** pnpm.
- **Styling:** Tailwind CSS.
- **Base UI:** shadcn/ui and [Shoogle](https://shoogle.dev/).
- **Rich Text / Block Editor:** TipTap (Headless editor integrated with custom UI).
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth (Email/Password, Magic Link, Google Native).
- **Hosting & CI/CD:** Firebase App Hosting.

## 3. Design System & UI Principles
- **Fluid Functionalism Registry:** All shadcn/ui base components MUST be installed using the custom registry from [Fluid Functionalism](https://www.fluidfunctionalism.com/). The project configuration (e.g., `components.json` or CLI commands) must point to this specific registry to ensure the fluid typography, spacing (using `clamp()`), and motion curves are applied natively upon installation.
- **Shoogle Priority:** Maximize the reuse of components from [shoogle.dev](https://shoogle.dev/) before writing custom UI components from scratch. Combine Shoogle's logic with the Fluid Functionalism aesthetic.

## 4. Database Schema (Graph-Ready Firestore)
To support polymorphic relations and bidirectional graph querying without hitting the 1MB document limit, the database utilizes a central edges collection.

### Collections:
- `users`: Stores user profile data and settings.
- `spaces`: The top-level tenant container. Every object belongs to a `spaceId`.
- `objects`: The primary content collection. Documents use a `type` discriminator.
  - Types: `question`, `exam`, `tag`, `collection`, `note`, `citation`.
  - Common fields: `id`, `spaceId`, `type`, `createdAt`, `updatedAt`, `content` (TipTap JSON representation).
- `object_links` (The Graph Edges): Manages relationships between any two objects.
  - Fields: `sourceId`, `targetId`, `relationType` (e.g., "references", "belongs_to"), `spaceId`.
- `study_records`: Tracks the user's Spaced Repetition performance.
  - Fields: `userId`, `objectId` (Question ID), `nextReviewDate`, `interval`, `easeFactor`, `history`.

## 5. Interfaces & APIs

### 5.1 Server Actions (Next.js)
All secure business logic will bypass standard API routes in favor of Next.js Server Actions using the `firebase-admin` SDK. 
- **Spaced Repetition Engine:** The client submits a study attempt; a Server Action runs the SM-2 algorithm, calculates the `nextReviewDate`, and mutates the `study_records` collection directly from the server.

### 5.2 Model Context Protocol (MCP) Server
- **Endpoint:** `/api/mcp/route.ts` (Next.js Route Handler).
- **Transport:** Server-Sent Events (SSE) or standard HTTP POST.
- **Scope:** Read-only access exposing `Questions`, `Notes`, and `Citations`. 

## 6. Security & Data Isolation
- **Firestore Security Rules:** Strict tenant isolation. Users can only read/write documents in `objects` and `object_links` where `spaceId` matches their owned spaces. Public viewing is allowed if `isPublic == true`.
- **Route Protection:** Next.js Middleware verifies the Firebase Auth token to protect private Space routes.

## 7. Target Directory Structure
```text
/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Login and Registration routes
│   ├── (dashboard)/      # Protected Space/PKM routes
│   └── api/mcp/          # MCP Server Route Handlers
├── components/           # React Components
│   ├── editor/           # TipTap Custom Nodes and UI
│   └── ui/               # Fluid Functionalism adapted components (via custom registry)
├── lib/                  # Shared utilities
│   ├── firebase/         # Firebase Client SDK initialization
│   ├── firebase-admin/   # Firebase Admin SDK (Server only)
│   └── srs/              # Spaced Repetition Algorithm logic
├── actions/              # Next.js Server Actions
└── types/                # Global TypeScript definitions (Object types, schemas)