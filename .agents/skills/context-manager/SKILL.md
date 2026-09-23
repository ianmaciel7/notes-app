---
name: context-manager
description: "Manage, audit, create, update, and align repository-level control documentation including README.md, AGENTS.md, CONTEXT.md, ARCHITECTURE.md, CONVENTIONS.md, TESTING.md, DESIGN.md, SECURITY.md, CONTRIBUTING.md, and INTENT.md. Use this skill whenever the user asks to create, update, audit, sync, or review project documentation standards, architectural specs, design system guides, test strategies, security policies, contribution guides, agent onboarding files, project vocabulary, or project intent, even if they only mention one of these files."
---

# Control Docs

A skill to govern, synchronize, and enforce repository-level control documentation across the software lifecycle.

Control documentation establishes the single source of truth for humans and AI agents collaborating on a codebase. Rather than static boilerplate, these documents must be **living specifications** that faithfully reflect the real codebase state and evolve alongside code changes.

---

## The 10 Pillars of Repository Control Documentation

| Document | Primary Role | Ground Truth Sources in Repo |
|---|---|---|
| **`README.md`** | Human-facing front door: what this is, setup, links to every other pillar | `package.json` scripts, actual run/build commands |
| **`AGENTS.md`** | AI-agent onboarding brief: run/test commands, non-obvious conventions, framework gotchas | `package.json`, tool-generated agent-rule blocks, `CONVENTIONS.md` |
| **`CONTEXT.md`** | AI-agent codebase briefing: repo layout, domain model, commands, known gaps (or, when a repo deliberately scopes it narrower, a ubiquitous-language glossary — see `references/context-template.md`) | `src/` structure, migrations/schema, route files, code identifiers |
| **`INTENT.md`** | Problem statement, product vision, personas, non-goals, key success metrics | `README.md`, issues, specs, product briefs |
| **`ARCHITECTURE.md`** | Topology, directory boundaries, data flow, state model, tech stack, constraints | `package.json`, `tsconfig.json`, `src/`, entrypoints |
| **`CONVENTIONS.md`** | Code formatting, naming conventions, import ordering, linting, anti-patterns | `biome.json`, `.eslintrc`, tsconfig, repo patterns |
| **`DESIGN.md`** | Design system tokens (OKLCH/CSS vars), typography, radius, UI primitives catalog | `components.json`, `globals.css`, `src/components/ui/` |
| **`TESTING.md`** | Testing pyramid, test runners, visual stories, mocking, quality gates, CI | `package.json` scripts, test configs, Ladle/Vitest |
| **`SECURITY.md`** | Threat models, secret handling, auth/authz, input validation, disclosure policy | Auth handlers, middleware, env validation, dependencies |
| **`CONTRIBUTING.md`** | Setup guide, branch naming, Conventional Commits, pre-flight verification checklist | Git history, package manager, CI scripts, lint scripts |

---

## Operating Principles

1. **Ground Truth Over Assumptions**:
   Never write generic documentation blindly. Always inspect the actual codebase first: read `package.json`, configuration files (`components.json`, `biome.json`, `tsconfig.json`), directory structure, and stylesheets before drafting or editing.
   When a template section names a capability the repo doesn't have yet (no test runner, no auth layer, no CI, no persistence), do not invent plausible-sounding content to fill it. State the real status plainly (e.g. "No test runner is configured yet; component review is limited to Ladle stories") so the doc stays trustworthy for both humans and agents reading it later.
2. **Strict Path Portability**:
   Never use hardcoded absolute machine paths (`C:\Users\...` or `/home/...`). Always write repo-relative paths (`./src/app/...`, `ARCHITECTURE.md`).
3. **Living & Anti-Drift**:
   When code, styling, or architecture evolves (e.g. adding shadcn components, migrating to Tailwind v4, adding test runners), immediately update the corresponding control documents.
4. **Cross-Document Coherence**:
   Prevent contradictions across docs (e.g., if `CONVENTIONS.md` mandates Biome, `CONTRIBUTING.md` must list `pnpm lint` via Biome, not ESLint).
5. **Respect Tool-Generated Blocks**:
   Some files (notably `AGENTS.md`) may contain a block written by a framework CLI (e.g. a `<!-- BEGIN:... --> … <!-- END:... -->` marker written by `next dev`). Never edit or remove content inside such a block — add project-authored content outside it instead.

---

## Core Workflows

### Workflow 1: Documentation Audit & Drift Detection

Use this workflow to evaluate the health of the repository's control documents.

1. **Inventory Existing Docs**: Check which of the 10 files exist in the repository root (`README.md`, `AGENTS.md`, `CONTEXT.md`, `INTENT.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md`, `TESTING.md`, `SECURITY.md`, `CONTRIBUTING.md`). For `README.md`, also check whether it's still unedited scaffold boilerplate (e.g. default `create-next-app` text) — that counts as effectively missing.
2. **Inspect Codebase Reality**:
   - Check framework and runtime versions in `package.json`.
   - Check UI library, styling engine, and theme variables (`components.json`, `src/app/globals.css`).
   - Check linter, formatter, and compiler configurations (`biome.json`, `tsconfig.json`).
   - Check test scripts, Ladle stories, and test directories (`src/components/ui/*.stories.tsx`).
3. **Compare & Report Discrepancies**:
   - Flag missing documents.
   - Flag outdated library versions, obsolete paths, or phantom tools (tools mentioned in docs that aren't in `package.json`).
   - Flag token mismatches (e.g., CSS variables in code that differ from `DESIGN.md`).

---

### Workflow 2: Creating or Initializing a Control Document

When creating a new control document from scratch:

1. **Load Reference Template**: Read the appropriate template from `references/`:
   - `references/readme-template.md`
   - `references/agents-template.md`
   - `references/context-template.md`
   - `references/intent-template.md`
   - `references/architecture-template.md`
   - `references/conventions-template.md`
   - `references/design-template.md`
   - `references/testing-template.md`
   - `references/security-template.md`
   - `references/contributing-template.md`
2. **Tailor to Project Implementation**:
   - Replace placeholders with the actual project technology, file paths, script names, and conventions.
   - Do not leave empty boilerplate sections; if a section is not applicable yet, state the current status or planned milestone.
3. **Write Document**: Save the document directly to the repository root in clean, GitHub-flavored Markdown.

---

### Workflow 3: Synchronizing Documents with Code Changes

Whenever significant code changes occur:

- **Adding / Modifying UI Components or Theme**:
  - Update `DESIGN.md` token tables and UI primitive catalog.
  - If visual stories were added (`*.stories.tsx`), verify `TESTING.md` reflects story verification workflows.
- **Changing Build, Lint, or Tooling Settings**:
  - Update `CONVENTIONS.md` (rules and commands).
  - Update `CONTRIBUTING.md` (pre-flight checklist).
- **Refactoring Modules or Adding Core Services**:
  - Update `ARCHITECTURE.md` (topology, directory boundaries, and data flow).
- **Modifying Auth, Data Ingestion, or Sensitive Endpoints**:
  - Update `SECURITY.md` (threat model, access policies, validation schemas).
- **Introducing a New Domain Concept or Renaming One**:
  - Update `CONTEXT.md` (add the term and its `_Avoid_` synonyms) in the same change, not as follow-up.
- **Changing Setup/Run/Test Commands or Adding a Framework-Specific Agent Gotcha**:
  - Update `AGENTS.md` and, if user-facing, `README.md`'s Getting Started section.
- **Adding or Removing a Control Doc**:
  - Update `README.md`'s Documentation links so it never points to a doc that doesn't exist.

---

## Reference Templates Directory

Detailed canonical templates and structural checklists are maintained under `references/`:
- [`references/readme-template.md`](references/readme-template.md)
- [`references/agents-template.md`](references/agents-template.md)
- [`references/context-template.md`](references/context-template.md)
- [`references/intent-template.md`](references/intent-template.md)
- [`references/architecture-template.md`](references/architecture-template.md)
- [`references/conventions-template.md`](references/conventions-template.md)
- [`references/design-template.md`](references/design-template.md)
- [`references/testing-template.md`](references/testing-template.md)
- [`references/security-template.md`](references/security-template.md)
- [`references/contributing-template.md`](references/contributing-template.md)
