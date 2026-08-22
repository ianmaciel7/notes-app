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

### Requirement: Shared object-type listing structure
Every selectable object type SHALL use one reusable listing composition with a type header, `Overview` and `All` view controls, and Capacities-style overview sections for recently opened content, collections, and queries.

#### Scenario: Empty object-type overview
- **WHEN** a user opens any object type that has no matching created entities, collections, or queries
- **THEN** `Overview` SHALL be selected and the recently opened, collections, and queries sections SHALL render their localized empty states and creation affordances

#### Scenario: Recently created object
- **WHEN** an ephemeral object has been created for the selected object type
- **THEN** its title and type badge SHALL appear in the recently opened section and selecting it SHALL reactivate its existing editor tab

#### Scenario: All objects view
- **WHEN** the user selects `All`
- **THEN** the composition SHALL switch to the complete-list state while preserving the active object-type header and shared actions

#### Scenario: Reused across object types
- **WHEN** the user switches between different sidebar object types
- **THEN** the same semantic structure and interaction contract SHALL remain present while the label, icon, tone, count, and matching recent entities update for the selected type

### Requirement: Functional object-type creation and import actions
The object-type listing SHALL connect its visible `New` and `Import file(s)` affordances to the local workspace lifecycle rather than rendering decorative controls.

#### Scenario: Create from the active object type
- **WHEN** a user activates `New` in either the object-type header or empty complete-list state
- **THEN** the workspace SHALL start the existing creation flow for the active object type and SHALL create or request the fields required by that type

#### Scenario: Import compatible local files
- **WHEN** a user activates `Import file(s)` and selects one or more compatible files
- **THEN** the workspace SHALL create one local entity per accepted file under the active object type, update its count and listing, and activate the last imported entity

#### Scenario: Reject an incompatible import
- **WHEN** a selected file does not satisfy the active file-backed type's accepted format
- **THEN** the workspace SHALL preserve existing entities, expose a localized error, and allow the user to select a different file

#### Scenario: Operate the listing toolbar
- **WHEN** a user activates search, collapse, filter, sort, list, grid, recent expansion, settings, or either menu
- **THEN** the associated visible list state SHALL update and every enabled command SHALL perform a concrete local state transition; feedback alone SHALL NOT satisfy the command

#### Scenario: Match listing toolbar glyphs
- **WHEN** the reusable object-type toolbar renders Overview or All state
- **THEN** its view, add, count, filter, sort, list, grid, caret, and settings controls SHALL use the target-measured semantic Phosphor glyph, size, tone, and alignment without changing their accessible names or stateful behavior

#### Scenario: Configure overview sections
- **WHEN** a user opens overview settings and toggles a visible or hidden section
- **THEN** the corresponding overview section SHALL hide or reappear immediately while the settings control remains keyboard accessible

#### Scenario: Expand recently opened
- **WHEN** a user activates the recent-section expand control
- **THEN** the composition SHALL open the dedicated complete-list state for recent objects and preserve an accessible path back to Overview

#### Scenario: Create collection or query
- **WHEN** a user activates the Collection or Query affordance
- **THEN** an untitled sequential local entry SHALL be created, selected, and opened for editing without persistence or backend mutation

#### Scenario: Pin and open the global New palette
- **WHEN** a user pins the active type or chooses New object from the split menu
- **THEN** the active type SHALL be added to or removed from the provider-owned pinned list, or the existing sidebar New palette SHALL open, respectively
