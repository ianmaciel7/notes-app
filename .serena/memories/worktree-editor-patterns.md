# Worktree Editor Patterns & Invariants (Scouted from .worktrees/old-4 & old-6)

1. **Schema v3 Domain Model**:
   - `BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION = 3` with recursive node schemas (`BlockEditorNode`, `BlockEditorDocument`).
   - Standardized block IDs (`block:<UUID>`) and max nesting depth bounding (`MAX_BLOCK_DOCUMENT_DEPTH = 8`).
   - Framework-agnostic AST decoupling persistence from rendering engine (TipTap / ProseMirror vs Plate / Slate).

2. **Trigger Arbitration Priority**:
   - Multi-char triggers take precedence over single-char:
     - `[[` (object-reference, priority 40)
     - `((` (block-reference / transclusion, priority 40)
     - `/` (slash-command, priority 20)
     - `+` (plus-quick-action, priority 20)
     - `#` (tag-reference, priority 20)
     - `@` (object-reference, priority 20)

3. **React 19 Concurrent Portal Teardown**:
   - Suggestion/slash menu portals must use deferred teardown (`scheduleSlashMenuRootUnmount` via setTimeout/scheduler) instead of synchronous `root.unmount()` inside TipTap destroy callbacks to eliminate React 19 concurrent render race conditions.

4. **Markdown Round-Trip Serialization**:
   - Bi-directional Markdown conversion (`blockEditorDocumentFromMarkdown` / `blockEditorDocumentToMarkdown`) with lossiness detection (`documentHasAdvancedMarkdownLossiness`).