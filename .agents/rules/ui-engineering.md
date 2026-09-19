# UI Engineering Rules

Use this rule for general UI quality and repository constraints that apply to
feature UI as well as shared components. shadcn-specific composition rules are
in `.agents/rules/shadcn.md`.

## Icons, content, and accessibility

- Use `lucide-react` for ordinary icons and follow the `XIcon`/
  `ChevronDownIcon` naming convention.
- Let the component's icon sizing styles control ordinary icons; do not add
  ad-hoc dimensions.
- Give icon-only controls an accessible name with `aria-label`, visible text,
  or an equivalent labelling relationship.
- Preserve meaningful text and semantic elements. Use `sr-only` text when a
  visual control needs a non-visible label.
- Review keyboard, focus, disabled, invalid, modal, and menu interactions.

## Next.js and repository constraints

- Before changing Next.js code, read the relevant current documentation under
  `node_modules/next/dist/docs/` and follow its deprecation guidance.
- Preserve the Next.js-managed block in `AGENTS.md`.
- Keep application code under `src/`, shared UI under `src/components/ui/`,
  and imports organized by Biome. Use configured aliases across directories
  and relative imports for tightly colocated files.
- Never create `index.ts` or `index.tsx` barrel files.
- Use pnpm scripts and Biome for formatting, linting, and import organization.

## Validation

After UI changes, run the smallest relevant checks and broaden validation when
practical:

1. `pnpm lint`
2. `pnpm format` when formatting changed or is uncertain
3. `pnpm build` for route, client/server boundary, or shared primitive changes
4. `pnpm ladle:build` for component or story changes

Before finishing, verify that exports and props remain compatible, interactive
states remain usable, icon-only controls are labelled, `data-slot` names and
token classes match neighboring files, and no unnecessary dependency or global
CSS change was introduced.

