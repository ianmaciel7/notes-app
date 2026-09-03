---
trigger: model_decision
description: Critical rules for document ingestion, PDF rendering, Markdown reading, and non-mutating text highlighting.
---

# Reader Engine & Non-Mutating Highlighting Rules

## Critical Negative Constraint
- **NEVER mutate DOM text nodes**: Never split, wrap, or inject elements directly into text nodes to render highlights. Doing so corrupts React Virtual DOM reconciliation and breaks cursor selections.

## 1. Web & Markdown Text Highlighting
- Use the **CSS Custom Highlight API** (`CSS.highlights.set()`) with W3C Text Quote Selectors:
  ```typescript
  const highlightRange = new Range();
  highlightRange.setStart(startNode, startOffset);
  highlightRange.setEnd(endNode, endOffset);
  const customHighlight = new Highlight(highlightRange);
  CSS.highlights.set(`hl-${highlightId}`, customHighlight);
  ```
- Store exact text, prefix, and suffix in the `Highlight` entity for fuzzy anchor relocation.

## 2. PDF Rendering & Highlighting
- Render PDF canvas with `pdfjs-dist` in a Web Worker at device pixel ratio (`window.devicePixelRatio`).
- Align transparent text layer overlay with standard CSS transform scale.
- Render highlights as SVG or Canvas overlay bounding boxes positioned precisely above the transparent text layer using viewport coordinates (`viewport.convertToViewportRectangle`).

## 3. Provenance & Proven Relational Linking
- Every `Flashcard` extracted by AI must reference its source highlight ID (`sourceHighlightId`) and quote snippet to maintain strict auditability back to the original source text.
