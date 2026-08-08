<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent Instructions

### Environment

- Work from WSL2; prefer Linux paths, shell commands, and assumptions.
- Convert Windows paths from prompts to WSL paths before running commands when needed.

### Package Manager

- Use **pnpm 11.20.0**: `pnpm install`

### Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Generate Next types | `pnpm exec next typegen` |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Format | `pnpm format` |
| Format file | `pnpm exec biome format --write path/to/file` |
| Typecheck | `pnpm exec tsc --noEmit` |

### External References

| Need | File |
| --- | --- |
| Setup | `README.md` |
| CI | `.github/workflows/ci.yml` |
| Local agents | `.agents/agents/` |
| Local workflows | `.agents/workflows/` |
| Project MCP manifest | `.agents/mcp-servers.json` |
| Agent context efficiency audit | `docs/agent-context-efficiency-audit.md` |
| Frontend accessibility | `https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md` |
| Production hosting | `apphosting.yaml` |
| Staging hosting | `apphosting.staging.yaml` |

### Key Conventions

- App Router source lives under `src/app`; there is no top-level `app/` directory.
- For Next.js API, routing, caching, or file-convention work, read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed.
- Use Tailwind CSS v4 from `src/app/globals.css`.
- Keep `CLAUDE.md` as a pointer to `AGENTS.md`; do not duplicate instructions there.
- Keep `GEMINI.md` as a pointer to `AGENTS.md`; do not duplicate instructions there.
- React Compiler is enabled in `next.config.ts`; preserve that setting unless intentionally changing React compilation behavior.
- There is no test script configured; add one before documenting or relying on `pnpm test`.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Keep CLI context, cache, session, memory, and repository-intelligence audit details in `docs/agent-context-efficiency-audit.md`; reference it instead of duplicating tool-specific measurements here.
- Use `.agents/agents/architect/agent.md`, `code-reviewer/agent.md`, `test-engineer/agent.md`, and `security-reviewer/agent.md` for specialized review or planning work.
- Use `.agents/workflows/` for OpenSpec change workflows when a task involves specs, proposals, or change verification.
- Keep generic MCP server recommendations in `.agents/mcp-servers.json`; do not store secrets there.

### Context and Simplicity

- Prefer native CLI context controls, deterministic shell filtering, and existing project Skills before adding MCP servers or middleware.
- Use `rg`, targeted `git diff`, `git diff --stat`, `git log --oneline`, `jq`, and command-specific `--tail` or filter flags instead of dumping large outputs into agent context.
- Do not create unnecessary abstractions. Prefer existing code, platform-native capabilities, standard library features, and existing dependencies. Implement the simplest correct solution.
- Before adding semantic indexes, memory systems, or context middleware, record the security review and benchmark evidence in `docs/agent-context-efficiency-audit.md`.

### Frontend Accessibility

- Follow `A11Y.md` Standard profile (WCAG 2.2 AA) unless the task explicitly sets another profile.
- Prefer native semantic HTML; do not use clickable `div` or `span` elements.
- Keep every interaction keyboard-operable with visible focus and correct focus management.
- Provide connected labels for form controls and meaningful `alt` text for informative images.
- Meet contrast requirements: 4.5:1 for text and 3:1 for UI components or meaningful graphics.
- Do not convey state by color alone; pair color with text, iconography, or another cue.
- Respect `prefers-reduced-motion` for animations and transitions.
- Record accepted accessibility violations in `EXCEPTIONS.md`; record conformant pattern decisions in `A11Y-DECISIONS.md`.
