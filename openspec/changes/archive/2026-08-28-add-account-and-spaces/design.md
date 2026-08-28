## Context

Capacities organizes independent Spaces. Each Space has its own object types/Structures, tags, collections, organizational state, content/search context, and developer connection scope. Notes App therefore treats Space as a hard domain boundary, not a navigation preference.

## Goals / Non-Goals

**Goals:** hard Space isolation across every durable/derived subsystem, active-space lifecycle, provider-neutral session/auth boundary, and explicit offline cached-session rules.

**Non-Goals:** collaboration/teamspaces/comments/enterprise ACLs or a prematurely chosen auth SaaS.

## Decisions

- SpaceId scopes entities, Structures, property definitions/values, tags, collections, links/relations, blocks, queries/views, search indexes, tasks/dates, assets/media, operations, sync cursors/conflicts, and all repository lookups.
- Derived indexes must be either physically partitioned or keyed by SpaceId and must never return cross-Space results.
- Auth/session is separate from workspace content and secrets never live with objects.
- Previously authorized local content may remain available offline under explicit device/session policy; remote actions require valid auth.
- Space deletion and local-cache removal are distinct destructive operations.

## Risks / Trade-offs

- Cross-Space leakage is a critical bug class -> negative isolation tests at repository, index, query/search, relation, media, and sync levels.
- Sign-out must not silently destroy local data.

## Migration Plan

1. Define AccountId/UserSession/SpaceId/Space and active-space service.
2. Partition every durable and derived repository/index and migrate the current workspace into one default Space without changing object ids.
3. Add session/auth adapter contracts and deterministic local test adapter.
4. Add Space switch/create/rename/delete UI and exhaustive isolation acceptance.

## Open Questions

Production identity provider remains an implementation decision behind the adapter contract.
