---
name: browser-launcher
description: Use when launching, opening, or testing web applications in desktop browsers across platforms (Windows, Linux, macOS, WSL) to guarantee browser windows appear on the active user display.
---

# Browser Launcher

## Overview
Cross-platform browser launcher that guarantees GUI windows open on the active user monitor across Windows (handling session isolation / Session 1 dispatch via `schtasks /it`), Linux / WSL (`xdg-open` / `wslview`), and macOS (`open`).

## When to Use
- User asks to open, launch, view, or test an application URL in their desktop browser.
- Cross-platform development environments where commands need to work identically on Windows, Linux, macOS, and WSL.
- When background worker processes or remote agent shells fail to bring browser windows to the foreground on the active monitor.

When NOT to use:
- Synthetic headless DOM inspection via Chrome DevTools MCP.

## Quick Reference

Open default / auto-detected browser:
```bash
python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000"
```

Target specific browser:
```bash
# Chrome
python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000" --browser chrome

# Brave
python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000" --browser brave
```

## How It Works
- **Windows**: Detects installed browser binaries (Brave, Chrome, Edge, Firefox) and dispatches to the interactive console session (Session 1) using an ephemeral `schtasks /it` task to overcome session isolation.
- **Linux / WSL**: Detects `wslview` in WSL environments or `xdg-open` / browser binaries in native Linux desktop sessions.
- **macOS**: Dispatches via `open -a` to the specified or default browser app.
