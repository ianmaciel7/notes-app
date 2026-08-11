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

## Canonical Docs

| Need | Document |
| --- | --- |
| Setup, commands, Git, commits, PRs, CI, merge, versioning, tags | `CONTRIBUTING.md` |
| Security, secrets, dependency review | `SECURITY.md` |
| Architecture and project structure | `docs/ARCHITECTURE.md` |
| Design principles and accessibility | `docs/DESIGN.md` |
| Testing and verification | `docs/TESTING.md` |
| Build, environments, deployment | `docs/DEPLOYMENT.md` |
| Agent context audit | `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md` |

## Mandatory Conventions

- Follow `CONTRIBUTING.md` for branch, commit, push, pull request, CI, merge, versioning, tag, and release preparation work.
- Follow `docs/DEPLOYMENT.md` for deployment triggers, environment promotion, deployment verification, and rollback behavior.
- Do not push directly to protected branches.
- Do not create, delete, move, or force-update release tags unless explicitly instructed.
- For Next.js API, routing, caching, or file-convention work, read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed.
- Keep `CLAUDE.md` and `GEMINI.md` as pointers to `AGENTS.md`; do not duplicate instructions there.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo`.
- Use OpenSpec (`openspec/changes/`) for active proposed product changes and `openspec/specs/` for canonical requirements.
- Use `.agents/workflows/` and OpenSpec for proposals, significant architectural changes, rationale, alternatives, and trade-offs.
- Use `.agents/agents/` only when a specialized role is useful for review or planning.
- Keep generic MCP server recommendations in `.agents/mcp-servers.json`; do not store secrets there.
- Whenever adding a new library, inspect the exact installed package before using it: check bundled documentation (`docs/`, `dist/docs/`, guides, and `README.md`), public exports, TypeScript declarations, changelog or migration notes, and any `AGENTS.md` or `SKILL.md` files. Prefer documentation shipped with the installed version over remembered APIs. Add enduring consumer-facing requirements to this `AGENTS.md` only when they apply to this application; do not copy contributor instructions for the library's own repository. If documentation is unavailable, verify behavior from the package's public types and implementation before writing integration code.
- **Never delete `docs/temp/` or any files inside it.** This directory is an intentional scratch and drafting area maintained by the user. Do not remove, move, or rename its contents even when reorganizing other parts of `docs/`.
- **Always use relative paths in Markdown files.** When writing links or references inside any `.md` file, use paths relative to that file (e.g. `../evidence/image.png`, `./notion.md`). Never hardcode absolute paths such as `file:///C:/Users/...`, `/abs/path/...`, or any OS-specific absolute path.

## Component Discovery First

Before creating any new UI component, primitive, block, or complex custom markup, always perform component discovery first.

### Required Workflow

1. Inspect the current project:

   ```powershell
   pnpm dlx shadcn@latest info --json
   ```

2. Check whether the required component already exists in the project.

3. Search shadcn registries before writing custom UI:

   ```powershell
   pnpm dlx shadcn@latest search -q "<component or functionality>"
   ```

4. Search by functionality and synonyms, not only by the exact requested name. Examples include `command palette`, `cmd menu`, `combobox`, and `autocomplete`.

5. Prefer sources in this order:

   1. Existing project components.
   2. Official shadcn/ui components.
   3. Existing configured registries.
   4. The shadcn Registry Directory or trusted community registries.
   5. Composition of existing primitives.
   6. Custom implementation.

6. For candidate components, inspect documentation and source:

   ```powershell
   pnpm dlx shadcn@latest docs <component>
   pnpm dlx shadcn@latest view <component>
   ```

7. Never install a third-party registry component blindly. Review its source code, dependencies, package scripts, imports, accessibility, compatibility, maintenance, and license.

8. Preview third-party changes before installation whenever possible:

   ```powershell
   pnpm dlx shadcn@latest add <component> --dry-run
   pnpm dlx shadcn@latest add <component> --view
   ```

9. Do not create a custom component if an existing component can satisfy the requirement through reasonable composition or customization.

10. Only create a new component after documenting that component discovery did not produce a suitable implementation.

## Product Research & Reconstruction Workflow

```text
COMPETITOR / REFERENCE APP
            │
            ▼
      docs/research/
   (evidence + facts: CONFIRMED / INFERRED / UNKNOWN)
            │
      product decision
            │
            ▼
      openspec/changes/<change-name>/
   (proposal linking via Progressive Disclosure)
            │
      proposal → specs → design → tasks
            │
      implementation & parity verification
            │
            ▼
      openspec archive (updates main specs)
```

- **Separation of Concerns**: Keep long-lived research knowledge in `docs/research/`. Never use `openspec/specs/` or proposals as generic research dumps.
- **Progressive Disclosure**: OpenSpec proposals reference relevant research files via markdown links (`docs/research/...`) rather than duplicating research blocks. Agents load research files only when required for a specific task.

## Minimal Agent Loop

The main agent is the loop controller. Use the existing harness instead of creating duplicate rules, agents, skills, workflows, state files, memory files, scripts, or documentation.

Use this loop for meaningful work:

```text
discover -> decide OpenSpec need -> delegate if useful -> implement -> verify software -> verify OpenSpec when applicable -> review if justified -> PR -> stop
```

- Start from repository evidence: relevant docs, code, tests, package scripts, OpenSpec specs/changes, Git status, and CI.
- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, and change lifecycle. Do not create parallel planning, task, memory, or spec files.
- Keep transient loop state in the agent session. Persist only useful outcomes in the right owner: OpenSpec, tests, code, docs, Git commits, PRs, or CI.
- Keep software verification separate from OpenSpec verification. Passing tests does not prove requirements were met; valid OpenSpec artifacts do not prove the software works.
- Prefer `pnpm verify` for ordinary local completion evidence unless a narrower verification path is explicitly justified.

## Subagent Delegation

Reuse existing agents in `.agents/agents/` before creating new ones.

- `architect`: use for architectural boundaries, data flow, server/client tradeoffs, persistence, auth, hosting, dependencies, or migrations.
- `test-engineer`: use for verification strategy, regression coverage, reproductions, or test infrastructure.
- `code-reviewer`: use for meaningful implemented diffs, user-visible behavior, important logic, regression risk, accessibility, or missing verification.
- `security-reviewer`: use for auth, authorization, secrets, user data, dependencies, deployment exposure, external integrations, or trust boundaries.

For multi-file, user-visible, architectural, security, dependency, or deployment changes, use the appropriate independent reviewer or record why independent review was not justified.

Delegation should be one level by default. Give subagents compact packets containing only:

- objective;
- relevant OpenSpec change or requirement;
- relevant files or search scope;
- constraints and allowed tools;
- expected output.

Use parallel subagents only for independent analysis. Do not allow simultaneous writes to the same working tree; parallel implementation requires isolated workspaces or Git worktrees and explicit justification.

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
