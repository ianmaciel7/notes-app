---
name: find-worktrees
description: Find information across local git worktrees by dispatching one subagent per searched worktree for investigation and using ripgrep for fast mechanical filtering. Use when a user asks to compare historical worktrees, find code across `.worktrees/*`, locate where a change exists in old branches, audit multiple local worktrees before editing, or search symbols, files, behavior, TODOs, tests, or implementation patterns across branches.
---

# Find Worktrees

## Overview

Find information across local git worktrees before assuming a symbol, pattern, behavior, or file only exists in the current checkout. Use the bundled script to discover and filter worktrees, then dispatch one subagent per searched worktree when the task requires reading, interpretation, comparison, or judgment.

## Quick Start

Run the helper from the repository root:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py "pattern"
```

Common options:

- `--fixed`: treat the pattern literally.
- `--ignore-case`: search case-insensitively.
- `--glob "src/**/*.ts"`: restrict searched files; repeat as needed.
- `--worktree old-3`: search only worktrees whose path, branch, or label contains the value; repeat as needed.
- `--context 2`: include surrounding lines.
- `--no-ignore`: include files ignored by gitignore or rg ignore files.
- `--list`: list matching worktrees without searching file contents.

## Workflow

1. List candidate worktrees with `git worktree list` or `python .agents/skills/find-worktrees/scripts/find_worktrees.py --list`.
2. Narrow the candidate set with `--worktree` filters if the user named specific branches or old worktrees.
3. For interpretive tasks, dispatch one subagent per searched worktree. Give each subagent exactly one worktree path, the same search question, and any known `rg` pattern or glob filters.
4. For simple mechanical searches, run the helper directly and skip subagents when the result does not need per-worktree analysis.
5. Synthesize the subagent results by worktree label and path. Call out agreement, differences, missing implementations, and confidence.
6. If a search influences code edits, edit only the intended checkout and do not copy changes from another worktree unless the user asked for that.

## Subagent Dispatch

Create one independent subagent for each worktree that will be searched when the user asks for comparison, historical investigation, "which branch has this?", or any answer that needs more than raw line matches.

Use this prompt shape:

```text
Search only this worktree: <absolute-worktree-path>
Question: <user question>
Pattern/globs if relevant: <pattern and filters>

Report:
- Whether the requested symbol, behavior, file, or pattern exists.
- The most relevant file paths and line references.
- A short explanation of what this worktree does differently from the others, if evident.
- Any uncertainty or follow-up search that would improve confidence.

Do not edit files. Do not inspect other worktrees.
```

Keep the main agent responsible for choosing the worktrees, merging the findings, and deciding whether a follow-up targeted search is needed.

## Examples

Find a component across all branches:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py "SplitButton" --glob "src/**/*.tsx"
```

List old worktrees before dispatching subagents:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py --list --worktree old
```

Find literal text in one old worktree:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py "graphify update ." --fixed --worktree old-5
```

Find TODOs with context:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py "TODO|FIXME" --context 1
```

## Guardrails

- Prefer `rg` directly when searching only the current checkout.
- Add `--no-ignore` when searching ignored agent, generated, or local-only files.
- Use `git worktree list` first if the helper reports no worktrees.
- Do not have one subagent search multiple worktrees unless only one subagent tool call is available; isolation keeps findings comparable.
- Treat dirty generated files in `graphify-out/` as expected unless the user asks about them.
- After modifying code or agent files in this repo, run `graphify update .`.
