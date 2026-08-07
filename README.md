# Notes App

A Next.js notes application using the App Router, React Compiler, Tailwind CSS v4, pnpm, and Biome.

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

App Router source lives in `src/app`. Start with `src/app/page.tsx` and `src/app/layout.tsx`.

## Commands

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production server | `pnpm start` |
| Check repo | `pnpm lint` |
| Format repo | `pnpm format` |
| Typecheck | `pnpm exec tsc --noEmit` |

There is no test script configured yet.

## Accessibility

Frontend work must follow the [A11Y.md Standard](https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md) profile for WCAG 2.2 AA unless a task explicitly sets a different compliance profile.

## Local Agents

Specialized agent definitions live under `.agents/agents/`:

| Agent | Purpose |
|-------|---------|
| `architect` | System design, architecture tradeoffs, and implementation planning |
| `code-reviewer` | Code review for defects, regressions, accessibility, and missing verification |
| `test-engineer` | Test strategy, regression coverage, and verification commands |
| `security-reviewer` | Security, privacy, secrets, dependencies, and deployment exposure |

## Hosting

Firebase App Hosting configuration is in `apphosting.yaml` and `apphosting.staging.yaml`.
