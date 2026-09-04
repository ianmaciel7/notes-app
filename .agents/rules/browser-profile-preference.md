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
   - To ensure compatibility across Windows, Linux, macOS, and WSL, **always launch via the dedicated Python skill script**:
     ```bash
     python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000"
     ```
   - For specific browsers:
     ```bash
     python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000" --browser chrome
     # or for Brave:
     python .agents/skills/browser-launcher/scripts/open_browser.py --url "http://localhost:3000" --browser brave
     ```




3. **Check If App Is Already Running**:
   - Before attempting to start the development server (`pnpm dev`) or navigating a browser, always check if the application is already running and listening (e.g. `Get-NetTCPConnection -LocalPort 3000`).
   - If the server is already active, do not start redundant dev server processes; immediately open or connect to the existing running instance.

4. **Automated DevTools MCP Inspection**:
   - For background DOM inspection, accessibility trees, and synthetic headless checks, use Chrome DevTools MCP seamlessly.



