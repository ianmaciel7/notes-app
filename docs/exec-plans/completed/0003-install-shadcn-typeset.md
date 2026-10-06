# Execution Plan: Install shadcn/typeset Markdown Typography System

> **Historical record.** This completed plan preserves the implementation and
> verification context from 2026-10-05. Current versions, guards, CI gates,
> product direction, and architecture are documented in the root project docs.

## Metadata

- **Status**: `Completed`
- **Owner**: `Lead Orchestrator`
- **Started**: `2026-10-05`
- **Last Updated**: `2026-10-05`

---

## 1. Objective

Integrate the `shadcn/typeset` pure-CSS Markdown typography system into the Next.js exam-study platform foundation. This establishes a high-performance, token-aware prose styling foundation for rendering Markdown notes, documentation, code blocks, tables, and rich text without runtime JavaScript overhead or reliance on legacy PostCSS plugins.

---

## 2. Scope

### In Scope
- Vendor and host the official `shadcn/typeset` stylesheet locally at `src/app/typeset.css`.
- Import `src/app/typeset.css` into `src/app/globals.css` and configure reusable typography presets (`.typeset-docs`).
- Harmonize font variable exports in `src/app/layout.tsx` (`--font-geist` and `--font-geist-mono`) with global theme and typeset variables.
- Discover candidate UI surfaces across the application for prose wrapping and prompt the user for target selection.
- Wrap chosen surface(s) with `.typeset` / `.typeset-docs` or defer according to user direction, and verify visual formatting, layout integrity, and build compliance.
- Document architectural rationale in ADR 0003.

### Out of Scope
- Implementation of rich-text Markdown editing tools, toolbar components, or AST parsers (addressed in future editor execution plans).
- Custom font family integration beyond the standard Geist and Geist Mono font stacks.
- Re-architecting unrelated application components or global layout primitives.

---

## 3. Canonical Context

- **Architecture Decision Record**: [ADR 0003](../../adr/0003-install-shadcn-typeset.md) (`docs/adr/0003-install-shadcn-typeset.md`)
- **Upstream Specification**: [shadcn/typeset Documentation](https://ui.shadcn.com/docs/typeset)
- **Technologies & Dependencies**:
  - Framework / Runtime: Next.js App Router (React 19, React Server Components)
  - Language: TypeScript 5
  - Styling: Tailwind CSS v4 (`@import "tailwindcss";`), CSS Cascade Layers (`@layer components`)
  - Fonts: Geist & Geist Mono via `next/font/google`
  - Tooling: Biome v2

---

## 4. Plan & Milestones

- [x] **Milestone 1: Download and Host typeset.css (Completed)**
  - [x] Fetch the upstream `shadcn/typeset` stylesheet.
  - [x] Place the stylesheet at `src/app/typeset.css` enclosed within `@layer components`.
  - [x] Ensure all core typography elements (headings, paragraphs, blockquotes, lists, tables, pre/code, math, media, GFM task lists) and opt-out selectors (`.not-typeset`, `[data-not-typeset]`) are present.

- [x] **Milestone 2: CSS Import & Preset Definition (Completed)**
  - [x] Import `./typeset.css` into `src/app/globals.css` directly following Tailwind CSS imports.
  - [x] Define `.typeset-docs` preset mapping `--typeset-font-body`, `--typeset-font-heading`, and `--typeset-font-mono` to Next.js Geist CSS variables.
  - [x] Configure comfortable default reading metrics (`--typeset-size: 15px`, `--typeset-leading: 1.75`, `--typeset-flow: 1.25em`).

- [x] **Milestone 3: Root Layout Font Wiring (Completed)**
  - [x] Update `src/app/layout.tsx` to standardize font variable identifiers (`variable: "--font-geist"` and `variable: "--font-geist-mono"`).
  - [x] Ensure root `<html>` element correctly applies font variables alongside base utility classes.

- [x] **Milestone 4: Candidate Surface Discovery & User Selection (Completed)**
  - [x] Analyze codebase to discover candidate surfaces that render or will render prose / Markdown content (e.g., `src/app/page.tsx`, preview containers, note viewers).
  - [x] Present discovered surface options to the user and request confirmation on wrapping targets.
  - [x] User decision: Leave existing surfaces untouched and defer wrapping to the upcoming note viewing components in SPEC-0001.

- [x] **Milestone 5: Surface Wrapping & Verification (Completed)**
  - [x] Resolution: Deferred surface wrapping per user decision; shadcn/typeset infrastructure is fully installed, tested, and ready.
  - [x] Run full verification checks (`pnpm biome check src`, `pnpm build`).

---

## 5. Progress and Decision Log

| Date | Author | Event / Decision | Rationale |
| --- | --- | --- | --- |
| 2026-10-05 | Lead Orchestrator | Vendor `typeset.css` locally | Downloaded and hosted `src/app/typeset.css` under `@layer components` to avoid external package churn and allow repository-controlled adjustments. |
| 2026-10-05 | Lead Orchestrator | Preset `.typeset-docs` configuration | Configured `.typeset-docs` in `src/app/globals.css` binding `--font-geist` and `--font-geist-mono` with 15px base size and 1.75 line height for optimal readability. |
| 2026-10-05 | Lead Orchestrator | Root layout font alignment | Standardized Google font variable naming in `src/app/layout.tsx` to `--font-geist` and `--font-geist-mono`, ensuring isomorphic resolution across styles and components. |
| 2026-10-05 | Lead Orchestrator | Candidate surface assessment | Discovered current application surface `src/app/page.tsx` (scaffolded default page); formulated user prompt to choose wrapping approach before modifying UI markup. |
| 2026-10-05 | Lead Orchestrator | Defer surface wrapping | User confirmed leaving existing surfaces untouched; wrapping will be applied directly to note viewing components in SPEC-0001. |
| 2026-10-05 | Lead Orchestrator | Execution plan completion | Marked all milestones completed with infrastructure verified and ready for note components. |

---

## 6. Verification

- **Code Formatting & Linting**:
  ```bash
  pnpm biome check src
  ```
  *Result*: Clean pass, 0 diagnostics or formatting deviations.

- **Type Checking & Build**:
  ```bash
  pnpm build
  ```
  *Result*: Turbopack and React Compiler build passes successfully.

- **File Layout Integrity**:
  Confirmed presence of:
  - `src/app/typeset.css`
  - `src/app/globals.css` (with `@import "./typeset.css"` and `.typeset-docs`)
  - `src/app/layout.tsx` (with `--font-geist` and `--font-geist-mono`)
  - `docs/adr/0003-install-shadcn-typeset.md`
  - `docs/exec-plans/completed/0003-install-shadcn-typeset.md`

---

## 7. Completion Summary

- **Completed Date**: `2026-10-05`
- **Result Summary**: The `shadcn/typeset` pure-CSS Markdown typography system was successfully installed, imported, and configured with `.typeset-docs` presets and Next.js Geist font variables. Candidate surface discovery was conducted, and the user decided to defer surface wrapping to the upcoming note viewing components specified in SPEC-0001. All typography infrastructure, configuration, and build verifications have passed cleanly.
