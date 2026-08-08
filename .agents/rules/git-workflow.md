# Git Workflow Rule

For branches, commits, pushes, pull requests, CI, merges, versioning, tags, and release preparation, follow `CONTRIBUTING.md`.

- Never push directly to `main` or `staging`.
- Do not bypass required CI checks or branch protection unless explicitly requested.
- Investigate unexpectedly large or unrelated changes before pushing or merging.
- Use squash merge for pull requests.
- Do not use merge-time branch deletion such as `gh pr merge --squash --delete-branch`.
- Delete merged working branches only as an explicit cleanup step after verifying the target branch updated correctly.
- Do not create, delete, move, or force-update release tags unless explicitly requested.
