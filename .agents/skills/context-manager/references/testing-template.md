# TESTING.md Template

## Document Purpose

`TESTING.md` owns verification strategy: test levels, runners, file locations,
mocking/fixtures, component stories, browser verification, and test automation
status. Numeric blocking thresholds belong to `CONSTRAINTS.md`; security scans
belong to `SECURITY.md`.

## Canonical Structure

```markdown
# Testing Strategy & Guidelines

## 1. Verification Model
[Which test levels exist and what each proves.]

## 2. Toolchain
[Test runner, coverage, component workbench, mutation/E2E/browser tools actually installed.]

## 3. Commands
[Only testing/verification commands owned by this document.]

## 4. File Conventions
[Test/story locations and naming.]

## 5. Test Design
[Mocking, fixtures, determinism, behavior-over-implementation guidance.]

## 6. Automation Status
[Which of these checks actually run in CI today. Do not call local checks CI gates
unless a workflow executes them.]
```

## Governance Rules

1. State absent test levels plainly; do not fabricate integration/E2E coverage.
2. Do not copy global thresholds from `CONSTRAINTS.md`.
3. Do not copy security scanners from `SECURITY.md`.
4. Keep CI claims grounded in `.github/workflows/`.
5. Prefer behavior-focused tests and the smallest verification layer that proves the
   behavior.
