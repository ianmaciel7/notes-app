# Rule: Path Portability and Repository Links

## Description
Enforce strict path portability across all operating systems, user environments, machines, and CI/CD runners. Never persist machine-dependent or user-dependent absolute paths into repository artifacts.

## Mandatory Guidelines

1. **Strictly Forbid Hardcoded Machine Paths**:
   - Never write hardcoded user paths or machine paths (e.g., `C:\Users\...`, `/home/...`, or `file:///C:/Users/...`) into repository source code, documentation, configuration files, agent prompts, rules, or commits.

2. **Always Use Relative Repository Paths**:
   - In all persisted repository files, use relative paths relative to workspace root (e.g., `src/app/page.tsx`, `AGENTS.md`, `./docs/adr/0001-bootstrap-next-app.md`).
   - Use standard forward slashes (`/`) as path separators in documentation and configuration files for cross-platform portability.

3. **Dynamic Links in Interactive Chat Output Only**:
   - Absolute paths and clickable `file:///` URLs are strictly limited to runtime interactive chat output shown directly to the user.
   - Never commit or serialize runtime chat links into markdown or code files.
