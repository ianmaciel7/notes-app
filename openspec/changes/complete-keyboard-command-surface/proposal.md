## Why

The command foundation now supports a central registry, `Mod+K`/`Mod+P`, search, navigation, runtime object creation, and editor references, but the visible and keyboard command surface is still incomplete. Shortcut hints remain partly duplicated in the sidebar and documented commands such as extended search, shortcut browser, settings, focus/sidebar toggles, tab actions, and find in page are not yet represented by one canonical registry.

## What Changes

- Extend the registry with the approved application, navigation, page, tab, calendar, and search commands that have real local action owners.
- Add `Mod+Shift+P` extended search, `Mod+F` find in page, shortcut browser, settings, focus/sidebar/panel toggles, and global task creation where supported.
- Make sidebar hints, menus, palette rows, and the shortcut browser render from shared command metadata.
- Add a searchable shortcuts browser grouped by context and platform.
- Preserve contextual arbitration so editor and component shortcuts win over global commands.
- Omit or truthfully disable commands whose feature owner is not implemented.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/keyboard-command-system`: Complete the registered command surface and shortcut browser.
- `ui/app-sidebar`: Derive visible shortcut hints from canonical command metadata.

## Impact

- Command registry, workspace controller adapters, sidebar hints, palette groups, shortcut browser, localization, tests, and evidence.
- Does not add advanced blocks, `+`/`#` editor triggers, AI, or unsupported backend actions.
