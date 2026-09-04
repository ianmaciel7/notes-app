---
trigger: always_on
description: Rule requiring confirmation of browser profile preference (specific Chrome user profile vs. isolated/clean session) whenever opening or interacting with the browser.
---

# Browser Profile Preference Rule

Whenever the agent is requested to open, launch, or interact with a browser (via Chrome DevTools MCP, system browser, or automated browser testing):

1. **Ask Profile Preference**: If not explicitly specified by the user in the prompt, prompt or confirm with the user whether to:
   - Use a **specific Chrome user profile** (retaining existing logins, cookies, extensions, and sessions).
   - Use an **isolated / clean profile** (temporary guest / clean DevTools MCP session).

2. **Honor Explicit Directives**: If the user explicitly mentions a profile name, directory, or clean mode in their request, immediately proceed with the specified option without extra confirmation.
