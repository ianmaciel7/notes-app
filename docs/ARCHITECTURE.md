# Architecture

## Overview

Notes App is a Next.js repository using the App Router.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS v4
- OpenSpec

## Source layout

- `src/app` is the main application entry for routes and pages.
- `src/lib/workspace-objects.ts` owns canonical workspace entities.
- `src/lib/workspace-object-types.ts` owns runtime Structure definitions.
- `src/lib/workspace-object-views.ts` owns Object View, Data View, dashboard, template, query projection, and conversion contracts.

## Object and Data Views

Object Views render one canonical entity as inline content, a link block, a card, an embed, or a page. They never persist a second copy of the object.

Data Views persist a `QueryDefinition` plus presentation configuration for list, table, gallery, wall, or embedded layouts. Switching layouts preserves the query and therefore preserves result membership. `grid` is intentionally not a canonical persisted view kind because gallery and wall have different semantics.

`WorkspaceViewsProvider` hydrates and persists view configuration separately from entity content. Contextual graph remains a linking-derived surface and is not represented as a Data View layout.

Structure dashboards reference saved Data Views, while creation templates clone property values and allocate fresh object and nested block identities. Schema-aware conversion produces an explicit mapping plan and does not commit until every incompatible or unmapped value is resolved.
