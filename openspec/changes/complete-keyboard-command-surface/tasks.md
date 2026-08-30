## 1. Inventory and Registry

- [ ] 1.1 Map current local action owners to documented command families and classify unsupported actions.
- [ ] 1.2 Add failing tests for command ID uniqueness, chord/context conflicts, availability, stable ordering, and shared metadata projection.
- [ ] 1.3 Extend the registry only for commands with canonical local owners.

## 2. Consumers

- [ ] 2.1 Replace hard-coded sidebar shortcut arrays with registry projections.
- [ ] 2.2 Add extended-search and find-in-page commands with focused, accessible surfaces.
- [ ] 2.3 Add settings, theme, focus, sidebar, panel, tabs, navigation, calendar, and create-task commands where their owners exist.
- [ ] 2.4 Add a searchable, grouped shortcuts browser using the same metadata.

## 3. Context and Accessibility

- [ ] 3.1 Add conflict tests for editable targets, selected editor text, modal priority, calendar single-letter keys, and browser-reserved chords.
- [ ] 3.2 Verify keyboard, pointer, Escape, outside dismissal, focus restoration, reduced motion, responsive containment, and localized platform labels.
- [ ] 3.3 Verify unavailable commands never mutate state and expose truthful UI.

## 4. Verification

- [ ] 4.1 Run focused command, sidebar, editor, search, routing, and accessibility tests.
- [ ] 4.2 Run repository verification and `openspec validate complete-keyboard-command-surface --strict`.
