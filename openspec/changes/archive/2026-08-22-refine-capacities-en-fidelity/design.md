## Context

The current `dev` route composes `AppShell`, split sidebar components, the reusable application header/tab system, and Base UI-backed shadcn primitives. Live inspection confirms that the shell already has the correct 288px sidebar and 46px header rail, but its main and contextual surfaces are empty, its demo tabs describe unrelated content, the contextual pane is materially wider than the target state, and its Geist typography differs from the target's measured Inter stack.

The latest exact authenticated Capacities URL supplied by the user is the primary read-only state and geometry reference. Its current accepted state is a blank `Citação` editor titled `Sem título`, with five visible main tabs and six `Explorar` actions. The user subsequently supplied the WACZ archives, completeness audit, and recoverable JSONL corpus. Their captured CSS and theme definitions are now the primary source for colors, borders, radii, shadows, and object-type tone mappings; the sanitized generated contract records these values without retaining authentication data or proprietary JavaScript bodies. Historical branches remain useful secondary donors: `old` for rich menus/tooltips and reduced-motion behavior, `old-2` for measured fixtures and contextual sizing, `old-3` for complete three-pane composition, and `feat/app-sidebar` for a narrow side-panel close behavior. None is an architectural merge target.

## Goals / Non-Goals

**Goals:**

- Make `/en` reproduce the latest accepted `Sem título` citation editor and six-action `Explorar` contextual surface in the existing modular architecture.
- Converge geometry, typography, semantic surfaces, spacing, radii, borders, icons, and interactive states using measured evidence.
- Keep route/demo fixture state separate from generic primitives and preserve public props, `data-slot`, ARIA, keyboard, resize, collapse, reduced-motion, and mobile contracts.
- Evaluate up to five iterations with a structured rubric and retain explicit evidence for every remaining failure.
- Reuse only narrow donor behaviors or values that are confirmed against the live target or needed to reproduce the target fixture.

**Non-Goals:**

- No copy of Capacities proprietary bundles, authentication data, cookies, private URLs, or captured identifiers beyond the user-supplied read-only target.
- No restoration of `WorkspaceShell`, `CapacitiesLayout`, `SidebarProvider`, or another historical monolith.
- No production persistence, backend, router/history integration, search implementation, or real Capacities data mutation.
- No third-party component framework, Base UI replacement, broad primitive restyling, or screenshot-only CSS hacks.
- No broad icon-library replacement or unverified proprietary asset copying; exact composition-owned SVG paths are permitted when authenticated evidence identifies the public Phosphor glyph and visible approximation remains material.

## Decisions

### Keep route acceptance state outside the primitives

Create a focused route-owned Capacities fidelity composition/fixture for the main object-type view and contextual explorer, then pass it through the current `AppShellSurface` slots.

- **Why:** The missing content is a route integration gap, not a reason to hardcode product data into `AppShell`, header, sidebar, or `src/components/ui`.
- **Alternative considered:** Restore `old-2`'s monolithic `WorkspaceShell` or `old-3`'s `CapacitiesLayout`. Rejected because it would replace the canonical architecture and duplicate already-split components.

### Reuse one object-type listing composition

Extend `ObjectTypeWorkspace` so every sidebar object type shares the same `Overview`/`All` structure. The overview owns recently opened entities filtered by the active type plus presentation-only collection and query sections; the all view retains the existing complete-list empty state.

- **Why:** Live Capacities evidence shows the same information architecture for object types such as Places, while the current local component already owns every generic type route.
- **Alternative considered:** Add a bespoke Places page and duplicate it for each preset. Rejected because it would drift visually, split interaction state, and contradict the shared object-type contract.

### Route listing actions through the workspace lifecycle

Wire both object-type `New` entry points to `createWorkspaceEntity(objectType.id)` and keep one visually hidden multi-file input owned by `ObjectTypeWorkspace`. Route selected files through an explicit workspace import action that validates file-backed types, reads textual content where useful, creates one local entity per accepted file, activates the last imported entity, and clears the input so the same file can be chosen again.

Keep the remaining listing controls in the same composition owner: title search filters the current type, collapse hides only the view toolbar, filter and sort expose inline rows, list/grid switch presentation, recent expansion opens the dedicated complete-list state, and the options/split-New menus route to concrete create/import/query/collection/pin/template/export/settings actions. Overview settings own explicit visible/hidden section state. Commands shown as available MUST change local state; localized feedback may confirm an action but cannot be its only effect.

- **Why:** A Capacities-style affordance must change workspace state; a decorative button or a file input that only works for file object types is not functional parity.
- **Alternative considered:** Reuse `beginCreate` followed by `commitFile` for every import. Rejected because document, task, URL, tag, table, and query imports do not own a file draft and would silently fail.

### Model collection, query, and settings commands as local state transitions

Create collection/query entries immediately with an untitled sequential identifier, select the created entry, and expose an inline editable title/details surface. Keep overview section visibility as local per-component state and allow every section to be restored from the settings popover. Dispatch the split-New global command to the existing sidebar palette and add/remove the active object type through the provider-owned pinned-entity state.

- **Why:** Authenticated inspection showed that collection/query creation is immediate, settings are checkbox-driven, recent expansion changes the active list state, and pin/global-New commands alter navigation state rather than displaying a toast.
- **Alternative considered:** Keep status banners or demo-complete messages for these controls. Rejected because visible commands that do not change application state fail the user's behavioral parity requirement.

### Refine composition owners before primitives

Apply measured values in `app-shell.tsx`, header/tab owners, sidebar consumers, and the route fixture. Change `src/components/ui/*` only when direct evidence proves a primitive-level mismatch shared by all consumers.

The object-type view/action toolbar owns a narrow `ObjectTypeToolbarIcon` map containing the measured Phosphor paths for Overview, All, add view, count, filter, sort, list, grid, and caret. The overview settings control reuses the already verified sidebar source gear. These glyphs remain 14px except the measured 12px caret and settings icons; the existing buttons, ARIA state, and local behavior remain the interaction owners.

- **Why:** This preserves shadcn `base-nova` behavior and avoids turning a Capacities-specific rule into a global regression.
- **Alternative considered:** Globally restyle buttons, menus, cards, and tooltips. Rejected because the current primitives serve unrelated surfaces and already provide required semantics.

### Use a small semantic foundation

Adopt Inter through the existing Next font boundary if implementation confirms the relevant Next.js 16 guidance, and promote only confirmed shared Capacities-like surface/border/text values to semantic CSS variables. Keep component-specific metrics local through Tailwind utilities.

- **Why:** Typography affects portals and every composed surface, while geometry such as tab widths and menu offsets belongs to the owning component.
- **Alternative considered:** Copy the historical `--bg-*` token set wholesale. Rejected because the supplied WACZ permits extracting the current captured light-theme values directly and historical values may be stale.

### Treat the live target as stateful evidence

Capture the authenticated target without mutating it, using the existing visible state as the canonical fixture. When a fresh navigation temporarily shows a loading/not-ready state, do not replace the original accepted state with that transient result.

- **Why:** The target is a live application whose asynchronously loaded content can change during reload; fidelity requires a stable acceptance state.
- **Alternative considered:** Infer content only from donors. Rejected because live evidence outranks historical implementations.

### Bound contextual sizing without replacing resize infrastructure

Retain `react-resizable-panels`, current triggers, and mobile Sheets. Adjust default/min/max proportions only from measured target evidence and verify collapse/expand/resize at every desktop checkpoint.

- **Why:** The current 45% contextual default produces a visible mismatch, while the existing shell already supplies accessible resize behavior.
- **Alternative considered:** Port `old-2`'s manual pixel resize and localStorage implementation. Rejected unless the current primitive cannot satisfy the measured behavior.

### Use structured evaluator-optimizer iterations

For each render, record `PASS` or `FAIL`, evidence, remaining mismatch, and owning file for shell geometry, typography, surfaces, spacing, radii/borders, sidebar, headers/tabs, side panel, icons, menus/popovers, interaction states, motion/resize, responsive behavior, and accessibility. Fix the highest-impact root cause and stop after five iterations or complete material convergence.

- **Why:** A single screenshot can hide interaction, accessibility, and responsive regressions.
- **Alternative considered:** One implementation pass followed only by `pnpm verify`. Rejected because static checks cannot establish visual fidelity.

## Risks / Trade-offs

- [Risk] The WACZ audit does not claim byte-identical archive completeness and omits four image payloads plus redacted request/authentication data. → Mitigation: use it only for the recoverable UI source contract, retain the live authenticated target for state/geometry validation, and keep unavailable image glyphs as documented approximations.
- [Risk] Changing the global font can affect menus, dialogs, and unrelated routes. → Mitigation: verify all `/en` portals plus focused application checks, and keep the change at the existing font boundary rather than adding local font overrides.
- [Risk] Context-panel tuning can break collapse, resizing, or narrow desktop widths. → Mitigation: preserve `ResizablePanel` APIs and test open, collapsed, expanded, resized, and mobile Sheet states at the defined checkpoints.
- [Risk] Route fixture content can be mistaken for persistent production data. → Mitigation: keep it in a clearly named demo/fidelity component with controlled callbacks and no storage/backend access.
- [Risk] Active component-scoped OpenSpec changes overlap implementation files. → Mitigation: preserve their requirements, avoid duplicate capabilities, and reconcile the new route-level delta during sync.
- [Risk] Target-specific icons could spread into global primitives. → Mitigation: keep the verified Phosphor paths in the object-type toolbar composition and reuse them only where the authenticated target proves the exact semantic glyph.

## Migration Plan

1. Capture and retain the initial live/local baseline plus the consolidated mismatch ledger.
2. Implement the route-owned fidelity fixture and highest-impact shared foundations without changing persistence or routing contracts.
3. Refine shell, tabs, sidebar, and contextual composition in dependency order, using selective donor diffs rather than merges or cherry-picks.
4. Run up to five visual evaluation iterations at desktop and responsive checkpoints, including interaction and accessibility states.
5. Run focused checks, `pnpm typecheck`, `pnpm verify`, OpenSpec verification/sync/strict validation, and the repository-supported Graphify status/update check.
6. Roll back by reverting only the files owned by this change; no data migration or external-state cleanup is required.

## Open Questions

- Whether future captures materially change the extracted theme contract; if they do, regenerate the sanitized artifact and review its source hashes and token diff before adoption.
- Whether Inter is best loaded through `next/font/google` or an existing local asset; implementation must first read the installed Next.js 16 font documentation and avoid introducing an unnecessary network/runtime dependency.
