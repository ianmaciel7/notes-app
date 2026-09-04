# Explicit Tooltip and Preview Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Notes App tooltips and hover previews follow the archived Capacities interaction model instead of deriving visual hints automatically from ARIA metadata.

**Architecture:** Accessibility metadata remains independent from presentation. `Button` exposes an explicit `tooltip` prop backed by the existing detached Base UI Tooltip handle, while `HoverCard` remains a Preview Card with Capacities entity-preview timing and geometry. Popovers remain click-driven interactive surfaces. Shared styles own the visual tokens.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript, Tailwind CSS v4, Base UI 1.7, Playwright.

**Spec:** `DESIGN.md#7-accessible-interaction-contract`

## Global Constraints

- Use Base UI/shadcn primitives already present in the repository.
- `aria-label`, `aria-description`, and `aria-keyshortcuts` must never opt a control into a visual tooltip by themselves.
- Capacities tooltip defaults: 200 ms open delay, 0 ms close delay, 6 px offset, `max-w-40`, no arrow, non-interactive, hidden on mobile by default.
- Capacities entity-preview defaults: 330 ms open dwell, 180 ms close tolerance, 4 px main-axis offset, top placement, desktop only.
- Tooltip and preview use different semantic primitives and motion.
- Preserve keyboard focus, Escape dismissal, collision handling, and popup ARIA.
- Keep the existing `InteractionProvider`; change it from ARIA-derived registration to explicit tooltip payload rendering.

---

### Task 1: Replace the ARIA-derived regression contract

**Files:**
- Modify: `tests/interaction-hints.spec.ts`

**Interfaces:**
- Consumes: `resolveInteractionTooltip`, explicit `tooltip` Button behavior, rendered header/sidebar controls.
- Produces: tests proving ARIA alone does not create a visual tooltip and explicit tooltip controls still render Capacities-style hints.

- [x] **Step 1:** Add a pure contract test asserting `resolveInteractionTooltip(undefined)` is `undefined` and explicit string/config values normalize to tooltip payloads.
- [x] **Step 2:** Change runtime assertions from `[data-hint]` to explicit `[data-interaction-tooltip-trigger]` controls.
- [x] **Step 3:** Assert sidebar/header tooltip controls still expose their ARIA metadata independently.
- [x] **Step 4:** Assert the standard tooltip popup uses `max-w-40` and no arrow.

### Task 2: Make Button tooltips explicit

**Files:**
- Modify: `src/components/ui/interaction-hint.ts`
- Modify: `src/components/ui/interaction-provider.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/tooltip.tsx`
- Modify: `src/components/ui/shared-styles.ts`

**Interfaces:**
- Produces: `InteractionTooltip`, `InteractionTooltipConfig`, `resolveInteractionTooltip()`, and `ButtonProps.tooltip`.

- [x] **Step 1:** Define `InteractionTooltip` as either a string or config with `text`, optional `description`, `shortcuts`, `side`, `delay`, `closeDelay`, and `showOnMobile`.
- [x] **Step 2:** Normalize tooltip values without reading ARIA attributes.
- [x] **Step 3:** Remove `data-hint`/icon-size automatic registration from `Button`; return the plain button when `tooltip` is absent.
- [x] **Step 4:** Wrap only explicitly configured buttons in the detached Tooltip trigger, with mobile disabled unless `showOnMobile` is true.
- [x] **Step 5:** Render explicit tooltip payloads in `InteractionProvider` and keep provider defaults at 200/0/400.
- [x] **Step 6:** Match archived `.base-tooltip`: content-box, base radius, 50% front surface, 50% strong border, xs/medium text, 8 px blur, restrained shadow, `max-w-40`, fade-only motion, no arrow.

### Task 3: Match Capacities entity HoverCard behavior

**Files:**
- Modify: `src/components/ui/hover-card.tsx`
- Modify: `src/components/ui/shared-styles.ts`

**Interfaces:**
- Produces: Preview Card defaults of 330/180 ms, top/4 px geometry, preview-card surface, fade-only motion.

- [x] **Step 1:** Change HoverCard trigger defaults to 330 ms open and 180 ms close.
- [x] **Step 2:** Change HoverCard content defaults to top placement and 4 px offset.
- [x] **Step 3:** Match the archived entity preview shell (`w-72`, compact `p-1.5`, xs typography) while keeping caller class overrides possible.
- [x] **Step 4:** Remove popover-like zoom/slide motion from HoverCard and use preview fade motion only.

### Task 4: Migrate known application controls explicitly

**Files:**
- Modify: `src/components/app-header.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`

**Interfaces:**
- Consumes: `Button.tooltip`.
- Produces: explicit tooltip ownership for header history/focus controls and sidebar New/Search/Explore/Calendar/Tasks actions.

- [x] **Step 1:** Pass explicit tooltip text to header actions while keeping ARIA labels unchanged.
- [x] **Step 2:** Convert sidebar command hints into explicit tooltip config using the same translated action/hint data and keyboard shortcuts.
- [x] **Step 3:** Remove `data-hint` and `data-hint-side` usage from those controls.
- [x] **Step 4:** Keep popup triggers and command-dialog behavior independent from tooltip state.

### Task 5: Correct the design contract and reference evidence

**Files:**
- Modify: `DESIGN.md`
- Modify: `artifacts/reference-evidence/floating-interactions/README.md`
- Modify: `docs/superpowers/plans/2026-09-04-accessible-interaction-contract.md`

**Interfaces:**
- Produces: durable documentation matching the archived Capacities sources and official navigation/shortcut docs.

- [x] **Step 1:** Replace the statement that ARIA automatically owns visual hints with the explicit-tooltip rule.
- [x] **Step 2:** Document tooltip defaults and HoverCard preview defaults separately.
- [x] **Step 3:** Mark the previous ARIA-derived implementation plan as superseded by this corrective plan.
- [x] **Step 4:** Keep source references to `Interactable59846.js`, `RootEntity59846.js`, and `index59846.css`.

### Task 6: Verify the change

**Files:** all changed files above.

- [ ] **Step 1:** Transpile every modified `.ts`/`.tsx` file with TypeScript and require zero syntax diagnostics.
  - Partial verification completed: the changed UI primitives, header, shared styles, and regression test transpile without syntax diagnostics. The full sidebar module could not be executed in a repository dependency environment here.
- [ ] **Step 2:** Run Playwright interaction tests if a runnable dependency environment is available; otherwise report the runtime limitation explicitly.
  - Runtime unavailable in the current environment: no project checkout/dependency installation is available for starting Next.js + Playwright.
- [x] **Step 3:** Compare the final `dev` diff against the starting SHA and confirm no unrelated concurrent changes were overwritten.
  - A concurrent `fix: match Capacities focus mode behavior` commit landed during the work. Its `page.tsx`, focus provider/evidence/test, and expanded `app-header.tsx` behavior remain preserved; the current header still contains the explicit tooltip configuration.
- [x] **Step 4:** Verify the remote `dev` HEAD and available GitHub status checks.
  - Remote `dev` was verified after implementation. GitHub currently reports no combined statuses and no workflow runs for the checked HEAD; this is recorded as absence of CI evidence, not as a passing CI result.
