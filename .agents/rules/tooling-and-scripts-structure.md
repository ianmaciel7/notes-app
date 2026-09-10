---
trigger: always_on
description: Policy enforcing strict separation between application runtime code (src/) and CLI/automation tooling (scripts/).
---

# Tooling & Scripts Directory Structure Policy

1. **`src/` Directory Isolation**:
   - `src/` is reserved **exclusively** for web application runtime code (Next.js App Router pages, React components, API routes, custom hooks, and domain libraries).
   - Never place CLI automation scripts, browser launch helpers, git hooks, or standalone developer tooling inside `src/` or `src/tooling/`.

2. **`scripts/` Directory Standardization**:
   - `scripts/` is the sole top-level directory for all developer tooling, CLI scripts, code quality checkers, and automation helpers.
   - Standard subfolder structure under `scripts/`:
     - `scripts/dev/` - Developer automation (e.g. `open_browser.py`, browser launcher scripts)
     - `scripts/quality/` - Code quality checkers, metrics, Biome runners, and complexity analyzers
     - `scripts/tooling/` - Executable TypeScript/Node tooling modules and quality policy helpers

3. **No Cross-Boundary Imports**:
   - Application code inside `src/` must never import files from `scripts/`.
