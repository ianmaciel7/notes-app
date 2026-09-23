# INTENT.md Template (Anthropic AI-Native SDLC Standard)

## Document Purpose
`INTENT.md` is the foundational artifact defined by **Anthropic's AI-Native Software Development Life Cycle (SDLC)**. It serves as the primary contract and proto-spec that initiates work, capturing the "what" and "why" before technical design or code implementation begins.

`INTENT.md` ensures human stakeholders and AI coding agents share an unambiguous, audit-trailed source of truth regarding business objectives and boundaries before any implementation begins.

---

## Canonical Structure (Anthropic Standard)

```markdown
# Intent: [Short descriptive title of the feature, fix, or initiative]

**Author:** [Name / Role - e.g., Product Owner, Lead Engineer]  
**Status:** [Draft | Review | Approved]  
**Last Updated:** [YYYY-MM-DD]

## Problem
[1-2 clear sentences describing the user pain point, business friction, or triggering incident. If applicable, link to relevant customer feedback, support tickets, or incident post-mortems.]

## Proposed Outcome
[A concrete definition of what "done" looks like. What must the user or system be able to do once this is implemented? State the desired behavior and measurable success criteria.]

## Affected Users and Systems
- **Target Personas / Users:** [Who is directly or indirectly impacted?]
- **Systems & Components:** [Which services, modules, UI surfaces, databases, or third-party APIs are affected?]

## Constraints
[Explicit boundaries and non-negotiables that the AI agent and developers must respect:]
- **Security & Privacy:** [e.g., No new PII collected, zero plaintext storage of tokens]
- **Architecture & Tech Stack:** [e.g., Must use existing shadcn/Base UI primitives, no additional runtime dependencies]
- **Performance & Budgets:** [e.g., Page load under 1.5s, bundle size increase < 5KB]
- **Scope / Non-Goals:** [What we are explicitly NOT doing in this scope]

## Open Questions
[Any unresolved uncertainties, architectural trade-offs, or decisions requiring human sign-off before implementation proceeds.]
- [ ] Question 1: ...
- [ ] Question 2: ...
```

---

## Life Cycle & Governance Rules

1. **Human-in-the-Loop Signoff**:
   - An AI agent or team member can draft `INTENT.md`, but its status must transition from `Draft` -> `Approved` with a human reviewer sign-off before implementation begins.
2. **Immutability of Scope during Build**:
   - Once approved, the intent sets the boundary for implementation. If requirements pivot during development, update `INTENT.md` first and record the rationale.
3. **Repository Location**:
   - Placed at the repository root as `INTENT.md`, the project-wide charter/intent.
