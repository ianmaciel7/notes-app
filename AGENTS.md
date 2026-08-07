<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent Instructions

### Package Manager

- Use **pnpm**: `pnpm install`

### Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Format | `pnpm format` |
| Format file | `pnpm exec biome format --write path/to/file` |
| Typecheck | `pnpm exec tsc --noEmit` |

### External References

| Need | File |
| --- | --- |
| Setup | `README.md` |
| Local agents | `.agents/agents/` |
| Local workflows | `.agents/workflows/` |
| Frontend accessibility | `https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md` |
| Production hosting | `apphosting.yaml` |
| Staging hosting | `apphosting.staging.yaml` |

### Key Conventions

- App Router source lives under `src/app`; there is no top-level `app/` directory.
- Use Tailwind CSS v4 from `src/app/globals.css`.
- Keep `CLAUDE.md` as a pointer to `AGENTS.md`; do not duplicate instructions there.
- React Compiler is enabled in `next.config.ts`; preserve that setting unless intentionally changing React compilation behavior.
- There is no test script configured; add one before documenting or relying on `pnpm test`.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Use `.agents/agents/architect/agent.md`, `code-reviewer/agent.md`, `test-engineer/agent.md`, and `security-reviewer/agent.md` for specialized review or planning work.
- Use `.agents/workflows/` for OpenSpec change workflows when a task involves specs, proposals, or change verification.

### Frontend Accessibility

- Follow `A11Y.md` Standard profile (WCAG 2.2 AA) unless the task explicitly sets another profile.
- Prefer native semantic HTML; do not use clickable `div` or `span` elements.
- Keep every interaction keyboard-operable with visible focus and correct focus management.
- Provide connected labels for form controls and meaningful `alt` text for informative images.
- Meet contrast requirements: 4.5:1 for text and 3:1 for UI components or meaningful graphics.
- Do not convey state by color alone; pair color with text, iconography, or another cue.
- Respect `prefers-reduced-motion` for animations and transitions.
- Record accepted accessibility violations in `EXCEPTIONS.md`; record conformant pattern decisions in `A11Y-DECISIONS.md`.
