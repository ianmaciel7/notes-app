## Context

Capacities-like workflows depend on users learning concepts over time. The app should contain its own reference layer and a safe feedback path from the workspace.

## Decisions

### Treat help as product surface

Help includes FAQ, UI reference, shortcuts, methodology, troubleshooting, and advanced feature explanations. It should be searchable and linked from relevant UI surfaces.

### Feedback must be actionable and private by default

Feedback payloads need category, affected surface, app version, workspace-safe diagnostics, and user text. They must not include object bodies, secrets, AI prompts, exports, or unauthorized identifiers unless the user explicitly attaches content.

### Community links are optional integrations

External community destinations such as Discord or a public feedback portal should be configurable, clearly labelled, and non-blocking.

## Risks / Trade-offs

- Feedback without triage metadata becomes noise.
- Capturing too much context can leak sensitive content.
- External community links can break or change; the app needs recoverable disconnected states.
