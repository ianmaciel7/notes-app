# Security

## Reporting

Report security concerns privately to the repository owner. Do not publish secrets, exploit details, or sensitive configuration in public issues or pull requests.

## Secrets

- Keep credentials, API keys, tokens, private keys, and production secrets out of Git.
- Use `.env` for local secrets and `.env.example` for non-sensitive variable names.
- Do not store secrets in `.agents/mcp-servers.json`, documentation, OpenSpec artifacts, or generated agent files.
- Never print secrets or derived credentials in logs.

## Current Application Surface

The current app is a minimal Next.js starter page. It does not yet include:

- authentication;
- authorization;
- database access;
- Firebase Admin;
- protected APIs;
- deployment configuration;
- payment or external data integrations.

Treat any future addition in those areas as security-sensitive.

## Dependencies

- Use `pnpm install` and keep `pnpm-lock.yaml` committed.
- Review dependency changes before merging.
- Prefer existing dependencies and platform APIs before adding new packages.

Dependabot, Dependency Review, CodeQL, and GitHub Actions security workflows are not configured in the current branch because `.github/` is not present.

## GitHub Actions Supply Chain

No GitHub Actions workflows are present in this branch. When workflows are added:

- prefer official GitHub Actions where practical;
- keep permissions least-privilege;
- pin or trust action sources intentionally;
- avoid printing secrets.

## Agent Work

Use `.agents/agents/security-reviewer/agent.md` for security-focused review when changes affect secrets, authentication, authorization, dependencies, deployment, or external integrations.

Record accepted security trade-offs in the relevant OpenSpec change or project documentation.
