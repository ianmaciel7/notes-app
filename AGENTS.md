# Agent Instructions

## Package Manager

- Use **pnpm** (`pnpm@11.20.0`); keep dependency changes in `package.json` and `pnpm-lock.yaml` together.

## Commands

| Task | Command |
|------|---------|
| Development | `pnpm dev` |
| Dev with emulators | `pnpm dev:all` |
| Firebase emulators | `pnpm emulators` |
| Export emulators | `pnpm emulators:export` |
| Lint | `pnpm lint` |
| Typecheck | `pnpm typecheck` |
| Unit tests | `pnpm test` |
| E2E tests | `pnpm test:e2e` |
| Production build | `pnpm build` |

## Architecture

- This is a Next.js 16 App Router application under `src/app/`; route pages live in `src/app/**/page.tsx`.
- `src/components/` contains feature UI, application shells, and providers (e.g. `src/components/auth-provider.tsx`, `src/components/space-layout.tsx`); keep route composition in `src/app` and reusable UI / providers in `src/components`. Do not create a separate `src/contexts/` directory.
- Component naming convention:
  - Primitives/wrappers must follow official shadcn/Base UI suffixes: `*Dialog` (`DeckDialog`, `CardDialog`, `GoalsDialog`), `*AlertDialog` (`ConfirmAlertDialog`), `*Card` (`StudyCard`, `GoalsCard`).
  - Screen/shell components use semantic domain names: `LibraryShell`, `DeckDetail`, `StudySession`, `BackupManager`, `AnalyticsDashboard`, `SpaceLayout`. Avoid generic `-app` or `-view` suffixes.
- `src/data/` contains browser-local IndexedDB access, backup serialization, and domain record types. `src/domain/` contains scheduling and study-queue rules. `src/integrations/` contains WebMCP and Firebase integrations. Keep business rules out of route pages and presentational components.
- Persistence is browser-local IndexedDB through Dexie (`src/data/db.ts`); do not assume a server database or add server persistence without an explicit requirement.
- Preserve the existing Portuguese (`pt-BR`) product language and accessibility/focus behavior.

## Next.js and UI Conventions

- Follow App Router conventions: use Server Components by default; add `"use client"` only to components that need browser APIs, state, effects, or event handlers.
- Keep browser-only code (Dexie, `window`, file APIs) behind client boundaries and do not import it into Server Components.
- Use English route segments for navigation (`/backup`, `/decks/[deckId]`, `/study/[deckId]`); validate dynamic route data before use.
- Use Tailwind CSS v4 and the design tokens in `src/app/globals.css`; avoid introducing a second styling system or scattering new global CSS.
- Before changing App Router APIs, routing, caching, or Server Actions, consult the installed guides under `node_modules/next/dist/docs/`.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- shadcn/ui is configured through `components.json` with `base-nova`, `@base-ui/react`, `lucide-react`, `@/components/ui`, and `@/lib/utils`; follow the detailed rules in `.agents/rules/shadcn-first.md`.
- Keep generated shadcn primitives in `src/components/ui`; compose them in feature components and do not put product-specific behavior in generated primitives.
- Keep controlled text-entry state local; debounce Dexie writes and flush persistence on blur, submit, navigation, or unmount. Handle IME composition without committing partial input.

## Verification

- After changing code or agent instructions, run `graphify update .`.
- For UI changes, run the focused component tests plus `pnpm typecheck` and `pnpm lint`; run E2E tests for route or interaction changes.
- Run the checks you report and state skipped checks, failures, assumptions, and remaining risks honestly.
- Inspect the final diff and repository status before reporting completion; preserve unrelated user changes.

## Code Style

- Use TypeScript strict mode, double quotes, semicolons, trailing commas, and 2-space indentation as established by the existing files and ESLint.
- Name files and folders in kebab-case; use PascalCase for React components and types, camelCase for functions, variables, and hooks, and UPPER_SNAKE_CASE only for true constants.
- Keep persistence mutations and validation in `src/data`, and domain rules in `src/domain`; UI components should emit callbacks and render state rather than duplicate business rules.
- Use semantic HTML, accessible names, `type="button"` for non-submit buttons, and the existing focus-visible behavior.
- Write code in English: identifiers, types, functions, hooks, props, filenames, comments, test descriptions, and internal errors must use English.
- Keep only user-facing product copy in Portuguese (`pt-BR`); preserve established domain identifiers such as `deck`, `card`, `schedule`, and `review`.

## Graphify

- Use `graphify query "<question>"` first for codebase questions when `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships between files, symbols, or concepts.
- Use `graphify explain "<concept>"` for focused concept context.
- Use `graphify-out/wiki/index.md` for broad navigation when it exists.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain is insufficient.
- Dirty `graphify-out/` files are expected after hooks or incremental updates.
- After modifying code or agent files, run `graphify update .`.
- When the user types `/graphify`, use the installed graphify skill or instructions before anything else.

## Context7

- Use `npx ctx7@latest` for current docs when the user asks about a library, framework, SDK, API, CLI tool, or cloud service.
- Do not use Context7 for refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.
- Resolve first with `npx ctx7@latest library <name> "<what to look up>"` unless the user provides a `/org/project` ID.
- Fetch docs with `npx ctx7@latest docs <libraryId> "<what to look up>"`.
- Keep each docs query to one concept unless the question is specifically about how concepts interact.
- Do not run more than 3 Context7 commands per question.
- Do not include API keys, passwords, credentials, personal data, or proprietary code in Context7 queries.
- Run Context7 outside Codex's default sandbox; if DNS/network errors occur, rerun outside the sandbox.
- If quota fails, tell the user and suggest `npx ctx7@latest login` or `CONTEXT7_API_KEY`.

## Custom Agents

- Cross-tool role files live in `.agents/agents/*.md`; Codex CLI roles live in `.codex/agents/*.toml` and must define `name`, `description`, and `developer_instructions`.
- Follow `.agents/skills/custom-agent/SKILL.md` when creating, reviewing, renaming, or improving role files.
- Keep role files short, explicit about edit permissions, and clear about verification or handoff.
- Follow `.agents/skills/skill-creator/SKILL.md` when editing skills under `.agents/skills/`.

## Instruction Scope

- Update `AGENTS.md` for durable repo-wide instructions that every coding agent should see.
- Create or update a narrower rule file when the instruction is tool-specific, experimental, generated, or only applies to one workflow.
- Follow the guidelines in `.agents/rules/instruction-scoping.md` when scoping new agent rules.
- Prefer a nested `AGENTS.md` only when a subtree needs different commands or conventions from the repo root.
- Keep temporary task notes out of `AGENTS.md`; put repeatable workflow guidance in a skill under `.agents/skills/`.
- Do not duplicate the same instruction in `AGENTS.md` and a rule file; link to the narrower source when possible.
- Treat `.worktrees/` as strictly read-only historical reference material and preserve unrelated user changes.
- Never expose secrets or perform destructive, privileged, production-impacting, or irreversible actions without explicit authorization; use portable relative paths in repository configuration.

## External References

| Need | File |
|------|------|
| Custom agent roles | `.agents/agents/*.md` |
| Custom agent workflow | `.agents/skills/custom-agent/SKILL.md` |
| Skill authoring | `.agents/skills/skill-creator/SKILL.md` |
| Instruction scoping | `.agents/rules/instruction-scoping.md` |
| UI & Component rules | `.agents/rules/shadcn-first.md` |
| Tailwind CSS rules | `.agents/rules/tailwind-styling.md` |
| Input performance | `.agents/rules/input-performance.md` |
| React children props | `.agents/rules/react-children-props.md` |
| Firebase basics | `.agents/skills/firebase-basics/SKILL.md` |
| Firebase Auth basics | `.agents/skills/firebase-auth-basics/SKILL.md` |
| Knowledge graph | `graphify-out/graph.json` |
