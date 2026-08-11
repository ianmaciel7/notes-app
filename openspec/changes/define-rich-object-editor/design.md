## Context

The editor is where objects become usable thought surfaces. It must preserve object context while allowing structured document editing.

## Decisions

### Persist valid document structure

Editor serialization should be deterministic and schema-valid so revisions, import/export, search, and sync can reason about content safely.

### Keep metadata and body editing connected

Icon, type, collections, title, aliases, description, tags, properties, and body content should update dependent views consistently.

### Separate structure from prose visually

Metadata should appear as structured object fields near the header or contextual area, while the body remains a calm writing surface made of modular blocks.

### Presentation is a view mode, not mutation

Presentation mode changes how content is displayed; it should not alter object content unless the user explicitly edits.

## Risks / Trade-offs

- Editor behavior can become hard to test if serialization is implicit.
- Presentation mode can conflict with focus mode unless exit and context rules are explicit.
