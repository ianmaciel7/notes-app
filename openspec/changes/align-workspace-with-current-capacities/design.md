## Context

The current `dev` workspace uses a 288px default sidebar, a three-column shell that leaves only about 266px for the main surface at 768px, and tabs whose hover actions can cover the primary selection target. The current authenticated Capacities reference instead uses a 224px expanded sidebar, 46px rails, 10px gutters, 12px primary surface radii, compact 150-250ms state transitions, and stateful mobile navigation. The repository already has modular shell/header/sidebar owners, but `WorkspaceProvider` and `workspace-content.tsx` concentrate significant behavior, local hardcodes, and production fixture naming.

This change overlaps active shell/header/sidebar changes. The untracked `add-block-editor` change separately owns block document types, editor persistence, and a storage version migration, so this change must not edit those contracts.

## Goals / Non-Goals

**Goals:**

- Converge all existing workspace routes on the current live-reference geometry and interaction states while preserving local data.
- Make desktop, cramped, and mobile shell states deterministic and testable.
- Centralize repeated visual states in shared semantic variants and keep accessible primary/nested targets distinct.
- Add real-browser regression coverage alongside existing source-level tests.
- Remove production demo/fixture naming and localized hardcodes touched by this change.

**Non-Goals:**

- Copying Capacities account data, counts, object types, or content.
- Changing the localStorage schema/version, entity body types, block editor, backend, import data model, or public workspace APIs.
- Replacing shadcn/Base UI primitives, Tailwind v4 tokens, the object icon registry, or the App Router boundary.
- Treating pixel screenshots alone as proof of behavioral parity.

## Decisions

### Live reference values override historical measurements

The authenticated reference measured during this change is authoritative for properties that can be observed today. The 224px sidebar replaces the historical 288px baseline. Existing semantic tokens remain the implementation mechanism; measured OKLCH values document expected computed output rather than encouraging scattered hardcoded colors.

Alternative: retain the 288px repository contract. Rejected because it knowingly diverges from the user-selected current reference.

### AppShell remains the only geometry owner

`AppShell` will own the 224px default, fluid main/panel tracks, collapse thresholds, mobile overlay state, and stable triggers. Feature sidebars and content components will not create competing desktop grids or off-canvas implementations. At 768px the shell will collapse auxiliary content before shrinking the main tab/content region below a usable bound. Below 768px, the existing mobile composition remains visible while desktop panels are unmounted or zero-sized; mobile overlay open and closed states are both first-class acceptance states.

Alternative: use CSS overrides at each route. Rejected because it would duplicate geometry and reproduce the current drift.

### Preserve public APIs and local persistence

The provider's external contract, entity model, storage key, and snapshot version remain unchanged. Presentation and transient navigation/panel state may be separated into internal reducers/helpers to enable deterministic tests. Files owned by `add-block-editor` may receive only conflict-free composition changes after coordination; body types and storage code are excluded.

Alternative: combine parity and block-editor refactoring. Rejected because the storage migration and 3,000-line content owner create avoidable merge and validation risk.

### Shared variants own repeated interactive appearance

Sidebar rows, tabs, chips, compact menu rows/surfaces, submenus, and small actions will consume named variants/helpers under the existing shared UI layer. Call sites retain placement and behavior props but do not own popup widths, row heights, borders, radii, shadows, or transition timings. Object icons continue to come from the central registry.

Alternative: copy measured Tailwind strings into each feature. Rejected by the workspace parity rule and because it prevents global convergence.

### Primary and nested actions use non-overlapping DOM regions

Tabs and compound chips will expose a stable primary target and sibling nested action region. Nested actions stop propagation as needed, but layout—not event cancellation alone—must keep the primary center reachable. E2E hit testing will assert that the tab midpoint selects and dedicated action coordinates pin/close or disclose.

Alternative: preserve overlapping absolute actions and rely on users clicking the label. Rejected because more than half of the current 64px tab can be intercepted on hover.

### Browser tests complement source tests

Playwright will cover pointer, keyboard, focus, Escape, click-outside, transitions, overlay states, containment, and computed geometry at fixed viewports. Existing `node:test` coverage remains for reducers, storage invariants, and source contracts. Reference screenshots are runtime evidence and are not committed as vendor-image fixtures; stable local baselines and numeric contracts are used for regression checks.

Alternative: continue regex-only source tests. Rejected because they cannot validate hover, hit targets, focus, post-click state, or responsive geometry.

### Object creation parity is a lifecycle contract, not a screenshot target

Each object that can be instantiated from `Novo` or from the object-type studio presets must carry a type-specific creation, click, write, projection, and persistence contract. The local app keeps its own object data, counts, labels, and custom types, but the surfaces around them follow the current reference: the creation trigger has visible idle/hover/focus/pressed/open states, object option rows are stable full-row targets, intermediate URL/file/task/query capture surfaces close or validate predictably, and committed objects immediately synchronize tabs, sidebar/object-type rows, content, search/query projections, and persisted state. The authenticated reference observed on August 22, 2026 exposed `Queries`, `Etiquetas`, `Tweets`, `Default`, `Weblinks`, `Tabelas`, and `Páginas`; this is used as evidence for required local coverage without copying the account's private content. Central registry coverage also includes `book`, `person`, `area`, `meeting`, `definition`, `idea`, `place`, `project`, `organization`, `media`, `travel`, and `ai-chat`; `archive` remains reserved/non-creatable unless a future requirement changes its ownership.

Alternative: define only a generic "new object" flow. Rejected because it hides regressions where clicking, writing, validation, counts, or selected state work for one object family but fail for another.

### Reusable lifecycle components prevent object-by-object drift

Object creation and editing will be implemented through reusable contracts: `ObjectCreationTrigger`, `ObjectCreationMenu`, `ObjectTypeOptionRow`, `ObjectCaptureSurface`, `ObjectEditorShell`, `EditableObjectTitle`, `EditableObjectBody`, `ObjectField`, `ObjectFieldGroup`, `ObjectValidationMessage`, `ObjectAttachmentControl`, `ObjectTab`, `ObjectProjectionRow`, `ObjectProjectionCard`, `ObjectCountBadge`, `ObjectTypePresetCard`, `ObjectTypeDetailsPanel`, `CustomObjectTypeForm`, and `ObjectIconTonePreview`. These names describe contracts; implementation may map them to existing files or shared variants as long as ownership remains neutral and reusable. The shared contracts own geometry, typography, icon treatment, focus, hover, pressed, selected, open, post-click, Escape, outside-click, validation, and reduced-motion behavior. Object-specific components provide data and field slots only.

Alternative: implement a separate editor/menu/row for every object type. Rejected because it would make parity impossible to maintain and would violate the workspace UI rule against repeated reference-derived class strings.

## Risks / Trade-offs

- [The live product changes again] → Timestamp measured contracts, keep the audit script state-based, and require a fresh reference pass before updating numeric values.
- [Responsive collapse changes user expectations] → Preserve explicit reopen controls, keyboard focus restoration, and both mobile open/closed test paths.
- [Shared primitive changes affect unrelated consumers] → Add named variants instead of changing defaults and test every modified consumer.
- [Playwright introduces runtime cost] → Keep a focused parity project and fixed high-value viewport/state matrix; retain fast unit checks separately.
- [Concurrent `add-block-editor` edits conflict] → Reserve its entity/storage/body contracts, make composition changes in isolated commits, and rebase/coordinate before touching shared content owners.
- [Historical OpenSpec tasks conflict with new measurements] → Validate evidence first, then update/sync superseded requirements rather than marking old checkboxes by assumption.

## Migration Plan

1. Capture reference and localhost baselines without changing data.
2. Introduce the current shell geometry and responsive state policy behind existing component APIs.
3. Move repeated visual states to named shared variants and update shell/sidebar/header consumers.
4. Correct content-level compound controls, panel visibility, localization, and production naming without changing persistence.
5. Add per-object lifecycle coverage for creation, click, write, validation, selected state, projection synchronization, and no duplicate counts.
6. Extract or map reusable lifecycle components and shared variants before applying object-specific behavior.
7. Add unit and Playwright coverage, then run the complete viewport/state matrix.
8. Validate and sync OpenSpec deltas only after browser and source evidence pass.

Rollback is file-level: revert the parity commits while retaining local workspace data because no storage migration occurs.

## Open Questions

None. Mobile navigation open/closed behavior is explicitly stateful, the current authenticated reference is authoritative, and local data remains the content source.
