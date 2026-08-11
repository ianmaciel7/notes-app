## Context

These features govern user control, portability, resilience, and operational safety. They affect data boundaries and verification quality across the workspace.

## Decisions

### Validate before import and export

Imports should preview and validate before commit. Exports should honor permissions, embedded content options, and format-specific options.

### Preserve reconstruction metadata

Full exports need a machine-readable manifest that can reconstruct object identity, type schema versions, metadata, relationships, attachments, and collections. Human-readable formats alone are not sufficient for data sovereignty.

### Make offline state explicit

Previously loaded objects may remain readable offline, but queued mutations, conflicts, retries, and recovery choices must be visible.

### Keep observability tenant-safe

Diagnostics need correlation and operation metadata without recording object bodies, secrets, AI prompts, exports, or unauthorized identifiers.

## Risks / Trade-offs

- Offline sync can silently lose data if conflict handling is weak.
- Import/export can expose unauthorized content if authorization is not checked consistently.
- Observability can leak sensitive workspace data if logging is too broad.
- Markdown-only export can lose relationships and type schemas unless paired with a manifest.
