# Ladle Story Standards

These rules define the required structure for Ladle component and documentation stories.

## Component stories

- Keep each story file beside its component: `src/components/<area>/<name>.stories.tsx`.
- Use one story file per component or cohesive component family; do not use catch-all catalogs.
- Import `Story` and `StoryDefault` as types from `@ladle/react`.
- Export the default meta object with `satisfies StoryDefault`.
- Use stable area-first titles such as `UI / Button`, `Editor / Capacities Parity`, or `Objects / Icons`.
- Name the baseline story `Default`; use concise PascalCase names such as `Variants`, `Sizes`, `Disabled`, `Checked`, `Empty`, `Range`, and `Group` for other states.
- Give each story one visual or interaction purpose and demonstrate every public variant, size, and important state.

## Layout and accessibility

- Add an explicit width or layout constraint when the component would otherwise stretch ambiguously.
- Use consistent `gap-*` or `space-y-*` spacing for multiple examples.
- Give every input-like control a label or explicit accessible name.
- Give icon-only controls an accessible name and mark decorative icons with `aria-hidden="true"`.
- Prefer semantic HTML in fixtures and use the production CSS, tokens, and providers.
- Keep fixtures deterministic and independent of routes, authentication, persistence, network requests, time, and randomness.

## Composite and interactive stories

- Render compound components in their intended parent-child structure to exercise context and keyboard behavior.
- Use stable `defaultValue` or `defaultChecked` state unless controlled behavior is the subject of the story.
- Include at least one interaction-relevant state for menus, dialogs, tabs, toggles, selectors, and editor controls.
- Use real production components; mock only external services or data.

## Documentation stories

- Keep Markdown documentation under `docs/` and expose it through the matching `.stories.tsx` file.
- Use `?raw` imports and `DocViewer` for Markdown rendering.
- Documentation stories with translations must expose the shared `pt-BR` / `en` locale control.
- Register every new or changed Markdown document in its domain story in the same change.

## Verification

- Run `pnpm typecheck` and `pnpm ladle:build` before completion.
- Check light and dark themes when theme tokens are involved.
- Check keyboard focus, labels, and icon-only control names.
- Confirm the story appears under the intended sidebar title without an accidental catch-all group.

