# AGENTS.md

## Project overview

This is a Next.js application managed with pnpm.

The `.worktrees/old` through `.worktrees/old-6` directories are historical
attempts of this same project. They are reference worktrees, not separate
projects. Preserve them as historical context and do not delete, reset, or
rewrite them unless explicitly requested.

## Markdown document responsibilities

Each Markdown document has a defined scope. Do not duplicate or move a rule to
the wrong document just because it is convenient.

| File or location | Responsibility | Authority |
| --- | --- | --- |
| `AGENTS.md` | Repository-wide instructions for coding agents: workflow, safety, commands, style, framework, testing, and contribution rules. | Canonical operational instructions |
| `ARCHITECTURE.md` | System structure, runtime boundaries, routes, data flow, security boundaries, and architectural invariants. | Canonical architecture |
| `SPEC.md` | Product behavior and requirements, including visitor/authenticated access, scope, and future seams. | Canonical product behavior |
| `DESIGN.md` | Visual direction, interaction principles, responsive behavior, and UI language. | Canonical design direction |
| `DECISIONS.md` | Durable architectural decisions and their rationale. Record why a choice was made; do not use it as a task list. | Canonical decision record |
| `README.md` | Human-facing project introduction and getting-started information. Keep it concise and do not replace agent instructions with it. | Canonical human entry point |
| `CLAUDE.md` / `GEMINI.md` | Compatibility entry points that reference `AGENTS.md`. Keep them as pointers unless a tool requires provider-specific instructions. | Delegates to `AGENTS.md` |
| `.agents/README.md` | How workspace agent customization is organized. | Agent-discovery guidance |
| `.agents/rules/agents.md` | General principles for agent instruction files, precedence, and scope. | Agent-rule guidance |
| `.agents/rules/subagents.md` | Antigravity subagent orchestration, delegation matrix, and lifecycle standards. | Subagent orchestration guidance |
| `.agents/agents/*/agent.md` | Role-specific operating instructions for a named agent. These files must consult the root documents and must not redefine product or architecture truth. | Agent role guidance |
| `.agents/skills/*/SKILL.md` | Reusable task procedure for a specific skill. Follow it only when that skill is selected. | Skill procedure |
| `.agents/plugins/*/plugin.json` | Plugin manifest packaging skills, rules, hooks, and MCP configs for a domain. | Canonical plugin bundle |
| `.worktrees/old*/**/*.md` | Historical implementation context only. Never treat these files as authoritative for the active checkout. | Read-only reference |

When documents disagree, resolve them by scope: user/system instructions and
the root `AGENTS.md` govern agent behavior; `SPEC.md` governs product behavior;
`ARCHITECTURE.md` governs system structure; `DESIGN.md` governs visual and
interaction direction; and `DECISIONS.md` explains accepted trade-offs. Update
the relevant source document when a change materially affects its scope.

## Setup and development

- Install dependencies: `pnpm install`
- Install required plugins: `npx plugins add vercel/vercel-plugin --scope project` and `npx plugins add firebase/agent-skills --scope project`
- Restore agent skills: `npx skills experimental_install` (when `skills-lock.json` exists and skills in `.agents/skills/` are missing)
- Start the development server: `pnpm dev`
- Run tests: `pnpm test`
- Use `pnpm` exclusively for project commands and dependency management. Do
  not use npm or yarn for this repository.
- **Mandatory setup verification**: Before implementing any changes, always verify
  that all project dependencies, required CLI tools (e.g., `firebase-tools`),
  required plugins (`vercel/vercel-plugin` and `firebase/agent-skills` installed
  via `npx plugins add <repo> --scope project`), and agent skills are installed
  and enabled. If any package, CLI tool, plugin, or locked skill from
  `skills-lock.json` is missing or not installed, proactively install, enable, or
  restore it immediately as part of setup before proceeding.

### Worktree setup and references

Whenever starting work on the project:

1. Confirm the available worktrees and their branches with
   `git worktree list`.
2. Review the historical worktrees when prior implementation context is
   relevant. Compare them with the active branch using commands such as
   `git diff dev...old` or `git diff dev...old-6`.
3. Work in the active checkout or in a newly requested worktree. Treat
   `old`–`old-6` as read-only references by default.
4. Run `pnpm install` in the worktree where the task will be implemented.
   Ensure project plugins (`vercel/vercel-plugin`, `firebase/agent-skills`)
   are installed with `npx plugins add <repo> --scope project`. If
   `skills-lock.json` exists and skills in `.agents/skills/` are missing, run
   `npx skills experimental_install` to restore them. Ensure all required
   tools, plugins, and skills are fully installed and active, then run the
   project's relevant checks before making changes.

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
- Store all user-facing application copy in `src/messages/*.json` and read it
  with `next-intl`; do not hardcode visible labels, aria labels, tooltips,
  status text, or navigation names in components. Keep every message key
  synchronized across all supported locale files.
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
- Never introduce deprecated APIs, options, overloads, or package members. Treat
  TypeScript deprecation diagnostics such as `ts(6385)` as implementation
  errors: consult the installed package types and official documentation, then
  migrate to the current API before considering the change complete.
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
  (`radix` or `base`), style, icon library, aliases, and resolved paths. Expected project baseline: `base-nova`, `@base-ui/react`, `lucide-react`, `@/components/ui`, and `cn` from `@/lib/utils`.
- Keep generated primitives in `src/components/ui/` and shared helpers in
  `src/lib/`, including `src/lib/utils.ts` with the project's `cn()` helper.
- Keep feature compositions in `src/components/` and compose the primitives;
  do not copy or fork a primitive into a feature folder.
- **Component Selection and Composition Order**: Before writing custom UI, follow this strict order:
  1. Reuse an appropriate component already available under `@/components/ui`.
  2. Inspect and add missing official components with `pnpm dlx shadcn@latest add <component>` from the package containing `components.json`.
  3. Compose existing primitives and named parts. Create a custom primitive only when available components cannot meet the requirement.
- For compound controls such as split buttons, wrap and compose the existing
  shadcn primitives instead of rebuilding their behavior. Preserve the
  primitive `data-slot` contract, expose typed props with
  `React.ComponentProps<typeof Primitive>`, `React.ComponentPropsWithRef`, or
  CVA `VariantProps` (using intentional `Pick`/`Omit`), and use `cn()` for caller
  class names and conditional classes.
- New reusable components owning a DOM root must add stable kebab-case `data-slot`
  attributes to their root and meaningful sub-parts (e.g., `data-slot="settings-panel-header"`).
- Feature wrappers around shadcn primitives must derive their props from the
  wrapped component with `ComponentProps<typeof Primitive>` and forward those
  props. Destructure only feature-specific props (such as route state) so
  custom values never leak onto the DOM.
- Put shared visual variants in typed maps or `cva()` definitions, keep domain
  variant types outside the primitive UI layer, and pass theme values through
  semantic tokens or CSS variables rather than raw palette classes.
- Use direct imports from the defining component files. Do **NOT** create or use `index.ts` barrel files for shadcn/ui components. Use lowercase kebab-case filenames for UI component files.
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
  `asChild` for Radix or `render` for Base UI primitives.
- For Base UI composition, use `render` on supporting primitives, not Radix-style `asChild`. Custom rendered
  components must forward received props and ref to the correct DOM element and avoid
  nested interactive elements.
- When exposing custom `render` APIs with Base UI, use `useRender` and combine primitive
  and consumer props with `mergeProps` (preserving handler execution order). Because
  `mergeProps` does not merge refs, use `useRender` ref handling or ref composition.
- Preserve state attributes supplied by the installed primitive (such as `data-open`,
  `data-checked`, `data-disabled`, `data-size`, `data-variant`, or `data-orientation`).
  Do not assume Radix `data-state` conventions on Base UI primitives. Avoid mirroring
  these attributes with redundant React state.
- In React 19, forward refs directly on component props without introducing `forwardRef`
  mechanically. Preserve Next.js server/client boundaries by placing `'use client'` strictly
  at client entry points.
- Use semantic theme tokens such as `bg-background`, `text-foreground`,
  `border-border`, `ring-ring`, `text-muted-foreground`, and `bg-primary`; do not use raw color classes (such as `bg-blue-500` or hardcoded hex/RGB values) for
  component states or manually override dark-mode colors. Do not modify `globals.css`
  or global theme variables to fix a local component unless scoped to the task.
- Use `flex`/`grid` with `gap-*`, `size-*` for equal dimensions, `truncate`,
  and `cn()` for conditional classes. Avoid `space-x-*`, `space-y-*`, manual
  template-literal class conditions, and manual overlay z-index values.
- For dynamic layout styles, prefer inline CSS variables or utility tokens over arbitrary
  values and avoid using `!important` as a specificity workaround.
- Follow accessible shadcn composition: group menu/select/command items,
  include titles in Dialog/Sheet/Drawer, keep TabsTrigger inside TabsList,
  provide AvatarFallback, and use complete Card composition.
- Use `FieldGroup`/`Field` for forms, `ToggleGroup` for small option sets,
  `FieldSet`/`FieldLegend` for related controls, and `data-invalid` plus
  `aria-invalid` for validation states.
- Maintain accessible focus behavior and keyboard navigation across all controls: keep configured
  focus rings (such as `outline-ring/50`); never remove focus outlines without an accessible replacement,
  and do not rely on color alone for state indication.
- For overlay components (Dialog, Sheet, Drawer, Popover, Tooltip), forward `side`, `align`,
  and offset props to positioner parts; reuse anchor dimensions, available-space variables, and
  transform origins. Validate Escape dismissal, outside click handling, focus restoration, clipping,
  and `prefers-reduced-motion`. Tooltip content must remain strictly non-interactive.
- Use `Alert`, `Empty`, `Separator`, `Skeleton`, `Badge`, and `sonner` for
  their respective patterns instead of recreating them with styled elements.
- Put `data-icon` on icons inside Buttons, do not add manual icon sizing inside
  components, and pass icon components as objects rather than string keys.
- Import icons explicitly from `lucide-react`. Do not mix icon libraries, import the entire icon
  namespace for static icons, or redraw existing icons as custom inline SVG.
- When a component renders an icon-bearing child internally, keep the icon
  accessible (`aria-hidden` when decorative) and apply the project's icon
  slot convention rather than adding ad-hoc width/height classes.
- Domain object icons must use the local `ObjectIcon` primitive and be added
  to the `ObjectIconName` union and `objectIconMap` in `src/lib/object.ts`.
  Actionable object types should have a matching `*-split-button.tsx`
  composition; do not turn the primitive into a registry.
- Separate layout/state concerns: independent panels require independent state (e.g., sidebar visibility,
  panel width, mobile behavior). Maintain one source of truth per state (`value`/`defaultValue`, `open`/`defaultOpen`).
- For stories and tests: use production components and real visual providers; test relevant variants,
  disabled/error/loading states, keyboard navigation, focus, RTL, and responsive layouts. Prefer semantic behavior
  tests over raw snapshot testing.
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
- Clean up listeners, timers, subscriptions, and effects. Isolate persistence
  and make shared managers replaceable/resettable for independent instances,
  stories, and tests. Avoid hydration mismatches from browser-only state.
- Keep state local unless composition requires sharing. Use context for related
  parts, not mandatory global wrappers. Preserve required provider boundaries
  and stable instances; never hide missing-provider errors with artificial fallbacks.

### shadcn official references

Consult these on demand — always use the installed version, not training-data assumptions:

| Topic | URL |
| --- | --- |
| Configuration | https://ui.shadcn.com/docs/components-json |
| CLI | https://ui.shadcn.com/docs/cli |
| All components | https://ui.shadcn.com/docs/components |
| Theming | https://ui.shadcn.com/docs/theming |
| Base UI composition | https://base-ui.com/react/handbook/composition |
| Rendering & refs | https://base-ui.com/react/utils/use-render |
| Prop merging | https://base-ui.com/react/utils/merge-props |
| State styling | https://base-ui.com/react/handbook/styling |
| Lucide icons | https://lucide.dev/guide/react |
| Client boundaries | https://nextjs.org/docs/app/api-reference/directives/use-client |

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
- Verify **every affected component and meaningful part**, not a single
  representative example. Run relevant lint, type-check, and tests; check
  visual/interactive changes in a browser when available. Review consumers
  and preserve unrelated work.
- For meaningful UI changes, verify keyboard navigation, focus behavior,
  accessible names, loading/error states, responsive layout, and hydration.
- Keep tests close to the behavior they cover and include regression tests for
  component variants, accessibility contracts, and server/client boundaries.
- Report changes, completed checks, and limitations. Never claim passing tests,
  visual parity, accessibility compliance, or compatibility without evidence.

## Tooling preferences

- Prefer the project's CLI tools or available MCP integrations for supported operations instead of manually recreating their results.
- Use the shadcn CLI or its MCP integration when adding shadcn components; verify the component before installing it.
- Use Shoogle or another appropriate registry/search integration when looking for reusable components or packages.
- Inspect generated or downloaded files and adapt them to the repository's conventions before considering the work complete.

## Agent configuration

- Workspace agent definitions are located in `.agents/agents/<name>/agent.md`.
- Workspace rules are located in `.agents/rules/` and skills in `.agents/skills/<name>/SKILL.md`.
- Do not create, mirror, or recreate `.codex` directories, `openai.yaml` files, or non-standard configurations.
- Subagent definitions must use standard YAML frontmatter with `name`, `description`, and `subagent: true`.
- Each subagent operates within an independent context window to maintain focus, prevent context pollution, and handle background execution.

### Lead Orchestrator and Delegation Pattern

- The primary Antigravity agent operates as a **Lead Orchestrator**, decomposing complex, multi-step, or domain-specialized tasks rather than executing everything monolithically.
- Delegate subtasks concurrently to specialized subagents using `invoke_subagent`.
- Antigravity uses reactive message wakeup: do **not** poll or loop on subagent status. Proceed with other work or stop calling tools; the system resumes execution automatically when a subagent reports back.
- Monitor active subagents, view step transcripts, and manage processes via the `/agents` panel in the CLI or Desktop UI.

### Mandatory Subagent Delegation Matrix

| Domain | Subagent | Responsibility |
| :--- | :--- | :--- |
| **Research & Exploration** | `research` | Codebase searches, multi-directory file lookups, external documentation, and web references. |
| **Architecture & System Design** | `architect` | System boundaries, RSC vs Client Component splits, refactoring strategy, and ADRs. |
| **Code Review & Quality** | `code-reviewer` | Auditing git diffs, checking strict TypeScript, enforcing Biome styles, and catching regressions. |
| **Testing & Verification** | `test-engineer` | Designing test plans, authoring tests, verifying build/test passes (`pnpm test`), and emulators. |
| **Security & Privacy** | `security-reviewer` | Firebase Auth verification on server, Firestore default-deny security rules, and secret hygiene. |
| **Documentation** | `doc-maintainer` | Maintaining living documentation (`AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `SPEC.md`). |
| **Firebase Operations** | `firebase-developer` | Client/Server SDK boundary, Firestore data modeling, Security Rules, and Emulator Suite. |
| **Next.js & Vercel** | `vercel-developer` | Next.js App Router, SSR/RSC optimization, caching strategies, Vercel deployments, and shadcn/ui. |

## Contribution guidelines

- Preserve existing changes and avoid destructive commands.
- Keep changes focused.
- Add or update tests for behavior changes.
- Update documentation when behavior or architecture changes.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
