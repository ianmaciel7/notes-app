---
trigger: glob
globs:
  - "src/**/*.tsx"
  - "src/**/*.ts"
description: >-
  Keystroke latency, debounced persistence to IndexedDB/Dexie, IME composition handling, and state optimization.
---

# Input Performance & Editor Latency Rule

Text entry in inputs, textareas, and editors must keep the keystroke path local and synchronous.

## 1. Required Practices

- Text that directly controls an editor, input, or textarea must update local component state immediately.
- **Do not dispatch app-wide context updates or IndexedDB/Dexie writes on every keystroke.**
- Persist text through a buffered commit with an idle debounce (300ms–500ms) and an immediate flush on blur, submit, navigation, or unmount.
- Handle composition events (`compositionstart`, `compositionend`) so IME, accents, and dead-key inputs are not committed mid-composition.
- Use `useDeferredValue` for search text or filter terms that drive expensive list filtering, sorting, or relational queries.
- Use `startTransition` only for non-input derived updates; do not wrap the state value controlling the text field in a transition.

## 2. Review Checklist

- Typing in card titles, notes, or search bars does not write to Dexie once per key.
- The final value is guaranteed to persist upon debounce expiry, blur, submit, and unmount.
- IME composition is handled cleanly without committing partial character sequences.
