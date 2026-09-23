# SECURITY.md Template

## Document Purpose
`SECURITY.md` defines the security policies, vulnerability reporting procedures, authentication & authorization models, secrets management, and defensive engineering practices.

---

## Canonical Structure

```markdown
# Security Policy & Guidelines

## 1. Reporting a Vulnerability
- Instructions on how to report suspected security flaws (e.g., email address, private security advisory link).
- Expected response time and disclosure embargo process.
- What NOT to do (do not open public GitHub issues for active vulnerabilities).

## 2. Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 3. Secrets & Environment Configuration
- No secrets in version control (enforced via `.gitignore` and git pre-commit hooks).
- Production secrets injection (e.g., Vercel Environment Variables, Vault, Secret Manager).
- Sanitization of log outputs: Never log tokens, passwords, or PII.

## 4. Input Validation & Data Sanitization
- Form validation and payload boundaries (e.g., Zod schemas, strict type parsing).
- XSS prevention: Escaping user content, safe markdown rendering libraries, Content Security Policy (CSP).
- SQL / Query injection defenses (parameterized queries, ORM safety).

## 5. Authentication & Authorization Policies
- Session management, JWT / cookie flags (`HttpOnly`, `SameSite=Lax`, `Secure`).
- Role-Based Access Control (RBAC) or ownership verification on all data mutations.

## 6. Dependency Management & Auditing
- Automated scanning commands (`pnpm audit`, Dependabot / Renovate).
- Policy for resolving high and critical severity advisories.
```
