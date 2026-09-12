---
name: competitive-intelligence
description: >
  Use when researching competitor features, architectural parity, object types, property schemas, daily notes, task systems, API endpoints, or ingestion workflows for notes-app development. Applies whenever comparing note-taking tools, reverse-engineering PKM features, or auditing parity against Capacities, Obsidian, Tana, Readwise, Reader, Notion, Evernote, or Apple Notes, even if specific competitor names are not explicitly mentioned.
---

# Competitive Intelligence

## Overview
Centralized competitive intelligence repository and feature parity benchmarks for major personal knowledge management (PKM) apps, built from official documentation snapshots and audited source inventories.

## When to Use
Use this skill when:
- Benchmarking features, object models, or workflows against competitor note-taking applications.
- Designing architectural parity for object types, property schemas, daily notes, task management, or graph views.
- Auditing multi-channel ingestion pipelines (Readwise, web clippers, mobile bots, email forwarding).
- Planning import/export migration pathways (from Notion, Obsidian, Tana, Capacities, Evernote, Apple Notes).
- Developing developer platform interfaces (REST API, MCP endpoints, X-Callback URLs).

## Core Premises & Principles

1. **Live External Verification for Currency & Accuracy**: Never rely on stale assumptions or static training priors. Always cross-reference external links, official documentation roots (e.g., `docs.capacities.io`, `developers.capacities.io`), and machine-readable endpoints (`llms.txt`, `llms-full.txt`, OpenAPI/REST specs) to obtain the most exact, current information.
2. **Active Web Querying & Freshness**: Whenever verifying cutting-edge features, API endpoints, or competitor updates, actively fetch the latest documentation via search or direct URL lookup to prevent design regressions caused by outdated snapshots or deprecated routes (such as 404 endpoints).
3. **Evidence-Based Source Attribution**: Every architectural parity claim, schema design, or competitive requirement must reference verified official documentation links, live endpoint schemas, or audited inventory records.

## Progressive Disclosure & Reference Reading

Read specific reference files based on the target competitor:

- **Capacities:** Read [references/capacities.md](references/capacities.md) when designing object-based content types, metadata property schemas, daily note engines, Readwise/messaging ingestion pipelines, or Capacities REST/MCP API parity.

## Gotchas & Non-Obvious Architecture Realities

- **Capacities Object Model vs. Raw Files:** Capacities stores notes as typed entities with metadata schemas rather than raw Markdown files in folder trees. Do not assume hierarchical folders exist in Capacities workspaces.
- **Capacities MCP Endpoint:** Capacities provides a native Model Context Protocol endpoint at `https://api.capacities.io/mcp` and REST API at `https://developers.capacities.io/api/overview`. The legacy `/api/reference` URL returns HTTP 404.
- **Tana Live Nodes vs. Page Documents:** Tana models everything as an outliner node with supertags; pages are virtual views of tags rather than separate file documents.
- **Obsidian File-First Boundaries:** Obsidian relies on plain Markdown files with YAML frontmatter; complex features (canvas, properties, bases) map directly back to local file system representations.

## Competitor Ecosystem Overview

| Competitor | Primary Model | Key Architectural Distinction | Default Parity Focus |
| :--- | :--- | :--- | :--- |
| **Capacities** | Object-based PKM | Typed entities, dynamic property schemas, daily notes, native MCP server. | Structured Object Types & Daily Note Engine |
| **Obsidian** | Local Markdown vault | File-system-first, community plugin ecosystem, frontmatter properties. | Markdown Storage & Plugin System |
| **Tana** | Outliner & Supertags | Live nodes, supertag taxonomy, dynamic search nodes, MCP integration. | Node Supertags & Inline Inline Queries |
| **Readwise / Reader** | Highlighting & Reading | Highlight aggregation, Ghostreader AI, multi-source ingestion. | Highlight Sync & Reader Pipeline |
| **Notion** | Block-based databases | Relational databases, formula properties, workspace sharing. | Relational Database & Block Engine |

## Competitive Parity Audit Workflow

When auditing or implementing a feature for `notes-app`:

1. **Identify Competitor Benchmark:** Determine which competitor excels at the target feature (e.g. Capacities for object types, Readwise for ingestion, Obsidian for local storage).
2. **Consult Reference Specs:** Load the relevant reference doc (e.g., [references/capacities.md](references/capacities.md)).
3. **Map Data Models:** Map competitor schema representations (properties, tokens, blocks) to `notes-app` TypeScript data models.
4. **Validate API & Interop:** Check REST, MCP, or export/import interoperability requirements.
