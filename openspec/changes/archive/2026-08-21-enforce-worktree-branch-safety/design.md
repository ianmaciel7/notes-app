## Context

The repository uses multiple worktrees and long-lived branches. A branch can be attached to a different worktree, while a local server can continue serving an older checkout. The current Git rule does not require agents to prove which checkout they are changing or serving before merging and publishing.

## Goals / Non-Goals

**Goals:**

- Make branch-to-worktree identity explicit before every integration operation.
- Prevent accidental direct updates to protected branches.
- Make stale local refs and stale dev servers visible in the standard workflow.
- Provide a repeatable source-to-target verification trail.

**Non-Goals:**

- Add Git hooks that automatically mutate branches or kill processes.
- Change GitHub branch-protection settings.
- Require a particular GUI, shell, or worktree manager.

## Decisions

- The canonical preflight uses `git status --short --branch`, `git branch -vv`, and `git worktree list --porcelain`. This is preferred over trusting a task title, current directory label, or browser URL.
- A source branch is integrated only after comparing its commit with the target using `git merge-base` and `git rev-list --left-right --count`.
- If the target branch is attached to another worktree, work must happen in that worktree or stop for explicit user direction; agents MUST NOT force-switch or remove the attached worktree.
- Protected branches (`dev`, `stag`, and `main`) are updated through a pull request. Feature branches are the publication target for task work unless the user explicitly chooses another branch.
- Local UI validation records the server process/worktree relationship and rebuilds or restarts the intended checkout when the browser is serving an older process.

## Risks / Trade-offs

- [Risk] Extra preflight commands slow small changes → Mitigation: keep the checks read-only and use the compact command set above.
- [Risk] A branch may advance between comparison and push → Mitigation: verify the remote and working-tree state again immediately before publishing.
- [Risk] Worktree ACLs may block Git locks → Mitigation: report the exact blocked path and request an authorized shell; never force cleanup or force push.

## Verification Notes

- Clean preflight was observed before the documentation edits; after edits, `git status --short --branch` correctly reports only the scoped rule and OpenSpec files.
- `git worktree list --porcelain` identified `feat/app-sidebar` at `C:\Users\ianma\.codex\worktrees\e3e0\notes-app`, so the protected `dev` checkout was left unchanged.
- `git rev-list --left-right --count dev...feat/app-sidebar` reported `0 1`, correctly identifying one source-only commit and no target-only commits.
- `openspec validate enforce-worktree-branch-safety --strict` passed, and both `git` and `openspec.cmd` resolve on the machine.
