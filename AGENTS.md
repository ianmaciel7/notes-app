<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Environment

- Work from WSL2; prefer Linux paths, shell commands, and assumptions unless a task requires native Windows behavior.
- The primary local shell is Windows PowerShell; do not use Bash-style `\` line continuation in PowerShell examples.
- Use pnpm 11.20.0.

## Canonical Agent Configuration

- `AGENTS.md` and `.agents/` are the only repository source of truth for portable agent instructions, skills, rules, agents, workflows, and MCP recommendations.
- Do not create or maintain duplicated project knowledge under `.agent/`, `.codex/`, `.gemini/`, or vendor-specific instruction files.
- Keep reusable skills under `.agents/skills/<skill-name>/SKILL.md`; there must be one canonical copy per skill.
- Keep reusable workflows under `.agents/workflows/`, rules under `.agents/rules/`, reviewer definitions under `.agents/agents/`, and generic MCP recommendations in `.agents/mcp-servers.json`.
- If a tool requires vendor-specific local configuration, prefer supported user-level configuration and do not duplicate repository instructions or workflows there.

## Canonical Docs And Specs

| Need | Document |
| --- | --- |
| Setup, commands, Git, commits, PRs, CI, merge, versioning, tags | `CONTRIBUTING.md` |
| Security, secrets, dependency review | `SECURITY.md` |
| Architecture and project structure | `docs/ARCHITECTURE.md` |
| Design principles and accessibility | `docs/DESIGN.md` |
| Testing and verification | `docs/TESTING.md` |
| Build, environments, deployment | `docs/DEPLOYMENT.md` |
| Graphify infrastructure, hooks, CI, upgrades | `docs/GRAPHIFY.md` |
| Agent context audit | `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md` |
| Accepted repository requirements | `openspec/specs/` |
| Active proposed changes | `openspec/changes/` |

## Mandatory Conventions

- Follow `CONTRIBUTING.md` for branch, commit, push, pull request, CI, merge, versioning, tag, and release preparation work.
- Follow `docs/DEPLOYMENT.md` for deployment triggers, environment promotion, deployment verification, and rollback behavior.
- Do not push directly to protected branches.
- Do not create, delete, move, or force-update release tags unless explicitly instructed.
- For Next.js API, routing, caching, or file-convention work, read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, alternatives, trade-offs, and change lifecycle work.
- Use `.agents/agents/` only when a specialized role is useful for review or planning.
- Whenever adding a new library, inspect the exact installed package before using it: check bundled documentation (`docs/`, `dist/docs/`, guides, and `README.md`), public exports, TypeScript declarations, changelog or migration notes, and any `AGENTS.md` or `SKILL.md` files. Prefer documentation shipped with the installed version over remembered APIs. Add enduring consumer-facing requirements to this `AGENTS.md` only when they apply to this application; do not copy contributor instructions for the library's own repository. If documentation is unavailable, verify behavior from the package's public types and implementation before writing integration code.
- Never delete, move, or rename `docs/temp/` or files inside it.
- Use relative paths in Markdown files; do not hardcode absolute, `file://`, or OS-specific paths.
- Before creating UI components or complex custom markup, perform component discovery as required by `openspec/specs/repository-governance/spec.md`.
- Store long-lived product research under `docs/research/` and reference it from OpenSpec through relative links instead of duplicating research dumps.

## Minimal Agent Loop

Use this loop for meaningful work:

```text
discover -> decide OpenSpec need -> delegate if useful -> implement -> verify software -> verify OpenSpec when applicable -> review if justified -> PR -> stop
```

- Start from repository evidence: relevant docs, code, tests, package scripts, OpenSpec specs/changes, Git status, and CI.
- Follow the Graphify policy below before broad repository exploration.
- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, and change lifecycle. Do not create parallel planning, task, memory, or spec files.
- Keep transient loop state in the agent session. Persist only useful outcomes in the right owner: OpenSpec, tests, code, docs, Git commits, PRs, or CI.
- Keep software verification separate from OpenSpec verification. Passing tests does not prove requirements were met; valid OpenSpec artifacts do not prove the software works.
- Prefer `pnpm verify` for ordinary local completion evidence unless a narrower verification path is explicitly justified.

## Graphify

Use Graphify as the primary codebase navigation and architecture discovery layer.

Before broad repository exploration:

- Prefer `graphify query` for architecture and conceptual questions.
- Prefer `graphify explain` for understanding a specific component.
- Prefer `graphify path` for discovering relationships and execution paths.
- Consult `graphify-out/GRAPH_REPORT.md` when broad architectural context is needed.

Prefer Graphify to narrow the search space before performing repository-wide searches.

Raw repository search remains allowed when:

- an exact symbol or string is required;
- Graphify does not contain enough information;
- Graphify appears stale;
- Graphify fails;
- source-code verification is required.

Graph maintenance is handled by repository automation.

Do not rebuild the entire graph unnecessarily.

## Subagent Delegation

Reuse existing agents in `.agents/agents/` before creating new ones.

- `architect`: use for architectural boundaries, data flow, server/client tradeoffs, persistence, auth, hosting, dependencies, or migrations.
- `test-engineer`: use for verification strategy, regression coverage, reproductions, or test infrastructure.
- `code-reviewer`: use for meaningful implemented diffs, user-visible behavior, important logic, regression risk, accessibility, or missing verification.
- `security-reviewer`: use for auth, authorization, secrets, user data, dependencies, deployment exposure, external integrations, or trust boundaries.

For multi-file, user-visible, architectural, security, dependency, or deployment changes, use the appropriate independent reviewer or record why independent review was not justified.

## Failure And Stop Conditions

- Verification failures require diagnosis: identify the failing check, classify the likely root cause, make a targeted change, and rerun the narrowest useful verification before broader verification.
- Retries must be bounded. If the same root cause repeats without meaningful progress, change strategy, delegate to the right specialist, report BLOCKED, or ESCALATE.
- DONE requires evidence such as relevant checks, tests, build, OpenSpec verification, review results, and CI status appropriate to the change.
- BLOCKED means progress depends on an external condition such as credentials, permissions, unavailable services, missing runtimes, or environment failures. Report evidence, attempts, and what is needed next.
- ESCALATE means human judgment or authorization is required for ambiguity, security tradeoffs, destructive operations, production impact, protected-branch bypass, release tags, IAM, billing, or repeated no-progress failures.

## Human Gates

Do not autonomously perform high-impact actions unless explicitly authorized:

- bypassing branch protection or required CI;
- pushing directly to `main` or `staging`;
- merging pull requests;
- production deployments or rollbacks;
- destructive database, cloud, or filesystem operations;
- credential, secret, IAM, billing, or release-tag changes;
- force-pushing protected history or deleting protected branches.

