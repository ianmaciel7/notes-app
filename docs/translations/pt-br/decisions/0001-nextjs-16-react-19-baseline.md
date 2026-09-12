# ADR-0001: Next.js 16 + React 19 App Router Baseline

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-11

## Context and Problem Statement

`notes-app` requires a modern, performant, local-first full-stack web framework capable of handling rich note editing, graph visualization, document reading, and server-side API proxying (AI gateways, parsing).

## Decision Drivers

* Support for React 19 Server Components and App Router navigation.
* First-class TypeScript integration and Tailwind CSS v4 styling support.
* Fast build times and Turbopack support.

## Considered Options

1. **Next.js 16 (App Router)** + React 19 + Tailwind CSS v4
2. Vite + React 19 SPA with separate Node.js backend
3. Next.js Pages Router (legacy)

## Decision Outcome

Chosen option: **Next.js 16 (App Router)** because it provides full-stack Route Handlers for AI/parsing gateways, Server Components for high-performance rendering, and seamless compatibility with Tailwind CSS v4.

### Positive Consequences

* Clean separation between client components (Dexie offline database) and server handlers.
* First-class route generation and Turbopack build speed.

### Negative Consequences

* React 19 breaking changes require careful type validation in layout props.
