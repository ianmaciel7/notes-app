# Browser Use Rule

Use a real browser when the task depends on rendered or interactive state that source inspection and automated checks cannot prove.

- Use browser control for visual comparisons, responsive layouts, accessibility state, user flows, browser-only failures, authenticated pages, screenshots, and claims about what is visibly rendered.
- Do not use a browser when a repository file, focused test, official API, or purpose-built connector can answer the question more directly and no visual or interactive evidence is required.
- For Codex browser work, prefer the official shared [`chrome@openai-bundled`](https://chatgpt.com/plugins/share/chrome@openai-bundled) plugin declared in `../mcp-servers.json`.
- Reuse the user's connected Chrome session when authentication, existing tabs, or browser extensions matter.
- Respect an explicit browser choice from the user. Do not silently substitute another browser surface when the requested one is unavailable.
- Use the plugin-managed browser runtime; do not add or invoke a duplicate raw Chrome MCP integration for the same task.
- Compare both DOM or accessibility state and a rendered viewport when visual parity is the acceptance criterion.
- Keep software checks, OpenSpec verification, and browser evidence separate; none is a substitute for the others.
- Report browser blockers such as unavailable plugin connections, sign-in requirements, or an unreachable local server with the exact next action needed.
