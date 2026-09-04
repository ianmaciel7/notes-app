"use client";

import * as React from "react";
import { AppShellContext } from "@/components/app-shell";
import { cn } from "@/lib/utils";

type FocusModeContextValue = {
  active: boolean;
  enter: () => void;
  leave: () => void;
  toggle: () => void;
};

type FocusModeRestoreState = {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  leftOverlayOpen: boolean;
  rightOverlayOpen: boolean;
};

const FocusModeContext = React.createContext<FocusModeContextValue | null>(null);

function FocusModeProvider({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const appShell = React.useContext(AppShellContext);
  const [active, setActive] = React.useState(false);
  const restoreStateRef = React.useRef<FocusModeRestoreState | null>(null);

  const enter = React.useCallback(() => {
    if (active) return;

    restoreStateRef.current = {
      leftCollapsed: appShell?.leftCollapsed ?? true,
      rightCollapsed: appShell?.rightCollapsed ?? true,
      leftOverlayOpen: appShell?.leftOverlayOpen ?? false,
      rightOverlayOpen: appShell?.rightOverlayOpen ?? false,
    };

    appShell?.setLeftOverlayOpen(false);
    appShell?.setRightOverlayOpen(false);

    const leftPanel = appShell?.leftPanelRef.current;
    if (leftPanel && !leftPanel.isCollapsed()) leftPanel.collapse();

    if (!appShell?.compactDesktop) {
      const rightPanel = appShell?.rightPanelRef.current;
      if (rightPanel && !rightPanel.isCollapsed()) rightPanel.collapse();
    }

    setActive(true);
  }, [active, appShell]);

  const leave = React.useCallback(() => {
    if (!active) return;

    const restoreState = restoreStateRef.current;
    restoreStateRef.current = null;

    if (restoreState && appShell) {
      if (!appShell.compactDesktop && !restoreState.leftCollapsed) {
        const leftPanel = appShell.leftPanelRef.current;
        if (leftPanel?.isCollapsed()) leftPanel.expand();
      }

      if (!appShell.compactDesktop && !restoreState.rightCollapsed) {
        const rightPanel = appShell.rightPanelRef.current;
        if (rightPanel?.isCollapsed()) rightPanel.expand();
      }

      if (appShell.compactDesktop && restoreState.leftOverlayOpen) {
        appShell.setLeftOverlayOpen(true);
      }

      if (appShell.compactDesktop && restoreState.rightOverlayOpen) {
        appShell.setRightOverlayOpen(true);
      }
    }

    setActive(false);
  }, [active, appShell]);

  const toggle = React.useCallback(() => {
    if (active) leave();
    else enter();
  }, [active, enter, leave]);

  const value = React.useMemo<FocusModeContextValue>(
    () => ({ active, enter, leave, toggle }),
    [active, enter, leave, toggle],
  );

  return (
    <FocusModeContext.Provider value={value}>
      <div
        data-slot="focus-mode-root"
        data-focus-mode={active ? "true" : undefined}
        className={cn(
          "contents",
          active &&
            "[&_[data-slot=app-shell-resize-handle]]:hidden [&_[data-slot=app-shell-sidebar-trigger]]:hidden [&_[data-slot=app-shell-side-panel-trigger]]:hidden",
          className,
        )}
      >
        {children}
      </div>
    </FocusModeContext.Provider>
  );
}

function useFocusMode() {
  return React.useContext(FocusModeContext);
}

export type { FocusModeContextValue };
export { FocusModeProvider, useFocusMode };
