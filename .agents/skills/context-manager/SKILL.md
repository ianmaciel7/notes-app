---
name: context-manager
description: "Manage, audit, create, update, and align repository-level control documentation including README.md, AGENTS.md, CONTEXT.md, ARCHITECTURE.md, CONVENTIONS.md, TESTING.md, DESIGN.md, SECURITY.md, CONTRIBUTING.md, INTENT.md, and CONSTRAINTS.md. Use this skill whenever the user asks to create, update, audit, sync, or review project documentation standards, quality gates, architectural specs, design system guides, test strategies, security policies, contribution guides, agent onboarding files, project vocabulary, or project intent, even if they only mention one of these files."
---

# Control Docs

A skill to govern, synchronize, and enforce repository-level control documentation across the software lifecycle.

Control documentation establishes the single source of truth for humans and AI agents collaborating on a codebase. Rather than static boilerplate, these documents must be **living specifications** that faithfully reflect the real codebase state and evolve alongside code changes.

---

## Documentation Ownership and Boundaries

Every project rule, fact, threshold, workflow, or policy MUST have exactly one
canonical owner. Other files may reference that owner but MUST NOT copy, restate, or
independently redefine the same rule. If two documents claim ownership of the same
fact, choose the document whose responsibility matches the table below and replace
the other copy with a pointer.

| Document / artifact | Canonical responsibility | Radius of action | Explicitly does NOT own |
|---|---|---|---|
| **`README.md`** | Human-facing front door | Project summary, prerequisites, installation, basic run commands, documentation index | Architecture rules, agent behavior, detailed testing, code style |
| **`INTENT.md`** | Product intent | Problem, vision, users, goals, non-goals, success criteria, product boundaries | Implementation details, commands, architecture decisions |
| **`CONTEXT.md`** | Domain language and conceptual context | Ubiquitous language, domain concepts, definitions, relationships, terms to avoid | Technical architecture, code conventions, tool procedures |
| **`ARCHITECTURE.md`** | System structure | Modules, layers, dependency direction, boundaries, topology, data flow, architectural decisions | Formatting/style rules, test commands, visual design |
| **`CONVENTIONS.md`** | Code-writing rules | Naming, TypeScript/React/Next.js conventions, imports, composition, shadcn/Base UI coding patterns | Product scope, architecture topology, test strategy, Git workflow |
| **`DESIGN.md`** | Product UI/UX system | Design tokens, typography, spacing, responsive behavior, UI anatomy, interaction/visual rules | Git workflow, backend architecture, general tooling |
| **`TESTING.md`** | Verification strategy | Test levels, runners, coverage approach, fixtures/mocks, Ladle, mutation testing, browser verification | Code-style rules, contribution process, global quality-floor ownership |
| **`SECURITY.md`** | Security posture | Threat model, auth/authz, secrets, validation, sensitive-data handling, disclosure/security practices | General coding style, unrelated architecture, PR process |
| **`CONTRIBUTING.md`** | Human contribution workflow | Environment setup, branches, commits, PR process, contributor pre-flight checklist | Detailed code conventions, test strategy, architecture specification |
| **`CONSTRAINTS.md`** | Non-regression quality contract | Blocking floors, measurable thresholds, gates, baselines, owned exceptions | Tutorials, tool manuals, implementation style |
| **`AGENTS.md`** | Agent router and always-on contract | Scope/precedence, doc/tool/skill routing, agent decision boundaries, anti-bypass invariants, definition of done | Full tool manuals, detailed code conventions, test matrices already owned elsewhere |
| **`RTK.md`** | RTK-specific usage | RTK behavior, supported usage, exceptions, troubleshooting | General shell policy or unrelated tools |
| **`.agents/agents.json`** | Machine-readable agent configuration | MCP servers, integrations, profiles, targets, synchronization behavior | Long-form human policy or procedural documentation |
| **`.agents/rules/*.md`** | Modular agent rules | Targeted, always-on invariant and enforcement rules | Global routing, full manuals |
| **`.agents/skills/*/SKILL.md`** | Specialized execution workflow | Trigger and procedure for one focused agent capability | Global repository policy unrelated to that skill |
| **`skills-lock.json`** | Locked remote-skill provenance/state | Source, path, hash/version state required for reproducibility | Human instructions, tool procedures, project policy |

### Context ownership rule

Use the following decision test before adding documentation:

1. Identify the **subject** of the new fact or rule.
2. Select exactly one canonical owner from the table above.
3. Add the full rule only to that owner.
4. In other files, add only a short pointer when routing is necessary.
5. If a duplicate already exists, keep the canonical copy and replace the others
   with references.
6. If no owner fits, define a new bounded context explicitly instead of spreading
   the rule across multiple files.

### Boundary rule

A document may mention another context only to route the reader, explain an interface
between contexts, or state a dependency. Mentioning another context does not transfer
ownership. Detailed procedures belong to their owner.

---

## Operating Principles

1. **Ground Truth Over Assumptions**:
   Never write generic documentation blindly. Always inspect the actual codebase first: read `package.json`, configuration files (`components.json`, `biome.json`, `tsconfig.json`), directory structure, and stylesheets before drafting or editing.
   When a template section names a capability the repo doesn't have yet (no test runner, no auth layer, no CI, no persistence), do not invent plausible-sounding content to fill it. State the real status plainly (e.g. "No test runner is configured yet; component review is limited to Ladle stories") so the doc stays trustworthy for both humans and agents reading it later.
2. **Strict Path Portability**:
   Never use hardcoded absolute machine paths (`C:\Users\...` or `/home/...`). Always write repo-relative paths (`./src/app/...`, `ARCHITECTURE.md`).
3. **Living & Anti-Drift**:
   When code, styling, or architecture evolves (e.g. adding shadcn components, migrating to Tailwind v4, adding test runners), immediately update the corresponding control documents.
4. **Cross-Document Coherence Without Duplication**:
   Prevent contradictions across docs, but do not solve them by copying the same rule
   everywhere. The canonical owner defines the rule; dependent documents link to it
   or expose only the minimum interface needed for their own context.
5. **Single Source of Truth Within a Document, Not Just Across Documents**:
   Cross-document coherence (#4) isn't the only place duplication hides — the same fact can drift against itself *inside one file* (e.g. a component/story count repeated in prose in two sections of the same doc). When auditing, check a document against itself, not only against other documents: if a fact appears twice in one file as an independently hand-typed value, one occurrence should be the source and the other a pointer to it.
   **Exception — `DESIGN.md`'s frontmatter/body relationship is not this problem.** The [design.md spec](references/design-template.md) defines the YAML frontmatter as normative and the Markdown body as rationale that *references* those tokens via `{group.key}` syntax. A body table showing `{colors.primary}`'s value for human readability, sourced from the same frontmatter, is a rendering of the source, not a second independent copy — don't strip `DESIGN.md`'s frontmatter down to bare metadata under this principle, as an earlier pass in this skill's history mistakenly did before this skill knew the real external spec existed.
6. **Respect Tool-Generated Blocks**:
   Some files (notably `AGENTS.md`) may contain a block written by a framework CLI (e.g. a `<!-- BEGIN:... --> … <!-- END:... -->` marker written by `next dev`). Never edit or remove content inside such a block — add project-authored content outside it instead.

---

## Documentation Quality Contract

Apply the documentation quality contract to every audit, creation, or synchronization task: ground every claim in repository evidence; reject fabricated tools, unresolved links, placeholders, and edits to generated blocks; require executable checks for numbered rules; preserve measured baselines; and give exceptions an owner, reason, and expiry. Use [`references/constraints-template.md`](references/constraints-template.md) when creating `CONSTRAINTS.md`.

### Constraint setup and maintenance

When `CONSTRAINTS.md` is missing or the user asks to define the quality bar, use this compact constraint-driven workflow:

1. Detect before asking: inspect the package manifest, compiler and linter configuration, test runner and coverage output, CI, agent harness, and current scripts. Report the two most relevant facts before asking questions.
2. Ask at most four focused questions, one at a time: which dimensions should be enforced (coverage, security, performance, accessibility, architecture); whether failures block or warn; whether to measure today's baseline or choose a target; and the acceptable task-end runtime. Use defaults of security plus new-code coverage, blocking the floor, measuring and ratcheting, and roughly 90 seconds.
3. Write `CONSTRAINTS.md` at the repository root. Include a floor, numbered rules with a real checker and lifecycle stage, measured-but-not-enforced baselines, and owned/dated exceptions. Add the read instruction to agent onboarding docs without overwriting generated blocks.
4. Choose de facto tools that already fit the repository. Never add a number without a command that can produce its verdict. Scope expensive checks to changed files or CI; use `--redact` for secret scanners; put browser checks behind a reachable URL; and do not run coverage twice when existing lcov data is sufficient.
5. Wire checks to cost: fast checks after edits, related tests and changed-line coverage at verification, full security and architecture checks at review/CI. A warning is not a gate; document whether each check blocks or informs.
6. Guard the bar itself. Review diffs for lowered thresholds, deleted or weakened tests, new suppressions, stubs/TODOs, and unreviewed exception rows. Tightening should be quiet; loosening should be explicit. Use the floor-guard contract below or the repository's `scripts/floor-guard.mjs` rather than inventing a new guard.
7. Ratchet unknowns: if a target fails the current codebase, record today's value and require that it does not worsen. State missing capabilities plainly instead of fabricating CI, auth, tests, or design tokens.

Do not silently invent numeric defaults. If the user has not chosen a threshold,
measure the current state and keep the metric non-blocking until a real floor is
adopted. Recommendations may be proposed separately, but the committed contract must
distinguish recommendations from enforced repository policy.

Use three escalation levels: written contract; scripted checks; tool-backed runner with diff scoping, budgets, ratchets, and guards. Most repositories should stop at scripted checks. Keep at least one external constraint—such as a vulnerability database, browser audit, or standards-based accessibility scanner—because project tests alone are circular.

Do not weaken a threshold to make a change pass, place slow checks in the edit loop, create exceptions without owners or expiry, or let every dimension be judged only by the project's own tests.

### Floor-guard contract

The floor guard is diff-scoped: compare added and removed lines against the merge base, include untracked files, and report the rule and location without printing secret values.

- Exit `0` when clean, `1` when a floor violation is found, and `2` when the guard cannot establish a merge base or otherwise cannot run.
- Detect only floor violations the implementation actually recognizes. Do not claim
  threshold-diff detection unless the guard implements it.
- Detect tests made easier: added skips, deleted test assertions, or deleted test files.
- Detect silenced checkers: new `@ts-ignore`, `eslint-disable`, `biome-ignore`, `noqa`, `nosemgrep`, `gitleaks:allow`, or equivalent suppressions.
- Detect unfinished work: unimplemented throws, empty catches, and TODO placeholders.
- Detect new `CONSTRAINTS.md` exception rows.
- Treat tightening as clean and loosening as loud.

Keep the implementation dependency-free and diff-scoped. Adapt suppression, stub,
and test patterns for the repository's language; never turn an inability to run the
guard into a successful result. A secret finding reports only its rule and location,
never the matched value. Run the cheap floor check where the repository actually
wires it; describe it as CI only after a workflow executes it. Keep expensive checks
scoped to their real review/CI usage.

---

## Core Workflows

### Workflow 1: Documentation Audit & Drift Detection

Use this workflow to evaluate the health of the repository's control documents.

1. **Inventory Existing Docs**: Check which of the 11 files exist in the repository root (`README.md`, `AGENTS.md`, `CONTEXT.md`, `INTENT.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md`, `TESTING.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CONSTRAINTS.md`). For `README.md`, also check whether it's still unedited scaffold boilerplate (e.g. default `create-next-app` text) — that counts as effectively missing.
2. **Inspect Codebase Reality**:
   - Check framework and runtime versions in `package.json`.
   - Check UI library, styling engine, and theme variables (`components.json`, `src/app/globals.css`).
   - Check linter, formatter, and compiler configurations (`biome.json`, `tsconfig.json`).
   - Check test scripts, Ladle stories, and test directories (`src/components/ui/*.stories.tsx`).
3. **Compare & Report Discrepancies**:
   - Flag missing documents.
   - Flag outdated library versions, obsolete paths, or phantom tools (tools mentioned in docs that aren't in `package.json`).
   - Flag token mismatches (e.g., CSS variables in code that differ from `DESIGN.md`).
   - Flag any fact (a count, a token value, a command) restated more than once — across documents OR within the same one — where the restatements disagree. Per Operating Principle #5, one occurrence should be canonical and the rest should point to it.
   - Treat `skills-lock.json` as a required legacy lock artifact. Whenever a skill is created, installed, removed, or updated, verify that the lock file was refreshed with `npx skills update -p -y` and that its resulting diff is included.
4. **Use the bundled verification scripts instead of re-deriving facts by hand**. The scripts live under this skill's `scripts/` directory; do not invoke nonexistent root-level `scripts/check-*.js` paths. Run the applicable checks from the repository root:
   - `node .agents/skills/context-manager/scripts/verify-agents.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-architecture.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-context.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-contributing.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-conventions.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-design.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-intent.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-readme.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-security.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-testing.js . --quiet`
   - `node .agents/skills/context-manager/scripts/verify-constraints.js . --quiet`

   Each pillar supports `--json`, `--help`, and `--quiet`/`-q`; they use shared
   argument handling from `scripts/lib/cli.js`, make no network calls, and exit
   nonzero when a document is stale or inconsistent.

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
   - `references/constraints-template.md`
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
- **Changing Tooling**:
  - Update only the canonical owner: code-writing behavior -> `CONVENTIONS.md`;
    test/verification tooling -> `TESTING.md`; security tooling -> `SECURITY.md`;
    quality thresholds -> `CONSTRAINTS.md`; human setup/PR flow -> `CONTRIBUTING.md`;
    agent tooling/config -> `AGENTS.md` or `.agents/agents.json` as appropriate.
- **Refactoring Modules or Adding Core Services**:
  - Update `ARCHITECTURE.md` (topology, directory boundaries, and data flow).
- **Modifying Auth, Data Ingestion, or Sensitive Endpoints**:
  - Update `SECURITY.md` (threat model, access policies, validation schemas).
- **Introducing a New Domain Concept or Renaming One**:
  - Update `CONTEXT.md` (add the term and its `_Avoid_` synonyms) in the same change, not as follow-up.
- **Changing Commands or Framework Behavior**:
  - Update the command's canonical owner only. README gets basic human start commands;
    TESTING gets test commands; SECURITY gets security commands; CONTRIBUTING gets
    contributor/PR flow; AGENTS gets only agent routing/invariants.
- **Adding or Removing a Control Doc**:
  - Update `README.md`'s Documentation links so it never points to a doc that doesn't exist.
- **Creating, Installing, Removing, or Updating a Skill**:
  - Run `npx skills update -p -y` and commit the resulting `skills-lock.json` change, even when the update only reorders entries or refreshes hashes.

---

## Verification

The skill was applied correctly when:

- [ ] Every edited claim was checked against repository ground truth.
- [ ] Missing capabilities are stated plainly rather than invented.
- [ ] Local links, cited files, package scripts, versions, and generated blocks pass their applicable checks.
- [ ] The documentation quality floor was checked and no verifier was weakened, skipped, or hidden to obtain a pass.
- [ ] All eleven individual verifiers were run for a full audit.

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

No `assets/` directory exists yet. Per the [Agent Skills spec](https://agentskills.io/specification), `assets/` holds literal, verbatim-copied output templates, while `references/` holds documentation an agent *reads for guidance*. Each `references/*-template.md` file currently mixes both — prose rationale/governance rules (correctly `references/` material) and a literal "Canonical Structure" code block (the part that's actually spec's `assets/` use case, per [best-practices](https://agentskills.io/skill-creation/best-practices)'s "Templates for output format" guidance). Splitting the skeletons out into `assets/*.md` and leaving `references/*-template.md` to hold only rationale + a pointer to its matching asset is a legitimate follow-up, not done here to avoid creating a second, duplicate copy of the same skeleton content mid-edit.
