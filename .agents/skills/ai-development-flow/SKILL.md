---
name: ai-development-flow
description: Use when starting, planning, implementing, debugging, reviewing, or verifying development work in this repository.
---

# AI Development Flow

Use this skill to choose and execute the repository's proportional workflow for AI-assisted development.

## When To Use

- Any feature, bugfix, refactor, review, or verification task in this repository.
- Any task touching auth, authorization, sync, storage, document parsing, AI generation, secrets, database migrations, architecture boundaries, or broad cross-cutting behavior.

## When Not To Use

- Purely conversational questions that do not inspect or change the repository.
- External product research unrelated to repository work.

## Required Context

Read, as relevant:

- `AGENTS.md`
- `docs/ai-development-flow.md`
- `SPEC.md`
- `ARCHITECTURE.md`
- `DECISIONS.md`
- `SECURITY.md` for security-sensitive work
- The focused source files and tests for the behavior being changed

## Steps

1. Confirm repository root, branch, and `git status --short`.
2. Classify the task as lightweight, bounded, or complex using `docs/ai-development-flow.md` and `src/tooling/ai-development-flow.ts`.
3. For bounded or complex work, create a change spec or bugfix spec from `docs/templates/`.
4. Research current behavior with targeted file reads and `rg`.
5. Plan the smallest independently verifiable change.
6. Write a focused failing test before production code when feasible.
7. Implement incrementally.
8. Run focused verification, then the selected workflow's required quality command.
9. Review spec coverage separately from code quality and security risk.
10. Report evidence using `PASSOU`, `FALHOU`, `NÃO EXECUTADO`, `BLOQUEADO PELO AMBIENTE`, or `INTEGRAÇÃO NÃO VERIFICADA`.

## Outputs

- A short diagnosis and workflow choice.
- Spec or bugfix spec path when one was needed.
- Files changed.
- Commands run and real outcomes.
- Known failures, blockers, and external configuration still required.
