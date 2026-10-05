# Rule: Keep skills-lock.json Updated

## Description
Ensure `skills-lock.json` remains synchronized and up-to-date for third-party skills installed in the project.

## Scope & Distinction
- **Third-Party Skills**: Installed via `npx skills add <source>`. Tracked in `skills-lock.json` with source provenance and integrity hashes.
- **Local Custom Skills**: Created directly in `.agents/skills/<skill-name>/`. Maintained as project source files and are not tracked in `skills-lock.json`.

## Mandatory Guidelines

1. **CLI Skill Management**:
   - Always use `npx skills` (`add`, `update`, `remove`) to install and manage third-party skills.
   - Do not manually edit keys or hashes in `skills-lock.json`.

2. **Update & Integrity**:
   - When updating or modifying third-party skills from remote repositories, run:
     ```bash
     npx skills update
     ```
   - Always include changes to `skills-lock.json` in commits and PRs.

3. **Agent Synchronization**:
   - Always run the synchronization command after modifying skills or MCP configurations:
     ```bash
     npx agents sync
     ```
   - Use verification in CI/PR checks:
     ```bash
     npx agents sync --check
     ```
