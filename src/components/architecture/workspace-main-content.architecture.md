# WorkspaceMainContent Architecture

`WorkspaceMainContent` is the main workspace body. It reads transient workspace state from `WorkspaceProvider`, routes primary actions to dedicated action panels, and falls back to `WorkspaceDefaultPanel` for normal tab/object rendering.

```mermaid
graph TD
  WorkspaceProvider --> WorkspaceMainContent
  WorkspaceMainContent --> SearchActionPanel
  WorkspaceMainContent --> CalendarActionPanel
  WorkspaceMainContent --> ExploreActionPanel
  WorkspaceMainContent --> TasksActionPanel
  WorkspaceMainContent --> ContextMenuPendingActionPanel
  WorkspaceMainContent --> WorkspaceDefaultPanel
  WorkspaceDefaultPanel --> WorkspaceObjectRenderer
  WorkspaceObjectRenderer --> WorkspaceListRenderer
```

## State Ownership

`WorkspaceProvider` owns `activeAction`, `mainValue`, `activeEntityId`, `mainTabs`, object types, and created entities. `WorkspaceMainContent` only decides which content surface should be visible for that state.
