# Agent Context Efficiency Audit

## Current Baseline

This branch has a lightweight project surface:

- minimal Next.js App Router starter under `src/app/`;
- repository agent guidance under `AGENTS.md` and `.agents/`;
- OpenSpec configuration under `openspec/`;
- no `.github/` workflows;
- no Graphify output;
- no test suite;
- no deployment configuration.

## Current Policy

- Keep `AGENTS.md` concise and portable.
- Keep reusable agent material under `.agents/`.
- Use OpenSpec for durable requirements, proposals, rationale, alternatives, and trade-offs.
- Do not add repository-intelligence tools, caches, generated graphs, or memory systems until the need is measured.
- Prefer direct source inspection for this branch because the source tree is small.

## Tooling Status

| Area | Current state | Policy |
| --- | --- | --- |
| Agent entrypoint | `AGENTS.md` exists | Keep concise and current |
| Agent assets | `.agents/` restored | Use as portable guidance |
| OpenSpec | `openspec/config.yaml` and active change exist | Use for durable requirements |
| Graphify | Guidance restored, artifacts absent | Do not claim active graph automation |
| CI | `.github/` absent | Do not claim CI gates |
| Tests | no test runner configured | Do not claim coverage or test checks |

## Verification Notes

For this branch, context efficiency is best served by targeted file reads and exact searches. Graph or memory infrastructure can be restored later if the repository grows enough to justify the maintenance cost.
