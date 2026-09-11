# Reference Worktrees Read-Only Rule

The `.worktrees/` directory (including all subdirectories `.worktrees/old`, `.worktrees/old-2`, `.worktrees/old-3`, `.worktrees/old-4`, `.worktrees/old-5`) contains immutable historical reference iterations.

Rules:
- NEVER create, edit, modify, or delete any files or directories inside `.worktrees/`.
- Treat all files inside `.worktrees/` as strictly READ-ONLY reference material.
