# Architecture

## Overview

This branch currently contains a minimal Next.js App Router starter using React, TypeScript, Tailwind CSS v4, Biome, pnpm, and React Compiler.

It does not yet contain the richer workspace implementation, shadcn component set, CI setup, Firebase App Hosting configuration, tests, Graphify output, or server/data architecture from `origin/old`.

## Application Structure

- `src/app/` contains the App Router source.
- `src/app/layout.tsx` defines the root layout, Geist fonts, metadata, and document shell.
- `src/app/page.tsx` defines the current starter home page.
- `src/app/globals.css` imports Tailwind CSS and defines global styles.
- `public/` contains static assets served by Next.js.

There is no top-level `app/` directory.

## Runtime And Framework

- `next.config.ts` enables React Compiler.
- Next.js version is `16.3.0`.
- React version is `19.2.8`.
- Next.js framework APIs and file conventions should be checked against `node_modules/next/dist/docs/` before code changes because this project uses a version with breaking changes.

The current `package.json` does not define `typecheck`, `typegen`, or test scripts.

## Server Architecture

The app currently has no protected data access, database client, Firebase Admin client, auth modules, Server Actions, or internal Route Handlers.

Use native App Router patterns first:

- Server Components for server-rendered data consumption.
- Server Actions / Server Functions for UI mutations when they become needed.
- Route Handlers only for real HTTP endpoints, webhooks, non-UI responses, or external/client API boundaries.

Do not add empty `src/server`, repository, use-case, dependency-injection, or composition-root structures until the app has concrete complexity that needs them.

Repository guidance for future server work lives in `.agents/rules/nextjs-server-architecture.md`.

## Styling

Tailwind CSS v4 is available through `src/app/globals.css` and `postcss.config.mjs`.

There is no `src/components/` directory and no shadcn component registry installed in the current branch.

## Automation And Agent Context

- Repository agent instructions start in `AGENTS.md`.
- Agent roles, rules, skills, workflows, and MCP recommendations live under `.agents/`.
- OpenSpec change artifacts live under `openspec/`.

The current branch includes a code-only `graphify-out/` graph. It does not yet include `.github/`, `skills-lock.json`, Graphify check scripts, hooks, or CI automation.

## OpenSpec

OpenSpec is the source for significant proposals, architectural changes, rationale, alternatives, and trade-offs. Current active work is under `openspec/changes/`.
