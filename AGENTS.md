# AGENTS.md

## Project overview

This is a Next.js application managed with pnpm.

The `.worktrees/old` through `.worktrees/old-6` directories are historical
attempts of this same project. They are reference worktrees, not separate
projects. Preserve them as historical context and do not delete, reset, or
rewrite them unless explicitly requested.

## Setup and development

- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Run tests: `pnpm test`
- Use `pnpm` exclusively for project commands and dependency management. Do
  not use npm or yarn for this repository.

### Worktree setup and references

Whenever starting work on the project:

1. Confirm the available worktrees and their branches with
   `git worktree list`.
2. Review the historical worktrees when prior implementation context is
   relevant. Compare them with the active branch using commands such as
   `git diff dev...old` or `git diff dev...old-6`.
3. Work in the active checkout or in a newly requested worktree. Treat
   `old`–`old-6` as read-only references by default.
4. Run `pnpm install` in the worktree where the task will be implemented,
   then run the project's relevant checks before making changes.

The primary development branch is `dev`. Do not assume that the newest
historical worktree is the correct implementation; inspect the code and
history before reusing an approach.

## Architecture guidance

- Always locate and read the repository's `ARCHITECTURE.md` before planning or
  implementing changes.
- Treat the current checkout's `ARCHITECTURE.md` as the authoritative source
  for the project's structure, boundaries, and architectural invariants.
- If the document is missing or does not describe the requested area, call
  that out before making architectural changes and update the document when
  the change materially affects the architecture.
- Do not treat `ARCHITECTURE.md` files in historical worktrees as authoritative
  unless they are explicitly being consulted for comparison.

## Code style

- Use TypeScript strict mode.
- Use single quotes and omit semicolons.
- Prefer functional patterns where practical.
- Use two-space indentation and keep files, functions, and components focused.
- Keep functions below roughly 80 lines when practical; split complex logic
  into named helpers that can be tested independently.
- Keep code and documentation in English.
- Keep identifiers, filenames, test descriptions, comments, error messages, and user-facing application copy clear and idiomatic in English.
- Use Biome as the formatter and linter when it is configured. Do not add
  ESLint or Prettier without an explicit project decision.
- Use the repository's formatter configuration as the source of truth for
  quote and semicolon details; do not reformat generated shadcn files by hand
  in a way that conflicts with the configured formatter.
- Keep imports direct and ordered by the formatter. Do not create barrel
  `index.ts` files for shadcn/ui components.
- Name React components in PascalCase, hooks with the `use` prefix, event
  handlers with `handle`/`on` semantics, and types/interfaces with clear
  domain names.
- Prefer explicit, narrow types over `any`; model nullable and error states
  instead of hiding them with assertions.
- Avoid `as` assertions, non-null assertions, and `any` unless the boundary is
  validated and the reason is documented.
- Keep domain types and business rules independent from UI components so that
  data, server, and test modules do not import from presentation code.

## Styling and CSS rules

- Use Tailwind CSS v4 with CSS-first configuration. Define theme variables and
  semantic tokens in `src/app/globals.css`; do not create `tailwind.config.js`
  or `tailwind.config.ts` unless the project explicitly changes Tailwind
  versions.
- Do not create component CSS Modules or standalone per-component stylesheets.
  Use Tailwind utilities, `cva()` variants, arbitrary descendant selectors,
  and global theme tokens instead.
- Use semantic tokens instead of raw palette colors. Prefer
  `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`,
  and component variants over `bg-blue-500`, hardcoded hex values, or manual
  `dark:` overrides.
- Use `gap-*` for layout spacing, `size-*` for equal width and height,
  `truncate` for text truncation, and `cn()` for conditional classes. Avoid
  `space-x-*`, `space-y-*`, duplicated width/height utilities, and manual
  template-literal class conditions.
- Do not add manual z-index values to Dialog, Sheet, Drawer, Popover, or other
  overlay primitives; their shadcn composition owns stacking behavior.

## Next.js best practices

- Follow current Next.js App Router conventions and inspect the existing project structure before adding files.
- In Next.js 16, use `proxy.ts` for network proxy concerns; do not introduce
  `middleware.ts` unless the installed Next.js version explicitly requires it.
- Prefer React Server Components by default; add `'use client'` only when browser APIs, state, effects, or event handlers require it.
- Keep client components small and pass only serializable props across the server/client boundary.
- Client Components must not be async. Fetch data in a Server Component and
  pass serializable DTOs down to the client boundary.
- In Next.js 15+, await `params`, `searchParams`, `cookies()`, and `headers()`;
  do not use the old synchronous API shape.
- Use Server Actions for UI mutations and Route Handlers for HTTP APIs or external integrations.
- Avoid request waterfalls with parallel data fetching, `Suspense`, and appropriate caching or revalidation strategies.
- Use `next/link`, `next/image`, and `next/font` instead of equivalent unoptimized HTML or external loading patterns.
- Use `next/script` for third-party scripts; inline scripts require an `id`.
- Wrap `useSearchParams()` in `Suspense`, and wrap `usePathname()` in
  `Suspense` for dynamic routes when required by static rendering.
- Follow Next.js metadata and error-handling conventions, including `metadata`, `generateMetadata`, `not-found.tsx`, and `error.tsx` where appropriate.
- Use the Node.js runtime by default and choose Edge only when the implementation and dependencies support it.
- Keep browser-only packages behind a small Client Component or an appropriate
  `next/dynamic` boundary; never import browser-only code into server modules.
- Prefer Web `Request`/`Response` in Route Handlers, return explicit status
  codes, and keep UI imports out of API modules.
- Read the installed Next.js documentation under `node_modules/next/dist/docs/`
  when dependencies are available, because framework APIs and conventions can
  change between versions.

## shadcn/ui standards

- For every UI task, use the `shadcn` skill before implementing or reviewing
  components. Refresh project context with `pnpm dlx shadcn@latest info` when
  `components.json` exists.
- Treat shadcn/ui components as source code owned by the repository, not as a
  runtime dependency or opaque component package.
- Use `components.json` as the source of truth for the shadcn template, base
  (`radix` or `base`), style, icon library, aliases, and resolved paths.
- Keep generated primitives in `src/components/ui/` and shared helpers in
  `src/lib/`, including `src/lib/utils.ts` with the project's `cn()` helper.
- Keep feature compositions in `src/components/` and compose the primitives;
  do not copy or fork a primitive into a feature folder.
- For compound controls such as split buttons, wrap and compose the existing
  shadcn primitives instead of rebuilding their behavior. Preserve the
  primitive `data-slot` contract, expose typed props with
  `React.ComponentProps<typeof Primitive>`, and use `cn()` for caller class
  names and conditional classes.
- Put shared visual variants in typed maps or `cva()` definitions, keep domain
  variant types outside the primitive UI layer, and pass theme values through
  semantic tokens or CSS variables rather than raw palette classes.
- Use direct imports from the defining component files. Do not add barrel
  exports for compound shadcn components or their primitives.
- Do not create standalone CSS Modules or per-component stylesheets for UI.
  Use Tailwind CSS v4 utilities, `cva()` variants, arbitrary descendant
  selectors, and theme tokens in `src/app/globals.css`.
- Use the project's configured aliases from `components.json`; never assume
  `@/` or hardcode registry import paths.
- Check the shadcn registry with the CLI before creating a custom component.
  Prefer existing components, built-in variants, and composition over custom
  markup or one-off CSS.
- Before creating, fixing, or using a component, consult its shadcn docs with
  `pnpm dlx shadcn@latest docs <component>` and use the configured base API:
  `asChild` for Radix or `render` for Base UI.
- Use semantic theme tokens such as `bg-background`, `text-foreground`,
  `text-muted-foreground`, and `bg-primary`; do not use raw color classes for
  component states or manually override dark-mode colors.
- Use `flex`/`grid` with `gap-*`, `size-*` for equal dimensions, `truncate`,
  and `cn()` for conditional classes. Avoid `space-x-*`, `space-y-*`, manual
  template-literal class conditions, and manual overlay z-index values.
- Follow accessible shadcn composition: group menu/select/command items,
  include titles in Dialog/Sheet/Drawer, keep TabsTrigger inside TabsList,
  provide AvatarFallback, and use complete Card composition.
- Use `FieldGroup`/`Field` for forms, `ToggleGroup` for small option sets,
  `FieldSet`/`FieldLegend` for related controls, and `data-invalid` plus
  `aria-invalid` for validation states.
- Use `Alert`, `Empty`, `Separator`, `Skeleton`, `Badge`, and `sonner` for
  their respective patterns instead of recreating them with styled elements.
- Put `data-icon` on icons inside Buttons, do not add manual icon sizing inside
  components, and pass icon components as objects rather than string keys.
- When a component renders an icon-bearing child internally, keep the icon
  accessible (`aria-hidden` when decorative) and apply the project's icon
  slot convention rather than adding ad-hoc width/height classes.
- Use the project's configured icon library and primitive base. Do not replace
  them with a different library or assume Radix APIs without checking
  `components.json`.
- When adding or updating a component, use `pnpm dlx shadcn@latest`, inspect
  every generated file, verify imports and composition, and run the relevant
  checks. Never use `--overwrite` without explicit approval.
- For community registry components, specify the registry explicitly. Review
  every added file, repair aliases and icon imports using `components.json`,
  and verify missing groups, accessibility labels, and server/client boundaries.
- When updating an installed component, preview with `--dry-run` and `--diff`
  first. Preserve local changes and never use `--overwrite` without explicit
  approval.
- When using a registry block or community component, identify the registry
  explicitly, review its files, and fix aliases, icons, missing groups, and
  accessibility issues before considering it complete.
- Do not use direct DOM mutations for application UI. Keep DOM updates under
  React's control, except for an explicitly documented browser API integration.

### shadcn CLI reference

Run every shadcn command from the project directory with the configured package
runner: `pnpm dlx shadcn@latest`. Do not use npm/yarn, manually fetch registry
files, decode preset codes, or invent undocumented flags.

```powershell
# Inspect the project and components.json configuration
pnpm dlx shadcn@latest info
pnpm dlx shadcn@latest info --cwd <path>

# Initialize the current project or scaffold a new project
pnpm dlx shadcn@latest init --defaults
pnpm dlx shadcn@latest init --template next --preset base-nova
pnpm dlx shadcn@latest init --name <name> --template next --preset base-nova
pnpm dlx shadcn@latest init --monorepo --template next --preset base-nova
pnpm dlx shadcn@latest create --defaults

# Search configured registries
pnpm dlx shadcn@latest search <registry> --query <query>
pnpm dlx shadcn@latest search <registry> -q <query> --limit <number> --offset <number>
pnpm dlx shadcn@latest list <registry> -q <query>

# Get documentation URLs and inspect registry items
pnpm dlx shadcn@latest docs button dialog select
pnpm dlx shadcn@latest view @shadcn/button

# Add official or explicitly named registry components
pnpm dlx shadcn@latest add button card dialog
pnpm dlx shadcn@latest add @<registry>/<item>
pnpm dlx shadcn@latest add <component> --path <path>
pnpm dlx shadcn@latest add --all

# Preview before writing or updating files
pnpm dlx shadcn@latest add <component> --dry-run
pnpm dlx shadcn@latest add <component> --diff
pnpm dlx shadcn@latest add <component> --diff <file>
pnpm dlx shadcn@latest add <component> --view
pnpm dlx shadcn@latest add <component> --view <file>

# Build a custom registry from registry.json
pnpm dlx shadcn@latest build
pnpm dlx shadcn@latest build <registry> --output <path>
```

CLI workflow rules:

- Run `info` first when `components.json` exists; use its aliases, resolved
  paths, framework, Tailwind version, base, icon library, and package manager.
- Run `search` before creating a new component and check community registries
  when relevant. Use `docs` and fetch the returned documentation before using
  a component API.
- Use `view` for registry inspection. Use `add --dry-run`, `add --diff`, and
  `add --view` to preview project-specific changes, source files, and CSS
  updates before installation or modification.
- `add --diff` replaces the separate `diff` command for component updates. Do
  not use `shadcn diff`.
- Use only explicit registries. Never guess a registry for a block or
  community component.
- `--overwrite` is destructive to local component files and requires explicit
  user approval. Prefer smart merge: preview with `--dry-run`/`--diff`, then
  preserve local changes while applying upstream updates.
- `--force` may replace configuration. Ask before using it unless the user
  explicitly requested the operation.
- For preset changes, ask whether to `reinstall`, `merge`, or `skip`:
  `init --preset <code> --force --reinstall` replaces components;
  `init --preset <code> --force --no-reinstall` updates configuration while
  preserving components; merge requires inspecting each installed component
  with `info`, `--dry-run`, and `--diff`.
- Presets are opaque named values, codes, or URLs. Pass them directly to
  `init --preset`; never decode or resolve them manually.
- `build` is only for projects publishing a custom registry. It reads the
  local `registry.json` and writes registry files to `public/r` by default.
- Inspect every file written by the CLI. Verify aliases, imports, base-specific
  APIs (`asChild` versus `render`), icon library, grouping, accessibility,
  server/client boundaries, and generated CSS before considering the change
  complete.

## Code safety boundaries

- Never import server credentials, admin SDKs, private environment variables,
  or secret-bearing modules into Client Components.
- Do not expose secrets through `NEXT_PUBLIC_*`, client props, URLs, logs, or
  rendered HTML.
- Do not mutate React-managed DOM nodes directly. Use React state and props;
  browser APIs require a deliberate Client Component boundary.
- Do not use async Client Components. Do not pass non-serializable values such
  as functions, class instances, `Date`, `Map`, or `Set` across RSC boundaries.
- Keep generated files such as `.next/`, `next-env.d.ts`, and build metadata
  out of manual edits.

## Verification standards

- Run the narrowest relevant checks first, then the full project checks when
  practical: `pnpm check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and
  `pnpm build` according to the scripts that actually exist.
- Do not claim a check passed unless it was run in the current checkout.
- For meaningful UI changes, verify keyboard navigation, focus behavior,
  accessible names, loading/error states, responsive layout, and hydration.
- Keep tests close to the behavior they cover and include regression tests for
  component variants, accessibility contracts, and server/client boundaries.

## Tooling preferences

- Prefer the project's CLI tools or available MCP integrations for supported operations instead of manually recreating their results.
- Use the shadcn CLI or its MCP integration when adding shadcn components; verify the component before installing it.
- Use Shoogle or another appropriate registry/search integration when looking for reusable components or packages.
- Inspect generated or downloaded files and adapt them to the repository's conventions before considering the work complete.

## Agent configuration

- The Vercel agent definitions are mirrored in `.codex/agents/` and
  `.agents/agents/`.
- Keep both definitions aligned in name, purpose, plugin dependency, skill
  catalog, and scope. Only the file format differs: Codex uses TOML and
  Antigravity uses Markdown with YAML frontmatter.
- Codex discovers project-scoped agents from `.codex/agents/*.toml`. Its
  machine-wide alternative is `C:\Users\ianma\.codex\agents`.

## Contribution guidelines

- Preserve existing changes and avoid destructive commands.
- Keep changes focused.
- Add or update tests for behavior changes.
- Update documentation when behavior or architecture changes.
