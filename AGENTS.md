<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Environment

- On user or machine `ianma`, use native Windows PowerShell paths, commands, and assumptions by default.
- Do not assume WSL2 is available for `ianma`; use WSL or Linux commands only when explicitly requested or after verifying WSL is available.
- Use pnpm 11.20.0.
- Do not use Bash-style `\` line continuation in PowerShell examples.

## Canonical Agent Configuration

- `AGENTS.md` and `.agents/` are the repository source of truth for portable agent instructions, skills, rules, agents, workflows, and MCP recommendations.
- Do not create or maintain duplicated project knowledge under `.agent/`, `.codex/`, `.gemini/`, or other vendor-specific project instruction trees.
- Keep reusable skills under `.agents/skills/<skill-name>/SKILL.md`; there must be one canonical repository copy per skill.
- Keep reusable workflows under `.agents/workflows/`, rules under `.agents/rules/`, reviewer definitions under `.agents/agents/`, and generic MCP recommendations in `.agents/mcp-servers.json`.
- If a tool requires vendor-specific local configuration, prefer supported user-level configuration and do not duplicate repository instructions or workflows there.

## OpenSpec

- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, alternatives, trade-offs, and change lifecycle work.
- Before changing repository code or documentation, identify an existing active OpenSpec change that covers the work or create/update one under `openspec/changes/`.
- The OpenSpec change must describe the intended scope before implementation begins.
- Current agent-governance bootstrap is tracked in `openspec/changes/init-agent-governance/`.
- Accepted repository requirements belong under `openspec/specs/`.
- Active proposed changes belong under `openspec/changes/`.
- Do not create parallel planning, task, memory, or spec files for information that belongs in OpenSpec.
- Keep software verification separate from OpenSpec verification. Passing tests does not prove requirements were met; valid OpenSpec artifacts do not prove the software works.

## Repository Guidance

Use the restored `.agents` material before inventing new local process:

| Need | Location |
| --- | --- |
| Specialist review roles | `.agents/agents/` |
| Portable rules | `.agents/rules/` |
| Reusable project skills | `.agents/skills/` |
| Reusable workflows | `.agents/workflows/` |
| MCP recommendations | `.agents/mcp-servers.json` |
| Durable requirements and proposals | `openspec/` |

Some restored rules refer to docs and CI files that are intentionally not part of this first bootstrap slice yet. Treat missing referenced files as follow-up restoration work, not as proof that the rule is invalid.

## Mandatory Conventions

- Do not push directly to protected branches.
- Do not bypass required CI checks or branch protection unless explicitly requested.
- Do not create, delete, move, or force-update release tags unless explicitly requested.
- For Next.js API, routing, caching, or file-convention work, read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Use relative paths in Markdown files; do not hardcode absolute, `file://`, or OS-specific paths.
- For UI work, always prefer existing project components and shadcn/ui components over raw HTML controls or custom component markup; record why when custom UI is necessary.
- Whenever adding a new library, inspect the exact installed package before using it: bundled documentation, public exports, TypeScript declarations, changelog or migration notes, and any relevant `AGENTS.md` or `SKILL.md` files.

## Minimal Agent Loop

Use this loop for meaningful work:

```text
discover -> decide OpenSpec need -> delegate if useful -> implement -> verify software -> verify OpenSpec when applicable -> review if justified -> PR -> stop
```

- Start from repository evidence: relevant docs, code, tests, package scripts, OpenSpec specs or changes, Git status, and CI when available.
- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, and change lifecycle.
- Do not edit code or docs outside an OpenSpec-covered scope.
- Keep transient loop state in the agent session.
- Prefer focused verification for the changed surface, then broader verification when the repo has the needed scripts and dependencies.

## Graphify

Use Graphify when `graphify-out/` and the Graphify CLI are present and current.

- Prefer Graphify to narrow broad architecture exploration.
- Read actual source before changing behavior.
- Raw repository search remains allowed when an exact symbol is needed, Graphify is stale or absent, or source verification is required.
- Do not rebuild the entire graph unnecessarily.

## Subagent Delegation

Reuse existing agents in `.agents/agents/` before creating new ones.

- `architect`: architectural boundaries, data flow, server/client tradeoffs, persistence, auth, hosting, dependencies, or migrations.
- `test-engineer`: verification strategy, regression coverage, reproductions, or test infrastructure.
- `code-reviewer`: meaningful implemented diffs, user-visible behavior, important logic, regression risk, accessibility, or missing verification.
- `security-reviewer`: auth, authorization, secrets, user data, dependencies, deployment exposure, external integrations, or trust boundaries.

For multi-file, user-visible, architectural, security, dependency, or deployment changes, use the appropriate independent reviewer or record why independent review was not justified.

## Failure And Stop Conditions

- Verification failures require diagnosis: identify the failing check, classify the likely root cause, make a targeted change, and rerun the narrowest useful verification before broader verification.
- Retries must be bounded. If the same root cause repeats without meaningful progress, change strategy, delegate to the right specialist, report `BLOCKED`, or `ESCALATE`.
- `DONE` requires evidence such as relevant checks, tests, build, OpenSpec verification, review results, and CI status appropriate to the change.
- `BLOCKED` means progress depends on an external condition such as credentials, permissions, unavailable services, missing runtimes, or environment failures.
- `ESCALATE` means human judgment or authorization is required for ambiguity, security tradeoffs, destructive operations, production impact, protected-branch bypass, release tags, IAM, billing, or repeated no-progress failures.

## Human Gates

Do not autonomously perform high-impact actions unless explicitly authorized:

- bypassing branch protection or required CI;
- pushing directly to protected branches;
- merging pull requests;
- production deployments or rollbacks;
- destructive database, cloud, or filesystem operations;
- credential, secret, IAM, billing, or release-tag changes;
- force-pushing protected history or deleting protected branches.
