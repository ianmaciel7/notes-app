## 1. Inventory and Registry

- [x] 1.1 Map current local action owners to documented command families and classify unsupported actions.
- [x] 1.2 Add failing tests for command ID uniqueness, chord/context conflicts, availability, stable ordering, and shared metadata projection.
- [x] 1.3 Extend the registry only for commands with canonical local owners.

## 2. Consumers

- [x] 2.1 Replace hard-coded sidebar shortcut arrays with registry projections.
- [x] 2.2 Add extended-search and find-in-page commands with focused, accessible surfaces.
- [x] 2.3 Add settings, theme, focus, sidebar, panel, tabs, navigation, calendar, and create-task commands where their owners exist.
- [x] 2.4 Add a searchable, grouped shortcuts browser using the same metadata.

## 3. Context and Accessibility

- [x] 3.1 Add conflict tests for editable targets, selected editor text, modal priority, calendar single-letter keys, and browser-reserved chords.
- [x] 3.2 Verify keyboard, pointer, Escape, outside dismissal, focus restoration, reduced motion, responsive containment, and localized platform labels.
- [x] 3.3 Verify unavailable commands never mutate state and expose truthful UI.

## 4. Verification

- [x] 4.1 Run focused command, sidebar, editor, search, routing, and accessibility tests.
- [x] 4.2 Run repository verification and `openspec validate complete-keyboard-command-surface --strict`.
