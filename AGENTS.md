<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:tooling-agent-rules -->

# Tooling Rules

- Use pnpm commands defined in `package.json`.
- Use Biome for linting and formatting.
- Preserve the Next.js-managed block in `AGENTS.md`.
- For repetitive Next.js migrations or API changes, check whether Next.js
  provides an official codemod before writing custom edits.
- Prefer official Next.js codemods through pnpm, for example
  `pnpm dlx @next/codemod@latest <codemod-name> .`; do not add
  `@next/codemod` as a project dependency unless there is recurring
  maintenance value.
- Before running a codemod, inspect the affected files with `rg`, exclude
  generated or build output, and use any available dry-run or preview mode.
- After running a codemod, inspect `git diff`, search for remaining old
  patterns, then validate with the relevant project commands such as
  `pnpm lint`, `pnpm test`, and `pnpm build`.
- If a codemod leaves ambiguous or partial changes, finish those cases with
  targeted manual edits.

<!-- END:tooling-agent-rules -->

<!-- BEGIN:no-index-agent-rules -->

# No Index Files Rule

- Never create or use `index.ts` or `index.tsx` (barrel files).
- Always import directly from the specific module file (e.g., `@/lib/i18n/provider`, `@/lib/i18n/auth-errors`, `@/lib/auth/client-session`) instead of importing from directory roots or barrel exports.
- Do not create re-exporting barrel files to aggregate a folder's exports.
- This ensures optimal tree-shaking, prevents circular dependencies, maximizes Turbopack compilation speed, and eliminates module resolution ambiguities.

<!-- END:no-index-agent-rules -->

<!-- BEGIN:graphify-agent-rules -->

# Graphify Rules

- **Mandatory search routing**: All repository file searches, symbol lookups, dependency investigations, and architecture questions MUST start with Graphify (`graphify query`, `graphify path`, `graphify explain`, or `graphify affected`) when `graphify-out/graph.json` exists. If the investigation is broad, multi-step, or architectural, delegate it to `.agents/agents/research/agent.md` and require that agent to use the Graphify skill. Direct `rg`, `find`, or equivalent searches are permitted only as targeted verification after Graphify has established the relevant scope, or when Graphify has no matching node.
- For codebase questions, use `graphify query` when `graphify-out/graph.json` exists (use `--dfs` to trace linear execution/call chains, or default BFS for broad subsystem context).
- Use `graphify path` for relationships and `graphify explain` for focused concepts.
- Check `graphify-out/GRAPH_REPORT.md` for pre-extracted community clusters, god nodes, and architecture patterns.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation.
- For multi-step codebase exploration or architectural investigation, delegate to the `research` subagent (`code-researcher`).
- Do not skip Graphify because its generated files are dirty; skip only for stale/incorrect graph-output tasks or when explicitly requested.
- Use the fast path: query an existing `graphify-out/graph.json` before rebuilding, and use `graphify check-update .` or the incremental update command before expensive extraction.
- Before changing a highly connected shared component, service, API, database object, or authentication boundary, consider `graphify affected "<concept>"` and verify important results in source and tests.
- Use God Nodes and community labels for architectural orientation, but treat them as guidance rather than design judgments. Preserve directed relationships when dependency or call direction matters.
- Use Global Graph, repository cloning/merging, PostgreSQL introspection, or Cargo workspace introspection only when cross-project or external schema relationships materially affect the task.
- Respect `.graphifyignore`, protect existing graphs from unexpectedly smaller replacements, and use force/replacement options only after confirming that deletions or refactors make the reduction intentional.
- Prefer local/code-only extraction when project privacy matters; do not send non-code content to an external backend without authorization.
- After modifying code, run `graphify update .`.

<!-- END:graphify-agent-rules -->

<!-- BEGIN:skill-agent-rules -->

# Skill Ownership Rule

- External skills that are not owned or maintained by this project must be treated as read-only and must not be modified.
- Only skills owned and maintained by this project may be changed.
- If an external skill needs adjustments, create a project-owned adaptation without editing the original source.

<!-- END:skill-agent-rules -->

<!-- BEGIN:language-agent-rules -->

# Code Language Rule

- Always write code in English.
- Use English for variable names, function names, types, components, filenames, and technical comments.
- For user-facing or system-generated messages, prefer an internationalization (i18n) system over hardcoded strings.

## Internationalization (Next.js App Router)

- Treat a locale as a language and regional formatting preference, using standard identifiers such as `en-US` or `pt-BR`.
- Prefer the browser's `Accept-Language` preferences when selecting the initial locale, with an explicit supported-locale fallback.
- For localized routing, use a locale sub-path or domain. When using sub-path routing, place App Router special files under `app/[lang]/` and redirect requests without a supported locale in `proxy.ts`.
- Keep translations in per-locale dictionaries keyed by stable message identifiers; do not duplicate translated copy in components.
- Validate route locale parameters with a type guard such as `hasLocale` and call `notFound()` for unsupported locales instead of allowing a runtime dictionary failure.
- Load dictionaries in Server Components or server utilities. Use `next/root-params` to read a locale shared by nested Server Components without prop drilling; do not use it in Client Components, Server Actions, or Route Handlers.
- Use `generateStaticParams` for statically rendered localized routes when the supported locale set is known.
- Set the document `<html lang>` attribute from the active locale.
- For Client Components, receive the resolved locale/dictionary through the established app i18n provider or props; keep server-only dictionary loading out of client bundles.

Reference: [Next.js Internationalization guide](https://nextjs.org/docs/app/guides/internationalization)

<!-- END:language-agent-rules -->

<!-- BEGIN:shadcn-agent-rules -->

# shadcn/ui Rules

Use this rule when creating, modifying, or reviewing shared UI in
src/components/ui/ or feature components that consume it.

## Project source of truth

- This repository uses shadcn/ui with the base-nova style.
- The shadcn configuration is in components.json; keep it authoritative.
- Components are colocated in src/components/ui/.
- The configured aliases are:
  - @/components -> src/components
  - @/components/ui -> src/components/ui
  - @/lib -> src/lib
  - @/lib/utils -> src/lib/utils
  - @/hooks -> src/hooks
- The project uses @/* -> src/* from tsconfig.json.
- Tailwind CSS is v4. There is no Tailwind config file to edit for ordinary
  component work; global tokens and utilities live in src/app/globals.css.
- components.json uses CSS variables, neutral as the base color, no class
  prefix, Lucide as the icon library, RSC support, and rtl: false.
- The repository uses pnpm, Biome, Next.js 16, React 19, and TypeScript.

## Component architecture

- Prefer the existing component before adding a new primitive. Review the
  matching file in src/components/ui/ and follow its API and styling shape.
- Treat new component creation as the last option. Before writing a new
  component, follow this discovery order: (1) inspect and compose the local
  component and feature code, (2) search the shadcn/community registries with
  the `search-registry-items` skill using a short component keyword, and (3)
  review at least one relevant real-world reference when the interaction or
  layout is non-trivial. Use the reference library below according to the
  task; prefer real product flows for UX and component galleries for visual
  direction.
- Real product flows and app UI: https://mobbin.com/, https://pageflows.com/,
  https://refero.design/, https://nicelydone.club/, https://www.saasframe.io/,
  https://uisources.com/, and https://saasui.design/.
- SaaS and landing pages: https://saaswebsites.com/,
  https://saaslandingpage.com/, https://saaspo.com/, https://land-book.com/,
  https://www.lapa.ninja/, https://landingfolio.com/, and
  https://onepagelove.com/.
- Web and visual exploration: https://recent.design/, https://siteinspire.com/,
  https://www.awwwards.com/, https://minimal.gallery/, https://httpster.net/,
  https://collectui.com/, https://layers.to/, https://dribbble.com/,
  https://www.behance.net/, https://www.figma.com/community/, and
  https://www.designmd.co/.
- Design systems and focused patterns: https://designsystemsrepo.com/,
  https://designsystems.surf/, https://navbar.gallery/, https://footer.design/,
  https://bentogrids.com/, and https://muz.li/.
- Use references to understand interaction states, information hierarchy,
  accessibility, responsive behavior, and failure/recovery paths. Do not copy
  visual styling blindly, treat a screenshot as proof of usability, or add a
  dependency without checking its code, license, accessibility, and fit with
  the repository's Base UI/shadcn conventions.
- If no suitable equivalent exists, record the search terms and why local,
  registry, and reference options were insufficient in the implementation
  notes or pull request description. A new component must still compose from
  existing primitives wherever possible and explain its distinct boundary.
- Shared primitives should remain small, composable wrappers around the
  underlying primitive or semantic HTML element.
- Interactive primitives in this repository use Base UI packages such as
  @base-ui/react/button, @base-ui/react/dialog, @base-ui/react/menu,
  @base-ui/react/tabs, and related packages. Use Base UI when the local
  component already does so; do not introduce Radix-only APIs into a Base UI
  wrapper.
- Use "use client" only when the component or its primitive requires client
  behavior, state, effects, event handlers, or browser APIs. Keep static
  components server-compatible.
- Preserve the component's exported public API. If adding a subcomponent,
  export it from the same module with the other related parts.
- Feature components that wrap a shadcn primitive must derive their public
  props from that primitive. Use an `interface extends Omit<React.ComponentProps<typeof Primitive>, ...>` shape for controlled props, then forward the remaining props to the primitive.
- Prefer primitive prop types from the underlying library, or
  React.ComponentProps<"element"> for native wrappers. Avoid any and avoid
  duplicating DOM props by hand.
- Forward remaining props to the rendered primitive/element. Preserve refs and
  polymorphic composition according to the primitive's existing API.

## Styling and composition

- Use cn for class merging. In this repository it is available from cn and is
  re-exported by src/lib/utils.ts; follow the import style of the surrounding
  component.
- Use class-variance-authority (cva and VariantProps) for reusable variants
  and sizes. Keep variant names explicit and type-safe, and define sensible
  defaultVariants.
- Keep base styles in the component and allow a className override. Follow
  the established pattern of passing the merged class name to the primitive.
- Use semantic design tokens such as bg-background, text-foreground,
  bg-primary, text-muted-foreground, border-input, ring-ring, and
  text-destructive. Do not hard-code colors when a token exists.
- Use the existing radius scale (rounded-lg, rounded-xl, etc.) and spacing
  conventions. Do not introduce arbitrary design tokens without updating the
  global theme deliberately.
- Keep state styling accessible and consistent: include visible focus styles,
  disabled styles, invalid/error styles where relevant, and dark-mode variants
  when the component has a color-dependent state.
- Use data-slot="..." on the root and meaningful subparts. Existing CSS
  frequently targets these slots, including descendant and state selectors.
  Keep slot names stable and kebab-case.
- For Base UI polymorphic composition, follow the local render, mergeProps,
  and useRender patterns where the existing component uses them. Do not
  replace them with an unrelated asChild implementation.

## Icons and content

- Use icons from lucide-react; do not add a second icon library for ordinary
  UI.
- Follow the existing *Icon naming convention, for example XIcon or
  ChevronDownIcon.
- Let the component's icon sizing styles control ordinary icons. Use the
  component's icon size variants rather than ad-hoc icon dimensions.
- Icon-only controls must have an accessible name using aria-label, visible
  text, or an equivalent labelling relationship.
- Preserve meaningful text and semantic elements. Use sr-only text when a
  visual control needs a non-visible accessible label.

## Existing patterns to preserve

- button.tsx: Base UI Button plus CVA variants and sizes; exports both Button
  and buttonVariants.
- dialog.tsx, drawer.tsx, sheet.tsx, and menu components: client-side Base UI
  roots with portal, overlay, trigger, content, close, and labelled
  subcomponents as appropriate.
- input.tsx, textarea.tsx, label.tsx, and form-related components: native or
  Base UI controls with tokenized focus, disabled, and invalid states.
- card.tsx, table.tsx, skeleton.tsx, and similar structural components:
  server-compatible wrappers with stable data-slot markers.
- attachment.tsx, badge.tsx, bubble.tsx, empty.tsx, input-group.tsx,
  sidebar.tsx, tabs.tsx, toggle.tsx, and toggle-group.tsx: use the established
  CVA and slot patterns when adding related variants.
- Stories live beside components as *.stories.tsx and use Ladle. Add or update
  stories for meaningful variants, sizes, icon states, and edge cases.

## Configuration and dependencies

- Reuse installed dependencies before adding new ones. Relevant UI
  dependencies include @base-ui/react, @shadcn/react,
  class-variance-authority, cn, lucide-react, cmdk, date-fns,
  embla-carousel-react, input-otp, react-day-picker,
  react-resizable-panels, recharts, and tw-animate-css.
- Do not manually rewrite or remove shadcn-managed configuration without a
  clear reason. Keep components.json valid JSON and consistent with the
  generated component layout.
- Keep global token changes in src/app/globals.css; do not hide global theme
  changes inside one component.

## Next.js and repository constraints

- Before changing Next.js code, read the relevant current documentation under
  node_modules/next/dist/docs/; this project explicitly warns that its
  Next.js version has breaking changes.
- Preserve the Next.js-managed block in AGENTS.md.
- Keep application code under src/ and shared UI under src/components/ui/.
- Use the repository's pnpm scripts. Use Biome for formatting, linting, and
  import organization; do not introduce a competing formatter or linter.
- Keep imports organized in the style Biome produces. Prefer the configured
  aliases for cross-directory imports and relative imports for tightly
  colocated files such as stories.

## Validation checklist

After UI changes, run the smallest relevant checks and then the broader check
when practical:

1. pnpm lint
2. pnpm format when formatting changed or is uncertain
3. pnpm build for changes affecting routes, client/server boundaries, or
   shared primitives
4. pnpm ladle:build for component/story changes when practical

Before finishing, verify that:

- the component still exposes the expected exports and props;
- keyboard, focus, disabled, invalid, and modal/menu interactions remain usable;
- icon-only controls are labelled;
- data-slot names and token classes are consistent with neighboring files;
- no unnecessary dependency or global CSS change was introduced.

<!-- BEGIN:design-system-rule -->

# Design System Rule

- Read `DESIGN.md` before every UI, styling, component, theme, or visual design
  change.
- Treat `DESIGN.md` as mandatory project configuration for semantic colors,
  component composition, accessibility, and styling decisions.
- If `DESIGN.md` does not define a required decision, update it before
  implementing that decision.
- Follow the implementation template and completion gate in
  `.agents/rules/design.md`.

<!-- END:design-system-rule -->

<!-- BEGIN:knowledge-persistence-rules -->

# Knowledge Retention & Persistence Rule

- When an agent investigates a question, discovers critical architecture patterns, diagnoses recurring issues, or gathers information that is referenced multiple times—or when explicitly instructed to save knowledge—that information must NOT remain ephemeral in conversation chat logs.
- Always persist knowledge to the correct canonical repository location for long-term reuse:
  - **Codebase Knowledge Graph (`graphify-out/`)**: Run `graphify update .` after code or documentation changes to keep graph relationships current.
  - **Research & Deep Audits**: Save structured analyses into `docs/research/<topic>.md`.
  - **System Architecture**: Update `ARCHITECTURE.md` or `docs/decisions/`.
  - **Rules & Conventions**: Save into `.agents/rules/<rule-name>.md` and link in `AGENTS.md`.
  - **Developer Skills**: Save into `.agents/skills/<skill-name>/SKILL.md`.
- Always cite primary sources (exact files, commit hashes, line numbers, or official documentation URLs).

<!-- END:knowledge-persistence-rules -->

<!-- BEGIN:subagent-decomposition-rules -->

# Subagent Task Decomposition & Parallelization Rule

- Whenever a task spans large surface areas—such as investigating multiple repositories/worktrees, auditing dozens of files, reviewing multiple packages, or running extensive exploratory research—the Lead Orchestrator must divide the work across specialized subagents using `invoke_subagent`.
- Dispatch independent subagents concurrently (e.g., partitioning N items into parallel batches) to maximize throughput and minimize latency.
- The Lead Orchestrator aggregates findings across all subagent reports and synthesizes them into repository documentation adhering to the Knowledge Retention rule.

<!-- END:subagent-decomposition-rules -->

## Project context

- Next.js 16 with React 19 and TypeScript.
- pnpm is the package manager (`pnpm@11.20.0`).
- Application code lives under `src/`; the main route is `src/app/page.tsx`.
- Shared UI primitives live in `src/components/ui/`; utilities live in `src/lib/`; hooks live in `src/hooks/`.
- UI configuration is in `components.json`; Biome configuration is in `biome.json`.
- A Graphify knowledge graph is available under `graphify-out/`.

## Documentation and agent resources

- Architecture: `ARCHITECTURE.md`
- Agents: `.agents/agents/` (e.g., `architect` in `.agents/agents/architect/agent.md`, `code-reviewer` in `.agents/agents/code-reviewer/agent.md`, `doc-maintainer` in `.agents/agents/doc-maintainer/agent.md`, `firebase` in `.agents/agents/firebase/agent.md`, `research` in `.agents/agents/research/agent.md`, `security-reviewer` in `.agents/agents/security-reviewer/agent.md`, `test-engineer` in `.agents/agents/test-engineer/agent.md`, and `ui-engineer` in `.agents/agents/ui-engineer/agent.md`)
- Rules: `.agents/rules/` (including `shadcn.md` for shadcn/ui and
  `ui-engineering.md` for general UI, Next.js, and validation guidance)
- Design system: `DESIGN.md` and `.agents/rules/design.md`
- Skills: `.agents/skills/`
- UX/UI skill stack and routing: `.agents/rules/ux-ui-agent-skills.md`
- Project overview and commands: `README.md`
