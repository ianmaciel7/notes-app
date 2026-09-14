<!-- BEGIN:no-superpowers-rules -->

# ADR Over Superpowers Rule — Prohibiting docs/superpowers/ and Enforcing ADR-First Architecture

## Strict Prohibition of `docs/superpowers/`

- AI agents must **NEVER** create, edit, or use directories or files under `docs/superpowers/`, including `docs/superpowers/plans/` or `docs/superpowers/specs/`.
- Global superpowers skills (such as `brainstorming`, `writing-plans`, `executing-plans`, and `subagent-driven-development`) state in their skill definitions that user preferences for plan location override defaults. In this repository, that preference is strictly configured and enforced: **NO `docs/superpowers/`**.

## Mandatory ADR-First Architecture

- All technical designs, architectural decisions, data layers, schemas, component architectures, and library/framework choices **MUST** be authored directly as Architectural Decision Records (ADRs) under `docs/decisions/`.
- Always use the ADR skill tooling to scaffold records:
  ```sh
  node .agents/skills/adr/scripts/manage-adr.mjs new "<title>"
  ```
- ADRs must follow the Markdown Architectural Decision Records (MADR) format.
- Every ADR must be synchronized in the decision log (`DECISIONS.md` and `docs/decisions/README.md`) using:
  ```sh
  node .agents/skills/adr/scripts/manage-adr.mjs sync
  ```
- Every ADR file under `docs/decisions/` **MUST** be registered as a Ladle story in `docs/decisions/decisions.stories.tsx` per the project's documentation visibility invariant.

## Location for Implementation Plans

- If task implementation plans or execution checklists are authored separately, they **MUST** live in `docs/plans/` or be directly attached to the corresponding ADR in `docs/decisions/`.
- Plans must **NEVER** be created or stored in `docs/superpowers/plans/`.
- All markdown plans placed under `docs/plans/` **MUST** be registered and exported as stories in `docs/plans/plans.stories.tsx` to maintain full visibility in the Ladle DocViewer workbench (per the Ladle Documentation Visibility Invariant Rule).

## Enforcement

- Subagents (`architect`, `doc-maintainer`, `code-reviewer`) and orchestrators must block and reject any attempt to generate design specs or execution plans inside `docs/superpowers/`.
- Code reviewers must verify that technical designs are recorded as ADRs under `docs/decisions/` and indexed in `DECISIONS.md`.

<!-- END:no-superpowers-rules -->
