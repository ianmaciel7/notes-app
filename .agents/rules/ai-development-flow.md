---
description: Apply the repository's proportional AI-assisted development workflow.
alwaysApply: true
---

# AI Development Flow

Use `AGENTS.md` as the map and `docs/ai-development-flow.md` as the operational guide.

Select the lightest workflow that fits the risk:

- Lightweight: docs-only wording or low-risk local cleanup.
- Bounded: feature, behavior change, UI interaction, or ordinary bugfix with clear scope.
- Complex: auth, authorization, sync, storage, document parsing, AI generation, secrets, database migrations, architecture boundaries, or broad cross-cutting changes.

For bounded or complex work, create a focused spec from `docs/templates/change-spec.md` or `docs/templates/bugfix-spec.md` before implementation when the behavior is non-trivial.

Run relevant checks after meaningful changes and run the selected workflow's required verification before declaring completion. Never invent results or weaken gates to hide failures.
