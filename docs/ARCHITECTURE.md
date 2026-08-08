# Architecture

## Overview

This is a Next.js App Router application with React, TypeScript, Tailwind CSS v4, Biome, pnpm, and Firebase App Hosting configuration.

## Application Structure

- `src/app/` contains the App Router source.
- `src/app/layout.tsx` defines the root layout, fonts, metadata, and global document shell.
- `src/app/page.tsx` defines the current home page.
- `src/app/globals.css` imports Tailwind CSS and defines global theme tokens.
- `public/` contains static assets served by Next.js.

There is no top-level `app/` directory.

## Runtime And Framework

- `next.config.ts` enables React Compiler.
- Next.js types are generated with `pnpm exec next typegen`.
- Next.js framework APIs and file conventions should be checked against `node_modules/next/dist/docs/` before code changes because this project uses a version with breaking changes.

## Styling

Tailwind CSS v4 is configured through `src/app/globals.css` and `@theme inline` tokens. Global color and font tokens are defined there.

## Hosting

Firebase App Hosting configuration lives in:

- `apphosting.yaml` for production.
- `apphosting.staging.yaml` for staging.

Deployment details belong in `docs/DEPLOYMENT.md`.

## Automation And Agent Context

- GitHub Actions CI is defined in `.github/workflows/ci.yml`.
- Repository agent instructions start in `AGENTS.md`.
- Agent roles live in `.agents/agents/`.
- Agent workflows live in `.agents/workflows/`.
- Installed or recommended agent skills live in `.agents/skills/` and `skills-lock.json`.
- MCP server recommendations live in `.agents/mcp-servers.json`.

## OpenSpec

OpenSpec is the source for significant proposals, architectural changes, rationale, alternatives, and trade-offs. Current accepted architecture belongs here, not in OpenSpec proposals.
