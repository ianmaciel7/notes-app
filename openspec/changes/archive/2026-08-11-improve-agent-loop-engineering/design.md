## Context

The repository already has a harness: `AGENTS.md`, canonical docs, OpenSpec workflows, specialized subagents, GitHub rulesets, CI, security guidance, package scripts, and a verification harness. The current gap is drift and orchestration clarity, not missing infrastructure.

Current subagent files are stale after the verification-harness change and use Claude-style tool names. Current Antigravity documentation for custom subagents uses tool names such as `view_file`, `grep_search`, and `run_command`, and warns that unmapped tool names can cause subagent execution to hang.

## Goals / Non-Goals

**Goals:**

- Keep the main agent as the loop controller.
- Reuse OpenSpec, Git, tests, CI, and PRs as durable state and evidence.
- Refresh existing subagents instead of creating replacements.
- Keep subagent delegation shallow, focused, and least-privileged.
- Make DONE, BLOCKED, ESCALATE, bounded retry, and no-progress behavior explicit.
- Keep software verification and OpenSpec verification separate.

**Non-Goals:**

- Do not create a new multi-agent framework, orchestrator agent, memory system, hook system, telemetry system, eval platform, or custom loop-state file.
- Do not add dependencies, MCP servers, generated adapters, worktree automation, or CI jobs.
- Do not change product behavior.
- Do not archive OpenSpec changes as part of this work.

## Decisions

1. Update existing canonical owners instead of adding a loop document.

   `AGENTS.md` owns shared coding-agent execution rules, and `docs/TESTING.md` owns verification and Definition of Done. Adding a separate loop document would duplicate those owners.

2. Keep runtime-specific configuration in subagent frontmatter.

   Shared contracts remain in docs. Antigravity-specific tool declarations stay in `.agents/agents/*/agent.md`, using supported tool names from current Antigravity docs.

3. Use read/search tools by default and command execution only where verification benefits from it.

   `architect` remains read/search only. `test-engineer`, `code-reviewer`, and `security-reviewer` may run sandboxed commands for verification or focused inspection, but do not get write tools.

4. Use OpenSpec only for durable development contracts.

   This change creates a small `agent-loop-engineering` capability because it defines recurring repository behavior for coding agents. It does not create product specs, transient plan files, or a parallel task system.

5. Defer advanced parallelism and loop observability.

   Current repository size and risk do not justify worktree orchestration, agent telemetry, scheduled autonomous loops, or a loop eval platform. Parallel subagents may perform independent read-only analysis; parallel writes require isolated workspaces and explicit justification.

## Risks / Trade-offs

- [Risk] Antigravity tool names may change again. -> Mitigation: agent docs reference current tool names and keep tool lists minimal; future runtime changes should update the frontmatter only.
- [Risk] Documentation-only loop rules can be missed. -> Mitigation: safety-critical behavior is already backed by branch protection, CI, permissions, and human gates; this change avoids adding brittle hooks before evidence.
- [Risk] Subagent invocation cannot be fully validated from this PowerShell session if Antigravity CLI is unavailable on PATH. -> Mitigation: validate schema against official/current docs, inspect local installation state, and document the remaining runtime-validation gap.
- [Risk] OpenSpec artifacts could become a second planning system. -> Mitigation: specs describe durable loop requirements only; transient execution state remains in the agent session, Git, tests, CI, and PR.
