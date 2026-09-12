# ADR-0003: Automated Knowledge Graph Updates via Husky

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

## Context and Problem Statement

The repository relies on `graphify` (`graphify-out/graph.json`) to maintain a structural AST knowledge graph. Manual updates by developers lead to stale graph data over time.

## Decision Drivers

* Keep `graphify-out/graph.json` continuously synchronized after code modifications.
* Zero token cost (AST-only update).
* Non-blocking git hook workflows.

## Considered Options

1. **Husky v9 git hooks** (`post-commit`, `post-merge`, `pre-commit`, `pre-push`)
2. Manual developer execution of `graphify update .`
3. CI-only graph rebuilds

## Decision Outcome

Chosen option: **Husky v9 git hooks** because `post-commit` and `post-merge` automatically run `graphify update .` to update the AST graph locally, while `pre-commit` runs Biome staged checks and `pre-push` runs typechecking.

### Positive Consequences

* The knowledge graph is always current after developer commits and pulls.
* Code quality errors are caught before pushing code to remote branches.

### Negative Consequences

* Commits take an additional 1-2 seconds for AST extraction.
