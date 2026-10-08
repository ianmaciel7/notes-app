# Tooling

Inventory of the tooling present in this repository and on the current
development machine: what each tool is for, where it is configured, and where
it runs. Policy lives in the documents linked below; this file only maps tools
to commands and configuration.

Snapshot taken on 2026-10-07. Versions in the machine tables go stale; re-check
with each tool's `--version`.

- Coding policy: [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- Test strategy: [TESTING.md](./TESTING.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Engineering workflows: [docs/guides/workflows.md](./docs/guides/workflows.md)

## 1. Runtime and package manager

| Item | Value | Source |
| --- | --- | --- |
| Node.js | 22.19.0 | `.node-version` |
| Package manager | pnpm 12.8.1 | `packageManager` in `package.json` |
| Build-script allowlist | `@firebase/util`, `protobufjs` allowed; `sharp`, `unrs-resolver`, `@parcel/watcher`, `@swc/core` blocked | `pnpm-workspace.yaml` `allowBuilds` |
| Dependency overrides | `@grpc/grpc-js`, `qs`, `smol-toml` | `pnpm-workspace.yaml` `overrides` |
| Audit exception | `GHSA-vfj7-8cjw-p6xm` (markdownlint-cli2 globs only) | `pnpm-workspace.yaml` `audit.ignore` |
| Dependency updates | Renovate; `next`, `react`, `react-dom` grouped as `core-framework` | `renovate.json` |

## 2. Application stack

Runtime dependencies from `package.json`:

| Package | Role |
| --- | --- |
| `next`, `react`, `react-dom` | Framework (Next.js App Router, React) |
| `firebase` | Firebase SDK |
| `@firebase-oss/ui-core`, `@firebase-oss/ui-react` | Firebase UI packages behind the auth components (ADR 0004) |
| `@base-ui/react` | Base UI primitives under shadcn Base Nova |
| `shadcn`, `@shadcn/react` | shadcn CLI and React package |
| `class-variance-authority`, `cn`, `tw-animate-css` | Variant, class-name, and animation helpers |
| `lucide-react` | Icons |
| `react-hook-form`, `@hookform/resolvers` | Forms and schema resolvers |
| `cmdk`, `input-otp`, `embla-carousel-react`, `react-day-picker`, `react-resizable-panels`, `recharts`, `date-fns` | Component dependencies used by the shadcn UI layer |

Framework configuration:

| Item | Configuration |
| --- | --- |
| Next.js flags | `reactCompiler`, `cacheComponents`, `partialPrefetching` in `next.config.ts` |
| Type check config | `tsconfig.check.json` (extends `tsconfig.json`, excludes `src/components/firebase`) |
| React Compiler | `babel-plugin-react-compiler` |
| Tailwind CSS v4 | `tailwindcss`, `@tailwindcss/postcss`, `postcss.config.mjs` |
| shadcn | `components.json` (style `base-nova`, RSC, TSX, neutral base color, CSS variables) |

## 3. Quality tools

| Tool | Purpose | Command | Configuration |
| --- | --- | --- | --- |
| Biome 2.4.2 | Lint and format; hosts the GritQL plugin packs | `pnpm run lint`, `pnpm run lint:changed`, `pnpm run format` | `biome.json` |
| GritQL | Project-specific AST rules: `grit/nextjs/` and `grit/shadcn/` | runs inside Biome | `grit/`, `biome.json` `plugins` |
| TypeScript | Type check after `next typegen` | `pnpm run check:types` | `tsconfig.json`, `tsconfig.check.json` |
| Vitest | Unit tests with Happy DOM and V8 coverage, including the components-layer structure guard | `pnpm test`, `pnpm run test:guards`, `pnpm run test:changed`, `pnpm run test:coverage` | `vitest.config.ts`, `tests/unit/components-layer-structure.test.ts` |
| Testing Library | React and DOM test helpers | used by Vitest tests | `@testing-library/react`, `@testing-library/dom` |
| Playwright | E2E on Chromium, starts `pnpm dev` | `pnpm run test:e2e` | `playwright.config.ts` |
| Firestore rules tests | Security rules against the Firestore emulator | `pnpm run test:rules` | `vitest.rules.config.ts`, `tests/rules/` |
| axe-core | Accessibility checks inside Playwright | used by E2E tests | `@axe-core/playwright` |
| Stryker | Mutation testing (Vitest runner, TypeScript checker) | `pnpm run test:mutation` | `stryker.config.json` |
| Dependency Cruiser | Architecture rules: `no-circular`, `src-root-allowed-files-only`, `not-to-unresolvable`, `no-non-package-json`, `not-to-dev-dep`, `not-to-test`, `ui-primitives-cannot-import-domain`, `lib-and-hooks-cannot-import-ui-layers`, `components-cannot-import-app` | `pnpm run check:deps` | `.dependency-cruiser.cjs` |
| Knip | Unused files, exports, and dependencies | `pnpm run check:unused` | `knip.json` |
| jscpd | Code duplication (threshold 2) | `pnpm run check:duplication` | `.jscpd.json` |
| Fallow | Code health and complexity audit | `pnpm run check:health` | `.fallowrc.json` |
| Size Limit | Budgets: JS 600 kB, CSS 100 kB under `.next/static` | `pnpm run check:size` | `.size-limit.json` |
| CSpell | Spell check for `.ts`, `.tsx`, `.md` | `pnpm run lint:spelling` | `cspell.json` |
| markdownlint-cli2 | Markdown lint | `pnpm run lint:md` | `.markdownlint-cli2.jsonc` |
| `pnpm audit` | Dependency vulnerabilities, high and above | `pnpm run check:security` | `package.json`, `pnpm-workspace.yaml` |

Exclusions: Biome skips `src/components/ui` and `src/components/firebase`
(`files.includes` in `biome.json`). Vitest, Stryker, jscpd, Fallow, and
coverage skip `src/components/ui/**`. Knip ignores both reserved layers. See
[SHADCN-GUARD-COVERAGE](./docs/guards/SHADCN-GUARD-COVERAGE.md) and
[NEXTJS-GUARD-COVERAGE](./docs/guards/NEXTJS-GUARD-COVERAGE.md) for guard
ownership.

## 4. Verification scripts

| Script | Runs | Intended use |
| --- | --- | --- |
| `verify:changed` | `lint:changed`, `check:types`, `test:changed` | Fast iteration and the `pre-push` hook |
| `verify:fast` | `lint`, `check:types`, `test`, `check:deps`, `lint:spelling` | Delivery gate; run manually |
| `verify:agents` | `agents sync --check` | Confirms agent config is in sync; not part of the other gates |
| `ci:wait` | `scripts/wait-for-ci.mjs` | After `git push`: waits for the `CI` run of `HEAD`, prints failed steps and the last log lines, exits `0` green, `1` failed, `2` setup, `3` human needed |
| `ci:check-paths` | `scripts/wait-for-ci.mjs --check-paths` | Before committing a CI fix: fails (`4`) on protected paths, deleted tests or added suppressions |

## 5. Git hooks

Hooks are managed by Husky (`.husky/`, installed by the `prepare` script).
They stay light on purpose; CI is the authoritative gate.

| Hook | Runs |
| --- | --- |
| `pre-commit` | `lint-staged` (`biome check --write` on staged files) and `pre-commit run` (gitleaks) |
| `commit-msg` | commitlint with `@commitlint/config-conventional` |
| `pre-push` | `pnpm run verify:changed` |

`.pre-commit-config.yaml` pins gitleaks v8.24.0. The `pre-commit` hook requires
the `pre-commit` tool on the machine.

If `pre-push` or `check:types` fails with `ERR_SWC_NATIVE_CACHE` (bad ACL on
the default SWC cache directory on Windows), set `SWC_NATIVE_BINDING_CACHE` to
a directory you own and rerun. Never bypass the hook with `--no-verify`.

## 6. CI

Workflow: `.github/workflows/ci.yml`, on push and pull request to `dev` and
`main`.

| Job | Steps |
| --- | --- |
| `fast-gate` | Biome, type check, Vitest, Dependency Cruiser, CSpell, Knip, jscpd, Fallow, `pnpm audit` |
| `extended-verification` (after `fast-gate`) | Playwright browser install, Next.js production build, Size Limit, Firestore rules tests, Playwright E2E |
| `secret-scan` | gitleaks (`gitleaks-action@v3`) over the full history |

Not run in CI: `lint:md`, `verify:agents`, `test:coverage`, `test:mutation`.

### 6.1 Watching CI after a push

`pnpm run ci:wait` needs the GitHub CLI (`gh auth status`) and a classic or
OAuth login (fine-grained tokens lack `checks:read`). It finds `CI` runs by
commit SHA, discovers them by polling, then blocks on `gh run watch --compact --exit-status` until they finish (default timeout 30 minutes), and counts automatic
fix attempts through the `CI-Fix-Attempt: <n>` commit trailer (default limit
2; the counter resets on any commit without the trailer, so it is a guard
rail for agents, not a security boundary). `ci:check-paths` guards CI-fix
commits made by agents only: the commit that adds or changes the guard, its
tests (which contain suppression patterns on purpose), `package.json` or
these docs is a human-reviewed commit and is expected to trip it. Rules for
agents are in
`AGENTS.md` ("CI after push"). No remote self-healing workflow exists; any
future one must open a pull request instead of pushing, and `workflow_run`
only fires from a workflow file on the default branch.

## 7. Firebase

| Item | Detail |
| --- | --- |
| CLI | `firebase-tools` 15.0.0, pinned as a dev dependency |
| Emulators | Auth `127.0.0.1:9099`, Firestore `127.0.0.1:8080`, UI `127.0.0.1:4000`, single-project mode (`firebase.json`) |
| Project alias | `.firebaserc` |
| Local state | `.firebase/` (logs, seeds) |
| Java | Installed on the machine (OpenJDK) for the Firestore emulator |

`package.json` provides `emulator`, `emulators:seed`, and `test:e2e`.
All three now start **Auth and Firestore** emulators. The committed
`.firebase/seeds/` fixture provides Auth accounts; Firestore documents are
created by verified Server Actions for locale preferences. Local Next.js
development must set both `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
and `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`; the E2E runner sets
them through the emulator launcher. See [ADR 0005](./docs/adr/0005-adopt-firebase-auth-with-local-emulator.md)
and [ADR 0007](./docs/adr/0007-adopt-cookie-based-next-intl-with-firebase-sync.md).
ADR 0008's browser persistent cache remains unimplemented.

## 8. Agent tooling

### 8.1 Source of truth and sync

| Item | Location |
| --- | --- |
| Shared instructions | `AGENTS.md` (`CLAUDE.md` imports it) |
| Sync config | `.agents/agents.json` (`syncMode: source-only`) |
| Local/private overrides | `.agents/local.json` |
| Generated client configs | `.agents/generated/` |
| Rules | `.agents/rules/` (`context7`, `language`, `naming`, `nextjs`, `path-portability`, `shadcn`, `test`, `token-economy`, `worktrees-reference-only`) |
| Sync CLI | `agents` (`agents sync --check` via `verify:agents`) |

`.agents/agents.json` enables sync for Codex, Claude, Claude Desktop, Gemini,
Antigravity, Cursor, and Grok. It does not support hooks.

Per-client generated or managed files: `.mcp.json` (Claude), `.codex/config.toml`,
`.cursor/mcp.json` and `.cursor/rules/`, `.gemini/settings.json`,
`.grok/config.toml`, `.agents/mcp_config.json` (Antigravity). `.vscode/settings.json`
hides these files from the explorer and search.

### 8.2 MCP servers

`.agents/agents.json` defines 10 servers, all enabled, all `stdio`. `agents sync`
writes each one only to its listed targets, so the per-client files differ.
`.mcp.json` (Claude) carries the 7 servers that target `claude`.

| Server | Launch | Sync targets |
| --- | --- | --- |
| `filesystem` | `npx -y @modelcontextprotocol/server-filesystem <repo>` | 18 clients |
| `fetch` | `uvx mcp-server-fetch` | 18 clients |
| `git` | `uvx mcp-server-git --repository <repo>` | 18 clients |
| `context7` | `npx -y @upstash/context7-mcp` | Codex, Claude, Claude Desktop, Gemini, Copilot (VS Code and CLI), Cursor, Antigravity |
| `github` | `npx -y @modelcontextprotocol/server-github` | Codex, Claude, Antigravity, Cursor |
| `serena` | `serena start-mcp-server` | Claude, Antigravity, Cursor |
| `graphify` | `graphify-mcp` | Claude, Antigravity, Cursor |
| `playwright` | `npx -y @playwright/mcp` | Antigravity, Cursor |
| `firebase` | `pnpm dlx firebase-tools mcp` | Antigravity, Cursor |
| `nextjs` | `pnpm exec next experimental-mcp` | Antigravity, Cursor |

`playwright`, `firebase`, and `nextjs` are not in `.mcp.json`, so Claude Code
does not load them from this repository.

Claude Code's `.claude/settings.local.json` (git-ignored, machine-specific)
enables `context7` and disables `fetch`, `filesystem`, `git`, `github`,
`graphify`, and `serena`. It contains no hooks. There is no committed
`.claude/settings.json`.

### 8.3 Code intelligence and local state

| Tool | Location | Purpose |
| --- | --- | --- |
| Serena | `.serena/` (`project.yml`, memories, cache) | Symbol-aware code navigation |
| graphify | `graphify-out/` | Knowledge graph of the codebase |
| Fallow cache | `.fallow/` | Cache for the Fallow audit |
| Issue tracker | `.scratch/` | Local markdown issues (see `docs/agents/issue-tracker.md`) |

When to use each code-intelligence tool (rule:
[`token-economy.md`](./.agents/rules/token-economy.md)):

| Question | Use | Do not use for |
| --- | --- | --- |
| Where is symbol X defined, what does it contain, who references it? | Serena (`find_symbol`, `get_symbols_overview`, `find_referencing_symbols`) | Reading a whole file to find one function; storing project facts |
| How do modules relate, what depends on what, what is the path between A and B? | graphify (`query_graph`, `get_neighbors`, `shortest_path`, or the CLI `graphify explain\|path\|query`) | Exact symbol bodies (use Serena); anything that must be current to the minute |
| Is a library or SDK API what I remember? | Context7 | Project-specific facts |
| The answer needs many files or an unknown location | A `research` subagent | Single-symbol lookups |

Both are read tools backed by git-ignored, machine-local state. `graphify-out/`
is generated and is rebuilt with `/graphify`; never edit it by hand. `.serena/`
holds a cache and optional scratch memories; a fact other agents or machines
need must live in a committed file or a skill (see the `save` skill). If either
MCP server fails to connect, fall back to `rg` and targeted reads and say so.

## 9. Machine-level CLIs

Verified on 2026-10-07:

| CLI | Version | Used for |
| --- | --- | --- |
| `node` / `npm` / `npx` | 22.19.0 / 10.9.3 | Runtime and `npx` launchers |
| `pnpm` | 12.8.1 | Package manager |
| `git` | 2.50.1 | Version control |
| `gh` | 2.97.0 | GitHub CLI |
| `uv` / `uvx` | 0.11.26 | Python tool runner (MCP `fetch` and `git` servers) |
| `python` | 3.12.10 | Python runtime |
| `pre-commit` | 4.6.2 | Runs gitleaks in the pre-commit hook |
| `gitleaks` | 8.30.1 | Secret scanning |
| `firebase` | 15.31.0 | Firebase CLI and emulators |
| `java` | OpenJDK 21.0.12 | Firestore emulator |
| `agents` | 0.9.1 | Agent config sync |
| `ctx7` | 0.5.12 | Context7 documentation lookups |
| `graphify` | 0.9.67 | Knowledge graph builder |
| `codex` | 0.160.0 | OpenAI Codex CLI |
| `claude` | 2.1.292 | Claude Code |

`playwright-cli` was not found on the machine at this snapshot.

## 10. Maintenance

Update this file when a tool is added or removed, a script changes, a hook
changes, an MCP server or skill is added, or the CI workflow changes. Keep
[TESTING.md](./TESTING.md) in sync for the hook and CI split.
