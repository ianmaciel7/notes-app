# AI Development Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in this side conversation. Subagents are intentionally not used here because the active user instruction forbids them.

**Goal:** Make AI-assisted development in this repository discoverable, proportional, and verifiable without adding a heavy agent framework.

**Architecture:** Keep `AGENTS.md` as the stable entry point and move operational detail to `docs/ai-development-flow.md`. Add a small executable policy in `src/tooling/ai-development-flow.ts` so workflow selection is testable. Reuse existing docs, skills, Biome, Vitest, Playwright, and quality scripts.

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript, pnpm 11.20.0, Biome, Vitest.

**Spec:** User request pasted at `C:\Users\BobBytes\.codex\attachments\3898357b-b2a1-4ef4-97f4-3608387b9203\pasted-text.txt`.

## Global Constraints

- Preserve local changes and do not reset, commit, push, merge, deploy, or alter global configuration.
- Keep Biome as the sole general linter and formatter.
- Do not create a multiagent platform or introduce LangGraph-style orchestration.
- Do not configure unconfirmed tool schemas or claim integrations were verified without running them.
- Use executable verification evidence before completion claims.

---

### Task 1: Inspect Existing Project Workflow

**Files:**
- Read: `AGENTS.md`
- Read: `SPEC.md`
- Read: `DECISIONS.md`
- Read: `ARCHITECTURE.md`
- Read: `SECURITY.md`
- Read: `package.json`

**Interfaces:**
- Produces: baseline facts for documentation and verification reporting.

- [x] **Step 1: Confirm root, branch, and working tree**

Run: `git rev-parse --show-toplevel`, `git branch --show-current`, `git status --short`

- [x] **Step 2: Inspect scripts and current instructions**

Run: `Get-Content -Raw package.json`, `Get-Content -Raw AGENTS.md`

### Task 2: Add Executable Workflow Policy

**Files:**
- Create: `src/tooling/ai-development-flow.test.ts`
- Create: `src/tooling/ai-development-flow.ts`

**Interfaces:**
- Produces: `classifyDevelopmentWork(input)` and `summarizeRequiredWorkflow(policy)`.

- [x] **Step 1: Write failing tests for lightweight, bounded bugfix, and complex sensitive work**

Run: `pnpm exec vitest run src/tooling/ai-development-flow.test.ts`

- [x] **Step 2: Implement policy and rerun focused tests**

Run: `pnpm exec vitest run src/tooling/ai-development-flow.test.ts`

### Task 3: Add Discoverable Documentation and Templates

**Files:**
- Create: `docs/ai-development-flow.md`
- Create: `docs/templates/change-spec.md`
- Create: `docs/templates/bugfix-spec.md`
- Create: `docs/templates/checkpoint.md`

**Interfaces:**
- Consumes: executable policy from Task 2.
- Produces: canonical operating guide and reusable templates.

- [x] **Step 1: Document workflow levels, RPI, reviews, examples, evidence labels, and consulted sources**

- [x] **Step 2: Add spec, bugfix, and checkpoint templates**

### Task 4: Wire Agent Discovery

**Files:**
- Modify: `AGENTS.md`
- Create: `.agents/skills/ai-development-flow/SKILL.md`
- Create: `.agents/rules/ai-development-flow.md`

**Interfaces:**
- Consumes: `docs/ai-development-flow.md`.
- Produces: a short permanent map plus a callable project skill.

- [x] **Step 1: Update `AGENTS.md` with a concise AI development flow section**

- [x] **Step 2: Add Antigravity workspace rule and local skill pointing to the canonical guide**

### Task 5: Verify and Report

**Files:**
- Read: changed files and command output.

**Interfaces:**
- Produces: final evidence table.

- [x] **Step 1: Run focused tests**

Run: `pnpm exec vitest run src/tooling/ai-development-flow.test.ts`

- [x] **Step 2: Run formatting and lint gates**

Run: `pnpm format:check`, `pnpm lint`

- [x] **Step 3: Run relevant broader gates as environment allows**

Run: `pnpm test:unit`, `pnpm build`, and configured quality scripts. Report failures exactly.
