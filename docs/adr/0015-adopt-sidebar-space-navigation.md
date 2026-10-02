# 0015. Adopt Sidebar Space Navigation

- **Status:** Accepted
- **Date:** 2026-10-01
- **Canonical Owner:** `ARCHITECTURE.md`

## Context and Problem Statement

The `[spaceId]` route previously presented the Space selector as a centered
control. As the route gains authenticated-user actions and more Space-level
navigation, that layout does not provide a stable navigation surface. The
application already provides a shadcn/Base UI sidebar primitive and the product
design system defines a compact navigation language.

## Decision Outcome

Keep the existing `/${spaceId}` route contract and move Space navigation into a
sidebar shell:

1. `SpaceShell` owns orchestration while composing the native `SidebarProvider`,
   `Sidebar`, `SidebarHeader`, `SidebarFooter`, and `SidebarInset` primitives;
   the route page keeps its server-rendered content as children.
2. The sidebar remains visible and non-collapsible on the Space route. It lists
   the authenticated user's real Spaces from Firestore and
   navigates with App Router client navigation.
3. Space creation, loading, error, offline, empty, and missing-Space states remain
   part of the existing switcher flow.
4. The footer exposes the authenticated user's identity and sign out through a
   compact horizontal control row. Separate settings and theme controls use the
   existing locale-sync and `next-themes` integrations.
5. Visual anatomy belongs to `DESIGN.md`; this ADR records only the durable
   navigation boundary and its integration responsibilities.

## Alternatives Considered

- Keep the centered selector: rejected because it does not scale to Space-level
  navigation or authenticated-user controls.
- Add a new global layout route: rejected because it would broaden the route
  structure and risk changing the existing `/${spaceId}` contract.
- Persist theme and language in a new Firestore preferences document: rejected
  for now because existing client/Firebase integrations already own those
  preferences.

## Consequences

Positive consequences:

- Space switching is consistently available from the primary navigation surface.
- The route URL and existing Firestore Space model remain unchanged.
- User profile mutation is performed through the authenticated Firebase user.

Trade-offs:

- The Space switcher becomes a larger client boundary because it owns menu and
  dialog interactions.
- Future Space-level navigation items must preserve the sidebar anatomy in
  `DESIGN.md` and the shared UI primitives.
