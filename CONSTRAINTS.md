# Constraints

Hard constraints for working in this repository, consolidated in one place.
Each item links to the document that owns it. This file is an index, not a
source of truth: when a rule changes, change the owning document first, then
update this file.

Constraints describe what is enforced or required on the current `dev` branch.
Planned behavior belongs in ADRs and product specs.

## 1. Protected paths

| Path | Constraint | Source |
| --- | --- | --- |
| `src/components/firebase/**` | Immutable upstream Firebase UI reference. Never edit; `tests/unit/firebase-reference.test.ts` fails on any change. | [ADR 0004](./docs/adr/0004-adopt-firebase-ui-components.md) |
| `src/components/ui/**` | Owned shadcn implementation layer. Excluded from application guards, unit tests, Knip, jscpd, Fallow, and Biome. Do not write unit tests for it. | [AGENTS.md](./AGENTS.md), [TESTING.md](./TESTING.md) |
| `.worktrees/` | Reference only. Never edit, delete, create files in, or run build/test/install commands inside it. | [worktrees-reference-only](./.agents/rules/worktrees-reference-only.md) |
| `.github/workflows/**`, gate configs, `package.json`, `pnpm-lock.yaml` | Agents need human approval to change these, especially to make CI green. | [AGENTS.md](./AGENTS.md) |

## 2. Stack

- Next.js 16.3.8 App Router only. Pages Router APIs are forbidden
  (`next/router`, `next/head`, `next/document`, `next/legacy/image`,
  `getServerSideProps`, `getStaticProps`, `getStaticPaths`, `getInitialProps`).
- React 19.2.8 with React Compiler. Manual `useMemo`/`useCallback` only for
  measured or semantically necessary cases.
- TypeScript 5.9, strict. Never use `ignoreBuildErrors`.
- Tailwind CSS v4 (CSS-first), shadcn Base Nova on Base UI.
- Biome 2.4.2 owns formatting: spaces, 2-space indent, LF, 80 columns.
- pnpm 12.8.1 is the only package manager. Node 22.19.0 (`.node-version`).
- Use Base UI `render`, not Radix-only `asChild`. Use the Base UI toast
  primitive (`@/components/ui/toast`), not `sonner`.

Sources: [AGENTS.md](./AGENTS.md), [CODING_STANDARDS.md](./CODING_STANDARDS.md),
[TOOLING.md](./TOOLING.md).

## 3. Next.js

- Server Components by default. Keep `"use client"` boundaries small and deep.
- Await request APIs: `cookies()`, `headers()`, `draftMode()`, `params`,
  `searchParams`.
- Never call the application's own Route Handler from a Server Component for
  ordinary data access.
- Never wrap `redirect()` or `notFound()` in a generic `try/catch`.
- Do not use `unstable_cacheLife`, `unstable_cacheTag`, `unstable_noStore`, or
  `unstable_after`.
- Do not use `images.domains`; use `images.remotePatterns`.
- The root layout must not read cookies (Cache Components). The locale for
  `<html lang>` is set by a `beforeInteractive` script.
- Only `proxy.ts`, `middleware.ts`, and `instrumentation.ts` may sit directly
  under `src/` (Dependency Cruiser `src-root-allowed-files-only`).
- Do not import server-only modules into the client graph or expose private
  environment variables to Client Components.

Sources: [nextjs rules](./.agents/rules/nextjs.md),
[ARCHITECTURE.md](./ARCHITECTURE.md),
[Next.js guard coverage](./docs/guards/NEXTJS-GUARD-COVERAGE.md).

## 4. Components and hooks

- Application components must not call stateful hooks (`useState`,
  `useReducer`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useForm`)
  directly. These live in `src/hooks/use-*.ts(x)`.
- Exceptions: context accessors stay in the component file that owns the
  context, and files that call `createContext` are exempt.
- Reuse owned shadcn primitives before creating equivalents.
- Use semantic color tokens, `gap-*` instead of `space-*`, `size-*` when width
  and height match, and logical direction utilities (`start/end`, `ms/me`).
- Icon-only controls need an accessible name. Do not size icons that the parent
  component sizes.
- No manual z-index on shadcn overlay content.
- No speculative wrappers, service layers, or repository layers before a real
  domain seam exists.
- No circular dependencies. UI primitives must not depend on routing or
  application components. `src/lib` and `src/hooks` must not depend at runtime
  on `src/components` or `src/app`; components must not depend on `src/app`
  (Dependency Cruiser; see [ARCHITECTURE.md](./ARCHITECTURE.md) section 7).

Sources: [CODING_STANDARDS.md](./CODING_STANDARDS.md),
[shadcn rules](./.agents/rules/shadcn.md),
[SHADCN-GUARD-COVERAGE](./docs/guards/SHADCN-GUARD-COVERAGE.md).

## 5. Security

- Never commit secrets, credentials, tokens, or service-account files. Local
  secrets belong in ignored files such as `.env.local`.
- Only intentionally public values may use `NEXT_PUBLIC_*`.
- Treat every Server Action and Route Handler as a public HTTP endpoint:
  validate input at runtime, authenticate at the operation boundary, and
  authorize the concrete resource.
- Never trust client-provided roles, ownership IDs, or authorization claims.
  Proxy, layouts, and client route guards do not replace authorization.
- Treat `params`, `searchParams`, form data, headers, cookies, and request
  bodies as untrusted.
- Return minimum safe DTOs to Client Components.
- No `dangerouslySetInnerHTML` with untrusted HTML without a proven
  sanitization strategy.
- Do not treat accepted-but-unimplemented ADR behavior as an existing control.
- `pnpm audit --audit-level high` must pass. The only documented exception is
  `GHSA-vfj7-8cjw-p6xm`.

Source: [SECURITY.md](./SECURITY.md).

## 6. Verification and CI

- During iteration run `pnpm run verify:changed`. Before delivery run
  `pnpm run verify:fast`.
- CI additionally runs Knip, jscpd, Fallow, `pnpm audit`, the production build,
  Size Limit (JS 470 kB, CSS 100 kB), and Playwright E2E.
- A `git push` is not completion. After pushing to `dev` or `main`, run
  `pnpm run ci:wait`; the task is done only when it exits `0`.
- Add a failing regression test before fixing a bug.
- Never describe planned tests, coverage, or architecture as implemented.

Never, to make CI green:

- force push, or edit secrets;
- delete, skip, or weaken tests, or add lint, type, or spell suppressions;
- raise thresholds or disable checks (Biome, Knip, jscpd, Fallow, Size Limit,
  `pnpm audit`, gitleaks, dependency-cruiser);
- edit `.github/workflows/**`, gate configs, `package.json`,
  `pnpm-lock.yaml`, or `src/components/firebase/**` without human approval.

Do not auto-fix flaky tests, infrastructure or registry failures, gitleaks
findings (rotate the secret instead), new `pnpm audit` advisories, or
architecture violations. Report them. CI-fix attempts are limited (default 2);
at the limit, stop and report to the human.

Sources: [AGENTS.md](./AGENTS.md), [TESTING.md](./TESTING.md),
[TOOLING.md](./TOOLING.md) sections 4 to 6.

## 7. Internationalization

- No locale URL prefixes. The locale resolves from the `NEXT_LOCALE` cookie,
  then `Accept-Language`, then `en`.
- Only the `setLocalePreference` Server Action writes the cookie. Auto-detected
  locales are never persisted.
- Firebase Auth mirrors the resolved locale in `auth.languageCode`.

Source: [ADR 0007](./docs/adr/0007-adopt-cookie-based-next-intl-with-firebase-sync.md).

## 8. Repository hygiene

- English only for code, comments, docs, rules, skills, and commit messages,
  regardless of the conversation language.
- Never persist machine-specific absolute paths (`C:\Users\...`, `/home/...`,
  `file:///...`). Use repository-relative paths with forward slashes.
- Commit messages follow Conventional Commits (commitlint).
- After changing skills or MCP configuration, run `npx agents sync`.
- Automation changes must stay consistent across Claude, Codex, Gemini, and
  Antigravity. Only `.claude/settings.json` supports hooks;
  `.agents/agents.json` does not.

Sources: [language](./.agents/rules/language.md),
[path-portability](./.agents/rules/path-portability.md),
[TOOLING.md](./TOOLING.md).

## 9. Documentation ownership

| Concern | Owner |
| --- | --- |
| Current architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Coding policy | [CODING_STANDARDS.md](./CODING_STANDARDS.md) |
| Tests | [TESTING.md](./TESTING.md) |
| Security | [SECURITY.md](./SECURITY.md) |
| Tooling inventory | [TOOLING.md](./TOOLING.md) |
| Domain vocabulary | [GLOSSARY.md](./GLOSSARY.md) |
| Planned data model | [DER.md](./DER.md) |
| Historical decisions | [docs/adr/](./docs/adr/README.md) |

Update the owning document when behavior, architecture, tooling, or policy
changes.
