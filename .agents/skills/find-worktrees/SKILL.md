---
name: find-worktrees
description: Search local git worktrees with ripgrep and summarize where symbols, files, behavior, TODOs, tests, or implementation patterns appear across branches. Use when a user asks to compare historical worktrees, find code across `.worktrees/*`, locate where a change exists in old branches, or audit multiple local worktrees before editing.
---

# Find Worktrees

## Overview

Search all local git worktrees before assuming a symbol, pattern, behavior, or file only exists in the current checkout. Prefer the bundled script when the user asks about `.worktrees`, older branches, branch comparisons, or "where did this exist before?"

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

## Workflow

1. Start with a broad search across all worktrees.
2. Narrow with `--glob`, `--fixed`, or `--worktree` if the result set is noisy.
3. Open the most relevant files directly in the matching worktree before drawing conclusions.
4. When answering the user, name the branch/worktree label and path for each important match.
5. If a search influences code edits, edit only the intended checkout and do not copy changes from another worktree unless the user asked for that.

## Examples

Find a component across all branches:

```bash
python .agents/skills/find-worktrees/scripts/find_worktrees.py "SplitButton" --glob "src/**/*.tsx"
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
- Treat dirty generated files in `graphify-out/` as expected unless the user asks about them.
- After modifying code or agent files in this repo, run `graphify update .`.
