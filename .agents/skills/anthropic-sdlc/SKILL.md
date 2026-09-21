---
name: anthropic-sdlc
description: Apply Anthropic's AI-native SDLC workflow to software projects. Use when shaping a new product or feature, capturing intent, producing a requirements/design spec, planning implementation, implementing from an approved plan, verifying work, reviewing changes, preparing deployment, or turning production findings into new intent. Follows the official Anthropic workflow of intent.md -> spec.md -> plan.md -> implementation/tests -> review -> deploy -> maintain.
---

# Anthropic AI-Native SDLC

Use this skill to run software work through the AI-native SDLC described by Anthropic.

The workflow is artifact-driven and human-governed:

`idea/event -> intent.md -> human approval -> spec.md -> human approval -> plan.md -> human approval -> implementation + tests -> verification/review -> deployment -> monitoring -> new intent.md when needed`

## Core operating rules

1. Treat each approved artifact as the source input for the next stage.
2. Do not skip directly from a vague request to implementation when the change needs product or design decisions.
3. Preserve human judgment gates between intent, spec, plan, and higher-risk release decisions.
4. Keep artifacts version-controlled and auditable.
5. Use repository `AGENTS.md` for stable project context and commands, not for feature-specific requirements.
6. Use separate skills for institutional standards that must be applied consistently, such as security, UX, brand, compliance, and API conventions.
7. Treat skills as advisory controls. Use deterministic hooks or CI checks for rules that must never be violated.
8. Always provide the agent with a feedback loop: tests, build, lint/typecheck, screenshots, executable checks, or equivalent proof.
9. When implementation departs materially from the approved plan, update `plan.md` in the same change.
10. Production incidents and meaningful control-band breaches should re-enter the lifecycle as new intent.

## Editing scope

This skill session is authorized to create or edit only `intent.md`, `spec.md`, and `plan.md` (and their conventional variants, e.g. `intent/<feature>.md` — see the departure note at the end of "1. Capture Intent"). Do not create, edit, or delete any other file — source code, tests, config, docs — directly in this session, even for a change that looks trivial or the human seems to be asking for directly.

Any change to code, tests, or other repository files happens only through a dispatched implementation sub-agent (see "4. Build"), and only after the human has explicitly authorized that dispatch. If a request arrives that skips straight to "just implement X," route it through the normal stage gates (capture/confirm intent, spec, plan, authorize) rather than editing files in this session.

## Stage selection

First determine the current stage from repository evidence and the user's request.

- If there is only an idea, problem, ticket, incident, or vague feature request: start at **Capture Intent**.
- If `intent.md` exists but no approved `spec.md`: continue at **Requirements & Design**.
- If `spec.md` exists but no approved `plan.md`: continue at **Plan Mode**.
- If `plan.md` is approved and implementation is requested: continue at **Build**.
- If code exists and the user asks to validate, review, or finish: continue at **Verify / Review**.
- If the change is merged and the request concerns release automation: continue at **Deploy**.
- If the request begins from monitoring, a production incident, or an operational anomaly: diagnose and produce a new **intent.md**.

Do not recreate an already-approved artifact unless it has drifted or the user asks to revise it.

A filename match is not enough to conclude a stage. Explicitly check the repository root (not just the current working directory) for `intent.md`, `spec.md`, and `plan.md`, and open any you find — an existing `intent.md` search can silently miss the root copy if the search is scoped too narrowly. Read what you find rather than only noting that it exists: it may be approved, stale, or governing a different feature or product entirely. When a repo-root `intent.md`/`spec.md` turns out to describe unrelated work, still surface it to the human as relevant context — do not treat "an intent exists but isn't about this request" as equivalent to "no intent exists."

## 1. Capture Intent

Goal: turn the originator's problem or idea into a short, concrete, human-readable proto-spec.

Before writing `intent.md`, interview enough to make the idea concrete. Resolve or surface:

- problem / unmet need
- proposed outcome
- affected users
- affected systems
- constraints
- explicit non-goals when useful
- success criteria
- open questions

Do not force formal product language. Preserve the originator's meaning.

Write the result using `assets/intent-template.md`.

After drafting:

- point out assumptions and unresolved questions;
- ask the human to correct misunderstandings;
- do not silently promote the intent to an approved spec;
- treat acceptance/merge as the gate to Requirements & Design.

For a single product, prefer a version-controlled `intent/` directory when multiple intents will coexist. If the repository intentionally uses a single root `intent.md`, respect that convention — unless that root file already governs different, unrelated work. In that case do not overwrite it: give the new intent its own path instead (e.g. `intent/<feature>.md`) and tell the human why you departed from the existing single-root convention. The same applies to `spec.md` and `plan.md` in the sections below.

## 2. Requirements & Design

Prerequisite: approved intent.

Read the approved intent and all relevant organization/project skills. Produce a requirements and design specification that engineering can plan against.

The spec should include, when relevant:

- problem restatement and scope
- functional requirements
- behavioral rules and states
- user flows / UX expectations
- data and integration requirements
- security/privacy/compliance constraints
- accessibility requirements
- error, empty, loading, and failure states
- compatibility / migration constraints
- acceptance criteria
- concerns, contradictions, risks, and unresolved decisions
- traceability back to intent

Use `assets/spec-template.md`.

Important:

- Apply available standards skills while writing the spec.
- Explicitly flag conflicts that cannot be satisfied simultaneously.
- Do not invent missing product decisions as settled facts.
- Carry unresolved intent questions forward when they remain unresolved.
- The product owner/human reviews the spec against the intent.
- Acceptance of the spec is the gate to Plan Mode.

## 3. Plan Mode

Prerequisite: approved spec. `AGENTS.md` should be read when present.

Plan before editing code.

Explore the repository read-only first. Produce an implementation plan detailed enough that an engineer who did not see the conversation could execute it.

The plan must cover:

- files/modules to create or modify
- architecture and dependency boundaries
- ordered implementation steps
- test strategy and exact proof of correctness
- migrations / data changes
- rollout or compatibility concerns when applicable
- risks and likely breakage points
- alternatives considered when materially relevant
- links/traceability to spec requirements

Use `assets/plan-template.md`.

Before implementation, challenge the plan:

- What could this break?
- What is the riskiest step?
- What important alternative was rejected, and why?
- Are tests sufficient to prove the spec?

Human approval of the plan is the gate to Build.

## 4. Build

Prerequisite: approved `plan.md`.

This session does not implement code itself — per "Editing scope" above, it may only touch `intent.md`, `spec.md`, and `plan.md`. Implementation is always delegated to a dispatched sub-agent.

Before dispatching that sub-agent:

- confirm `plan.md` is approved and current;
- summarize, for the human, what will be implemented and roughly which files/modules are expected to change;
- explicitly ask the human to authorize dispatching the implementation sub-agent. This is a distinct gate from approving `plan.md` itself — do not infer authorization from plan approval, an earlier "looks good," or silence. Wait for an explicit yes.

Only after that explicit authorization, dispatch the `sdlc-builder` sub-agent (`.claude/agents/sdlc-builder.md`), guided by this skill, with the approved `plan.md` (plus `spec.md`/`intent.md` for context) as its brief. The sub-agent implements from `plan.md`:

- follow repository `AGENTS.md`;
- apply relevant skills;
- obey hooks and permission boundaries;
- work in small coherent increments;
- run the feedback loop repeatedly rather than only at the end;
- add or update tests as required by the plan/spec;
- avoid unrelated refactors unless needed for correctness;
- keep `plan.md` synchronized if implementation materially changes, and report any such drift back to this session.

For independent work touching different files, multiple sub-agent dispatches (parallel sessions/worktrees) may be used — each still requires its own explicit authorization and stays scoped to `plan.md`. For recurring bounded jobs, use subagents with narrow context and tool permissions.

## 5. Feedback Loop & Verification

Never claim completion without executable evidence when such evidence is available.

Prefer repository-provided commands from `AGENTS.md`.

Typical checks:

- unit/integration/e2e tests
- typecheck
- lint / formatter
- production build
- API response checks
- screenshots / visual comparison for UI
- security or policy checks

Iterate until required checks pass or report exactly what remains blocked.

When useful, run final verification in a fresh subagent/context so the verdict is less influenced by implementation assumptions.

## 6. Continuous Evals

Treat agent configuration as production configuration.

When changing `AGENTS.md`, skills, hooks, prompts, or agent behavior:

- run representative eval tasks when an eval suite exists;
- add real failures/incidents as regression evals;
- prefer deterministic pass criteria where possible;
- do not merge a configuration change that materially degrades the agreed eval threshold without human review.

## 7. PR Review

Review the resulting diff against:

1. `intent.md` — does the change solve the intended problem?
2. `spec.md` — are requirements and acceptance criteria satisfied?
3. `plan.md` — does the implementation match the approved approach, or is drift documented?
4. repository policies / skills — security, compliance, UX, API standards, etc.
5. tests/evals — is there evidence that behavior works and regressions are covered?

Report findings by severity and separate factual defects from suggestions.

When a repository uses `REVIEW.md`, treat it as the review-policy source of truth.

## 8. Hooks & Governance

Use skills for advisory institutional knowledge.
Use hooks / deterministic checks for rules that must hold without exception.

Examples suitable for hooks/checks:

- protected paths
- credential leakage
- generated code restrictions
- required ticket/approval before migration or infrastructure changes
- formatter/linter after edits
- release approval gates

Do not replace required human judgment with an agent decision for high-risk approvals.

## 9. Deploy

After review and merge, automation may use Claude non-interactively for judgment-oriented pipeline steps, but execution must remain sandboxed and scoped.

Prefer:

- read-only diagnosis first;
- write actions through PRs rather than direct pushes to protected branches;
- scoped credentials;
- explicit environment-specific approval gates;
- tested rollback paths before autonomous release actions.

## 10. Maintain / Close the Loop

When monitoring, incidents, tickets, or control-band breaches reveal a meaningful problem:

1. collect evidence;
2. diagnose with constrained/read-only tools first;
3. write the finding as a new `intent.md` using the same intent format;
4. route it through human triage;
5. if accepted, restart the lifecycle;
6. after the fix ships, add a regression test/eval when appropriate.

## Artifact boundaries

### `intent.md`
Use for **what is wanted, why, affected users/systems, constraints, and open questions**.
Do not put implementation-file details here.

### `spec.md`
Use for **requirements and design behavior** constrained by policies/skills.
Do not turn it into a step-by-step coding plan.

### `plan.md`
Use for **how this repository will implement the approved spec**, including files, order, risks, and proof.

### `AGENTS.md`
Use for **stable repository context**: commands, architecture, conventions, and recurring mistakes.
Do not put one-off feature requirements here.

### Skills
Use for **institutional knowledge/policies that must be applied consistently across tasks**.

### Hooks
Use for **deterministic enforcement or approval gates**.

### Evals
Use for **regression-testing agent configuration and behavior**.

### Subagents
Use for **recurring, scoped helper jobs with isolated context and limited tools** — e.g. `sdlc-builder` for Build-stage implementation (stage 4), dispatched only after explicit human authorization.

## Minimal completion report

When finishing a stage, report:

- stage completed;
- artifact created/updated;
- decisions made;
- unresolved concerns;
- evidence/checks run;
- next human gate or next stage.

Do not claim a later stage is approved unless a human has approved it.

## References

For the source basis and official Anthropic documentation map, read `references/official-anthropic-sources.md`.
