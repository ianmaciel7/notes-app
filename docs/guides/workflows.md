# Agent Workflows Guide

A simple, direct overview of the engineering skill workflows configured for this repository.

---

## 1. Main Flow: Idea to Ship (`Idea → Code`)

Use this route when you have a new feature idea or task to build from scratch:

```
[1. /grill-with-docs] ──> [2. /to-spec] ──> [3. /to-tickets] ──> [4. /implement] ──> [5. /code-review] ──> [6. /pr] ──> [7. /retro]
```

1. **/grill-with-docs**: Interview session to sharpen requirements; persists terms into `GLOSSARY.md` and ADRs.
2. **/to-spec**: Converts the discussion into a structured specification document.
3. **/to-tickets**: Splits the specification into actionable GitHub Issues with blocker dependencies.
4. **/implement**: Executes the ticket using Test-Driven Development (**/tdd**).
5. **/code-review**: Two-axis review (Standards + Spec) of the diff before merging.
6. **/pr**: Formats a pull request with visual evidence and context.
7. **/retro**: Reviews the session to suggest improvements to agent rules and workspace checks.

---

## 2. Bug Fixing Flow (`Diagnosis → Fix`)

Use when encountering a hard bug, intermittent flake, or unexpected behavior:

```
[1. /diagnosing-bugs] ──> [2. /tdd] ──> [3. /retro]
```

1. **/diagnosing-bugs**: Establishes a tight feedback loop (a single failing command) before attempting a fix.
2. **/tdd**: Implements the fix alongside a regression test.
3. **/retro**: Identifies preventative measures or architectural improvements.

---

## 3. Triage Flow (`Raw Issues & Requests`)

Use for incoming raw feature requests or bug reports:

```
[1. /triage] ──> [2. /implement]
```

1. **/triage**: Categorizes raw issues into canonical roles (`needs-info`, `ready-for-agent`, etc.).
2. **/implement**: Picks up `ready-for-agent` tickets to implement.

---

## 4. Large / Foggy Efforts Flow (`Wayfinder`)

Use for massive features or greenfield projects that are too large for a single session:

```
[1. /wayfinder] ──> [2. /to-spec] ──> [3. /to-tickets] ──> [4. /implement-spec]
```

1. **/wayfinder**: Maps decision tickets on the issue tracker, resolving architectural fog one step at a time.
2. **/to-spec & /to-tickets**: Collapses resolved decisions into buildable specs and task graphs.
3. **/implement-spec**: Drives parallel implementers across ready tickets on an integration branch.

---

## 5. Codebase Health & Upkeep

Use during downtime to keep the codebase clean and maintainable:

* **/improve-codebase-architecture**: Identifies deepening opportunities and modular refactors.
* **/domain-modeling**: Sharpens and resolves domain terms and ADRs.
* **/prototype**: Builds throwaway code to quickly validate state models or UI concepts.
