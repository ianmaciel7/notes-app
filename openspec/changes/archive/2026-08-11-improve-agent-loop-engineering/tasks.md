## 1. Shared Loop Contract

- [x] 1.1 Update `AGENTS.md` with the minimal main-agent loop, OpenSpec routing, delegation packet, terminal states, retry/no-progress rules, human gates, and PR handoff.
- [x] 1.2 Update `docs/TESTING.md` to distinguish software verification from OpenSpec verification and describe verification-failure diagnosis.

## 2. Existing Subagents

- [x] 2.1 Refresh `architect` facts, triggers, output, and supported read-only Antigravity tool declarations.
- [x] 2.2 Refresh `test-engineer` facts, triggers, output, and supported verification-oriented Antigravity tool declarations.
- [x] 2.3 Refresh `code-reviewer` facts, triggers, output, and supported verification-oriented Antigravity tool declarations.
- [x] 2.4 Refresh `security-reviewer` facts, triggers, output, and supported least-privilege Antigravity tool declarations.

## 3. Validation

- [x] 3.1 Validate OpenSpec artifacts with the installed OpenSpec CLI.
- [x] 3.2 Validate repository software checks with the canonical verification command.
- [x] 3.3 Validate subagent configuration as far as the local runtime allows, and document any runtime invocation gap.
- [x] 3.4 Review the final diff for duplicate systems, unsupported tool names, excessive permissions, stale facts, unsafe autonomy, unrelated changes, and secrets.
