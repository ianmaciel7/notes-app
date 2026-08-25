# Graphify

## Purpose

Graphify is the repository's primary codebase and architecture navigation layer for agents and contributors.

## Setup and usage

1. Install Graphify CLI (`graphify` command).
2. In this project, run:
   - `pnpm run graphify:install` (recommended; includes fallback install attempts and config)
   - `pnpm run graphify:build`
   - `pnpm run graphify:status`
3. If installation fails, try the CLI install directly:
   - `python -m pip install graphifyy`
   - `graphify install --platform codex --project`
   - `graphify install --platform codex`
4. Windows + uv cache issues:
   - `UV_CACHE_DIR=%CD%\.uv-cache UV_TOOL_DIR=%CD%\.uv-tools uv tool install graphifyy`
5. Generate or refresh the knowledge graph as needed using:
   - `graphify build`
   - `graphify update .`
   - `pnpm run graphify:update:code`
   - `graphify status`
6. Use in sessions:
   - `graphify query ...`
   - `graphify explain ...`
   - `graphify path ...`

## Freshness

- `graphify-out/GRAPH_REPORT.md` records the source commit used to build the committed graph.
- Compare that commit with `git rev-parse HEAD` before relying on the graph for code that may have changed.
- If the commits differ, refresh the graph or verify the affected area directly in source before changing behavior.
- The current CI workflow does not refresh Graphify automatically, so do not assume a committed graph is current merely because CI passed.
- Prefer `graphify update .` or `pnpm run graphify:update:code` when an incremental refresh is sufficient; avoid full rebuilds without a reason.

## Runtime policy in this repository

- Prefer Graphify before broad file search.
- Keep `.gitignore` excluding generated graph artifacts unless explicitly committed by workflow.
- Use raw source search only when exact symbol lookup, stale graph evidence, failures, or verification is required.
- Read `graphify-out/GRAPH_REPORT.md` when broad architectural context is needed, after checking its recorded source commit.

## Install references

- https://github.com/Graphify-Labs/graphify
