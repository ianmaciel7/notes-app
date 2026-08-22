# capacities-en-fidelity Specification

## Purpose
TBD: Define the route-level visual and behavioral acceptance contract for the Capacities-fidelity workspace.

## Requirements

### Requirement: Deterministic Capacities fidelity acceptance surface
The system SHALL render `/en` as a deterministic acceptance composition matching the latest user-supplied authenticated Capacities URL, including the visible sidebar, active `Sem título` citation editor, and `Explorar` contextual surface.

#### Scenario: Desktop acceptance state
- **WHEN** a user opens `/en` at a supported desktop viewport with the sidebar and contextual panel expanded
- **THEN** the page SHALL render the target workspace label, five measured main tabs with `Sem título` active, the citation editor card, and all six `Explorar` contextual actions instead of an earlier target state or empty surfaces

#### Scenario: Fixture remains presentation-only
- **WHEN** the acceptance composition handles target-state interactions
- **THEN** its data and callbacks SHALL remain route/demo owned and SHALL NOT imply backend persistence, real Capacities mutation, or production routing behavior

### Requirement: Evidence-governed visual convergence
The implementation MUST resolve visual and behavioral mismatches using the live target first, captured WACZ/JSONL evidence when available, current `dev` contracts, and historical donor branches in that order.

#### Scenario: Conflicting evidence
- **WHEN** a historical donor value conflicts with a measurable live target value
- **THEN** the implementation SHALL use the live value and SHALL document that the donor was not reused for that property

#### Scenario: Captured corpus unavailable
- **WHEN** the requested WACZ/JSONL files cannot be located
- **THEN** the evaluation SHALL record the evidence gap and SHALL NOT invent bundle-derived measurements or claim that captured-source verification passed

### Requirement: Canonical modular architecture preservation
The implementation SHALL preserve the current `dev` component architecture, public component APIs, `data-slot` contracts, Base UI/shadcn `base-nova` primitives, Tailwind CSS 4 conventions, and configured Lucide icon library.

#### Scenario: Historical donor reuse
- **WHEN** useful behavior or measurements are found in `old`, `old-2`, `old-3`, or `feat/app-sidebar`
- **THEN** only the narrow compatible behavior SHALL be ported into current owners and no historical monolith SHALL replace `AppShell` or the split sidebar/header components

#### Scenario: Primitive customization
- **WHEN** a Capacities-specific mismatch can be corrected in a composition-level component
- **THEN** `src/components/ui/*` SHALL remain unchanged and the correction SHALL stay with the owning application component

### Requirement: Measured shell and surface fidelity
The expanded desktop composition SHALL match the target's material geometry, typography, surfaces, spacing, borders, and radii while retaining accessible resize and collapse behavior.

#### Scenario: Expanded desktop shell
- **WHEN** `/en` renders at a target desktop checkpoint
- **THEN** the sidebar, 46px header rails, main/context proportions, inter-panel gaps, panel margins, surface radii, border colors, and shared typography SHALL have no material visible or measurable mismatch against the accepted target state

#### Scenario: Panel resize and collapse
- **WHEN** a user resizes, collapses, or re-expands the sidebar or contextual panel
- **THEN** the transition SHALL remain smooth, triggers SHALL remain usable, content SHALL NOT flash or disappear unexpectedly, and the layout SHALL return to a valid bounded size

### Requirement: Complete interaction and responsive preservation
The fidelity work MUST preserve keyboard navigation, focus visibility, ARIA semantics, hover/active behavior, menus/popovers/tooltips, tab operations, reduced-motion behavior, and supported mobile Sheets.

#### Scenario: Keyboard and pointer states
- **WHEN** a user navigates sidebar actions, tabs, menus, and panel controls using keyboard or pointer input
- **THEN** the same actions SHALL remain reachable and their hover, focus, active, expanded, selected, and disabled states SHALL be perceivable without duplicate accessible names

#### Scenario: Responsive layout
- **WHEN** `/en` is evaluated at 1440×900, 1280×800, 1024×768, and the supported mobile breakpoint where tooling permits
- **THEN** content SHALL remain usable without unintended overflow, desktop resize behavior SHALL remain valid, and mobile sidebar/context controls SHALL use the existing Sheet-based composition

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** resize, collapse, tab, hover, and surface transitions SHALL avoid unnecessary animation while preserving state changes

### Requirement: Iterative visual evaluation and regression evidence
The change SHALL use a bounded evaluator-optimizer loop and SHALL not be considered complete solely because static checks pass.

#### Scenario: Per-iteration rubric
- **WHEN** a visual evaluation iteration completes
- **THEN** each required dimension SHALL record `PASS` or `FAIL`, supporting evidence, the remaining mismatch, and the owning file before the next root-cause fix is selected

#### Scenario: Convergence stop condition
- **WHEN** all material dimensions pass or five iterations have completed
- **THEN** the loop SHALL stop and any unresolved mismatch SHALL be reported explicitly with evidence rather than hidden

#### Scenario: Final verification
- **WHEN** the implementation is ready for completion
- **THEN** focused interaction checks, responsive checks, OpenSpec verification/sync/strict validation, `pnpm typecheck`, `pnpm verify`, Graphify status evidence, and an independent fresh-context review SHALL complete or any proven pre-existing failure SHALL be reported precisely
