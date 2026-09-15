# Notes App agent map

This is a Next.js 16 App Router application managed with pnpm. The active
branch is `dev`; `.worktrees/old*` are read-only historical references.

## Start here

1. Read this file and `ARCHITECTURE.md`.
2. For codebase questions, query the local Graphify graph before searching:
   `graphify query "<question>"`.
3. Use `graphify path "<A>" "<B>"` for impact and `graphify explain "<symbol>"`
   for focused context.
4. If Graphify is insufficient, use a targeted `rg` search and open only the
   needed symbol or line range. Read whole files or scan directories only as
   a last resort.
5. After code changes, run `graphify update .`.

## Project map

- `src/app/`: App Router routes, layouts, loading/error boundaries, APIs.
- `src/components/`: feature compositions; `src/components/ui/` contains
  shadcn source primitives.
- `src/lib/`: server-safe domain, data, auth, and shared utilities.
- `src/messages/`: all user-facing copy, consumed through `next-intl`.
- `ARCHITECTURE.md`: runtime boundaries and data flow.
- `SPEC.md`: product behavior.
- `DESIGN.md`: visual and interaction direction.
- `DECISIONS.md`: durable decisions and rationale.
- `.agents/rules/`: detailed rules loaded only when relevant.
- `.agents/skills/`: reusable skills loaded only when relevant.
- `.agents/skills/graphify/`: Graphify workflow and query guidance.
- `docs/agent-context.md`: context-engineering policy and measurement.

## Essential commands

```text
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

Use `pnpm` only. Run the narrowest relevant check first. Do not claim a check
passed unless it ran in this checkout.

## Critical conventions

- TypeScript strict mode; single quotes; no semicolons; two-space indentation.
- React Server Components by default; use `'use client'` only for client needs.
- Next.js 16 uses `proxy.ts`, not `middleware.ts`.
- Tailwind v4 and semantic tokens; do not add raw palette colors or CSS
  modules. Use configured shadcn components and Base UI `render` composition.
- Keep secrets server-only. Validate authorization at server boundaries.
- Preserve unrelated changes and never modify `.worktrees/old*`.

## Progressive disclosure

Load detailed guidance only when the task requires it:

- Next.js/App Router: `ARCHITECTURE.md` and the relevant Next skill.
- UI/shadcn: `.agents/skills/ui-styling/`, `.agents/skills/shadcn/` or the
  installed plugin guidance.
- Firebase/auth/security: the Firebase plugin and security rules skills.
- Tests/debugging: the testing or systematic-debugging skill.
- Design/motion: the matching design skill and `DESIGN.md`.

Do not load every rule, skill, report, or historical worktree by default.

## Graphify

Graphify is the repository's structural knowledge layer. Its local outputs in
`graphify-out/` are ignored, rebuildable artifacts. Prefer scoped graph queries
over raw grep or full-file reads. Build once when the graph is absent, then use
`graphify update .` for incremental code updates. See
`.agents/skills/graphify/SKILL.md` for the full procedure.

Platform adapters should point to this file rather than duplicate it:

- Codex: reads root `AGENTS.md`.
- Gemini CLI: root `GEMINI.md` imports `AGENTS.md`.
- Antigravity: discovers `.agents/skills/` and this root map.

Do not add Serena, codebase-memory-mcp, Graft, or another code graph unless a
measured gap remains after using Graphify and targeted symbol search.
