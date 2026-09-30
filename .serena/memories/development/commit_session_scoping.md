# Commit Session Scoping Protocol

Whenever an agent in an active session is requested to create a git commit:

1. **Check for Active / Multiple Sessions**:
   - Assess whether multiple agent sessions or parallel workstreams exist.
2. **If Multiple Sessions Are Open**:
   - MUST ALWAYS ask the user whether to:
     - (a) Commit only what was modified in the current session/task, OR
     - (b) Commit all changes across all open sessions.
3. **If Only One Session Exists**:
   - The agent is allowed to commit all relevant changes directly without asking for session scope.

Formally documented in:
- `CONTRIBUTING.md` (Section 3: Commits)
- `.agents/skills/git-commit/SKILL.md` (Workflow Step 0)
