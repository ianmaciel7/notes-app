# Git Workflow Rule

For branches, commits, pushes, pull requests, CI, merges, versioning, tags, and release preparation, follow `CONTRIBUTING.md`.

- Before any branch operation, run these read-only preflight checks from the intended checkout:
  - `git status --short --branch`
  - `git branch -vv`
  - `git worktree list --porcelain`
- Record the exact checkout path, current branch, HEAD, upstream ref, and dirty-tree state. Do not trust a task title, browser URL, or server port as branch identity.
- If the target branch is attached to another worktree, work in that exact path or stop for user direction. Never force-switch, remove, or reassign the attached worktree.
- Preserve unrelated modified, staged, untracked, or conflicted files. Stop before integration unless the user explicitly authorizes how to handle them.
- Before integrating source into target, compare refs with `git merge-base --is-ancestor source target` and `git rev-list --left-right --count target...source`; report commits unique to either side.
- After integration, verify the source tip is an ancestor of target and repeat `git status --short --branch` before publishing.
- Publish task work to the requested feature branch and verify its worktree and remote first. For this repository, `feat/app-sidebar` is the default task publication branch when the user has selected it.
- Never push directly to `main` or `staging`.
- Never push directly or force-push to `dev`, `stag`, or `main`; update protected branches through a pull request.
- Do not bypass required CI checks or branch protection unless explicitly requested.
- Never use force push, `git reset --hard`, or forced worktree removal to resolve branch divergence or attachment conflicts.
- Investigate unexpectedly large or unrelated changes before pushing or merging.
- Use squash merge for pull requests.
- Do not use merge-time branch deletion such as `gh pr merge --squash --delete-branch`.
- Delete merged working branches as an explicit post-merge cleanup step after verifying the target branch updated correctly.
- Do not create, delete, move, or force-update release tags unless explicitly requested.
- Before claiming UI parity, verify that the listening server uses the intended checkout and commit. If it is stale, rebuild or restart only that local server, then verify the route and browser console.
