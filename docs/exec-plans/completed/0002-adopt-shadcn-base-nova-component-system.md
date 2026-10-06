# Execution Plan: Adopt shadcn Base Nova UI Component System

> **Historical record.** This completed plan preserves the implementation and
> verification context from 2026-10-05. Current versions, guards, CI gates,
> product direction, and architecture are documented in the root project docs.

## Metadata

- **Status**: Completed
- **Owner**: Lead Orchestrator
- **Started**: 2026-10-05
- **Last Updated**: 2026-10-05

---

## 1. Objective

Integrate the complete shadcn UI component library into the exam-study platform foundation using the `base-nova` design style and `@base-ui/react` primitives. This establishes a fully accessible, composable, in-tree UI design system supporting form controls, navigation shells, overlays, interactive modals, charts, and data displays, while strictly enforcing global pointer cursor standards and Tailwind CSS v4 OKLCH theme token alignment.

---

## 2. Scope

### In Scope

- Initialize and configure `components.json` with style `base-nova`, RSC support, path aliases, and Lucide icon integration.
- Install and vendor all 61 standard shadcn UI component primitives into `src/components/ui/`.
- Configure complete OKLCH semantic theme tokens and dark mode palettes in `src/app/globals.css`.
- Enforce the global button pointer cursor standard (`cursor: pointer` for interactive button elements and ARIA button roles) in `src/app/globals.css` and codify governance in `CODING_STANDARDS.md`.
- Harmonize toolchain configuration in `biome.json` to isolate in-tree vendorized UI primitives from formatting and linting churn while strictly checking application consumers.
- Verify end-to-end type safety, build integrity (`pnpm build`), and code health (`pnpm biome check`).
- Document architectural choices in ADR 0002.

### Out of Scope

- Authoring custom note-taking application features or business domain views (covered under feature execution plans).
- Custom modifications or restyling of individual upstream primitives beyond global theme token consumption.
- Replacing Lucide icons with alternative iconography libraries.

---

## 3. Canonical Context

- **Architecture Decision Record**: [ADR 0002](../../adr/0002-adopt-shadcn-base-nova-component-system.md) (`docs/adr/0002-adopt-shadcn-base-nova-component-system.md`)
- **Upstream Documentation**: [shadcn UI](https://ui.shadcn.com/)
- **Technologies & Dependencies**:
  - Framework / Runtime: Next.js 16 App Router (React 19, React Server Components)
  - Primitives: `@base-ui/react`, `@shadcn/react`
  - Utility Libraries: `class-variance-authority`, `clsx`, `tailwind-merge` (`src/lib/utils.ts`)
  - Specialized Ecosystem Primitives: `cmdk`, `recharts`, `react-day-picker`, `embla-carousel-react`, `react-resizable-panels`, `input-otp`
  - Icons: `lucide-react`
  - Language: TypeScript 5
  - Styling: Tailwind CSS v4, `tw-animate-css`, `shadcn/tailwind.css`
  - Tooling: Biome 2.4.2

---

## 4. Plan & Milestones

- [x] **Milestone 1: CLI Initialization & Registry Configuration (Completed)**
  - [x] Initialize `components.json` specifying `base-nova` style and `@base-ui/react` primitives.
  - [x] Configure paths and aliases (`@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`).
  - [x] Set icon library to `lucide` and CSS target to `src/app/globals.css`.

- [x] **Milestone 2: UI Primitives Installation (Completed)**
  - [x] Install all 61 standard UI primitives into `src/components/ui/` (`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `fieldset`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `status`, `switch`, `table`, `tabs`, `textarea`, `timeline`, `toggle`, `toggle-group`, `tooltip`, etc.).
  - [x] Install required runtime dependencies (`@base-ui/react`, `lucide-react`, `cmdk`, `recharts`, `date-fns`, `react-day-picker`, `embla-carousel-react`, `react-resizable-panels`, `input-otp`, `tw-animate-css`).
  - [x] Ensure helper functions in `src/lib/utils.ts` (`cn`) resolve correctly.

- [x] **Milestone 3: Theme Tokens & Pointer Cursor Enforcement (Completed)**
  - [x] Inject complete OKLCH theme palettes into `:root` and `.dark` in `src/app/globals.css`.
  - [x] Map tokens to `@theme inline` for Tailwind CSS v4 compatibility (including chart colors `--color-chart-1` to `--color-chart-5` and `--color-sidebar-*`).
  - [x] Add global pointer cursor rule to `@layer base` for `button:not(:disabled)` and `[role="button"]:not(:disabled)`.

- [x] **Milestone 4: Standards Alignment & Toolchain Harmonization (Completed)**
  - [x] Document shadcn UI registry governance and pointer cursor standard in `CODING_STANDARDS.md` (§ 5.1).
  - [x] Configure `biome.json` to ignore vendorized `src/components/ui` to avoid lint/formatting churn on registry templates.
  - [x] Author ADR 0002 documenting context, decision, consequences, and trade-offs.

- [x] **Milestone 5: Verification & Production Build Validation (Completed)**
  - [x] Verify static code analysis passes with zero warnings (`pnpm biome check`).
  - [x] Verify full production build succeeds with React Compiler (`pnpm build`).
  - [x] Verify all repository path references are portable and relative.

---

## 5. Progress and Decision Log

| Date | Author | Event / Decision | Rationale |
| --- | --- | --- | --- |
| 2026-10-05 | Lead Orchestrator | Initialize shadcn with `base-nova` | Chose `base-nova` style with `@base-ui/react` primitives to align with React 19 and provide modern, accessible UI controls. |
| 2026-10-05 | Lead Orchestrator | Vendor full component suite (61 components) | Installed all primitives into `src/components/ui/` to provide complete UI building blocks across note editing, navigation, sidebars, charts, and dialogs. |
| 2026-10-05 | Lead Orchestrator | Enforce global pointer cursor standard | Configured `button:not(:disabled)` and `[role="button"]:not(:disabled)` in `src/app/globals.css` to guarantee unambiguous clickable affordance on desktop viewports. |
| 2026-10-05 | Lead Orchestrator | Harmonize Biome ignore rules | Excluded `src/components/ui` in `biome.json` while maintaining strict linting across all consuming application source code to prevent upstream generator drift. |
| 2026-10-05 | Lead Orchestrator | Codify standards & ADR 0002 | Updated `CODING_STANDARDS.md` (§ 5.1), created ADR 0002, and finalized completed execution plan. |

---

## 6. Verification

- **Linting & Formatting**:
  ```bash
  pnpm biome check
  ```
  *Result*: Clean pass, zero diagnostics or formatting deviations across application source files.

- **Type Checking & Build**:
  ```bash
  pnpm build
  ```
  *Result*: Next.js App Router build and React Compiler compilation succeed with zero errors.

- **File Layout & Boundary Checks**:
  - `components.json`: Properly configured with `base-nova` and Lucide icons.
  - `src/components/ui/`: Verified presence of 61 UI component files.
  - `src/app/globals.css`: Contains OKLCH theme variables, Tailwind `@theme inline` mappings, and pointer cursor rule.
  - `CODING_STANDARDS.md`: Section 5.1 codifies shadcn primitives and pointer cursor standard.
  - `docs/adr/0002-adopt-shadcn-base-nova-component-system.md`: Canonical decision record established.
  - Path portability confirmed: No hardcoded local machine paths in any created documents.

---

## 7. Completion Summary

- **Completed Date**: `2026-10-05`
- **Result Summary**: Successfully adopted the entire shadcn UI component library (`base-nova` style) with all 61 UI primitives installed in `src/components/ui/`. Configured complete OKLCH theme variables for light and dark modes in `src/app/globals.css`, enforced the global pointer cursor standard for interactive button elements, documented architectural governance in `CODING_STANDARDS.md` and ADR 0002, and verified clean passes across Biome linting and Next.js production builds.
