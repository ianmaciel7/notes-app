# Security Policy

## 1. Supported Versions

Security updates are applied to the active branch and releases of the project.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

---

## 2. Reporting a Vulnerability

We take the security of this application seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not create a public GitHub Issue.**
2. Submit vulnerability details confidentially via GitHub Security Advisories or email the maintainers directly.
3. Include the following details to help us triage and verify the issue quickly:
   - Type of vulnerability (e.g., XSS, authentication bypass, prototype pollution).
   - Step-by-step reproduction instructions or proof-of-concept (PoC).
   - Impact assessment and affected components/routes.
   - Any suggested mitigations or patches.

### Response Timeline

- **Acknowledgment**: Within 48 hours of submission.
- **Initial Assessment**: Within 5 business days, confirming severity and reproduction.
- **Fix & Disclosure**: Coordinated patch delivery before public disclosure.

---

## 3. Core Security Invariants

All contributors and autonomous agents must uphold the following core security principles:

### Secrets & Credentials

- **Zero Committed Secrets**: Never commit API keys, service account credentials, private tokens, or secrets to Git.
- **Environment Separation**: Local secrets reside exclusively in `.env.local` (ignored by Git).
- **Automated Scanning**: Commits and pull requests are checked for exposed secrets before merging.

### Authentication & Authorization

- **Client vs Server Boundaries**: Secret keys (such as admin SDK tokens) must never be imported into Client Components (`'use client'`).
- **Input Validation**: Never trust external client input. All server actions and API route handlers must validate input structure and types before processing.

### Content Security & Safe Rendering

- **XSS Prevention**: Never inject untrusted user input into raw HTML (`dangerouslySetInnerHTML`) without cryptographic sanitization.
- **Markdown & Rich Content**: Markdown rendering must use AST-based safe parsing with HTML entity escaping.

### Dependency Governance

- **Regular Audits**: Run `pnpm run check:security` (`pnpm audit --audit-level high`) to detect known vulnerabilities in the dependency tree.
- **Automated Checks**: Dependency additions and updates are tracked in `pnpm-lock.yaml` to ensure deterministic supply chain integrity.
- **Targeted Audit Exceptions**: `pnpm-workspace.yaml` may ignore a specific GHSA only when no patched dependency exists, the exposure is demonstrably not reachable in this project, and the exception includes a rationale.
- **Current Exception**: `GHSA-vfj7-8cjw-p6xm` affects `braces` through `markdownlint-cli2`. No patched `braces` release exists as of October 6, 2026. In this repository, `markdownlint-cli2` receives repository-controlled glob patterns rather than untrusted runtime input. Remove the exception as soon as the dependency chain provides a patched release.
