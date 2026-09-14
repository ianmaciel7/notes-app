# Implementation Plans

This directory contains execution plans, rollout sequences, and implementation checklists.

## Directory Policy

- **ADR-First Architecture**: All technical designs, data schemas, and architectural choices must be authored as ADRs under `docs/decisions/`.
- **Plan Placement**: Task breakdowns, step-by-step implementation sequences, or checklists that are not directly embedded within an ADR must reside here (`docs/plans/`).
- **Strict Superpowers Ban**: Never create or use `docs/superpowers/` or `docs/superpowers/plans/`.
- **Ladle Visibility Invariant**: Every markdown file in `docs/plans/` must be imported and registered as a story in `docs/plans/plans.stories.tsx` using `DocViewer`.
