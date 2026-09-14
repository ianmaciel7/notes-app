# Components Audit and Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Fix confirmed defects across all component families while preserving stable APIs and documenting the resulting contracts.

**Architecture:** Keep primitives in `src/components/ui`, domain composition in `src/components/objects`, and editor interaction in `src/components/editor`. Tighten types at public boundaries, normalize unknown values at runtime boundaries, and use semantic behavior tests plus Ladle stories as the component contract.

**Tech Stack:** Next.js 16, React 19, TypeScript, Base UI/shadcn, Tailwind CSS, Ladle, Vitest, Biome, Graphify.

**Spec:** `docs/superpowers/specs/2026-09-14-components-audit-design.md`

## Global Constraints

- Preserve the Next.js 16 server/client boundary.
- Reuse configured Base UI/shadcn primitives before adding custom UI.
- Keep domain object types in `src/lib/space-object-types.ts`.
- Use semantic theme tokens, stable `data-slot` attributes, accessible names, visible focus, and keyboard support.
- Do not edit `.worktrees/`.
- Keep code and documentation in English.
- Preserve unrelated user changes already present in the working tree.

### Task 1: Baseline and defect inventory

**Files:**
- Read: `src/components/**/*.tsx`, relevant consumers, stories, tests, and `.agents/rules/*`
- Modify: none

- [ ] Run the current test, typecheck, lint, build, and Ladle build commands.
- [ ] Query Graphify for UI, object, editor, and story relationships.
- [ ] Record only reproducible component defects and their exact files before editing.

### Task 2: Shared UI contract fixes

**Files:**
- Modify: only shared primitives with confirmed contract or accessibility defects under `src/components/ui/`
- Test: the nearest existing `*.test.tsx` or a new focused test beside the affected primitive
- Story: the nearest existing `*.stories.tsx`, or a focused story for a public state

- [ ] Preserve primitive props, refs, events, and ARIA attributes while fixing the defect.
- [ ] Add or preserve stable `data-slot` names and semantic tokens.
- [ ] Add behavior tests for keyboard, focus, disabled, error, loading, or controlled state when relevant.
- [ ] Run the focused test and typecheck.

### Task 3: Object icon and split-button contracts

**Files:**
- Modify: `src/components/objects/icons/object-icon.tsx`, `src/components/objects/icons/icon-registry.tsx`, `src/components/objects/split-buttons/object-split-button.tsx`, `src/components/objects/split-buttons/object-split-button-registry.tsx`, and affected wrappers
- Test: `src/components/objects/icons/icons.test.tsx`, `src/components/objects/split-buttons/object-split-buttons.test.tsx`, plus type assertions where needed
- Story: `src/components/objects/icons/icons.stories.tsx`, `src/components/objects/split-buttons/object-split-buttons.stories.tsx`

- [ ] Replace public `ObjectIconName | (string & {})` widening with the domain union.
- [ ] Keep arbitrary strings only in the runtime normalization and fallback lookup boundary.
- [ ] Make registry typing honest: shared runtime lookup remains shared; typed maps preserve exact key-to-component props where required.
- [ ] Add regression coverage proving valid names are accepted, invalid public names are rejected, and runtime unknown names fall back safely.

### Task 4: Editor component semantics and interaction

**Files:**
- Modify: confirmed-defect files under `src/components/editor/`
- Test: existing editor tests and focused tests beside changed controls
- Story: `src/components/editor/editor.stories.tsx`

- [ ] Preserve editor state ownership and Plate provider boundaries.
- [ ] Fix semantic roles, labels, keyboard handling, focus behavior, and selection updates only where reproducible.
- [ ] Verify controlled and read-only behavior.

### Task 5: Stories, documentation, and regression coverage

**Files:**
- Modify: affected Ladle stories and documentation references
- Add/modify: `docs/superpowers/superpowers.stories.tsx` to expose the new Markdown docs

- [ ] Ensure every changed public state has a deterministic story.
- [ ] Add accessible names to input-like and icon-only story fixtures.
- [ ] Keep docs synchronized with changed component contracts.

### Task 6: Full verification and graph refresh

- [ ] Run `pnpm test`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm ladle:build`.
- [ ] Run `graphify update .`.
- [ ] Review `git diff --check` and the final diff for unrelated changes.
