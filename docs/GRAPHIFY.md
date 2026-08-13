# Graphify Infrastructure

This repository uses Graphify as a codebase navigation and graph-maintenance layer. Source code remains authoritative; Graphify narrows discovery before agents read real files.

## Version

- Local validated Graphify version: `0.9.40`
- CI package pin: `graphifyy==0.9.40`

Do not use an unpinned Graphify install in CI. When upgrading Graphify, review the changelog, install the new local version, reinstall project integrations and hooks, regenerate or update the graph, validate the artifacts, then update the CI pin in `.github/workflows/ci.yml`.

## Agent Integrations

The canonical shared integration is `.agents/skills/graphify/SKILL.md`.

- Codex uses `AGENTS.md` plus the project-scoped official `.codex/hooks.json` adapter where supported.
- Gemini CLI uses `GEMINI.md` as a thin adapter to `AGENTS.md`.
- Google Antigravity uses `.agents/rules/graphify.md` and `.agents/workflows/graphify.md`.
- `.agents/`-compatible agents use the shared skill, rule, and workflow directly.

Keep reusable policy in `AGENTS.md` and `.agents/`. Do not duplicate large Graphify instructions across vendor-specific files.

## Maintenance

Graph maintenance is repository automation:

- Official Graphify Git hooks keep code graph artifacts synchronized on supported Git events.
- CI runs `graphify update .`, `graphify check-update .`, `pnpm graphify:check`, and then fails if `graphify-out/` differs from the committed state.
- `graphify-out/graph.json` uses Graphify's official Git merge driver through `.gitattributes`.

Reinstall hooks after every Graphify upgrade because hook scripts can contain paths to the installed Python tool environment:

```powershell
graphify hook install
graphify hook status
```

Do not put `--force`, `GRAPHIFY_FORCE=1`, `--allow-partial`, or equivalent recovery flags in hooks, CI, or normal agent workflow.

## Versioned Artifacts

The repository intentionally versions:

- `graphify-out/graph.json`
- `graphify-out/graph.html`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/manifest.json`
- `graphify-out/.graphify_root`

The repository intentionally ignores local-only cost, cache, Python interpreter, reflection, and intermediate extraction files.

## Semantic Content

Code freshness is automatic and should stay local and AST-driven when possible.

Semantic content such as Markdown, PDFs, papers, images, and media is separate. If semantic extraction requires an external model or API, do not hide that cost in hooks or CI. Detect stale semantic markers, report them, and run semantic extraction only with an approved backend and budget.

## Worktrees

Graphify should operate on the current worktree when run manually. The installed official hooks are configured in the repository Git hooks directory and are validated for this repository's primary worktree. Linked worktrees must not receive unexpected `graphify-out/` directories from the primary worktree's hook execution.

## Failure Behavior

If Graphify is missing, stale, corrupted, or contradictory, agents should warn and fall back to source-code exploration. The codebase remains the source of truth.
