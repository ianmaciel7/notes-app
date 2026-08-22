## Why

The workspace currently diverges from the authenticated Capacities interface in desktop geometry, panel visibility, responsive behavior, and several hover/click state contracts. The live reference has also changed since earlier repository audits, so the project needs one current, evidence-backed parity contract rather than continuing to implement stale 288px-sidebar assumptions.

## What Changes

- Make the authenticated live Capacities UI the authoritative reference for workspace geometry, interaction states, and responsive behavior while retaining local Notes App data.
- Update the desktop shell to the current 224px sidebar, 46px rails, 10px surface gutters, 12px surface radii, fluid content sizing, and route/state-dependent contextual panel visibility.
- Keep the sidebar visible without horizontal overflow at 768px and move navigation and auxiliary panels off-canvas below the mobile breakpoint so the main workspace remains usable at 480px and 390px.
- Standardize shared sidebar rows, tabs, type chips, compact menus, submenus, popovers, tooltips, and their hover, focus, selected, open, post-click, Escape, and reduced-motion states.
- Make complete row/tab surfaces reliable pointer and keyboard targets while preserving distinct nested actions such as tab close and the object-type selector arrow.
- Apply the same visual and interaction contract across existing object listings, editors, cards, collections, queries, and empty states without copying reference account data or migrating persisted workspace data.
- Add real-browser interaction and responsive checks, computed-style/geometry evidence, localization cleanup, and strict OpenSpec verification.
- Preserve the untracked `add-block-editor` change and exclude block document types, editor persistence, and its planned storage migration from this change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/capacities-en-fidelity`: Replace the stale route/demo acceptance target with a current, locale-independent, local-data workspace parity contract covering shell, content states, interactions, motion, and responsive checkpoints.
- `ui/app-sidebar`: Change the authoritative expanded desktop width and responsive ownership, and tighten full-row targets plus hover/focus action-reveal behavior.
- `ui/app-header`: Require reliable full-tab activation, non-intercepting nested actions, current hover timing, and cramped/mobile panel behavior.
- `ui/object-lifecycle`: Require each locally instantiated object type to use the current Capacities creation, click, write, selected, post-click, count, and projection contracts without copying reference account data.

## Impact

- Affects `AppShell`, the workspace controller, sidebar/header compositions, shared compact UI primitives, object-content surfaces, locale catalogs, and browser/unit verification.
- Preserves the existing public workspace component APIs, `data-slot` contracts, localStorage schema/version, object data, and Next.js Server Component boundary.
- Introduces Playwright-based browser interaction coverage and parity audit artifacts/scripts; it does not add backend behavior or copy data from Capacities.
- Requires coordination with active shell/header/sidebar changes and reserves `workspace-content.tsx`, entity types, and storage areas owned by `add-block-editor` from incompatible edits.
