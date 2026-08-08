# Notes App

A Next.js notes application using the App Router, React Compiler, Tailwind CSS v4, pnpm, and Biome.

## Environment

Develop from WSL2 and prefer Linux paths and shell commands. The project uses pnpm 11.20.0, as declared in `package.json`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

App Router source lives in `src/app`. Start with `src/app/page.tsx` and `src/app/layout.tsx`.

## Commands

| Task | Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production server | `pnpm start` |
| Generate Next types | `pnpm exec next typegen` |
| Check repo | `pnpm lint` |
| Check file | `pnpm exec biome check path/to/file` |
| Format repo | `pnpm format` |
| Format file | `pnpm exec biome format --write path/to/file` |
| Typecheck | `pnpm exec tsc --noEmit` |

There is no test script configured yet.

## Accessibility

Frontend work must follow the [A11Y.md Standard](https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md) profile for WCAG 2.2 AA unless a task explicitly sets a different compliance profile.

## Local Agents

Specialized agent definitions live under `.agents/agents/`.

| Agent | Purpose |
| --- | --- |
| `architect` | System design, architecture tradeoffs, and implementation planning |
| `code-reviewer` | Code review for defects, regressions, accessibility, and missing verification |
| `test-engineer` | Test strategy, regression coverage, and verification commands |
| `security-reviewer` | Security, privacy, secrets, dependencies, and deployment exposure |

OpenSpec workflows live under `.agents/workflows/` for spec proposals, applying changes, archiving changes, and verification.

Repository-wide agent instructions live in `AGENTS.md`. `CLAUDE.md` is only a pointer to `AGENTS.md`.

## Hosting

Firebase App Hosting configuration is in `apphosting.yaml` and `apphosting.staging.yaml`.
