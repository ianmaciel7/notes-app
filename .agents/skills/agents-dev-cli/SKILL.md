---
name: agents-dev-cli
description: Manage multi-agent project configuration with the @agents-dev/cli `agents` command. Use when configuring or synchronizing MCP servers, skills, integrations, profiles, or Agent Plugin packages across coding tools.
metadata:
  short-description: Manage shared agents CLI configuration
---

# agents-dev CLI

Use the `agents` CLI from `@agents-dev/cli` to keep one project-level source of truth in `.agents/` and materialize tool-specific configuration for supported coding assistants.

## Operating model

- Treat `.agents/agents.json` and `.agents/skills/` as the shared, reviewable source of truth.
- Treat `.agents/local.json` as local, gitignored secret and override storage; never place API keys or tokens in committed configuration.
- Generated files are outputs of `agents sync`. Inspect their status before editing them directly.
- `AGENTS.md` remains the human-readable instruction file; this CLI manages machine-readable MCP, skill, and integration configuration.
- Check the repository's `syncMode` before deciding whether generated files belong in version control.

## Workflow

1. Check availability and current syntax with `agents --help` and the relevant subcommand's `--help`.
2. Inspect state with `agents status`, `agents mcp list`, `agents skills list`, or `agents doctor` before mutating configuration.
3. Use `agents start` for interactive onboarding, or `agents init` for non-interactive scaffolding.
4. Use `agents mcp add|import|remove`, `agents connect|disconnect`, and `agents profile ...` for focused changes.
5. Run `agents sync` after source changes. Use `agents sync --check` for a read-only drift check and CI gate; exit code `2` means drift.
6. Use `agents doctor` to diagnose; use `agents doctor --fix` only when the requested task authorizes repairs.

## Useful commands

```text
agents start
agents init
agents sync [--check] [--profile <name>]
agents status
agents doctor [--fix]
agents mcp add <name|url>
agents mcp import --file <config.json>
agents mcp list|remove <name>|test [--runtime]|budget
agents profile list|set|use|remove
agents skills list
agents connect --llm <ids>
agents disconnect --llm <ids>
agents plugin export --name <name>
agents plugin validate <dir>
agents plugin import <dir>
```

Use `--global` only when the user explicitly wants machine-wide configuration. Do not run `agents reset --hard`, remove servers, or overwrite generated configuration without confirming the intended scope when it is not explicit.

For current command details and supported integrations, consult the package README and repository documentation: https://www.npmjs.com/package/@agents-dev/cli and https://github.com/amtiYo/agents.
