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

## Completion check

Before finishing a workspace UI change, verify:

- no production source or tests reference old demo APIs such as `AppHeaderDemo`, `useAppHeaderDemo`, `AppSidebarPrimaryActionsDemo`, or `app-header-demo`;
- no production workspace component uses product-name-prefixed or locale-specific file names such as `product-*` or `*-en-*`;
- new user-facing copy appears in all locale catalogs under `src/messages`;
- object icons and object colors are imported from `@/components/object-icons`;
- a browser or DOM inspection of the reference UI backs any claimed visual parity change.
