## Context

Capacities documents web/mobile capture, integrations, Readwise, task actions, and X-Callback URLs. Primary references: `https://docs.capacities.io/reference/integrations`, `/web-extension`, `/integrations/readwise`, `/task-actions`, and `https://docs.capacities.io/developer/x-callback-urls`.

Provider-specific private implementations are not in the archive; Notes App uses adapter contracts and its own canonical services.

## Goals / Non-Goals

**Goals:** one Space-scoped connection model, secure secrets, normalized capture envelope, idempotent external items, phased provider adapters, outbound task actions.

**Non-Goals:** every community integration, calendar provider behavior, or wholesale mirroring of third-party data models.

## Decisions

- Provider payloads normalize to CaptureEnvelope before canonical creation/import.
- Stable provider/account/externalItem ids prevent duplicate retries/sync imports.
- Integration records contain secret references, never raw credentials in content/export/search/logs.
- Task actions are outbound links/results and do not replace native Task identity.

## Risks / Trade-offs

- Provider retries/webhooks require idempotency.
- Untrusted capture content needs sanitization/rate limits/sender authentication where relevant.

## Migration Plan

1. Define connection/capability/secret/capture/external-mapping/job/audit contracts.
2. Add deep-link/share/web-extension-style capture through canonical services.
3. Add messaging/email and reading/highlight adapters incrementally.
4. Add outbound task-action adapter(s), settings/status/retry/disconnect, and security tests.

## Open Questions

Specific provider order can be chosen during apply without changing the shared contract.
