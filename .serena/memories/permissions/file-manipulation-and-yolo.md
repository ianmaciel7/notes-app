# File Manipulation, Permissions, and Auto-Approval (YOLO)

## Permissions & Approval Policy
- **Auto-Approval / YOLO Mode**: All agents operate in YOLO mode with full tool auto-approval (`approvalMode: "yolo"`, `autoApprove: true`, `autoApproveAll: true`, `requireConfirmation: false`).
- **File Editing & Manipulation**: The agent and subagents are authorized to create, edit, patch, and delete files without prompting:
  - Allowed tools include `write_to_file`, `replace_file_content`, `read_file`, `write_file`, `edit_file`, `delete_file`, `create_directory`, `move_file`, `list_directory`, `search_files`, and all `filesystem(*)` / `serena(*)` / `mcp(*)` operations.
  - Configured in both workspace `.gemini/settings.json` and global `~/.gemini/settings.json`.
- **Subagents Write Capabilities**:
  - All specialized subagents in `.agents/agents/` (`research`, `architect`, `code-reviewer`, `test-engineer`, `security-reviewer`, `doc-maintainer`) have `enable_write_tools: true`.
  - Subagents can write scratch scripts, patch code, auto-fix lint/type issues, and update documentation directly.

## Execution Rules
- Run interactive CLI sessions with `agy --yolo` (or `agy -y`) or type `/mode yolo` / `/approval yolo` if confirmation prompts appear.
- All shell commands must go through `rtk <command>`.
- Never hardcode absolute user/machine paths in committed files or documentation; use repository-relative paths.