# CONTRIBUTING.md Template

## Document Purpose

`CONTRIBUTING.md` owns the human collaboration workflow: contributor setup,
branch/commit policy, pre-PR routing, and pull-request review expectations. It should
not become a duplicate code-style, testing, security, or agent-tool manual.

## Canonical Structure

```markdown
# Contributing Guidelines

## 1. Environment Setup
[Contributor-specific prerequisites and setup.]

## 2. Branches
[Primary branch, naming rules, history-safety rules.]

## 3. Commits
[Commit format and hook expectations.]

## 4. Pre-PR Checklist
[Small routing checklist: aggregate local gate plus extra checks required by
TESTING/SECURITY/CONSTRAINTS for the risk area.]

## 5. Pull Requests
[Scope, description, visual evidence, review expectations, merge policy.]
```

## Governance Rules

1. Link to `CONVENTIONS.md`, `TESTING.md`, `SECURITY.md`, and
   `CONSTRAINTS.md` rather than copying their detailed rules.
2. Keep contributor setup here; keep the README's setup minimal.
3. Do not embed MCP/skill/agent internals; route agent configuration through
   `AGENTS.md` and the relevant skill.
4. Keep pre-PR requirements executable and risk-based.
