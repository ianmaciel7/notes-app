# OpenSpec

This directory is the canonical home for product and repository changes that
need durable requirements, acceptance scenarios, design rationale, and an
implementation plan.

## Structure

- `config.yaml` defines the shared OpenSpec context and artifact rules.
- `changes/<change-id>/` contains active, reviewable changes.
- `specs/<capability>/spec.md` contains accepted capability requirements.
- `changes/archive/` contains completed changes after their specs are synced.

Each active change uses a semantic, kebab-case ID and owns one coherent
capability. Its canonical artifacts are `.openspec.yaml`, `proposal.md`,
`design.md`, `specs/`, and `tasks.md`; change-local README files are avoided
because they duplicate the proposal and can drift.

## Change Inventory

| Workstream | Change | State | Responsibility |
| --- | --- | --- | --- |
| Governance | `add-production-ci-cd-pipeline` | Implementation complete; archive separately | Repository delivery controls and verification gates |
| Product baseline | `add-mvp` | Imported from `mvp`; preserved reference | Generic object studio, AI capture, study workflow, and deterministic review scheduling |
| Product domain | `add-generic-objectives` | Planned | Desired outcomes, lifecycle, requirements, evidence, and results |
| Product domain | `add-recurring-commitment-tracking` | Planned | Quantitative targets, periods, pace, balances, carryover, and consistency |
| Visual foundation | `define-minimalist-ui-foundation` | Current review stage | Canonical design language and UI delivery gates |

Objectives and recurring commitments remain separate because an Objective
describes the outcome a person wants, while a recurring commitment describes
measurable work used to pursue an outcome. UI delivery is another independent
workstream and must not silently change those domain meanings.

## UI Delivery Checkpoints

Create only the current confirmed change. Later entries remain roadmap labels
until the previous checkpoint has browser evidence and user confirmation.

| Order | Planned change | Review surface |
| --- | --- | --- |
| 1 | `define-minimalist-ui-foundation` | `docs/DESIGN.md`, tokens, principles, primitives, and evidence gates |
| 2 | `implement-workspace-sidebar` | Sidebar structure, content, states, scrolling, collapse, and mobile overlay |
| 3 | `implement-workspace-shell-layout` | Main regions, top rail allocation, content/context geometry, and breakpoints |
| 4 | `implement-workspace-navigation` | Top rail, tabs, search, creation, history, and navigation feedback |
| 5 | `implement-object-list-surface` | Object-type lists, filters, sorting, rows, selection, and empty states |
| 6 | `implement-object-editor-surface` | Object title, properties, content body, editing controls, and outline |
| 7 | `implement-object-context-surface` | Relations, backlinks, graph, AI context, and panel modes |
| 8 | `implement-workflow-surfaces` | Capture, review, study, Objectives, and recurring commitments in small subchanges |
| 9 | `polish-workspace-interactions` | Responsive behavior, loading/error states, keyboard access, motion, and final integration |

## Working Agreement

1. Declare cross-change dependencies and implementation order in the proposal.
2. Keep product behavior in specs and implementation sequencing in tasks.
3. Do not mark implementation tasks complete from artifact completion alone.
4. Validate each affected change independently before repository verification.

```powershell
openspec.cmd status --change <change-id>
openspec.cmd validate <change-id> --strict
```
