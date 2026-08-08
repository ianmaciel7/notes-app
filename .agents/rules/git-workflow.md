# Git Workflow Rule

Apply this rule to any Git operation involving branches, commits, pushes, pull requests, or merges.

- Never push directly to `main` or `staging`.
- Create a dedicated working branch from the latest `staging`.
- Keep each branch limited to one logical task.
- Review changed files before committing or pushing.
- Reuse an existing pull request when one already exists for the branch.
- Pull requests must target `staging` unless explicitly instructed otherwise.
- Required CI checks must pass before merge.
- Use squash merge.
- Never bypass branch protection unless explicitly instructed.
- Stop and investigate if the change set is unexpectedly large or contains unrelated files.
- Prefer safe, non-destructive Git commands.
- The local shell is Windows PowerShell; do not use Bash `\` line continuation.

Follow `docs/git-workflow.md` for complete workflow commands and examples.
