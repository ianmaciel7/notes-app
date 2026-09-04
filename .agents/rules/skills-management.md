# Agent Skills Discovery & Installation Policy

## 1. CLI-First Discovery & Installation
- Whenever a task or user request calls for a new skill, specialized agent capability, or tool integration:
  - **Always prioritize discovery and installation via the CLI**: Search using `npx skills find <query>` and install via `npx skills add <package>` (or the appropriate official CLI/registry).
  - Do not manually scaffold or author new skill files when an established CLI package exists.

## 2. Explicit User Consent for Custom Skill Creation
- If no existing skill is found in the ecosystem or cannot be installed via CLI:
  - **Never create a custom `SKILL.md` automatically without prior user consent**.
  - Always notify the user that no existing skill was found in the official registry/CLI and ask whether they would like you to author a custom local skill for the task.
