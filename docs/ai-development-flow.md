# AI Development Flow

This repository uses a lightweight, spec-anchored workflow for AI-assisted software development. `AGENTS.md` is the map; this document is the operational source of truth.

## Operating Principles

- Use progressive disclosure: start with `AGENTS.md`, then load only the relevant sections of `SPEC.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `SECURITY.md`, plans, skills, and source files.
- Use the smallest workflow that fits the risk. Do not create subagents, services, frameworks, or long documents to make a small task look rigorous.
- Keep Biome as the only general linter and formatter.
- Use executable checks for claims. LLM review can find risks, but it does not replace lint, metrics, focused tests, build, security review, or browser verification.
- Preserve local changes. Inspect `git status --short` before modifying files and do not reset, commit, push, merge, deploy, or change remote protections without explicit authorization.

## Workflow Selection

The helper in `src/tooling/ai-development-flow.ts` defines the project policy in executable form.

| Level | When to use | Required artifact | Verification |
| --- | --- | --- | --- |
| Lightweight | Docs-only, wording, or low-risk local cleanup | None | Usually `pnpm format:check` plus diff review. |
| Bounded | Feature, behavior change, UI interaction, or ordinary bugfix with clear scope | `docs/specs/YYYY-MM-DD-<change>.md` or bugfix spec | Focused failing test first when feasible, then `pnpm lint` and `pnpm metrics`. |
| Complex | Auth, authorization, sync, storage, document parsing, AI generation, secrets, database migrations, architecture boundaries, or broad cross-cutting changes | Persistent spec and plan | Focused tests, `pnpm lint`, `pnpm metrics`, `pnpm test:unit`, spec review, quality review, and security review when relevant. |

If a task moves into a higher-risk category during implementation, pause the current step, update the spec/plan, and continue with the stronger workflow.

## Research-Plan-Implement

RESEARCH:

- Confirm root, branch, working tree state, package manager, lockfile, stack versions, scripts, tests, hooks, CI, and relevant repository instructions.
- Locate current behavior in source and tests. Distinguish facts from assumptions.
- For Next.js-sensitive work, read the local docs under `node_modules/next/dist/docs/`.
- For tool-specific customization, confirm vendor docs before adding paths, schema fields, events, or activation mechanisms.

PLAN:

- Define the smallest independently verifiable change.
- Name files likely to change, risks, preserved behaviors, and checks.
- For bounded or complex work, create a spec or bugfix spec from the templates in `docs/templates/`.
- For complex work, keep an implementation plan in `docs/superpowers/plans/`.

IMPLEMENT:

- Write a focused failing test before production code when the behavior is testable.
- Implement incrementally and rerun the focused check.
- Update docs, specs, or decisions only when the verified behavior or accepted decision changed.
- Run required checks after the last relevant change and report real outcomes.

## Reviews

Spec review asks whether the implementation satisfies the recorded scope, acceptance criteria, and preserved behavior.

Quality review asks whether the change is maintainable, secure, cohesive, tested, and aligned with repository architecture.

Security review is mandatory for authentication, authorization, sync, storage, document parsing, AI generation, secret handling, Firestore rules, or data boundary changes.

Reviews may happen in the same session when no separate reviewer is available. State that honestly; do not invent independence.

## Daily Examples

Feature:

1. Classify the work with `classifyDevelopmentWork` or the table above.
2. Create a change spec if it is bounded or complex.
3. Write a focused failing test for the behavior.
4. Implement the smallest change.
5. Run focused tests and the required quality command.

Bug:

1. Record current broken behavior, expected behavior, and behavior that must not change.
2. Reproduce the defect or record why it could not be reproduced.
3. Add a regression test that fails for the defect.
4. Fix the cause and run preservation tests.
5. Update the bugfix spec with verified evidence.

Review:

1. Read the spec or request, then inspect the diff.
2. Lead with findings: bug, risk, missing test, or security issue.
3. Include file and line references.
4. Separate required fixes from preferences.
5. Do not mark complete until verification evidence is fresh.

## Evidence States

Use these labels in status and final reports:

- `PASSOU`: command or check completed successfully with fresh evidence.
- `FALHOU`: command or check ran and found a real failure.
- `NÃO EXECUTADO`: not run.
- `BLOQUEADO PELO AMBIENTE`: prevented by sandbox, permissions, missing local runtime, network, or unavailable external service.
- `INTEGRAÇÃO NÃO VERIFICADA`: configuration exists, but the actual editor/runtime/remote integration was not exercised.

## Source Notes

Consulted sources:

- OpenAI Codex AGENTS.md documentation: `https://learn.chatgpt.com/docs/agent-configuration/agents-md`
- OpenAI Codex skills documentation: `https://learn.chatgpt.com/docs/build-skills`
- OpenAI Harness Engineering: `https://openai.com/index/harness-engineering/`
- Google Antigravity hooks documentation: `https://antigravity.google/docs/hooks`
- Google Antigravity rules documentation: `https://antigravity.google/docs/rules-workflows`

Do not copy vendor examples blindly. Treat them as schema and behavior references for the supported surface.
