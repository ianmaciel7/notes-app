# Command & Tool Invariants

These rules govern how agents execute commands and utilize repository-configured tools.

## 1. Shell Command Execution with RTK
- **Mandatory RTK Prefix**: Every shell command MUST be prefixed with `rtk` (e.g., `rtk pnpm build`, `rtk git status`, `rtk node script.js`).
- **Policy Violation**: Running bare shell commands without `rtk` is a violation of repository policy, equivalent to bypassing a quality gate.
- **Exceptions**: Only RTK diagnostic commands (`rtk --version`, `rtk gain`) and verifiably broken/unavailable RTK states may bypass this rule (see `RTK.md` for details).

## 2. Cross-File Architecture Analysis with Graphify
- **Mandatory Graphify First**: Whenever `graphify-out/` exists, agents MUST query Graphify before manually tracing cross-file architecture, dependency chains, or call graphs.
- **Procedure**: Consult `.agents/skills/graphify/skill.md` for query guidelines before executing queries.

## 3. Repository Snapshots with Repomix
- **Mandatory Repomix**: When a broad, portable repository snapshot or context export is required, agents MUST use Repomix via `repomix.config.json`.
- **Anti-Pattern**: Do NOT manually concatenate files or enumerate multiple full file dumps.

## 4. Third-Party Documentation with Context7
- **Mandatory Verification**: Before writing code against any external library, SDK, framework, or CLI tool, agents MUST fetch current documentation via Context7 (`ctx7 library` → `ctx7 docs`).
- **Anti-Pattern**: Never rely on unverified training-data memory for API signatures, breaking changes, or configuration syntax.
- **Procedure**: Follow `.agents/skills/context7-cli/SKILL.md`.
