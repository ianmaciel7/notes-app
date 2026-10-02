# Review checklist for rules no tool decides

`rtk pnpm run verify:code` prints the rule ids that `CONVENTIONS.md` marks `review-only`.
This file says where each rule is written and what to look for in the diff. It points at
`CONVENTIONS.md` instead of restating it, so the rule text stays in one place. If a rule
id in the Enforcement Index has no entry here, `verify:code` refuses to run until one is
added.

Review only the files in the diff (`rtk git diff origin/main --name-only`). A rule that
does not apply to any changed file is "not applicable", not a pass.

## Application components and hooks

| Rule | Read | Look for in the diff |
| --- | --- | --- |
| `base-ui-render-composition` | section 4 | A part that renders another element or component uses the Base UI `render={<X />}` prop. Flag `asChild`, custom `renderX` props, and wrapper components added only to change the rendered tag. |
| `reuse-primitives` | sections 3, 4, 8 | New markup that rebuilds something `src/components/ui/` already provides (dialog, select, menu, field, alert, button). Flag a new wrapper where an existing primitive and variant would do. |
| `composition-over-boolean-props` | section 3 | New boolean props that switch layout or structure (`isCompact`, `withIcon`). Prefer `children`, a real `variant` axis, or composition. |
| `single-public-application-component` | sections 3, 4 | Every file under `src/components/` outside `ui/` and `firebase/` declares exactly one React component and exports exactly one canonical application component matching the file's product role. Flag aliases, screen-name variants, any second component declaration, exported helpers, `Object.assign(Component, { Part })`, and static compound properties. Extract helper components into their own single-component files. No compound components, even with a shared context. A tool does not decide this, so run the three detection commands in `SKILL.md` section 3 on the whole `src/components/` tree (not only the diff) and report every hit as `file:count`. |
| `fast-refresh-module-isolation` | section 5, Fast Refresh | A component file that also exports constants, helpers, or singletons. Those belong in `src/lib/` or `src/hooks/`. |
| `server-action-result-type` | section 5, Server Actions | A Server Action that can throw across the RPC boundary instead of returning the typed `{ success, data } or { success: false, error }` result. |
| `performance-patterns` | sections 5, 7 | Sequential awaits that could start together, a parent awaiting data only a child needs, broad barrel imports on the client, heavy client-only code without `next/dynamic`, missing `loading.tsx` or `<Suspense>` where regions are independent. |

## Registry primitives (`src/components/ui/`)

These apply only when the diff edits a primitive. The folder is excluded from Biome and
the guards, so nothing else checks it. Compare with `rtk pnpm dlx shadcn@latest add <name> --diff`
before judging. Anatomy lives under "Primitive Anatomy" in section 4.

| Rule | Look for in the diff |
| --- | --- |
| `ui-primitive-no-default-export` | An `export default` in a primitive. |
| `ui-primitive-trailing-export-block` | `export function` or `export const` inline instead of one trailing `export { ... }` block. |
| `ui-primitive-no-interface` | An `interface` declaration instead of a `type` or a type derived from the primitive. |
| `ui-primitive-part-shape` | A part missing `data-slot`, not merging `className` through `cn()`, or not spreading `{...props}` last. |

## Floor items without a full mechanical check

`CONSTRAINTS.md` Floor is partly machine-checked by `check:floor` (suppressions, stubs,
skipped or deleted tests, removed assertions, new exceptions). These parts are not:

- **Secrets in source.** Read added lines for keys, tokens, and credentials. gitleaks runs
  in CI, so do not rely on it locally.
- **Browser baseline.** Chrome and Edge 111+, Firefox 111+, Safari 16.4+. Flag a hand-written
  polyfill, or an API newer than that baseline used without a runtime feature check.
- **Exceptions.** Any new row in the `CONSTRAINTS.md` Exceptions table needs an owner, a
  reason, and an expiry.
