## Purpose

Defines one keyboard-first command contract shared by global shortcuts, the command palette, menus, buttons, navigation, and runtime object creation.

## ADDED Requirements

### Requirement: Commands have one canonical definition and execution path
Every command exposed through a shortcut, palette, menu, or button SHALL resolve to one stable command identity with localized presentation, aliases, category, platform-neutral shortcuts, contexts, availability, and one canonical action.

#### Scenario: Same action is invoked from two surfaces
- **WHEN** a user invokes an available command from a visible control and later invokes the same command from the palette or its shortcut
- **THEN** both invocations SHALL execute the same canonical action against current workspace state
- **AND** presentation metadata or shortcut hints SHALL NOT create a second action implementation.

#### Scenario: Runtime object types change
- **WHEN** an eligible runtime Structure is added, renamed, disabled, or removed
- **THEN** object-creation commands SHALL reflect the current canonical Structure registry without a closed hard-coded object-type list.

### Requirement: Shortcut dispatch is contextual and centralized
Keyboard dispatch SHALL resolve the highest-priority available command in the order open modal, specialized component, text editor, block selection, page, and global application, and SHALL not require feature components to register independent document-level listeners.

#### Scenario: Mod K is pressed with selected editor text
- **WHEN** focus is in the editor, a non-empty text selection can accept a link, and the user presses `Mod+K`
- **THEN** the editor link command SHALL take precedence over the global palette command.

#### Scenario: Mod K is pressed without an editor selection
- **WHEN** no higher-priority context claims `Mod+K`
- **THEN** the global command palette SHALL open.

#### Scenario: Global shortcut is typed in an editable target
- **WHEN** focus is in an input, textarea, contenteditable surface, or composing editor and a global shortcut is not explicitly valid in that context
- **THEN** the global command SHALL NOT execute or interrupt text composition.

### Requirement: The global palette combines current commands and indexed results
`Mod+K` and `Mod+P` SHALL open the same global palette from any eligible application context and the palette SHALL combine available commands, navigation, runtime object creation, and indexed object and block results rather than presenting a fixed static list.

#### Scenario: Palette opens and closes by keyboard
- **WHEN** the user presses either supported palette shortcut
- **THEN** one palette SHALL open with its query input focused
- **AND** Escape SHALL close it and restore focus to the element that opened it when that element still exists.

#### Scenario: User navigates palette results
- **WHEN** the palette has results and the user presses ArrowDown, ArrowUp, or Enter
- **THEN** the active option SHALL move within the available results or execute the active result
- **AND** the active option SHALL have a visible state and programmatic selected identity.

#### Scenario: Command is unavailable
- **WHEN** a registered command is not valid for current state
- **THEN** it SHALL be omitted or truthfully disabled and SHALL NOT mutate workspace state if activation is attempted.

### Requirement: Palette accessibility and platform labels are coherent
The palette SHALL expose an accessible dialog containing combobox/listbox semantics, named grouped options, visible focus, screen-reader selection state, and shortcut labels formatted for the current operating system from platform-neutral shortcut metadata.

#### Scenario: Shortcut labels render on different platforms
- **WHEN** the same `Mod+Shift+P` metadata is rendered on macOS and Windows or Linux
- **THEN** macOS SHALL present Command and Shift symbols while Windows or Linux SHALL present Ctrl and Shift labels without changing command identity.

#### Scenario: Pointer and keyboard activation are compared
- **WHEN** a palette option is hovered, focused, activated, dismissed, or revisited with reduced motion enabled
- **THEN** its geometry SHALL remain stable, its state SHALL remain perceivable, and the same accepted action SHALL produce the same post-action state.

### Requirement: Palette input remains responsive
Palette query text SHALL update locally and synchronously, expensive derived filtering SHALL be allowed to lag without controlling the input, and stale asynchronous work SHALL not replace newer results.

#### Scenario: User types rapidly in a large workspace
- **WHEN** several query revisions occur before prior derived or asynchronous work completes
- **THEN** the visible input SHALL retain every accepted keystroke
- **AND** only results for the newest query SHALL become current, with truthful loading, empty, or error state when applicable.
