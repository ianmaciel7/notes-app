<!-- BEGIN:subagent-delegation-rules -->

# Subagent Delegation Rules

## Policy Rules

1. **Mandatory Subagent Delegation**:
   - For architecture, system design, or trade-off decisions, ALWAYS delegate to `architect`.
   - For code reviews, audit of diffs, or pre-commit verification, ALWAYS delegate to `code-reviewer`.
   - For testing strategies, test writing, or running test suites, ALWAYS delegate to `test-engineer`.
   - For security checks, threat modeling, or auth boundary verification, ALWAYS delegate to `security-reviewer`.
   - For documentation updates, ADRs, or Markdown synchronization, ALWAYS delegate to `doc-maintainer`.
   - For deep codebase exploration across multiple files or directories, ALWAYS delegate to `research`.

2. **Execution Protocol**:
   - Launch subagents using `invoke_subagent`.
   - Do NOT poll in a loop; wait for the system to notify upon subagent completion.
   - Integrate subagent findings before concluding tasks.

<!-- END:subagent-delegation-rules -->
