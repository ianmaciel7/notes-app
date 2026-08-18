# AGENT Instructions

This repository uses OpenSpec for significant proposals, workflow changes, and documentation updates.

## Repository entry points

- `CONTRIBUTING.md`
- `SECURITY.md`
- `CLAUDE.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`

## Operational policy

- Use English-first for repository documentation and code-facing text.
- Use OpenSpec for significant changes: proposal, spec, design, tasks.
- Keep practical docs synchronized in the same change when process or contributor rules change.
- When modifying behavior or contributor process, update related docs in the same change.

## Workflow notes

- Practical documentation baseline is maintained under this repo with the change `add-missing-repository-documentation`.
- Prefer small, atomic changes on dedicated branches and include clear verification notes in PRs.
- If this repository has a `CLAUDE.md`, follow instructions there as the top-priority AI agent entrypoint.
