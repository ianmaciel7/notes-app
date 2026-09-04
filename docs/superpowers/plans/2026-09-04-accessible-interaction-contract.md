# Accessible Interaction Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ad-hoc tooltip/hint behavior with one ARIA-first interaction contract grounded in the archived Capacities behavior.

**Architecture:** `aria-label` is the canonical action name, with optional `aria-description` and `aria-keyshortcuts`. A single root `InteractionProvider` owns one detached Base UI Tooltip handle. The shared `Button` transparently registers labeled hint triggers, so callers use `aria-label`/ARIA metadata without adding tooltip wrappers; Base UI `HoverCard` remains only for object previews and `Popover` remains for explicit interactive popups. Shared floating-surface classes own visual parity.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript, Tailwind CSS v4, Base UI 1.7, Floating UI DOM, Playwright.

**Spec:** `DESIGN.md#7-accessible-interaction-contract`

## Global Constraints

- Use `pnpm` for project commands and Biome as the formatter/linter.
- Keep Base UI/shadcn primitives instead of creating replacement popup primitives.
- `aria-label` is the only canonical action-name copy.
- No component-local hover timers for hints.
- Capacities parity: hint open 200 ms, close 0 ms, 6 px offset, no arrow; preview open 330 ms, close tolerance 180 ms.
- Preserve keyboard focus and Escape dismissal.

---

### Task 1: Define failing interaction-contract coverage

**Files:**
- Create: `tests/interaction-hints.spec.ts`

**Interfaces:**
- Consumes: existing app header/sidebar rendered at `/`.
- Produces: runtime assertions for ARIA-derived hints and removal of legacy tooltip/hover-card wrappers.

- [x] **Step 1: Write the failing tests** for header hover, keyboard dismissal, and sidebar ARIA hints.
- [x] **Step 2: Verify RED** against the existing source contract: header duplicates `tooltip`, sidebar owns a 200 ms `setTimeout`, and tooltip provider defaults to 0 ms.

### Task 2: Implement the root ARIA-driven hint owner

**Files:**
- Create: `src/components/ui/interaction-hint.ts`
- Create: `src/components/ui/interaction-provider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/ui/button.tsx`

**Interfaces:**
- Consumes: `[data-hint][aria-label]`, `aria-description`, `aria-keyshortcuts`, `data-hint-side`.
- Produces: `InteractionProvider`; icon-sized labeled `Button`s automatically opt into hints.

- [x] **Step 1: Create one detached Base UI Tooltip handle** shared by the root provider and `Button` triggers.
- [x] **Step 2: Delegate 200/0/400 timing, touch suppression, focus, Escape, collision handling, and adjacent-tooltip behavior to Base UI.**
- [x] **Step 3: Mount the provider once** in `RootLayout`.
- [x] **Step 4: Make icon `Button` + `aria-label` the zero-duplication default** with `data-hint="off"` as an escape hatch.

### Task 3: Standardize shared floating primitives

**Files:**
- Modify: `src/components/ui/shared-styles.ts`
- Modify: `src/components/ui/tooltip.tsx`
- Modify: `src/components/ui/hover-card.tsx`
- Modify: `src/components/ui/popover.tsx`
- Modify: `src/components/ui/kbd.tsx`

**Interfaces:**
- Produces: `tooltipSurfaceClass`, `floatingInteractionSurfaceClass`, 200/0/400 tooltip provider defaults, 330/180 preview-trigger defaults, semantic `KbdGroup`.

- [x] **Step 1: Centralize tooltip and interactive floating-surface tokens.**
- [x] **Step 2: Set Tooltip provider parity defaults** and remove the default arrow/inverted surface.
- [x] **Step 3: Set Preview Card trigger dwell/close defaults** while retaining Base UI behavior.
- [x] **Step 4: Reuse the shared interactive surface for HoverCard and Popover.**
- [x] **Step 5: Fix `KbdGroup` to render a `<span>` instead of nesting `<kbd>`.**

### Task 4: Migrate existing header/sidebar hints

**Files:**
- Modify: `src/components/app-header.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`
- Modify: `src/lib/workspace-shortcuts.ts`

**Interfaces:**
- Consumes: `InteractionProvider` contract.
- Produces: no duplicated `tooltip` prop in the header; no local HoverCard/timer in primary sidebar actions; standards-compliant `aria-keyshortcuts` formatting.

- [x] **Step 1: Remove AppHeaderAction Tooltip wrappers** and keep `aria-label` as the single copy source.
- [x] **Step 2: Convert sidebar command descriptions/shortcuts into `aria-description`/`aria-keyshortcuts`.**
- [x] **Step 3: Remove sidebar timer/open state/HoverCard hint implementation.**
- [x] **Step 4: Remove the redundant nested TooltipProvider.**

### Task 5: Preserve reference evidence and document the contract

**Files:**
- Modify: `DESIGN.md`
- Create: `artifacts/reference-evidence/floating-interactions/README.md`
- Create: seven user-provided screenshot evidence files in the same directory.

**Interfaces:**
- Produces: durable design rules and visual/source evidence for future parity work.

- [x] **Step 1: Document canonical ARIA semantics and hint/preview/popup boundaries.**
- [x] **Step 2: Record the archived Capacities source findings and source-file names.**
- [x] **Step 3: Preserve the user-provided screenshots with descriptive filenames.**

### Task 6: Verify and publish

**Files:** all changed files above.

- [x] **Step 1: Re-run source-contract checks** and confirm all expected GREEN conditions.
- [x] **Step 2: Transpile every changed `.ts`/`.tsx` file with TypeScript** to catch syntax errors.
- [ ] **Step 3: Create one commit on top of the current `dev` HEAD.**
- [ ] **Step 4: Fast-forward `dev` to the new commit and verify the remote diff/status.**
