# Security Policy & Guidelines

## 1. Reporting a Vulnerability
No formal disclosure process or security contact is published yet. The repository has a `.github/` directory for tooling configuration, but no security-advisory workflow. Until a disclosure process is set up, report suspected issues privately to the repository owner rather than opening a public issue.

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
- Run `rtk pnpm check:security` before merging dependency changes; it runs `pnpm audit --audit-level high` and fails on high or critical advisories.
- Lighthouse CI is a development-only dependency. Its reports use the filesystem upload target in `lighthouserc.cjs`; audit data is not sent to an external service.
- The current package audit reports unresolved high-severity transitive `extract-zip` advisories through Lighthouse CI. Do not suppress them; upgrade the upstream dependency when a patched npm release is available.
- OSV-Scanner v2 is configured in [`osv-scanner.toml`](./osv-scanner.toml). Install the official Windows package with `winget install --id Google.OSVScanner --exact`, then run `rtk pnpm check:osv` to scan repository lockfiles and manifests against the OSV database.
- Keep any OSV-Scanner exception in `osv-scanner.toml` with a specific reason and an expiry date where possible; do not suppress findings without an owner-approved remediation decision.
- Gitleaks is configured in `gitleaks.toml` with the built-in default rules. Run `gitleaks git --config gitleaks.toml .` to scan repository history; the optional `.pre-commit-config.yaml` adds a local pre-commit scan.
- Zizmor is installed as an isolated local CLI with `uv tool install zizmor`. Run `zizmor --offline .` to audit collected GitHub Actions and repository security inputs without network access; use `zizmor --collect=workflows --offline .` when workflows are present and only workflow files should be scanned.
- The one non-standard dependency worth tracking is `@shadcn/react` (used by `questionnaire.tsx` and the other conversational UI primitives, per `DESIGN.md` §5) — verify its advisories same as any other third-party package.
