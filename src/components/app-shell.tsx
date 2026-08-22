"use client";

import { cva } from "class-variance-authority";
import * as React from "react";
import { usePanelRef } from "react-resizable-panels";

import { AppHeaderSidebarSimpleIcon } from "@/components/app-header-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const APP_SHELL_LEFT_DEFAULT = "18rem";
const APP_SHELL_LEFT_MIN = "14rem";
const APP_SHELL_LEFT_MAX = "24rem";
const APP_SHELL_RIGHT_DEFAULT = "45%";
const APP_SHELL_RIGHT_MIN = "10%";
const APP_SHELL_RIGHT_MAX = "90%";

const appShellPanelGroupVariants = cva("h-full w-full", {
  variants: {
    resizing: {
      true: "[&>[data-panel]]:transition-none",
      false:
        "[&>[data-panel]]:transition-[flex-grow] [&>[data-panel]]:duration-300 [&>[data-panel]]:ease-in-out",
    },
  },
  defaultVariants: {
    resizing: false,
  },
});

type AppShellResizeSide = "left" | "right";

type AppShellContextValue = {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  resizingSide: AppShellResizeSide | null;
  leftPanelRef: ReturnType<typeof usePanelRef>;
  rightPanelRef: ReturnType<typeof usePanelRef>;
  leftPanelElementRef: React.RefObject<HTMLDivElement | null>;
  setLeftCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setRightCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setResizingSide: React.Dispatch<
    React.SetStateAction<AppShellResizeSide | null>
  >;
  toggleLeft: () => void;
  toggleRight: () => void;
};

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

function useAppShell() {
  const context = React.useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShell must be used within an AppShellProvider.");
  }

  return context;
}

function AppShellProvider({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const leftPanelRef = usePanelRef();
  const rightPanelRef = usePanelRef();
  const leftPanelElementRef = React.useRef<HTMLDivElement>(null);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [resizingSide, setResizingSide] =
    React.useState<AppShellResizeSide | null>(null);

  const toggleLeft = React.useCallback(() => {
    const panel = leftPanelRef.current;

    if (!panel) return;

    if (panel.isCollapsed()) {
      setLeftCollapsed(false);
      panel.expand();
      return;
    }

    setLeftCollapsed(true);
    panel.collapse();
  }, [leftPanelRef]);

  const toggleRight = React.useCallback(() => {
    const panel = rightPanelRef.current;

    if (!panel) return;

    if (panel.isCollapsed()) {
      setRightCollapsed(false);
      panel.expand();
      return;
    }

    setRightCollapsed(true);
    panel.collapse();
  }, [rightPanelRef]);

  React.useEffect(() => {
    const root = rootRef.current;
    const panel = leftPanelElementRef.current;

    if (!root || !panel) return;

    const syncLeftWidth = () => {
      root.style.setProperty(
        "--app-shell-left-width",
        `${panel.getBoundingClientRect().width}px`,
      );
    };

    syncLeftWidth();

    const observer = new ResizeObserver(syncLeftWidth);
    observer.observe(panel);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const stopResize = () => setResizingSide(null);

    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);

    return () => {
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, []);

  const value = React.useMemo<AppShellContextValue>(
    () => ({
      leftCollapsed,
      rightCollapsed,
      resizingSide,
      leftPanelRef,
      rightPanelRef,
      leftPanelElementRef,
      setLeftCollapsed,
      setRightCollapsed,
      setResizingSide,
      toggleLeft,
      toggleRight,
    }),
    [
      leftCollapsed,
      rightCollapsed,
      resizingSide,
      leftPanelRef,
      rightPanelRef,
      toggleLeft,
      toggleRight,
    ],
  );

  return (
    <AppShellContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="app-shell-provider"
        className={cn(
          "relative h-svh w-full overflow-hidden bg-sidebar",
          className,
        )}
        style={
          {
            "--app-shell-left-width": APP_SHELL_LEFT_DEFAULT,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
}

function AppShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell"
      className={cn("relative hidden h-full w-full md:block", className)}
      {...props}
    />
  );
}

function AppShellPanelGroup({
  className,
  resizeSide = "left",
  ...props
}: React.ComponentProps<typeof ResizablePanelGroup> & {
  resizeSide?: AppShellResizeSide;
}) {
  const { resizingSide } = useAppShell();

  return (
    <ResizablePanelGroup
      data-slot="app-shell-panel-group"
      data-resize-side={resizeSide}
      orientation="horizontal"
      className={cn(
        appShellPanelGroupVariants({ resizing: resizingSide === resizeSide }),
        className,
      )}
      {...props}
    />
  );
}

function AppShellSidebar({
  className,
  children,
  onResize,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  const { leftPanelRef, leftPanelElementRef, setLeftCollapsed } = useAppShell();

  return (
    <>
      <ResizablePanel
        id="app-shell-sidebar"
        panelRef={leftPanelRef}
        elementRef={leftPanelElementRef}
        defaultSize={APP_SHELL_LEFT_DEFAULT}
        minSize={APP_SHELL_LEFT_MIN}
        maxSize={APP_SHELL_LEFT_MAX}
        collapsedSize="0%"
        collapsible
        groupResizeBehavior="preserve-pixel-size"
        onResize={(size, id, previousSize) => {
          setLeftCollapsed(size.inPixels <= 1);
          onResize?.(size, id, previousSize);
        }}
        className={cn("h-full overflow-hidden bg-sidebar", className)}
        {...props}
      >
        <aside
          data-slot="app-shell-sidebar"
          className="flex h-full min-w-0 flex-col"
        >
          {children}
        </aside>
      </ResizablePanel>

      <AppShellResizeHandle side="left" />
    </>
  );
}

function AppShellWorkspace({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  return (
    <ResizablePanel
      id="app-shell-workspace"
      minSize="20rem"
      groupResizeBehavior="preserve-relative-size"
      className={cn("h-full min-w-0 overflow-hidden bg-sidebar", className)}
      {...props}
    >
      <AppShellPanelGroup resizeSide="right">{children}</AppShellPanelGroup>
    </ResizablePanel>
  );
}

function AppShellMain({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  return (
    <>
      <ResizablePanel
        id="app-shell-main"
        defaultSize="55%"
        minSize="10%"
        groupResizeBehavior="preserve-relative-size"
        className={cn(
          "flex h-full min-w-0 flex-col overflow-hidden bg-sidebar",
          className,
        )}
        {...props}
      >
        <main
          data-slot="app-shell-main"
          className="flex h-full min-w-0 flex-col"
        >
          {children}
        </main>
      </ResizablePanel>

      <AppShellResizeHandle side="right" />
    </>
  );
}

function AppShellSidePanel({
  className,
  children,
  onResize,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  const { rightPanelRef, rightCollapsed, setRightCollapsed } = useAppShell();

  return (
    <ResizablePanel
      id="app-shell-side-panel"
      panelRef={rightPanelRef}
      defaultSize={APP_SHELL_RIGHT_DEFAULT}
      minSize={APP_SHELL_RIGHT_MIN}
      maxSize={APP_SHELL_RIGHT_MAX}
      collapsedSize="0%"
      collapsible
      groupResizeBehavior="preserve-relative-size"
      onResize={(size, id, previousSize) => {
        setRightCollapsed(size.inPixels <= 1);
        onResize?.(size, id, previousSize);
      }}
      className={cn(
        "flex h-full min-w-0 flex-col overflow-hidden bg-sidebar transition-opacity duration-300 ease-in-out",
        rightCollapsed && "opacity-0",
        className,
      )}
      {...props}
    >
      <aside
        data-slot="app-shell-side-panel"
        className="flex h-full min-w-0 flex-col"
      >
        {children}
      </aside>
    </ResizablePanel>
  );
}

function AppShellHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn("flex h-[46px] shrink-0 items-center", className)}
      {...props}
    />
  );
}

function AppShellContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-content"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

function AppShellSurface({
  className,
  side = "main",
  ...props
}: React.ComponentProps<typeof Card> & {
  side?: "main" | "side-panel";
}) {
  return (
    <div
      data-slot="app-shell-surface-wrapper"
      data-side={side}
      className={cn(
        "min-h-0 flex-1 pb-2.5 pt-0",
        side === "main" ? "pl-2.5 pr-1" : "pl-1 pr-2.5",
      )}
    >
      <Card
        data-slot="app-shell-surface"
        className={cn(
          "h-full w-full gap-0 overflow-hidden rounded-[12px] bg-background py-0 shadow-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function AppShellResizeHandle({
  className,
  side,
  onPointerDown,
  onKeyDown,
  onKeyUp,
  ...props
}: React.ComponentProps<typeof ResizableHandle> & {
  side: AppShellResizeSide;
}) {
  const { leftCollapsed, rightCollapsed, setResizingSide } = useAppShell();
  const collapsed = side === "left" ? leftCollapsed : rightCollapsed;

  return (
    <ResizableHandle
      data-slot="app-shell-resize-handle"
      data-side={side}
      disabled={collapsed}
      className={cn(
        "group !w-px !bg-transparent after:!w-3 after:!bg-transparent before:pointer-events-none before:absolute before:inset-y-1 before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-border before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
        collapsed && "pointer-events-none before:opacity-0",
        className,
      )}
      onPointerDown={(event) => {
        setResizingSide(side);
        onPointerDown?.(event);
      }}
      onKeyDown={(event) => {
        setResizingSide(side);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        setResizingSide(null);
        onKeyUp?.(event);
      }}
      {...props}
    />
  );
}

function AppShellSidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { leftCollapsed, toggleLeft } = useAppShell();

  return (
    <div
      data-slot="app-shell-sidebar-trigger"
      className="absolute top-[9px] z-50"
      style={{
        left: "max(0.625rem, calc(var(--app-shell-left-width) - 2.125rem))",
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("bg-transparent aria-expanded:bg-transparent", className)}
        aria-expanded={!leftCollapsed}
        aria-label={
          leftCollapsed ? "Expand left sidebar" : "Collapse left sidebar"
        }
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleLeft();
        }}
        {...props}
      >
        <AppHeaderSidebarSimpleIcon />
      </Button>
    </div>
  );
}

function AppShellSidePanelTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { rightCollapsed, toggleRight } = useAppShell();

  return (
    <div
      data-slot="app-shell-side-panel-trigger"
      className="absolute right-[26px] top-[9px] z-50"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("bg-transparent aria-expanded:bg-transparent", className)}
        aria-expanded={!rightCollapsed}
        aria-label={
          rightCollapsed ? "Expand right panel" : "Collapse right panel"
        }
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleRight();
        }}
        {...props}
      >
        <AppHeaderSidebarSimpleIcon className="rotate-180" />
      </Button>
    </div>
  );
}

function AppShellMobile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-mobile"
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-sidebar md:hidden",
        className,
      )}
      {...props}
    />
  );
}

function AppShellMobileSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute left-2.5 top-[9px]"
            aria-label="Open navigation"
          />
        }
      >
        <AppHeaderSidebarSimpleIcon />
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn("w-3/4 bg-sidebar p-0", className)}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Application navigation</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

function AppShellMobileSidePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-[26px] top-[9px]"
            aria-label="Open side panel"
          />
        }
      >
        <AppHeaderSidebarSimpleIcon className="rotate-180" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn("w-3/4 bg-sidebar p-2.5", className)}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Side panel</SheetTitle>
          <SheetDescription>Secondary application panel</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export {
  AppShell,
  AppShellContent,
  AppShellHeader,
  AppShellMain,
  AppShellMobile,
  AppShellMobileSidebar,
  AppShellMobileSidePanel,
  AppShellPanelGroup,
  AppShellProvider,
  AppShellResizeHandle,
  AppShellSidebar,
  AppShellSidebarTrigger,
  AppShellSidePanel,
  AppShellSidePanelTrigger,
  AppShellSurface,
  AppShellWorkspace,
  useAppShell,
};
