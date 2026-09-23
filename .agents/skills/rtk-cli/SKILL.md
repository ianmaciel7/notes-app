---
name: rtk-cli
description: Configure, verify, and troubleshoot RTK (Rust Token Killer) for Codex CLI projects. Use when a project needs RTK command rewriting, RTK.md/AGENTS.md integration, Windows PATH setup, or token-savings verification.
metadata:
  short-description: Configure official RTK support for Codex
---

# RTK for Codex CLI

Use the official RTK integration from `rtk-ai/rtk`. RTK is a CLI proxy that
reduces command-output noise; it is not a replacement for the project's normal
shell commands.

## Configure

For the current project, run:

```text
rtk init --codex
```

This installs the project-scoped RTK awareness/configuration expected by Codex,
including `RTK.md` and an `@RTK.md` reference in `AGENTS.md`. For user-global
Codex configuration, use:

```text
rtk init --global --codex
```

Do not edit generated RTK integration files by hand unless the official command
cannot express the needed configuration. Preserve existing project instructions
and inspect `AGENTS.md`/`RTK.md` before initialization.

## Verify

Run:

```text
rtk --version
rtk gain
```

`rtk gain` should show the token-savings dashboard. If it is an unknown command,
check for the unrelated Rust Type Kit project also named `rtk` and inspect the
resolved executable with the platform's PATH command.

On native Windows, ensure the verified `rtk.exe` directory is on `PATH` before
initializing. If the WinGet launcher is broken, use the official release binary
from a stable user bin directory and verify `rtk --version` in a new terminal.

Restart Codex after changing its integration. Respect Codex's normal approval
and sandbox checks for rewritten commands.

## Official references

- [Supported agents and Codex setup](https://github.com/rtk-ai/rtk/blob/develop/docs/guide/getting-started/supported-agents.md)
- [RTK installation](https://github.com/rtk-ai/rtk/blob/develop/INSTALL.md)
- [RTK troubleshooting](https://github.com/rtk-ai/rtk/blob/develop/docs/guide/resources/troubleshooting.md)
