# Remote Visual Evidence Integrity

This rule applies only when the agent is operating in **remote mode**: the agent does not have direct access to the user's local machine/runtime and is working through a remote environment such as ChatGPT mobile/web, cloud execution, connectors, or repository automation.

Examples include the user traveling and using the ChatGPT mobile app while asking the agent to inspect or run the project remotely.

This rule does **not** force remote CI/browser workflows when the agent is already operating locally on the user's machine through a local CLI, IDE, desktop agent, or other environment with direct access to the project runtime.

## 1. Real execution is mandatory in remote mode

When a remote agent presents a screenshot as evidence that the application ran:

- the screenshot MUST be captured from the real application running from the intended branch or commit;
- do not generate, redraw, reconstruct, or approximate the UI with image generation, PIL, HTML mockups, design tools, or other synthetic means and present the result as a screenshot;
- a mockup or reconstruction is allowed only when the user explicitly asks for one, and it MUST be labeled clearly as a mockup rather than execution evidence.

## 2. Reach the requested state through the real application

When the requested screenshot depends on application state, reach that state through the actual product flow whenever practical.

Examples include:

- authenticate through the configured test/emulator flow;
- create, edit, or select data through the running UI or supported application API;
- navigate to the real route being verified;
- wait for the UI to settle before capture.

Do not fabricate an authenticated state, created entity, loading state, error state, or success state solely for a screenshot.

## 3. Remote fallback order

Only when direct local execution is unavailable because the agent is remote, use the narrowest real execution path available:

1. an existing preview/development environment;
2. repository CI such as GitHub Actions running the application and Playwright;
3. another repository-approved remote execution environment.

If one remote environment is blocked, try an available real execution fallback before concluding that capture is impossible.

Do not introduce GitHub Actions or another remote runner merely because it is convenient when the agent already has direct local runtime access.

## 4. Temporary remote execution changes

When CI or repository automation is introduced only to obtain visual evidence:

- run the exact target branch/commit;
- use test credentials, emulators, or non-production services;
- upload the raw screenshot as an artifact;
- preserve logs needed to establish that the app and required services actually started;
- remove temporary workflows, scripts, or commits after capture unless the user asks to keep them;
- restore the target branch to its original SHA when a temporary commit was introduced only for capture;
- verify the restored branch SHA before handoff.

Never rewrite unrelated history or disturb user work to obtain a screenshot.

## 5. Reporting

When handing off a remote-mode screenshot used as verification:

- state that it is a real capture;
- identify the branch or commit when relevant;
- state the execution environment when it materially affects the result;
- disclose any meaningful limitation, such as using Firebase Emulator instead of production.

If a real capture cannot be obtained remotely, say so plainly. Do not substitute synthetic visual evidence and imply that the application was executed successfully.
