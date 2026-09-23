# Security Policy & Guidelines

## 1. Reporting a Vulnerability
No formal disclosure process is defined yet (no `.github/` directory, no security contact published). Until one is set up, report suspected issues privately to the repository owner rather than opening a public issue.

## 2. Supported Versions
This is a pre-release, single-branch project (`main`, actively developed on `context-engineering`) with no versioned releases yet — there is no supported-version matrix to publish.

## 3. Secrets & Environment Configuration
- No `.env` files exist in the repo today, and `.gitignore` already excludes `.env*` from version tracking.
- No secrets, API keys, or credentials are referenced anywhere in the current codebase — there is no backend or third-party API integration yet (see `ARCHITECTURE.md`).
- When a backend/auth layer is introduced, secrets must go through environment variables (never committed) and log output must never include tokens, passwords, or personal data.

## 4. Input Validation & Data Sanitization
Not yet applicable — the app has no forms that submit to a server, no API routes, and no database (`src/app/page.tsx` is still the unedited Next.js starter page). No validation library (e.g. Zod) is installed. Add this section for real once user input starts flowing to a backend.

## 5. Authentication & Authorization Policies
There is no authentication or authorization in the codebase — no session/cookie handling, no auth provider dependency in `package.json`. Any note data introduced before an auth model exists should be treated as unauthenticated/local-only.

## 6. Dependency Management & Auditing
- No automated dependency scanning (Dependabot/Renovate) is configured yet.
- Run `rtk pnpm audit` manually before merging dependency changes until automated scanning is added.
- The one non-standard dependency worth tracking is `@shadcn/react` (used by `questionnaire.tsx` and the other conversational UI primitives, per `DESIGN.md` §5) — verify its advisories same as any other third-party package.
