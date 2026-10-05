---
name: git-reset-local-branches
description: Discard every local branch and recreate them from the remote as tracking branches. Use when the user asks to "discard all local branches and download all remote ones", reset local branches to origin, or resync local branches with the remote.
---

# Reset local branches to remote

Deleting local branches is destructive: unpushed commits survive only in the
reflog. Never touch `main` (no local `main`, no reset, no push), never use
`--no-verify`, and never modify `.worktrees/`.

## Steps

1. **Pre-flight (read-only).** Run `git fetch --all --prune`, then
   `git branch -vv`, `git branch -r`, `git worktree list` and `git status`.
   Note every local branch marked `ahead`: their commits are lost by this
   procedure. Record each SHA to report it for recovery.
2. **Stop on a dirty tree.** If `git status` is not clean, ask the user before
   continuing.
3. **Leave the current branch.** `git checkout -q --detach origin/<current>`.
4. **Delete local branches.** `git branch -D <each local branch>`. Skip any
   branch checked out in another worktree and report it.
5. **Recreate from the remote.** For every `origin/*` ref except `origin/HEAD`
   and `origin/main`:

   ```bash
   for b in $(git branch -r --format='%(refname:short)' | grep -v -e '^origin$' -e '/HEAD$' -e '^origin/main$'); do
     git branch --track "${b#origin/}" "$b" -q
   done
   ```

6. **Return to `dev`.** `git checkout -q dev`, then `git branch -vv` to confirm
   every branch tracks its remote with no `ahead`/`behind`.

## Report

- Branches discarded, with their old SHAs and how far ahead they were
  (recover with `git branch <name> <sha>`).
- Branches created.
- Remote branches pruned by the fetch.
- That `main` was intentionally not created locally. If a hook fails for a
  missing local `main`, do not create it: propose a fix that avoids branches
  (for example `--since=origin/main`) or ask.
