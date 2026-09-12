# Codebase Conventions & Guidelines

This document outlines structural rules, naming conventions, and file organization standards for `notes-app`.

---

## 1. Directory Conventions

- **`src/app/`**: Next.js App Router route segments, layouts, pages, and API route handlers.
- **`src/components/ui/`**: Primitive, unstyled shadcn/ui components. Pure presentational UI with zero domain logic.
- **`src/components/common/`**: Shared layout components (Navbar, Sidebar, Shell).
- **`src/components/features/`**: Feature-encapsulated UI domain components (`notes/`, `srs/`, `ingestion/`).
- **`src/lib/`**: Framework-agnostic pure logic engines, math, and database clients.
- **`src/actions/`**: Next.js Server Actions for data mutations.
- **`src/types/`**: Global TypeScript interfaces and DTOs.

---

## 2. Coding Rules & Principles

1. **React Server Components (RSC) by Default**:
   - Keep components server-side unless browser state/hooks are strictly required. Add `"use client"` only at leaf interactive nodes.

2. **Language Requirement**:
   - All code, comments, docstrings, and commit messages must be written in **English**.

3. **Portable Paths**:
   - Never hardcode user-specific absolute paths. Always use relative paths or portable environment variables.

4. **Linting & Formatting**:
   - Managed via Biome (`biome.json`). Run `pnpm check` before committing code.

5. **Knowledge Graph (`graphify`)**:
   - AST knowledge graph is maintained at `graphify-out/`. Keep graph updated via `graphify update .`.
