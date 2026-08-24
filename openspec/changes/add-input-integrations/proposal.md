## Why

Capture/reading/task integrations should be thin provider adapters feeding the same canonical URL/text/media/Daily Note/import/task services, not provider-specific write paths that duplicate validation or identities.

## What Changes

- Add Space-scoped IntegrationConnection records with secure credential references, capabilities, configuration, status, and audit metadata.
- Add a normalized capture envelope and idempotent external-item mappings for web/mobile/deep-link, messaging/email, and reading/highlight sources.
- Add outbound task-action adapters that preserve native Task identity.

## Capabilities

### New Capabilities

- `domain/input-integrations`: Secure provider connections, normalized capture/import adapters, external-id idempotency, and outbound task actions.

### Modified Capabilities

- None.

## Impact

- Priority: **P10**.
- Depends on Spaces, sync, public services/API, media, Daily Notes, and native tasks.
- Calendar providers remain a dedicated `add-calendar-integrations` change.
