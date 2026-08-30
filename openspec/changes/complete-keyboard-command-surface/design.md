## Context

The current registry deliberately shipped a narrow foundation. Capacities documents a larger shortcut surface, including settings, add content, standard and extended search, focus/sidebar/panel toggles, tabs, navigation, calendar views, find in page, and a searchable shortcuts menu. Notes App should expose only commands with canonical local owners; documentation parity does not justify dead or fake actions.

## Architecture

`WorkspaceCommandDefinition` remains the single metadata source. Each command includes stable ID, category, contexts, platform-neutral chords, localized label/description/aliases, availability predicate, and one execution adapter. Visible consumers receive projected commands and never maintain their own shortcut arrays.

A `ShortcutCatalog` projection groups commands by general, editing, blocks, page, navigation, calendar, table, and feature contexts. The browser is read-only and searchable. It does not register additional key listeners.

## Command Admission Rule

A documented command is admitted only when:

1. the local feature and canonical action owner exist;
2. the command has one stable ID and context;
3. conflicts are resolved through the central priority router;
4. unit and browser tests cover accepted and unavailable states;
5. the visible hint comes from registry metadata.

Unsupported actions are omitted or disabled with a localized explanation. They are not no-op placeholders.

## Initial Delivery

The first extension should cover settings, new content, extended search, find in page, shortcut browser, dark mode, focus mode, left sidebar, contextual panel, tabs bar, close tab, back/forward, calendar navigation, and create task. Commands tied to not-yet-implemented table or AI behavior remain deferred.

## Shortcut Conflicts

- `Mod+K` remains editor link when text is selected.
- `Mod+U` in editable text remains underline or browser/editor behavior; global new-content routing must not steal it.
- Single-letter calendar shortcuts apply only in the calendar context and outside editable targets.
- Browser-reserved or unreliable chords must have pointer/menu access and documented limitations.

## Testing

Tests cover metadata uniqueness, chord conflicts, contexts, platform labels, unavailable behavior, one-action execution, focus restoration, shortcut-browser accessibility, no duplicate listeners, and local-input performance.
