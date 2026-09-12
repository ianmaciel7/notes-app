# ADR-0004: Strict Path & Configuration Portability Rule

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

## Context and Problem Statement

Configuration files such as `.codex/hooks.json` previously contained hardcoded absolute user paths (e.g., `C:/Users/<username>/...`), breaking cross-machine portability and CI environments.

## Decision Drivers

* Repository must build and run seamlessly across different developer environments (Windows, macOS, Linux, CI).
* No user-specific system paths in committed configurations.

## Considered Options

1. **Relative paths & portable command names** in all configuration files + explicit agent rule enforcement in `AGENTS.md` & `.agents/rules/portable-paths.md`.
2. Absolute path resolution scripts.

## Decision Outcome

Chosen option: **Relative paths & portable command names** (e.g., `graphify hook-check`) because it ensures 100% portability across all operating systems and user setups.

### Positive Consequences

* Configuration files can be committed safely without user environment conflicts.
* Enforced across AI agents via `.agents/rules/portable-paths.md`.

### Negative Consequences

* CLI commands must be present in the user's environment `PATH` or invoked relatively.
