# ADR Always Rule — Mandatory Architectural Decision Records

## Rule

**Every architectural decision MUST be recorded as an ADR (Architectural Decision Record).**

An agent must NEVER make a significant architectural decision without creating or updating the corresponding ADR before (or immediately after) implementation.

---

## What Counts as an Architectural Decision

Record an ADR when the work involves any of the following:

- Adopting, replacing, or removing a **framework, library, or runtime** (e.g. switching from TipTap to Plate JS)
- Defining or changing a **data schema**, block AST structure, or database model
- Adding or removing a **system boundary** (e.g. new domain layer, new service, new API route group)
- Choosing a **state management** or **caching** strategy
- Establishing or changing a **plugin / extension architecture**
- Making a **cross-module** design decision (e.g. where types must live, how two layers communicate)
- Selecting a **testing strategy or toolchain** (e.g. Vitest, Playwright, MSW)
- Any decision that would be **hard or expensive to reverse**

---

## Workflow — How to Create an ADR

1. **Scaffold a new ADR** (auto-assigns next sequential number):
   ```sh
   node .agents/skills/adr/scripts/manage-adr.mjs new "<Short Decision Title>"
   ```

2. **Edit the generated file** at `docs/decisions/XXXX-slug.md` following the MADR format:
   - Fill in: Status, Context, Decision, Consequences, Alternatives Considered
   - Set `Status: Accepted` once the decision is finalised

3. **Sync the decision log** (updates `DECISIONS.md` and `docs/decisions/README.md`):
   ```sh
   node .agents/skills/adr/scripts/manage-adr.mjs sync
   ```

4. **Register the ADR as a Ladle story** in `docs/decisions/decisions.stories.tsx`:
   ```tsx
   export const ADR_XXXX: Story = () => <DocViewer content={adr_XXXX} />;
   ```
   *(Project Ladle Visibility Invariant — every markdown doc under `docs/` MUST appear as a Ladle story.)*

5. **Update the knowledge graph**:
   ```sh
   graphify update .
   ```

---

## Enforcement

- **Before implementing**: if the decision is known upfront, scaffold and fill the ADR first (decision-first workflow).
- **During implementation**: if the decision crystallizes mid-task, pause, write the ADR, then continue.
- **After implementation**: if an ADR was deferred, write it immediately — never close a task without an ADR for each architectural choice made.
- **Code reviewers** (`code-reviewer` subagent) MUST verify that a corresponding ADR exists before approving any PR or marking a task complete.

---

## ADR Skill Reference

Full instructions: `.agents/skills/adr/SKILL.md`

ADR files: `docs/decisions/`

Decision log: `DECISIONS.md` and `docs/decisions/README.md`
