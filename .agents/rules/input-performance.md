# Input Performance Rule

Workspace text entry must keep the keystroke path local and synchronous.

## Required Practices

- Text that directly controls an editor, textbox, textarea, or contenteditable surface must update local component state immediately.
- Do not dispatch workspace-wide object/context updates on every keystroke for editor text.
- Do not write to `localStorage` from the keystroke path.
- Persist editor text through a buffered commit with a short idle debounce and an immediate flush on blur, submit, navigation, or unmount.
- Handle composition events so IME, accent, and dead-key input is not committed mid-composition.
- Use `useDeferredValue` for search text or editor text that drives expensive filtered lists, query results, previews, or other derived rendering.
- Use `startTransition` only for non-input derived updates. Do not use transitions for the state value that directly controls a text input.

## Review Checklist

- Typing in title/body/notes fields does not update the global workspace object once per key.
- The final value is persisted after idle, blur, submit, and unmount.
- Tabs, sidebar labels, query results, and storage are allowed to lag briefly behind the active field.
- Existing visual parity and localized copy remain unchanged.
