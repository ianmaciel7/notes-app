# Eliminate Dead Code with Knip

We needed continuous static analysis to prevent dead code and unused dependencies from accumulating across the repository. We adopted Knip configured via `knip.json` to automatically detect unused files, exported symbols, and dependencies in CI and pre-commit checks.
