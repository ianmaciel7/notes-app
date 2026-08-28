## Context

Capacities documents single import, Bulk Import, export/backups, and Markdown as a reduced interchange representation. Primary references: `https://docs.capacities.io/reference/import`, `/bulk-import`, `/export`, and `https://developers.capacities.io/api/concepts/markdown`.

## Goals / Non-Goals

**Goals:** previewable safe imports, stable relation resolution, resumable bulk processing, lossless native backups, clear reduced exports.

**Non-Goals:** perfect fidelity for every third-party PKM or vendor-private archive format.

## Decisions

- Import is staged: parse → validate → map → preview → commit; preview cannot mutate canonical data.
- Versioned native JSON/manifest + media is the lossless Notes App interchange; Markdown/HTML/CSV are reduced projections.
- External ids map explicitly to newly allocated/collision-safe local ids before link resolution.
- Large jobs checkpoint/resume and enforce archive traversal/file/security limits.

## Risks / Trade-offs

- HTML/archives are untrusted: sanitization, path-traversal prevention, and executable-content rejection are mandatory.
- Ambiguous schema mapping requires user confirmation instead of guessing.

## Migration Plan

1. Define job/mapping/manifest/error schemas and security limits.
2. Move current text/Markdown conversion into staged adapters.
3. Add HTML/CSV/media/folder/archive adapters with id/link resolution.
4. Add native workspace and reduced Markdown/CSV/media exports.
5. Add round-trip, partial failure/resume, and malicious-input acceptance.

## Open Questions

None for planning.
