---
trigger: always_on
description: Policy requiring user confirmation of browser profile preference (system user profile vs. isolated/clean session) before opening or interacting with the browser.
---

# Browser Profile & Launch Policy

Whenever the agent is requested to open, launch, or interact with a browser (via system browser, Chrome DevTools MCP, or automated browser testing):

1. **Profile Preference & Intent**:
   - Unless explicitly specified by the user in their prompt or previously established in the conversation, confirm whether the user wants:
     - Their **default / existing browser profile** (retaining logins, cookies, extensions, and sessions).
     - An **isolated / clean profile** (temporary guest / clean session).
   - If the user explicitly asks to open the browser or specifies a profile mode, proceed immediately without redundant confirmation.

2. **Reliable Cross-Platform Desktop Launching (Environment Independent)**:
   - To ensure compatibility across Windows, Linux, macOS, and WSL, **always launch via the dedicated project script**:
     ```bash
     # Single URL:
     python scripts/open_browser.py --url "http://localhost:3000"

     # Full Workspace (Capacities + localhost:3000 + localhost:61000 in ONE new window):
     python scripts/open_workspace.py
     # or via pnpm:
     pnpm open:workspace
     ```
   - **Multi-URL Single-Window Rule**: When multiple URLs are requested at once, always pass them in a single `open_browser.py` call (e.g. `--url "url1" --url "url2"`) or use `open_workspace.py`. This ensures all tabs open together in a single new browser window instead of scattering across separate processes.
   - **Windows Session Desktop Dispatch Rule**: On Windows, background agent subshells run in non-interactive contexts. `open_browser.py` handles this by writing a temporary batch script in `%TEMP%` and invoking `schtasks` with `/ru %USERNAME% /it` to break out directly onto the active interactive user desktop (Session 1). Do not attempt raw `schtasks` quote escaping in `/tr`.

3. **Check If App Is Already Running**:
   - Before attempting to start the development server (`pnpm dev`) or navigating a browser, always check if the application is already running and listening (e.g. `Get-NetTCPConnection -LocalPort 3000`).
   - If the server is already active, do not start redundant dev server processes; immediately open or connect to the existing running instance.

4. **Automated DevTools MCP Inspection**:
   - For background DOM inspection, accessibility trees, and synthetic headless checks, use Chrome DevTools MCP seamlessly.



