import { expect, it, vi } from "vitest";

import {
  createWorkspaceCommandRuntime,
  projectWorkspaceCommands,
  routeWorkspaceShortcut,
  type WorkspaceCommandActions,
  type WorkspaceCommandRuntime,
  type WorkspaceShortcutClaim,
} from "@/lib/space-command-registry";

function createShortcutRuntime(actions: WorkspaceCommandActions): WorkspaceCommandRuntime {
  return createWorkspaceCommandRuntime({
    locale: "test",
    t: (key) => key,
    actions,
    state: {
      calendarActive: true,
      canCloseCurrentTab: true,
      canCreateTask: true,
      canFindInPage: true,
      canNavigateToday: true,
      canOpenSettings: true,
      canToggleTabsBar: true,
      canToggleTheme: true,
      canUseExtendedSearch: true,
    },
  });
}

function createGlobalClaims(runtime: WorkspaceCommandRuntime): WorkspaceShortcutClaim[] {
  return projectWorkspaceCommands(runtime).flatMap((command) =>
    command.shortcuts.map((shortcut) => ({
      id: `${command.id}:${shortcut}`,
      commandId: command.id,
      priority: "global",
      shortcuts: [shortcut],
    })),
  );
}

it("routes every Capacities workspace shortcut to its command action", () => {
  const actions = {
    closeCurrentTab: vi.fn(),
    createTask: vi.fn(),
    moveCalendar: vi.fn(),
    navigateBack: vi.fn(),
    navigateForward: vi.fn(),
    navigateToday: vi.fn(),
    openExplore: vi.fn(),
    openExtendedSearch: vi.fn(),
    openFindInPage: vi.fn(),
    openNewContent: vi.fn(),
    openPalette: vi.fn(),
    openSettings: vi.fn(),
    openShortcuts: vi.fn(),
    setCalendarView: vi.fn(),
    toggleFocusMode: vi.fn(),
    toggleSidePanel: vi.fn(),
    toggleSidebar: vi.fn(),
    toggleTabsBar: vi.fn(),
    toggleTheme: vi.fn(),
  };
  const runtime = createShortcutRuntime(actions);
  const claims = createGlobalClaims(runtime);

  const shortcuts = [
    ["workspace.openPalette", "k", { ctrlKey: true }, actions.openPalette],
    ["workspace.openPalette", "p", { ctrlKey: true }, actions.openPalette],
    ["workspace.openNewContent", "u", { ctrlKey: true }, actions.openNewContent],
    ["workspace.openExtendedSearch", "p", { ctrlKey: true, shiftKey: true }, actions.openExtendedSearch],
    ["workspace.openFindInPage", "f", { ctrlKey: true }, actions.openFindInPage],
    ["workspace.openShortcuts", "b", { ctrlKey: true, shiftKey: true }, actions.openShortcuts],
    ["workspace.openSettings", ",", { ctrlKey: true }, actions.openSettings],
    ["workspace.navigateBack", "ArrowLeft", { ctrlKey: true }, actions.navigateBack],
    ["workspace.navigateBack", "[", { ctrlKey: true }, actions.navigateBack],
    ["workspace.navigateForward", "ArrowRight", { ctrlKey: true }, actions.navigateForward],
    ["workspace.navigateForward", "]", { ctrlKey: true }, actions.navigateForward],
    ["workspace.navigateToday", "h", { ctrlKey: true, altKey: true }, actions.navigateToday],
    ["workspace.openExplore", "j", { ctrlKey: true }, actions.openExplore],
    ["workspace.toggleSidebar", "ArrowLeft", { ctrlKey: true, shiftKey: true }, actions.toggleSidebar],
    ["workspace.toggleSidePanel", "ArrowRight", { ctrlKey: true, shiftKey: true }, actions.toggleSidePanel],
    ["workspace.toggleFocusMode", "m", { ctrlKey: true, shiftKey: true }, actions.toggleFocusMode],
    ["workspace.toggleTheme", "l", { ctrlKey: true, shiftKey: true }, actions.toggleTheme],
    ["workspace.toggleTabsBar", "ArrowUp", { ctrlKey: true, shiftKey: true }, actions.toggleTabsBar],
    ["workspace.closeCurrentTab", "w", { ctrlKey: true }, actions.closeCurrentTab],
    ["workspace.createTask", "t", { ctrlKey: true, shiftKey: true }, actions.createTask],
    ["workspace.calendar.month", "m", {}, actions.setCalendarView],
    ["workspace.calendar.week", "w", {}, actions.setCalendarView],
    ["workspace.calendar.threeDay", "r", {}, actions.setCalendarView],
    ["workspace.calendar.day", "d", {}, actions.setCalendarView],
    ["workspace.calendar.previous", "ArrowLeft", {}, actions.moveCalendar],
    ["workspace.calendar.next", "ArrowRight", {}, actions.moveCalendar],
  ] as const;

  for (const [commandId, key, modifiers, action] of shortcuts) {
    const before = action.mock.calls.length;
    const event = {
      key,
      ...modifiers,
      preventDefault: vi.fn(),
    };

    const result = routeWorkspaceShortcut({
      runtime,
      platform: "windows",
      event,
      claims,
    });

    expect(result, commandId).toMatchObject({ accepted: true });
    expect(action.mock.calls.length, commandId).toBe(before + 1);
    expect(event.preventDefault, commandId).toHaveBeenCalledOnce();
  }
});
