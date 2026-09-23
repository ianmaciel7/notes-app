# AGENTS.md Template

## Document Purpose
`AGENTS.md` is the real, open, tool-agnostic standard (see [agents.md](https://agents.md/)) for giving AI coding agents predictable, repo-specific context — described by the spec itself as "a dedicated README for AI coding agents," complementary to `README.md` (which is for humans). It is the first file an agent should read before making changes. The spec defines **no required fields**: it's plain Markdown, and its only real constraint is that it goes at the repository root under the exact filename `AGENTS.md`.

Of the 10 pillars this skill governs, `AGENTS.md` is the one most often partly **tool-generated**. Some frameworks or CLIs write their own block into this file automatically (in this repo, `next dev` writes a `<!-- BEGIN:nextjs-agent-rules -->…<!-- END:nextjs-agent-rules -->` block via `node_modules/next/dist/server/lib/generate-agent-files.js`). Never edit inside a tool-generated block — treat it as read-only ground truth and add project-specific guidance outside it.

**Monorepos**: agents read the *nearest* `AGENTS.md` in the directory tree to the file they're editing, not just the root one. A subpackage can carry its own `AGENTS.md` that overrides or supplements the root file for anything under it — root-level instructions still apply, but the nearest file wins on conflict. (Explicit instructions from the user in chat always override anything in any `AGENTS.md`.)

---

## Canonical Structure
The spec's own reference example ([agents.md](https://agents.md/)) is intentionally short — these are the sections it actually demonstrates. Add or drop sections freely; there's nothing sacred about this list beyond "setup, style, test, PR" being the common core:

```markdown
# AGENTS.md

<!-- Preserve any tool-generated block verbatim (e.g. BEGIN/END markers).
     Add project-authored sections below or above it, never inside it. -->

## Setup commands
- Install deps: `<install command>`
- Start dev server: `<dev command>`
- Build: `<build command>`

## Code style
[Only the rules that would surprise a capable agent working from training data alone — link to `CONVENTIONS.md` and `DESIGN.md` rather than duplicating them wholesale.]
- [e.g., TypeScript strict mode, named exports only]
- [e.g., use `cn()` from `@/lib/utils` for class merging]

## Dev environment tips
[Non-obvious traps: a fork of a framework with different APIs, a monorepo path quirk, a package that shadows a well-known name — the section most worth keeping accurate, since it prevents wasted work.]

## Testing instructions
- [lint command]
- [test command, or "no test suite yet — see TESTING.md"]
- Fix any test or type errors until the suite is green before considering a task done.

## PR instructions
[Point to `CONTRIBUTING.md` rather than restating it; only add here if agents specifically need a different instruction than humans do.]
- Title format, required checks to run before committing, etc.
```

---

## Governance Rules

1. **No Required Fields — Optimize for the First Five Minutes**:
   The spec imposes no schema. Keep this file short; its job is to stop an agent from doing something wrong in its first few tool calls (wrong package manager, wrong test command, a deprecated API it would otherwise assume from training data) — not to be a full spec. If a section is growing long, that content probably belongs in a dedicated pillar doc with a link left behind.
2. **Tool-Generated Blocks Are Read-Only**:
   If a marked block (e.g. `<!-- BEGIN:... -->`) exists, do not remove or rewrite it, even if it looks redundant with other control docs. Removing it from a diff without disabling the generator just recreates the change on next run — commit it alongside your work instead of fighting it.
3. **Pointer, Not Duplicate**:
   `AGENTS.md` should link to `CONVENTIONS.md`, `TESTING.md`, `CONTRIBUTING.md`, and `ARCHITECTURE.md` rather than re-explaining them. Duplication drifts; a pointer can't.
4. **Nearest File Wins in Monorepos**:
   When adding a nested `AGENTS.md` under a subpackage, only include what's actually different for that subpackage — don't repeat root-level content, since the agent already reads both and the nearer file only needs to override or add.
5. **Repository Location**:
   Placed at the repository root as `AGENTS.md` (plus optional nested copies per subpackage in a monorepo). If the project also has a `CLAUDE.md`, that file should `@AGENTS.md`-import or otherwise defer to this one rather than forking its own copy of the same guidance.
