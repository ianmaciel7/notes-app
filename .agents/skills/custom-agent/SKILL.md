---
name: custom-agent
description: Use this whenever the user wants to create, review, improve, compare, or get recommendations for custom agent role files under `.agents/agents`, especially when they mention Claude, Claude Code, Antigravity, Codex, subagents, agent profiles, role files, or reusable agent instructions. This skill includes Context7 library-resolution notes for Claude Code, OpenAI Codex, and Google Antigravity, then guides concise recommendations or edits.
---

# Custom Agent

Use this skill to create or improve reusable agent role files in `.agents/agents/`.

The goal is to make role files portable across Claude-style subagents, Codex agent types, and other agentic coding tools while staying useful inside this repository.

## Inputs

Identify these from the user's request:

- Target path, defaulting to `.agents/agents/`
- Target role names, such as `developer`, `doc`, `search`, `reviewer`, or `research`
- Desired action: recommend, create, rewrite, split, merge, or audit
- Platform focus: Claude/Claude Code, Antigravity, Codex, or cross-platform
- Whether the user wants edits or only recommendations

If the request is clear, proceed without asking.

## Research Workflow

1. Read repository instructions first:
   - `AGENTS.md`
   - The closest nested instruction file, if present
   - Existing files under `.agents/agents/`
2. If `graphify-out/graph.json` exists and the question concerns repository structure or conventions, run:
   ```bash
   graphify query "<specific question>"
   ```
3. Use the Context7 library snapshot below before doing new discovery. If the user needs current API/platform details, fetch docs for the selected ID with a focused query. Respect any local limit on Context7 command count.

## Context7 Library Snapshot

These results came from Context7 `library` lookups and should be treated as the starting map for platform-specific research.

### Claude Code

Query:
```bash
npx ctx7@latest library "Claude Code" "subagents custom agents role files"
```

Best candidates:

| Rank | Library ID | Why it matters |
|------|------------|----------------|
| 1 | `/zebbern/claude-code-guide` | High-reputation guide with many snippets; description explicitly includes sub-agents, MCP, hooks, automation, and development workflows. |
| 2 | `/anthropics/claude-code` | High-reputation official Claude Code source; lower snippet count, but best for authoritative CLI behavior. Versions listed include `v2.1.39` and `v2.1.89`. |
| 3 | `/websites/code_claude` | High-reputation Claude Code documentation mirror with strong benchmark score and broad terminal/agentic coding coverage. |

Default choice:
- Use `/anthropics/claude-code` when the recommendation depends on official behavior.
- Use `/zebbern/claude-code-guide` when searching examples for subagents, hooks, or workflow patterns.

### OpenAI Codex

Query:
```bash
npx ctx7@latest library "OpenAI Codex" "custom agents agent types role instructions"
```

Best candidates:

| Rank | Library ID | Why it matters |
|------|------------|----------------|
| 1 | `/openai/codex` | High-reputation Codex CLI source; best default for Codex CLI behavior, local coding agent workflows, versions, and terminal usage. |
| 2 | `/llmstxt/learn_chatgpt_llms-full_txt` | High-reputation ChatGPT/Codex docs corpus; description mentions sandboxing, approval policies, modes, and subagent workflows. |
| 3 | `/luohaothu/everything-codex` | High-reputation community configuration toolkit with skills, execution policies, workflows, and `AGENTS.md` templates; use as inspiration, not authority. |

Default choice:
- Use `/openai/codex` for Codex behavior and configuration.
- Use `/llmstxt/learn_chatgpt_llms-full_txt` when the question is about ChatGPT/Codex app behavior such as sandboxing, approvals, or subagents.

### Google Antigravity

Query:
```bash
npx ctx7@latest library "Google Antigravity" "agent instructions rules custom agents"
```

Best candidates:

| Rank | Library ID | Why it matters |
|------|------------|----------------|
| 1 | `/websites/antigravity_google` | High-reputation Antigravity 2.0 source; best default for agent orchestration and command-center concepts. |
| 2 | `/websites/antigravity_google_get-started` | High-reputation getting-started docs; low snippet count, but useful for onboarding and platform basics. |
| 3 | `/websites/antigravity_google_ide_overview` | High-reputation IDE overview; useful for editor, terminal, browser, tasks, artifacts, autonomous operation, and verification framing. |
| 4 | `/websites/agentpedia_codes` | Medium-reputation, high-snippet source for AI rules and workflows; use only as supplemental inspiration. |

Default choice:
- Use `/websites/antigravity_google` for current Antigravity platform recommendations.
- Use `/websites/antigravity_google_ide_overview` when the role file needs to align with IDE tasks, artifacts, and verification.

## Fresh Docs Lookup

When platform-specific details matter, fetch docs from the selected IDs rather than repeating broad discovery:

```bash
npx ctx7@latest docs /anthropics/claude-code "subagents custom agents role file instructions"
npx ctx7@latest docs /openai/codex "custom agents agent types role instructions"
npx ctx7@latest docs /websites/antigravity_google "agent instructions rules custom agents"
```

Only rerun broad `library` discovery if:

- The selected ID returns thin or irrelevant docs.
- The user asks for a different version or platform.
- The platform naming changes.

If Context7 cannot find a platform, say so and use local installed references or official docs when available. Distinguish verified docs from inference.

## Role File Recommendations

Prefer role files that are:

- Short enough to load quickly.
- Specific about responsibility boundaries.
- Clear about whether the agent may edit files.
- Explicit about verification expectations.
- Careful with user changes and dirty worktrees.
- Source-aware: local files first, current docs for unstable platform behavior.
- Free of broad personality theater unless the role genuinely needs it.

## Standard Role File Shape

Use this structure unless an existing project pattern suggests otherwise:

```markdown
# <Role Name> Agent

You are a <role purpose>.

## Responsibilities

- ...

## Workflow

1. ...
2. ...
3. ...

## Guardrails

- ...
```

Add optional sections only when useful:

- `## Inputs`
- `## Output`
- `## Verification`
- `## Handoff`
- `## Non-goals`

## Platform Guidance

### Claude / Claude Code

- Make the role self-contained because subagents may receive a narrow prompt.
- Name expected inputs and outputs explicitly.
- Include a short workflow rather than long general advice.
- Tell the agent when to ask for clarification versus making an assumption.

### Codex

- Preserve user changes and avoid broad rewrites.
- Prefer local project instructions and existing code patterns.
- Include verification steps and exact reporting expectations.
- Keep file-edit permissions clear, especially for search or documentation roles.

### Antigravity

- Keep instructions action-oriented and easy to map to autonomous task execution.
- Separate responsibilities, workflow, and guardrails.
- Avoid assuming platform-only features unless current docs confirm them.

## Creating Or Editing Files

When the user asks to create or update role files:

1. Inspect current `.agents/agents/` contents.
2. Draft the smallest useful role file.
3. Use `apply_patch` for manual edits.
4. Verify the files exist and have the expected names.
5. Report paths changed and summarize the role differences.

## Recommendation Report

When the user asks only for recommendations, use this format:

```markdown
**Findings**
- <issue or strength> - <path>

**Recommendations**
- <specific change and why>

**Source Notes**
- Context7: <library IDs or docs queried>
- Local: <files inspected>
```

Keep the report concise. Put the most actionable changes first.
