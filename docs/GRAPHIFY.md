# Graphify

## Purpose

Graphify is the repository's primary codebase and architecture navigation layer for agents and contributors.

## Setup and usage

1. Install Graphify CLI (`graphify` command).
2. In this project, run:
   - `graphify install --platform codex --project`
   - `graphify install --platform codex`
3. Generate or refresh the knowledge graph as needed using:
   - `graphify build`
   - `graphify status`
4. Use in sessions:
   - `graphify query ...`
   - `graphify explain ...`
   - `graphify path ...`

## Runtime policy in this repository

- Prefer Graphify before broad file search.
- Keep `.gitignore` excluding generated graph artifacts unless explicitly committed by workflow.
- Use raw source search only when exact symbol lookup, stale graph evidence, failures, or verification is required.
- Read `graphify-out/GRAPH_REPORT.md` when broad architectural context is needed.

## Install references

- https://github.com/Graphify-Labs/graphify
