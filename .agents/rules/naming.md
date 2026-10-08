# Rule: Native Next.js and Repository Naming Conventions

## Description

Enforce strict compliance with native Next.js App Router file-system conventions and consistent code nomenclature across the repository.

## 1. Native Next.js App Router Special Files

Special files inside `src/app/` are reserved by the Next.js framework:

| File | Purpose | Key Constraints |
| :--- | :--- | :--- |
| `page.tsx` | Unique UI of a route; makes the path publicly accessible. | Server Component by default. |
| `layout.tsx` | Shared UI wrapper across sibling and child routes. | Preserves state across navigations; receives `{ children }`. |
| `loading.tsx` | Instant loading fallback using React Suspense. | Wraps `page.tsx` and nested children automatically. |
| `error.tsx` | Error boundary for segment errors. | **Must** be a Client Component (`"use client"`). |
| `global-error.tsx` | Root error boundary handling errors in root layout. | **Must** be `"use client"`; must define `<html>` and `<body>`. |
| `not-found.tsx` | 404 UI boundary. | Triggered by missing routes or `notFound()`. |
| `template.tsx` | Re-mounted layout alternative. | Creates a fresh component instance on every navigation. |
| `default.tsx` | Unmatched fallback for Parallel Routes. | Rendered when an active slot does not match current URL. |
| `route.ts` | HTTP API Route Handler (`GET`, `POST`, etc.). | **Cannot** coexist with `page.tsx` in the same directory. |

## 2. Route Folder Conventions

- **Dynamic Segments**:
  - `[id]` / `[slug]`: Single dynamic segment (e.g., `src/app/notes/[id]/page.tsx` $\rightarrow$ `/notes/:id`).
  - `[...slug]`: Catch-all segment (e.g., `src/app/docs/[...slug]/page.tsx` $\rightarrow$ `/docs/a/b/c`).
  - `[[...slug]]`: Optional catch-all segment (e.g., `src/app/shop/[[...slug]]/page.tsx`).
- **Route Groups**:
  - `(groupName)`: Groups routes logically without adding path segments to the URL (e.g., `src/app/(auth)/login/page.tsx` $\rightarrow$ `/login`).
  - Used for separate root layouts or feature domain scoping.
- **Parallel Routes (Slots)**:
  - `@slotName`: Named slot passed as a prop to parent layout (e.g., `src/app/@modal/default.tsx`).
- **Intercepting Routes**:
  - `(.)segment`: Intercepts at the same folder level.
  - `(..)segment`: Intercepts one folder level above.
  - `(..)(..)segment`: Intercepts two folder levels above.
  - `(...)segment`: Intercepts from the root `app` directory.
- **Private Folders**:
  - `_folderName`: Excludes the directory and all children from routing (e.g., `src/app/notes/_components/`).

## 3. Native Metadata and Asset Files

Standard Next.js metadata and static assets detected automatically:

- **Icons**:
  - `favicon.ico`
  - `icon.(ico|jpg|jpeg|png|svg|tsx)`
  - `apple-icon.(jpg|jpeg|png|tsx)`
- **Social Sharing**:
  - `opengraph-image.(jpg|jpeg|png|tsx)`
  - `twitter-image.(jpg|jpeg|png|tsx)`
- **Search & PWA**:
  - `robots.(txt|ts)`
  - `sitemap.(xml|ts)`
  - `manifest.(json|ts)`

## 4. Code & Identifier Conventions

- **React Components**: `PascalCase` function declarations (`export default function NoteList() {}`).
- **File & Directory Names**: `kebab-case` for all repository files (`note-card.tsx`, `use-mobile.ts`).
- **Custom Hooks**: `camelCase` prefixed with `use` (`useMobile`, `useNotesFilter`). Two kinds: context accessors (like `useSidebar`) stay in their component file; every other hook lives in its own `use-*.ts(x)` file in `src/hooks/` (import via `@/hooks`), never inline in a component file.
- **Server Actions**: `camelCase` verb phrases (`createNote`, `deleteNote`, `updateNoteTitle`).
- **Route Handler Methods**: Uppercase HTTP method names (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`).
- **Types & Interfaces**: `PascalCase` (`NoteItem`, `CreateNoteInput`, `PageProps`).
- **Environment Variables**:
  - Server-only secrets: `SCREAMING_SNAKE_CASE` (e.g., `DATABASE_URL`).
  - Browser-exposed: `NEXT_PUBLIC_*` (strictly for non-sensitive public configuration).

See [./nextjs.md](./nextjs.md),
[../../docs/guards/NEXTJS-GUARD-COVERAGE.md](../../docs/guards/NEXTJS-GUARD-COVERAGE.md), and
[../../CODING_STANDARDS.md](../../CODING_STANDARDS.md).
