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

## 3. Secrets, Logs, and Environment Configuration

- No `.env*` files are tracked; `.gitignore` excludes them.
- Never commit API keys, tokens, credentials, private keys, or production secrets.
- Runtime secrets must enter through environment configuration rather than source.
- Logs, errors, fixtures, screenshots, and emulator diagnostics must not expose credentials or sensitive user data.
- Firebase emulator and editor-plugin diagnostic logs are machine-local output and must remain untracked.
- Generated tool configuration that can contain machine-specific paths or credentials is local output, not canonical repository source.

## 4. Input & Data Boundaries

The application currently has client-side Firebase Authentication but no canonical
product persistence backend or server-side authorization layer.

Before persistent user data or server-submitted product mutations are introduced:

- validate data at trust boundaries, not only in the UI;
- encode/render untrusted content safely;
- use parameterized/ORM-safe persistence APIs;
- enforce Account and Space ownership on every server-side read and mutation;
- update the threat model here in the same change.

## 5. Authentication & Authorization

Firebase Authentication is implemented through the Web SDK, `AuthProvider`, and the
local Auth Emulator for development/testing. Client authentication state identifies a
Firebase `User`; it is **not** sufficient authorization for future server-side data.

Before protected persistent data is introduced, define and test:

- server-side identity/session verification;
- Account and Space ownership checks for reads and mutations;
- cookie/token storage, expiry, refresh, and revocation behavior;
- authorization failure behavior;
- production provider configuration and emulator/production separation.

Do not infer authorization from client UI state or framework defaults.

## 6. Security Tooling

- `rtk pnpm check:security` runs the package-manager audit and blocks high/critical advisories according to `CONSTRAINTS.md`.
- `rtk pnpm check:osv` scans manifests/lockfiles with OSV-Scanner using `osv-scanner.toml`.
- Gitleaks scans repository history using `gitleaks.toml` in `.github/workflows/security.yml` and as a pre-commit hook.
- Zizmor audits GitHub Actions in `.github/workflows/security.yml`.
- OSV-Scanner blocks newly introduced vulnerabilities on PRs and runs scheduled/full scans to expose the existing baseline.
- `.github/workflows/codeql.yml` runs CodeQL static analysis for `main`, `dev`, and `stag` PR/push targets plus its schedule.
- Third-party GitHub Actions are pinned to full commit SHAs; workflow permissions are least-privilege and locally controlled jobs have bounded timeouts.

Do not document transient vulnerability findings here. Scanner output is the source
of truth for current findings. Exceptions/suppressions require an explicit rationale
and must follow the repository quality/security policy.
