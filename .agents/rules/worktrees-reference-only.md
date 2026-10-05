# Rule: Read-Only Worktrees Directory (.worktrees)

## Description
The `.worktrees` directory (and any symlinks/aliases such as `.worktress`) contains git worktrees and historical branches intended solely as immutable reference points. Agents and automated processes must never modify, delete, or create files within this directory.

## Mandatory Guidelines

1. **Strict Read-Only Access**:
   - Files and directories inside `.worktrees/` are strictly for reference, comparison, and inspection.
   - Do NOT edit, delete, overwrite, move, or add files within `.worktrees/`.
   - Never run build, test, install, or migration commands inside `.worktrees/` that could produce side effects or mutate state.

2. **Workplace Isolation**:
   - All active development, bug fixes, refactoring, and feature work must occur in the root workspace (`src/`, etc.), never inside `.worktrees/`.
   - If reference code needs to be reused, copy relevant snippets into the active working tree rather than modifying the reference source.

3. **Tool and Script Constraints**:
   - File edit tools (`replace_file_content`, `write_to_file`, etc.) and command executions must treat `.worktrees/` paths as restricted and prohibited from mutation.
