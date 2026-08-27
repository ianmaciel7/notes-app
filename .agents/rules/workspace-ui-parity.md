# Workspace UI Parity

When implementing the reference-style workspace, do not treat prototype/demo code as production UI.

## Naming contract

- Do not use `demo`, `Demo`, `fixture`, product-name prefixes, or locale suffixes such as `-en` in production component names, file names, exported APIs, hooks, providers, or route-level workspace modules.
- Use neutral app-domain names for production workspace code, for example `WorkspaceProvider`, `useWorkspace`, and `workspace-content`.
- Test-only fixtures may use `fixture`, but they must stay under test files or explicitly documented test helpers.

## Localization contract

- Do not hardcode end-user copy in localized workspace components.
- Use the repository i18n layer (`next-intl` and `src/messages/*.json`) for all user-visible labels, placeholders, empty states, aria labels, menu copy, and status messages.
- Add or update every supported locale catalog when introducing a new user-visible string.
- Keep stable IDs, variable names, data attributes, and internal APIs in English.

## Object icon contract

- All object-type icons must come from the central object icon registry in `src/components/object-icons.tsx`.
- Do not import one-off object icons from `lucide-react`, ad hoc SVGs, or local inline replacements in feature components.
- The same object type must render the same icon and color everywhere: sidebar, tabs, search overlays, headers, side panels, cards, and empty states.
- Before changing object icons, inspect the current reference UI and preserve the observed SVG path, sizing, color, and inline label treatment unless a product requirement explicitly says otherwise.
- In object labels, render icons inline with text and use the central object tone metadata. Do not wrap object icons in extra colored badges unless the reference UI does so in the same context.

## Structure source-of-truth contract

- Treat `WorkspaceObjectState.structures` as the canonical source for object-type identity, ownership, names, lifecycle, schema, icon name, tone, collections, and presentation.
- Do not add a closed union of runtime object-type IDs, a fixed creation-palette list, or component-local mutable object-type registries. Derive sidebar rows, creation options, chips, tabs, headings, filters, and counts from canonical Structure selectors.
- Keep built-in Structures, reserved system Structures, and suggested custom-type presets separate. A preset is an immutable template; confirming it creates a custom Structure with a new persistent ID.
- Persist only locale-neutral serializable metadata. Resolve React icons through `src/components/object-icons.tsx` and localize built-in labels at projection boundaries; never persist components or translated labels.
- Resolve object creation and import behavior from the referenced Structure lifecycle kind. Unknown or reserved Structure IDs must fail without changing entities, selection, counts, or content.
- Structure rename and appearance changes must update the canonical record so every projection observes the change. Deletion must remain guarded while instances or dependent collections exist.
- Preserve the existing localStorage key and migrate snapshots atomically. A failed Structure or object-reference validation must use the recovery contract rather than partially hydrating mixed data.

## Shared component and style contract

- Do not paste long reference-derived `className` strings directly into multiple feature components.
- Before adding or changing a Tooltip, HoverCard, DropdownMenu, Popover, Combobox, Dialog, compact menu, object label, account panel, or icon badge, search `src/components/ui` and the nearby workspace components for an existing shared primitive or helper.
- If the same visual pattern is needed in more than one place, create or extend a neutral shared component/helper under `src/components/ui` or the relevant central registry before applying it to feature components.
- Use neutral app-domain names for shared UI helpers. Do not use product-name prefixes, locale suffixes, or names that imply a one-off reference copy.
- Keep one visual contract per pattern. A compact menu row, compact search input, floating surface, object icon badge, account plan badge, and small action button must have one shared implementation and only local sizing overrides when the reference UI genuinely differs by context.
- When a reference snippet exposes exact SVG paths, icon sizes, background colors, border colors, rounded corners, or hover states that must be reused, put the reusable pieces in the central icon registry or shared UI helper instead of duplicating them inline.
- Prefer existing theme tokens and shared constants. Hard-coded colors and arbitrary Tailwind values are allowed only when they are documented reference parity values and are centralized in a shared helper as soon as they repeat.
- Do not make screenshot-only fixes that diverge from shared primitives. If a component looks wrong, fix the shared primitive or add a well-named variant instead of layering overrides at every call site.

### Popup appearance contract

- Treat the live reference popup for the same product area as the canonical visual reference. Sidebar context menus must use the shared 269px sidebar context-menu width exported by `src/components/ui/compact-menu.tsx` so object-type and collection menus cannot drift apart.
- Standard dropdown and select rows use the shared 32px height, 8px radius, secondary icon color, aligned separators, and shortcut treatment from `src/components/ui/shared-styles.ts` and the owning primitive. The 24px compact-menu row is a distinct named variant, not the default popup density.
- Feature components must not set popup surface width, background, border, radius, shadow, padding, row height, row radius, hover/focus color, separator spacing, icon sizing, or keyboard-shortcut styling with one-off classes. Put a documented semantic variant in `src/components/ui` and reuse it instead.
- Call sites may control placement through primitive props such as `side`, `align`, and offsets. A visual override is allowed only when current reference evidence proves a distinct pattern and the override is promoted to a named shared variant.
- When changing a popup, compare it in the browser with the live canonical popup from the same area at the same viewport and add a focused source or component test that confirms both consumers use the shared contract.

## Interaction parity protocol

Treat every visible affordance as an interaction state machine, not as a screenshot. For each matching reference/local affordance, build an action matrix from the states that the control actually exposes:

- Baseline: record DOM structure, accessible role/name, bounding rectangle, computed typography/colors/borders, enabled/disabled state, focusability, console errors, and relevant data/count/route state before interaction.
- Pointer hover: move onto the whole primary target and each nested target; record reveal/opacity, background, border, icon, cursor, tooltip, submenu, geometry stability, and transition duration. Move away and confirm the state returns correctly.
- Focus and keyboard: reach the control with Tab/Shift+Tab, record the focus ring and focus target, then exercise Enter, Space, arrows, Escape, and typeahead/search when supported. Verify the accessible name and focus recovery.
- Click: click the primary target, nested action, disclosure arrow, and each visible option separately. Record navigation, selection, mutation, menu/dialog/popover opening, counts, active tab, and contextual-panel changes.
- Open state: inspect popup/overlay DOM, role, placement, width/height, padding, row heights, initial focus, available options, empty/loading/error state, outside-click behavior, and Escape close behavior.
- Post-click: after every accepted action, re-check the visible label/icon/selected or pressed state, route/tab, entity/content/count projection, related panel, and persisted data. Do not accept a click merely because an event fired.
- Persistence and recovery: reload or reopen when persistence is promised; verify the result survives exactly once. Exercise cancel, unavailable/disabled, empty, invalid, rejected, and failed states when exposed, and verify no partial mutation.
- Motion and stability: capture before/during/after transition states where motion exists, and repeat with reduced motion if supported. Check that hover/focus/click does not shift neighboring targets or create overflow.

Compare the same state sequence at the same viewport in the live reference and localhost. Separate semantic data differences from UI differences; never delete or rewrite local entities just to make a screenshot match. Report `action -> expected reference state -> observed local state -> parity verdict -> evidence`, and identify untested states explicitly.

## Completion check

Before finishing a workspace UI change, verify:

- no production source or tests reference old demo APIs such as `AppHeaderDemo`, `useAppHeaderDemo`, `AppSidebarPrimaryActionsDemo`, or `app-header-demo`;
- no production workspace component uses product-name-prefixed or locale-specific file names such as `product-*` or `*-en-*`;
- new user-facing copy appears in all locale catalogs under `src/messages`;
- object icons and object colors are imported from `@/components/object-icons`;
- object-type projections consume `WorkspaceObjectState.structures` without a parallel mutable registry or fixed preset IDs;
- repeated reference-style classes were extracted to a shared component/helper instead of copied into multiple feature components;
- Tooltip, HoverCard, DropdownMenu, Popover, Combobox, Dialog, compact menus, account panels, and object labels use the matching shared primitive or helper;
- popup consumers do not own one-off surface or row appearance classes, and related sidebar context menus use the same exported width contract;
- a browser or DOM inspection of the reference UI backs any claimed visual parity change.
