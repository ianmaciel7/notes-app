<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Operating rules

Read `CONSTRAINTS.md` before writing code. It is the quality contract: never weaken
it, delete a test, add a checker suppression, or create an exception just to make
the task pass. Read the relevant project document before changing its subject:
`ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md`, `TESTING.md`, `SECURITY.md`, or
`CONTRIBUTING.md`.

Treat the repository as the source of truth. Always use a tool to inspect files,
search, edit, or verify; do not infer that a command or file was checked. Keep
paths repository-relative in documentation.

## Tool selection guide

Use the smallest tool that answers the question:

| Need | Use | When and how |
| --- | --- | --- |
| List or read files | `rg --files`, `rg`, shell read commands | Start here for names and plain-text matches. Prefer `rg` over recursive `grep`. |
| Understand unfamiliar code | `graphify` first, then `ast-grep outline` | For codebase/architecture questions, run `graphify query` when `graphify-out/graph.json` exists. Use `graphify path` for relationships and `graphify explain` for a focused concept. Use `ast-grep outline` to map unfamiliar files. |
| Find syntax or code structure | `ast-grep` | Use structural search when text search could miss equivalent syntax or when locating imports, exports, calls, or component patterns. |
| Navigate symbols or make semantic edits | Serena | Use for symbol-aware retrieval, references, definitions, and edits when the operation benefits from code semantics. Keep its server definition in `.agents/agents.json`. |
| Make a local file edit | `apply_patch` | Use for all intentional edits, including documentation. Do not use shell redirection or scripts to rewrite files. Never edit generated tool output directly. |
| Run a local command | `exec_command` with `rtk` | Prefix project commands with `rtk` for compact output. Use the package scripts below instead of retyping tool invocations. |
| Configure agents, MCP, skills, or profiles | `agents` CLI | Use `rtk agents status`/`doctor` to diagnose, `rtk agents sync` after source changes, and `rtk agents sync --check` to detect drift. Source of truth: `.agents/agents.json` and `.agents/skills/`. |
| Research a library, framework, SDK, API, CLI, or cloud service | Context7 CLI | Run `rtk npx ctx7@latest library ...` first, then `docs ...` for the selected ID. Use no more than three Context7 commands per question and run them outside the default sandbox. |
| Browse current public information | Web search/fetch | Use only when the user asks to browse or facts may have changed. Prefer official or primary sources; cite web sources in the answer. |
| Verify a live browser or UI flow | CUA/browser tool | Use for interaction with a running browser, screenshots, or end-to-end visual checks. Use `lighthouse` for repeatable project-level audits. |
| Create a repository snapshot | Repomix | Run `rtk npx repomix@latest` when an AI-review bundle is requested; follow `repomix.config.json`. |

If PowerShell blocks the global `agents` shim, use `agents.cmd`. Keep secrets in
`.agents/local.json`, never in committed configuration. Creating, installing,
removing, or updating a skill also requires `rtk npx skills update -p -y` and a
verified `skills-lock.json` diff.

## Mandatory tooling policy

Configured project tooling is part of the repository contract, not a suggestion.
When a tool's scope applies, using that tool is part of the definition of done.

Use the smallest specialized project-configured tool that directly supports the
operation. Do not bypass a specialized tool in favor of a broader, manual, or
less structured approach merely for convenience, speed, familiarity, or token
savings.

### Shell commands and RTK

- All supported project shell commands MUST be executed through `rtk`.
- Do not run a command directly when the same command can be executed correctly
  through `rtk`.
- A direct command is allowed only when `rtk` does not support it, changes
  behavior required by the task, is unavailable, or is itself being diagnosed.
- When bypassing `rtk`, state the reason and use the narrowest fallback.

### Plain-text and file discovery

- Use `rg --files` for file discovery and `rg` for exact/plain-text search.
- Do not use recursive `grep`, broad repository dumps, or exhaustive file reads
  when `rg` can answer the question directly.
- Use shell reads only for focused file inspection after the target is known.

### Graphify

- For codebase, architecture, dependency, ownership, or cross-file relationship
  questions, MUST start with `graphify query "<question>"` when
  `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships and
  `graphify explain "<concept>"` for focused explanations.
- Use `graphify-out/wiki/index.md` for broad navigation when it exists.
- Do not replace Graphify with raw repository-wide scanning when the graph can
  answer the question.
- After modifying code, MUST run `graphify update .` when Graphify is available
  so the checked-in/local graph remains current.

### ast-grep

- Use `ast-grep outline` to map unfamiliar source files or modules before
  manually reading large files when an outline is sufficient.
- Use `ast-grep` for structural searches involving syntax, imports, exports,
  calls, declarations, components, or equivalent code shapes.
- Do not use plain-text search as the final method when the task depends on code
  structure that `ast-grep` can identify reliably.

### Serena

- Use Serena for symbol-aware navigation, definitions, references, semantic
  retrieval, and supported semantic edits.
- Do not replace Serena with broad file scanning when the question is fundamentally
  about symbols or references.
- Keep Serena configuration owned by `.agents/agents.json`; do not create
  parallel ad-hoc Serena configuration.

### Context7

- For current behavior, syntax, configuration, migration, or API details of a
  library, framework, SDK, API, CLI, or cloud service, MUST use Context7 before
  relying on model memory.
- Follow the Context7 workflow defined later in this file: resolve the library
  first, then query its documentation.
- Do not substitute generic web search for Context7 when the question is
  specifically about supported library documentation and Context7 is available.

### Agents CLI

- MUST use the project-configured `agents` CLI to manage MCP servers, skills,
  integrations, profiles, and generated agent configuration.
- Do not manually recreate or hand-edit configuration owned by the Agents CLI.
- After changing shared agent source configuration, MUST run
  `rtk agents sync`.
- When validating generated configuration or drift, use
  `rtk agents sync --check`.
- Use `rtk agents status` or `rtk agents doctor` for diagnosis before creating
  manual workarounds.

### Project skills

- Before implementing work, inspect the available project-local skills and use
  every skill whose documented scope applies to the task.
- Applicable project skills MUST NOT be silently ignored in favor of generic
  model behavior.
- Do not replace project-owned skills with unrelated remote skills.
- Creating, installing, removing, or updating a skill MUST be followed by
  `rtk npx skills update -p -y` and verification of the resulting
  `skills-lock.json` diff.
- Remote skill content MUST NOT be refreshed merely because a newer upstream
  version exists unless the user explicitly requests the update.

### Repomix

- MUST use the checked-in Repomix configuration when a task requires a portable
  repository snapshot, AI-review bundle, or consolidated context covering a
  substantial portion of the repository.
- Use `rtk npx repomix@latest` and `repomix.config.json`.
- Do not create ad-hoc repository dumps when Repomix already defines the required
  snapshot behavior.
- Repomix is not required for localized tasks that Graphify, Serena, `ast-grep`,
  or focused file reads can answer.

### Ladle

- Reusable UI component work MUST use Ladle for isolated visual verification when
  a relevant story exists or when the change warrants a story.
- New or materially changed shared UI primitives SHOULD add or update the
  corresponding Ladle story.
- Do not treat TypeScript compilation alone as sufficient validation for visual
  component behavior.
- Use `rtk pnpm ladle` for interactive verification or
  `rtk pnpm ladle:build` for build verification.

### Local edits

- Intentional local file edits MUST use `apply_patch` when that editing tool is
  available.
- Do not use shell redirection, generated one-off scripts, or full-file rewrites
  merely to avoid a focused patch.
- Never edit generated agent output directly; change its source configuration and
  regenerate it through the owning tool.

### Configured MCP servers

When the active agent exposes the MCP servers configured in
`.agents/agents.json`, use the matching specialized MCP instead of inventing a
parallel workflow:

- Filesystem MCP: project-scoped file reads/writes when MCP file operations are
  the appropriate primitive.
- Git MCP: repository-aware Git inspection and operations.
- Fetch MCP: HTTP retrieval when direct fetching is required.
- Serena MCP: semantic code retrieval and editing as defined above.

Do not manually duplicate MCP configuration in tool-specific files. The
`agents` source configuration remains canonical.

### Git hooks and validation

- Husky, `lint-staged`, and configured local checks MUST NOT be bypassed to make
  a change or commit pass.
- Do not use `--no-verify`, disable hooks, remove checks, weaken thresholds, or
  add suppressions merely to complete a task.
- Fix the underlying failure or report the blocking tool failure.

### Tool bypass policy

A required tool may be bypassed only when it is unavailable, broken, incompatible
with the current operation, or itself the subject of the investigation.

When a required tool is bypassed:

1. identify the tool that could not be used;
2. state why it could not be used;
3. use the narrowest reasonable fallback;
4. preserve equivalent validation whenever possible;
5. do not weaken repository quality or safety rules.

Convenience, speed, preference, or token usage are not valid reasons to bypass
required tooling.


## Workflow by task

### Before changing code

1. Inspect `git status --short`, the relevant files, `package.json`, and
   `CONSTRAINTS.md`.
2. For a codebase question, query graphify first when its graph exists; use
   `ast-grep` and Serena only as needed to narrow the scope.
3. Read the relevant project documentation. For Next.js changes, also read the
   applicable guide under `node_modules/next/dist/docs/`.
4. For library-specific behavior or API syntax, use Context7 before relying on
   memory.

### While changing code

- Prefer existing patterns, primitives, tokens, and scripts.
- Use Biome, strict TypeScript, named exports in `src/components/ui/`, and
  composition (`children`/compound components) instead of boolean-prop matrices.
- For React 19, pass `ref` as a regular prop and use `use()` for new context
  access; do not introduce `forwardRef` or `useContext` without a documented need.
- For shadcn/Base UI, use existing variants, semantic tokens, `cn()`, `gap-*`,
  and the installed `render` slot API; do not assume Radix `asChild`.
- When changing agent configuration, edit only source configuration and then run
  `rtk agents sync`; never edit `.codex` or generated agent files directly.

### After changing code or tooling

Run checks according to risk:

| Change | Minimum verification |
| --- | --- |
| Any source or config change | `rtk pnpm lint`, `rtk pnpm test`, `rtk pnpm check:types` |
| Dependency, import, or module change | `rtk pnpm deps:check`, `rtk pnpm knip` |
| Testable logic or quality tooling | `rtk pnpm test:coverage`, `rtk pnpm run check:duplication`; use `rtk pnpm test:mutation` when mutation confidence matters |
| Security-sensitive or dependency change | `rtk pnpm check:security`, `rtk pnpm check:osv`; use `zizmor --offline .` for workflow security |
| UI, route, or styling change | `rtk pnpm build`, then `rtk pnpm lighthouse` when browser accessibility/performance is in scope |
| GitHub Actions change | `rtk pnpm lint:actions` (requires the system `actionlint` binary) |
| Agent/MCP/skill source change | `rtk agents sync --check`; for skill changes also verify `skills-lock.json` |

For a complete task-end gate, run `rtk pnpm check:fast`,
`rtk pnpm check:security`, and `rtk pnpm check:osv`. Before a PR, also run the
checks listed in `CONTRIBUTING.md`; the Husky hook runs staged Biome checks and
`check:fast` before commits.

## Project conventions

- Biome is the only formatter/linter; there is no ESLint or Prettier.
- TypeScript is strict. Do not add `any`, `@ts-ignore`, `eslint-disable`, or
  `biome-ignore` to bypass a check.
- Shared UI belongs in the established shadcn/Base UI anatomy and should get a
  Ladle story when a new or changed primitive needs coverage.
- Keep architecture, design, security, testing, and intent documentation aligned
  with significant changes. See each project document for its scope.
- Use Conventional Commits and the PR checklist in `CONTRIBUTING.md`.

<!-- context7 -->
Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Resolve library: `rtk npx ctx7@latest library <name> "<what to look up>"` — use the official library name with proper punctuation (e.g., "Next.js" not "nextjs", "Customer.io" not "customerio", "Three.js" not "threejs")
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question)
3. Fetch docs: `rtk npx ctx7@latest docs <libraryId> "<what to look up>"` — run a separate `docs` command per distinct concept if the question spans multiple topics, unless it's about how they interact
4. Answer using the fetched documentation

You MUST call `library` first to get a valid ID unless the user provides one directly in `/org/project` format. Be specific about what to look up in the library's documentation — specific and detailed queries return better results than vague single words, but keep each query to a single concept unless the question is about how concepts interact; combined multi-topic queries dilute ranking and return shallow results for each topic. Do not run more than 3 commands per question. Do not include sensitive information (API keys, passwords, credentials) in queries.

For version-specific docs, use `/org/project/version` from the `library` output (e.g., `/vercel/next.js/v14.3.0`).

If a command fails with a quota error, inform the user and suggest `rtk npx ctx7@latest login` or setting `CONTEXT7_API_KEY` env var for higher limits. Do not silently fall back to training data.
Run Context7 CLI requests outside Codex's default sandbox. If a Context7 CLI command fails with DNS or network errors such as ENOTFOUND, host resolution failures, or fetch failed, rerun it outside the sandbox instead of retrying inside the sandbox.
<!-- context7 -->

@RTK.md

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Skill ownership and updates

- Treat `.agents/skills/` and `skills-lock.json` as project-owned configuration.
- Do not update, overwrite, or replace remote skill content merely because a newer upstream version exists.
- Reinstall or refresh a remote skill only when explicitly requested, and preserve the locked source and project-local skills.
- Do not add skills discovered from a remote repository unless they are explicitly requested and recorded in the project configuration.
