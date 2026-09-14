---
trigger: glob
globs:
  - "src/**/*.tsx"
  - "src/**/*.ts"
description: Keystroke latency, debounced persistence to Dexie/storage, IME handling, and useDeferredValue optimization for notes editors and search inputs.
---

# Input Performance & Editor Latency Rule

Workspace text entry must keep the keystroke path local and synchronous.

## 1. Required Practices

- Text that directly controls an editor, textbox, textarea, or contenteditable surface must update local component state immediately.
- **Do not dispatch workspace-wide object/context updates or IndexedDB/Dexie writes on every keystroke.**
- Persist editor text through a buffered commit with a short idle debounce (300ms–500ms) and an immediate flush on blur, submit, navigation, or unmount.
- Handle composition events so IME, accent, and dead-key input is not committed mid-composition.
- Use `useDeferredValue` for search text or editor text that drives expensive filtered lists, query results, previews, or relational graph updates.
- Use `startTransition` only for non-input derived updates. Do not use transitions for the state value that directly controls a text input.

## 2. Review Checklist

- Typing in title, body, notes, or BlockNote editor fields does not update the global workspace state or write to Dexie once per key.
- The final value is guaranteed to persist after idle debounce, blur, submit, and unmount.
- Tabs, sidebar labels, backlinks, and storage are permitted to lag briefly behind the active typing field.
