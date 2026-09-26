# Security Policy & Guidelines

This file owns the repository's **security posture and security tooling**. Numeric
quality-floor enforcement is recorded in `CONSTRAINTS.md`.

## 1. Reporting a Vulnerability

No public security contact or formal disclosure SLA is published. Report suspected
vulnerabilities privately to the repository owner rather than opening a public issue.

## 2. Supported Versions

The project is pre-release and has no versioned production releases, so there is no
supported-version matrix yet. Branch names are development workflow, not security
support guarantees.

## 3. Secrets & Environment Configuration

- No `.env*` files are currently tracked; `.gitignore` excludes them.
- Never commit API keys, tokens, credentials, private keys, or production secrets.
- Runtime secrets must enter through environment configuration rather than source.
- Logs, errors, fixtures, and screenshots must not expose credentials or sensitive
  user data.

## 4. Input & Data Boundaries

There is currently no product backend, persistence layer, or server-submitted product
form. When one is introduced:

- validate data at trust boundaries, not only in the UI;
- encode/render untrusted content safely;
- use parameterized/ORM-safe persistence APIs;
- update the threat model here in the same change.

## 5. Authentication & Authorization

No authentication/session/authorization model is currently implemented. Before
persistent user data or protected actions are introduced, define:

- identity/session ownership;
- authorization checks for reads and mutations;
- cookie/token storage and lifecycle;
- failure/revocation behavior.

Do not infer an auth model from framework defaults.

## 6. Security Tooling

- `rtk pnpm check:security` runs the package-manager audit and blocks high/critical
  advisories according to `CONSTRAINTS.md`.
- `rtk pnpm check:osv` scans manifests/lockfiles with OSV-Scanner using
  `osv-scanner.toml`.
- Gitleaks scans repository history using `gitleaks.toml` in `.github/workflows/security.yml` and as a pre-commit hook.
- Zizmor 1.30.1 audits GitHub Actions in `.github/workflows/security.yml`.
- OSV-Scanner 2.6.0 blocks newly introduced vulnerabilities on PRs and runs non-blocking scheduled/full scans to expose the existing baseline in `.github/workflows/osv-scanner.yml`.
- `.github/workflows/codeql.yml` runs CodeQL Action v4 static security analysis on the configured branch/PR targets and schedule.
- Third-party GitHub Actions are pinned to full commit SHAs; workflow permissions are least-privilege and jobs have bounded timeouts where locally controlled.

Do not document transient vulnerability findings here. Scanner output is the source
of truth for current findings. Exceptions/suppressions require an explicit rationale
and must follow the repository quality/security policy.
