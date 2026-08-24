# CLAUDE.md

## Project Context

- Notes App built with Next.js App Router.
- Main source of routes: `src/app`.
- Source-of-truth for proposals: OpenSpec in `.agents` and `openspec/specs`.

## Mandatory Operating Rules

- Write repository-facing documentation and agent-facing guidance in English.
- Follow `.agents/rules/verification-lifecycle.md`: all agents and subagents must re-read and verify rules before and after every modification.
- Follow `.agents/rules/graphify.md`: always use the Graphify knowledge graph and Graph Engine as the mandatory primary layer for codebase discovery, architecture navigation, and impact analysis.
- Follow `.agents/rules/component-deduplication.md`: search, reuse, and extend existing UI components before creating new ones; never duplicate components.
- Follow OpenSpec for significant behavioral/process changes:
  - Proposal
  - Specs
  - Design
  - Tasks
- Keep practical documentation synchronized (`CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/rules/*`) whenever process rules change.

## Priority for Decisions

1. User request for the current task.
2. OpenSpec specs in the active change.
3. `AGENTS.md`, `CLAUDE.md`, and `.agents/rules/*`.
4. Existing repository docs and coding conventions.

## Helpful Entry Documents

- `CONTRIBUTING.md`
- `SECURITY.md`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
- `docs/GRAPHIFY.md`
