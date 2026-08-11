# Security

## Reporting

Report security concerns privately to the repository owner. Do not publish secrets, exploit details, or sensitive configuration in public issues or pull requests.

## Secrets

- Keep credentials, API keys, tokens, private keys, and production secrets out of Git.
- Use `.env` for local secrets and `.env.example` for non-sensitive variable names and examples.
- Do not commit real Firebase, GitHub, OpenAI, or deployment credentials.
- Do not store secrets in `.agents/mcp-servers.json`, documentation, OpenSpec artifacts, or generated agent files.
- Enable GitHub Secret Scanning and Push Protection in repository settings when available.
- Never print secrets or derived credentials in CI logs.

## Dependencies

- Use `pnpm install` and keep `pnpm-lock.yaml` committed.
- Review dependency changes before merging.
- Prefer existing dependencies and platform APIs before adding new packages.
- Dependabot version updates are configured in `.github/dependabot.yml` for npm/pnpm dependencies and GitHub Actions.
- Enable GitHub Dependency Graph and Dependabot alerts in repository settings.
- After Dependency Graph is enabled, add GitHub Dependency Review as a pull request check that fails when dependency changes introduce high or critical vulnerable dependencies.

## Static Analysis

GitHub CodeQL is configured in `.github/workflows/security.yml` for JavaScript and TypeScript on pull requests, weekly scheduled runs, and manual runs. Treat CodeQL alerts as security findings, triage them before release, and use GitHub code scanning protection rules where available to block meaningful severity findings on protected branches.

The versioned branch rulesets do not require `Security` by default because code scanning availability can depend on repository plan and settings. After CodeQL uploads are confirmed stable for this repository, make the aggregate `Security` check required in GitHub branch rules or rulesets.

Do not add overlapping SAST scanners unless a concrete gap is identified.

## GitHub Actions Supply Chain

- Use official GitHub Actions where practical.
- Prefer trusted, actively maintained actions when an official action does not exist.
- Keep GitHub Actions updated through Dependabot.
- Keep workflow permissions least-privilege; the default should remain `contents: read`, with broader permissions only on jobs that need them.

## Application Expectations

- Treat authentication, authorization, and sensitive data handling as security-sensitive changes.
- Review deployment exposure, environment variables, and generated output before release.
- Keep generated output such as `.next/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo` out of manual edits.

## Agent Work

- Use `.agents/agents/security-reviewer/agent.md` for security-focused review when changes affect secrets, authentication, authorization, dependencies, deployment, or external integrations.
- Record accepted security trade-offs in the relevant OpenSpec change or project documentation.
