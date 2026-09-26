# Path Portability & Environment Guidelines

These rules ensure that the repository remains strictly portable across different operating systems, developer machines, and CI/CD environments.

## 1. Strict Path Portability
- **No Hardcoded Absolute Paths**: Never hardcode user-specific, machine-specific, or absolute filesystem paths (such as `C:\Users\...`, `/home/...`, or `file:///C:/Users/...`) inside repository files, documentation, agent prompts, configuration, or code.
- **Enforce Portable Relative Paths**: Always use repository-relative or workspace-relative paths (e.g., `AGENTS.md`, `./ARCHITECTURE.md`, `src/app/page.tsx`) in all committed or workspace files.
- **Dynamic Runtime Links Only**: Absolute paths and `file:///` URLs are only permissible when rendering runtime links directly in chat conversation outputs to the user, never persisted into repository artifacts or files.

## 2. Environment & Shell Conventions
- **Machine Environment**: On machine `ianma`, use native Windows / PowerShell paths and commands by default. Do not assume WSL2 is available unless verified.
- **Cross-Platform Compatibility**: Path separators in configuration files and scripts should use portable forward slashes (`/`) whenever possible.
