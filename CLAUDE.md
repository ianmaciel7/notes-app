# CLAUDE.md

## Project Context

- Notes App built with Next.js App Router.
- Main source of routes: `src/app`.
- Source-of-truth for proposals: OpenSpec in `.agents` and `openspec/specs`.

## Mandatory Operating Rules

- Write repository-facing documentation and agent-facing guidance in English.
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
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
