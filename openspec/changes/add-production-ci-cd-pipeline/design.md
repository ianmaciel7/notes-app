## Context

The repository needed protected pull-request delivery controls while preserving a lean Next.js baseline. The change spans GitHub Actions, rulesets, dependency maintenance, security scanning, local verification commands, deployment configuration, and contributor documentation.

This document records the design already implemented by the completed change so the artifact set remains compatible with the current `spec-driven` schema.

## Goals / Non-Goals

**Goals:**

- Keep one stable aggregate quality signal for branch protection.
- Make local verification mirror the CI checks closely enough for useful pre-push feedback.
- Separate quality, security, dependency, and deployment responsibilities.
- Preserve protected pull-request flow for `main` and `stag`.

**Non-Goals:**

- Add deployment workflows without an authenticated platform trigger.
- Import unrelated product UI or broad agent tooling.
- Require every internal CI job as an independently protected status context.

## Decisions

### Use an aggregate Quality gate

Formatting, linting, type checking, tests, Graphify freshness, and build validation remain readable jobs, while `Quality` provides the stable required context. Requiring every job directly was rejected because skipped or renamed jobs make branch protection brittle.

### Keep security as a separate workflow

CodeQL and security checks remain visible independently from ordinary build quality. Folding security into the aggregate quality job was rejected because it obscures ownership and platform-specific availability.

### Mirror CI with repository scripts

`pnpm verify` remains the canonical local composition of quality checks. Ad hoc CI-only commands were rejected because they make failures harder to reproduce locally.

### Version governance configuration

Rulesets, CODEOWNERS, Dependabot, workflows, and deployment configuration live in the repository for review. Console-only configuration was rejected because it cannot be audited with the code that depends on it.

## Risks / Trade-offs

- **Aggregate jobs can hide the first failing check** -> Keep individual jobs named and visible in the workflow.
- **CodeQL availability can vary by repository configuration** -> Treat Security as a merge signal until platform support is confirmed.
- **Local and CI environments can drift** -> Pin the package manager and keep scripts shared between both paths.
- **Ruleset files can diverge from GitHub state** -> Review repository rules and live protection before publication changes.

## Migration Plan

The change is already implemented. Future modifications should update the versioned workflow, ruleset, documentation, and relevant specs together, then pass `pnpm verify` and protected pull-request checks.

Rollback uses a reviewed pull request that reverts the affected governance files; protected branches must not be bypassed.

## Open Questions

- When should `Security` become a required protected status context?
- Which deployment platform should own production promotion after authentication is defined?
