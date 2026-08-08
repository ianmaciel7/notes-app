# Security

## Reporting

Report security concerns privately to the repository owner. Do not publish secrets, exploit details, or sensitive configuration in public issues or pull requests.

## Secrets

- Keep credentials, API keys, tokens, private keys, and production secrets out of Git.
- Use `.env` for local secrets and `.env.example` for non-sensitive variable names and examples.
- Do not commit real Firebase, GitHub, OpenAI, or deployment credentials.
- Do not store secrets in `.agents/mcp-servers.json`, documentation, OpenSpec artifacts, or generated agent files.

## Dependencies

- Use `pnpm install` and keep `pnpm-lock.yaml` committed.
- Review dependency changes before merging.
- Prefer existing dependencies and platform APIs before adding new packages.

## Application Expectations

- Treat authentication, authorization, and sensitive data handling as security-sensitive changes.
- Review deployment exposure, environment variables, and generated output before release.
- Keep generated output such as `.next/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo` out of manual edits.

## Agent Work

- Use `.agents/agents/security-reviewer/agent.md` for security-focused review when changes affect secrets, authentication, authorization, dependencies, deployment, or external integrations.
- Record accepted security trade-offs in the relevant OpenSpec change or project documentation.
