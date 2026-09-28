# Dependency Cruiser Architectural Rules Sync

Discovered and added two missing architectural rules from `.worktrees/old-5/dependency-cruiser.config.cjs` to `.dependency-cruiser.cjs`:

## Added Rules

1. `no-client-firebase-admin`:
   - **Severity**: error
   - **Comment**: Server-only Firebase Admin code must not be imported by client components.
   - **From**: `path: "^src"`, `pathNot: "^src/(app/api|lib/(auth|sync|storage|documents|ai))"`
   - **To**: `path: "firebase-admin"`

2. `no-app-to-tests`:
   - **Severity**: error
   - **Comment**: Production code must not import test files or Playwright specs.
   - **From**: `path: "^src"`, `pathNot: "\\.test\\.[tj]sx?$"`
   - **To**: `path: "(^tests/|\\.test\\.[tj]sx?$|\\.spec\\.[tj]sx?$)"`

## Verification Status
- `rtk pnpm run deps:check`: 0 dependency violations found across 143 modules.
- `rtk pnpm run check:fast`: 100% clean check status (formatting, types, linting, RSC boundaries, component props, dependency cruiser, vitest test suite 45/45 passed, code duplication guard, agents sync check).
