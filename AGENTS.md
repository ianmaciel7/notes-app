<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mission

Deliver correct, maintainable changes with minimal risk.

## Current stack

- Next.js 16.3.8 App Router
- React 19.2.8 + React Compiler
- TypeScript 5.9
- Tailwind CSS v4
- shadcn Base Nova / Base UI
- Biome 2.4.2
- pnpm 12.8.1

## Repository rules

- Respect [ARCHITECTURE.md](./ARCHITECTURE.md).
- Follow [CODING_STANDARDS.md](./CODING_STANDARDS.md).
- Follow naming conventions in [.agents/rules/naming.md](./.agents/rules/naming.md).
- Do not describe planned architecture as implemented.
- Never commit secrets.
- Keep edits focused.
- `.worktrees/` is reference-only and must not be modified.
- `src/components/ui/**` is the owned shadcn implementation layer.

## Next.js rules

Follow [.agents/rules/nextjs.md](./.agents/rules/nextjs.md) and
[Next.js guard coverage](./docs/guards/NEXTJS-GUARD-COVERAGE.md).

- Server Components by default.
- Keep `"use client"` boundaries small.
- Do not reintroduce Pages Router APIs.
- Do not call an internal Route Handler from a Server Component for ordinary
  server-side data access.
- Treat Server Actions and Route Handlers as security-sensitive boundaries.
- Use current async request APIs and route-aware types.
- Prefer framework/native enforcement over duplicate GritQL heuristics.

## shadcn rules

Follow [.agents/rules/shadcn.md](./.agents/rules/shadcn.md) and
[shadcn guard coverage](./docs/guards/SHADCN-GUARD-COVERAGE.md).

## MCP

- MCP definitions: `.agents/agents.json`
- Local/private overrides: `.agents/local.json`
- Context7 documentation rules: [.agents/rules/context7.md](./.agents/rules/context7.md)

## Agent skills

### Issue tracker

Local markdown files in `.scratch/`. See [docs/agents/issue-tracker.md](./docs/agents/issue-tracker.md).

### Triage labels

Canonical five roles mapping (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See [docs/agents/triage-labels.md](./docs/agents/triage-labels.md).

### Domain docs

Single-context (`GLOSSARY.md` + `docs/adr/`). See [docs/agents/domain.md](./docs/agents/domain.md).

## Verification

Follow [.agents/rules/test.md](./.agents/rules/test.md) and [TESTING.md](./TESTING.md).

Fast iteration:

```bash
pnpm run verify:changed
```

Fast delivery gate:

```bash
pnpm run verify:fast
```

Additional CI checks:

- Knip
- jscpd
- Fallow
- pnpm audit
- Next.js production build
- Size Limit
- Playwright E2E

## CI after push

A `git push` is not completion. After pushing to `dev` or `main`, run
`pnpm run ci:wait` and treat the task as done only when it exits `0`.
Run it in the background (`run_in_background`, or Monitor) and read its output
when it finishes: it blocks for minutes and `gh run watch` redraws its status on
every refresh.

| Exit | Meaning | Action |
| --- | --- | --- |
| `0` | CI green | Task may be reported as complete |
| `1` | CI failed; logs printed | Diagnose the root cause, fix, run `pnpm run verify:fast` and `pnpm run ci:check-paths`, commit with the trailer `CI-Fix-Attempt: <n>` printed by the script, push, run `pnpm run ci:wait` again |
| `2` | Commit not pushed or no run found | Fix the setup (push, `gh auth status`) and retry |
| `3` | Attempt limit reached, run cancelled or timed out | Stop and report to the human; do not retry |
| `4` | `ci:check-paths` found protected changes | Revert them or stop and ask |

`ci:check-paths` applies to CI-fix commits only. Changes to the guard itself
need human review, so ask instead of working around it.

Never, to make CI green:

- force push, or edit secrets;
- delete, skip or weaken tests, or add lint/type/spell suppressions;
- raise thresholds or disable checks (Biome, Knip, jscpd, Fallow, Size Limit,
  `pnpm audit`, gitleaks, dependency-cruiser);
- edit `.github/workflows/**`, gate configs, `package.json`,
  `pnpm-lock.yaml` or `src/components/firebase/**` without human approval.

Do not auto-fix flaky tests, infrastructure or registry failures, gitleaks
findings (rotate the secret instead), new `pnpm audit` advisories, or
architecture violations; report them. See [TOOLING.md](./TOOLING.md) section 6.

## Workflow

1. Read relevant project docs and ADRs.
2. Plan briefly.
3. Implement the smallest coherent change.
4. Run the most relevant fast checks.
5. Run broader verification before delivery.
6. Update documentation when behavior, architecture, tooling, or policy
   changes.
7. Report residual risk explicitly.

### Delegating implementation

In Claude Code sessions, delegate implementation (code, tests, rules) to the
Codex CLI with `codex exec` by default. Check `command -v codex` before
treating it as unavailable. Claude keeps the design and interview, writes a
self-contained brief (ADR path, files, constraints, verification commands),
reviews the resulting diff, and runs the verification gates before reporting
completion. Codex sessions implement directly and do not delegate again.

## Documentation sources of truth

- Current architecture: `ARCHITECTURE.md`
- Current coding policy: `CODING_STANDARDS.md`
- Visual design tokens and UI rules: `DESIGN.md`
- Consolidated hard constraints (index): `CONSTRAINTS.md`
- Current tests: `TESTING.md`
- Security policy: `SECURITY.md`
- Domain vocabulary: `GLOSSARY.md`
- Planned data model: `DER.md`
- Historical decisions: `docs/adr/`
