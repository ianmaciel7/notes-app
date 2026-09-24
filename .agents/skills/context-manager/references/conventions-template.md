# CONVENTIONS.md Template

## Document Purpose

`CONVENTIONS.md` owns **how code is written**: naming, file/API shape, framework
patterns, composition, formatting/lint ownership, implementation performance rules,
and code smells.

It does not own test strategy, quality thresholds, Git/PR workflow, or design-token
values.

## Canonical Structure

```markdown
# Coding Conventions & Standards

## 1. Tool-Owned Conventions
[Which formatter/linter/type/architecture tools own code-shape behavior; avoid a full
task-end command matrix.]

## 2. Naming & File Shape
[Files, components, functions, types, exports.]

## 3. Component / Module Composition
[Composition rules, boundaries, public API conventions.]

## 4. Framework-Specific Rules
[Only rules grounded in the installed framework/library.]

## 5. Styling / Data / Runtime Rules
[Implementation conventions whose owner is code, not visual product design.]

## 6. Performance-Sensitive Code
[Implementation-level performance patterns.]

## 7. Anti-Patterns
[Repository-specific code smells and forbidden shortcuts.]
```

## Governance Rules

1. Prefer tool/config ownership over manually duplicated formatter/import rules.
2. Keep commands/checklists in `TESTING.md`, `CONSTRAINTS.md`, or
   `CONTRIBUTING.md` as appropriate.
3. Reference `DESIGN.md` for visual-token semantics rather than copying token values.
4. Do not document speculative framework patterns that the repository does not use.
