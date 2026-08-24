# GEMINI.md

## Project Context

- Notes App built with Next.js App Router.
- Source routes are under `src/app`.
- OpenSpec is the canonical workflow for significant process and documentation changes.

## Mandatory Rules

- Use English for repository-facing and agent-facing guidance.
- Follow `.agents/rules/verification-lifecycle.md`: re-read and verify rules before and after every modification.
- Follow `.agents/rules/graphify.md`: always use the Graphify knowledge graph and Graph Engine for codebase navigation, dependency mapping, and impact analysis before modifications.
- Follow `.agents/rules/component-deduplication.md`: search, reuse, and extend existing UI components before creating new ones; never duplicate components.
- Follow OpenSpec in `.agents/rules/openspec-first.md` for significant proposals, architecture/process changes, and documentation updates.
- Keep repository documentation synchronized (`CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/rules/*`) whenever process rules change.

## Decision Priority

1. User request for the current task.
2. OpenSpec artifacts in the active change.
3. `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`.
4. `README.md` and repository docs.

## Helpful References

- `.agents/rules/verification-lifecycle.md`
- `.agents/rules/graphify.md`
- `.agents/rules/component-deduplication.md`
- `.agents/rules/openspec-first.md`
- `.agents/rules/english-first.md`
- `.agents/rules/shadcn-first.md`
- `.agents/rules/nextjs-server-architecture.md`
- `.agents/rules/git-workflow.md`
- `docs/GRAPHIFY.md`
