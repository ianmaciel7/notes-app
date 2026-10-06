<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version may contain APIs and conventions newer than model training data.
Read the relevant installed Next.js documentation before framework-specific
changes and heed deprecation notices.

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

## MCP and skills

- MCP definitions: `.agents/agents.json`
- Local/private overrides: `.agents/local.json`
- Project skills: `.agents/skills/*/SKILL.md`
- Skill lockfile: `skills-lock.json`

Third-party skills are managed artifacts. Do not rewrite their documentation
merely to update project docs.

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

## Workflow

1. Read relevant project docs and ADRs.
2. Plan briefly.
3. Implement the smallest coherent change.
4. Run the most relevant fast checks.
5. Run broader verification before delivery.
6. Update documentation when behavior, architecture, tooling, or policy
   changes.
7. Report residual risk explicitly.

## Documentation sources of truth

- Current architecture: `ARCHITECTURE.md`
- Current coding policy: `CODING_STANDARDS.md`
- Current tests: `TESTING.md`
- Security policy: `SECURITY.md`
- Domain vocabulary: `GLOSSARY.md`
- Planned data model: `DER.md`
- Historical decisions: `docs/adr/`
