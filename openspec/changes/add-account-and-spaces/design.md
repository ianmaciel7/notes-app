## Context

Capacities organizes independent Spaces and scopes developer connections to a selected Space. Its current product remains primarily personal; broad collaborative editing is not a supported parity requirement. Primary references: `https://docs.capacities.io/reference/spaces`, `https://docs.capacities.io/reference/account`, and `https://developers.capacities.io/api/overview/authentication`.

## Goals / Non-Goals

**Goals:** hard Space isolation, active-space lifecycle, provider-neutral session/auth boundary, explicit offline cached-session rules.

**Non-Goals:** collaboration/teamspaces/comments/enterprise ACLs or a prematurely chosen auth SaaS.

## Decisions

- SpaceId scopes every durable workspace aggregate and repository lookup.
- Auth/session is adapter-driven and secrets are never stored with object content.
- Previously authorized local content may be available offline under an explicit device/session policy; remote actions require valid remote auth once implemented.
- Space deletion and local-cache removal are distinct destructive operations with explicit confirmation.

## Risks / Trade-offs

- Cross-Space leakage is a critical bug class and needs negative isolation tests.
- Sign-out must not silently destroy local data or masquerade as account deletion.

## Migration Plan

1. Define AccountId/UserSession/SpaceId/Space and active-space service.
2. Partition repositories and migrate the existing workspace into one default Space without changing object ids.
3. Add session/auth adapter contracts and deterministic local test adapter.
4. Add Space switch/create/rename/delete UI and isolation acceptance.

## Open Questions

Production identity provider remains an apply/deployment decision behind the adapter contract.
