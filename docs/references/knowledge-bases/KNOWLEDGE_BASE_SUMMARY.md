# External Product Knowledge Summary

This document is a graphable summary of the JSON snapshots in this directory.
The JSON files remain the source corpus; this summary is a navigation aid and
does not override product specifications or OpenSpec requirements.

## Corpus Coverage

| Source | Structured coverage |
| --- | --- |
| Readwise / Reader | 93 pages, 251 chunks, 27 features, 20 entities, 12 workflows |
| Capacities | 148 pages, 214 chunks, 27 features, 18 entities, 12 workflows |
| Obsidian Help | 41 topics, 14 entities, 3 workflows |

## Shared Concepts

- Knowledge is captured as notes, documents, highlights, blocks, or other
  content records and later organized with tags, properties, and links.
- Search, backlinks, related content, filtered views, and graph views support
  navigation across connected content.
- Templates, daily notes, recurring review, and reusable workflows reduce the
  cost of repeated capture and study.
- Import, export, synchronization, offline behavior, backup, and recovery are
  operational concerns distinct from the content model.
- APIs, CLI tools, MCP servers, webhooks, plugins, and integrations are
  extension boundaries, not core content types.

## Readwise / Reader

Key concepts include highlights, documents, notes, tags, libraries, feeds,
filtered views, Daily Review, Mastery cards, themed reviews, annotations,
Ghostreader, browser capture, import/export, MCP, CLI, APIs, and webhooks.
Representative workflows include saving web content, reviewing highlights,
creating study cards, exporting highlights, and connecting an AI client.

## Capacities

Key concepts include spaces, objects, object types, properties, blocks, tags,
collections, queries, daily notes, tasks, templates, media, imports,
exports/backups, synchronization, offline work, API access, and MCP.
Representative workflows include creating an object, defining a custom object
type, linking a network of notes, building a query, importing content, and
connecting an MCP-capable client.

## Obsidian

Key concepts include vaults, Markdown notes, files and folders, properties,
tags, internal links, backlinks, outgoing links, attachments, templates,
daily notes, canvas, bases, search, graph view, sync, publish, and plugins.
Representative workflows include creating a vault, linking notes, and using
daily notes with templates.

## Product Boundary

These sources support a generic, object-centric foundation, but they do not
make vendor-specific features application requirements. The application should
keep generic object records, configurable types, properties, tags, and stable
relations as the foundation. Vendor-specific behavior belongs in references,
adapters, or explicitly approved OpenSpec changes.

## Evidence

- Readwise: `readwise.json`
- Capacities: `capacities.json`
- Obsidian: `obsidian.json`
