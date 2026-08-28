"use client";

import { cva } from "class-variance-authority";
import { useTranslations } from "next-intl";
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
import { workspaceSurfaceMotionClass } from "@/components/ui/shared-styles";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  getWorkspacePanelPresentation,
  WORKSPACE_CONTEXT_PANEL_DEFAULT_WIDTH_PX,
  WORKSPACE_CONTEXT_PANEL_MAX_WIDTH_PX,
  WORKSPACE_CONTEXT_PANEL_MIN_WIDTH_PX,
  WORKSPACE_RAIL_HEIGHT_PX,
  WORKSPACE_SIDEBAR_DEFAULT_WIDTH_PX,
  WORKSPACE_SIDEBAR_MAX_WIDTH_PX,
  WORKSPACE_SIDEBAR_MIN_WIDTH_PX,
  WORKSPACE_SURFACE_GUTTER_PX,
  WORKSPACE_SURFACE_RADIUS_PX,
} from "@/lib/workspace-layout";

const APP_SHELL_LEFT_DEFAULT = `${WORKSPACE_SIDEBAR_DEFAULT_WIDTH_PX}px`;
const APP_SHELL_LEFT_MIN = `${WORKSPACE_SIDEBAR_MIN_WIDTH_PX}px`;
const APP_SHELL_LEFT_MAX = `${WORKSPACE_SIDEBAR_MAX_WIDTH_PX}px`;
const APP_SHELL_RIGHT_DEFAULT = `${WORKSPACE_CONTEXT_PANEL_DEFAULT_WIDTH_PX}px`;
const APP_SHELL_RIGHT_MIN = `${WORKSPACE_CONTEXT_PANEL_MIN_WIDTH_PX}px`;
const APP_SHELL_RIGHT_MAX = `${WORKSPACE_CONTEXT_PANEL_MAX_WIDTH_PX}px`;

const appShellPanelGroupVariants = cva("h-full w-full", {
  variants: {
    resizing: {
      true: "",
      false: "",
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
  compactDesktop: boolean;
  leftOverlayOpen: boolean;
  rightOverlayOpen: boolean;
  resizingSide: AppShellResizeSide | null;
  leftPanelRef: ReturnType<typeof usePanelRef>;
  rightPanelRef: ReturnType<typeof usePanelRef>;
  leftPanelElementRef: React.RefObject<HTMLDivElement | null>;
  leftOverlayReturnFocusRef: React.RefObject<HTMLElement | null>;
  rightOverlayReturnFocusRef: React.RefObject<HTMLElement | null>;
  setLeftCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setRightCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRightOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [compactDesktop, setCompactDesktop] = React.useState(false);
  const [mobileShell, setMobileShell] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [leftOverlayOpen, setLeftOverlayOpen] = React.useState(false);
  const [rightOverlayOpen, setRightOverlayOpen] = React.useState(false);
  const leftOverlayReturnFocusRef = React.useRef<HTMLElement | null>(null);
  const rightOverlayReturnFocusRef = React.useRef<HTMLElement | null>(null);
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
    if (compactDesktop) {
      setRightOverlayOpen((open) => {
        if (!open && document.activeElement instanceof HTMLElement) {
          rightOverlayReturnFocusRef.current = document.activeElement;
        }
        return !open;
      });
      return;
    }

    const panel = rightPanelRef.current;

    if (!panel) return;

    if (panel.isCollapsed()) {
      setRightCollapsed(false);
      panel.expand();
      return;
    }

    setRightCollapsed(true);
    panel.collapse();
  }, [compactDesktop, rightPanelRef]);

  React.useEffect(() => {
    setHydrated(true);
    const sync = () => {
      const presentation = getWorkspacePanelPresentation(window.innerWidth);
      setCompactDesktop(presentation === "overlay");
      setMobileShell(presentation === "mobile");
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  React.useEffect(() => {
    if (mobileShell) return;
    setLeftOverlayOpen(false);
  }, [mobileShell]);

  React.useEffect(() => {
    if (compactDesktop || mobileShell) return;
    setRightOverlayOpen(false);
  }, [compactDesktop, mobileShell]);

  const previousLeftOverlayOpen = React.useRef(false);
  React.useEffect(() => {
    if (previousLeftOverlayOpen.current && !leftOverlayOpen) {
      const restoreFocusTimer = window.setTimeout(() => {
        leftOverlayReturnFocusRef.current?.focus({ preventScroll: true });
        leftOverlayReturnFocusRef.current = null;
      }, 220);
      return () => window.clearTimeout(restoreFocusTimer);
    }
    previousLeftOverlayOpen.current = leftOverlayOpen;
  }, [leftOverlayOpen]);

  const previousRightOverlayOpen = React.useRef(false);
  React.useEffect(() => {
    if (previousRightOverlayOpen.current && !rightOverlayOpen) {
      const restoreFocusTimer = window.setTimeout(() => {
        rightOverlayReturnFocusRef.current?.focus({ preventScroll: true });
        rightOverlayReturnFocusRef.current = null;
      }, 220);
      return () => window.clearTimeout(restoreFocusTimer);
    }
    previousRightOverlayOpen.current = rightOverlayOpen;
  }, [rightOverlayOpen]);

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
      rightCollapsed: compactDesktop ? !rightOverlayOpen : rightCollapsed,
      compactDesktop,
      leftOverlayOpen,
      rightOverlayOpen,
      resizingSide,
      leftPanelRef,
      rightPanelRef,
      leftPanelElementRef,
      leftOverlayReturnFocusRef,
      rightOverlayReturnFocusRef,
      setLeftCollapsed,
      setRightCollapsed,
      setLeftOverlayOpen,
      setRightOverlayOpen,
      setResizingSide,
      toggleLeft,
      toggleRight,
    }),
    [
      leftCollapsed,
      rightCollapsed,
      compactDesktop,
      leftOverlayOpen,
      rightOverlayOpen,
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
        data-hydrated={hydrated ? "true" : undefined}
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
  const { compactDesktop } = useAppShell();

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

      {!compactDesktop && <AppShellResizeHandle side="right" />}
    </>
  );
}

function AppShellSidePanel({
  className,
  children,
  onResize,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  const {
    rightPanelRef,
    rightCollapsed,
    compactDesktop,
    rightOverlayOpen,
    setRightCollapsed,
    setRightOverlayOpen,
  } = useAppShell();

  if (compactDesktop) {
    return (
      <Sheet open={rightOverlayOpen} onOpenChange={setRightOverlayOpen}>
        <SheetContent
          side="right"
          overlayClassName="motion-reduce:transition-none"
          className={cn(
            "w-[min(24rem,calc(100vw-2.5rem))] max-w-none gap-0 bg-sidebar p-2.5 motion-reduce:transition-none",
            className,
          )}
        >
          <aside
            data-slot="app-shell-side-panel"
            data-presentation="overlay"
            className="flex h-full min-w-0 flex-col"
          >
            {children}
          </aside>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ResizablePanel
      id="app-shell-side-panel"
      panelRef={rightPanelRef}
      defaultSize={APP_SHELL_RIGHT_DEFAULT}
      minSize={APP_SHELL_RIGHT_MIN}
      maxSize={APP_SHELL_RIGHT_MAX}
      collapsedSize="0%"
      collapsible
      groupResizeBehavior="preserve-pixel-size"
      onResize={(size, id, previousSize) => {
        setRightCollapsed(size.inPixels <= 1);
        onResize?.(size, id, previousSize);
      }}
      className={cn(
        "relative z-10 flex h-full min-w-0 flex-col overflow-hidden bg-sidebar",
        workspaceSurfaceMotionClass,
        rightCollapsed
          ? "pointer-events-none opacity-0"
          : "pointer-events-auto opacity-100",
        className,
      )}
      {...props}
    >
      <aside
        data-slot="app-shell-side-panel"
        data-collapsed={rightCollapsed || undefined}
        aria-hidden={rightCollapsed}
        className={cn(
          "flex h-full min-w-0 flex-col",
          rightCollapsed && "invisible",
        )}
      >
        {children}
      </aside>
    </ResizablePanel>
  );
}

function AppShellHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn("flex h-[46px] shrink-0 items-center", className)}
      style={
        {
          "--app-shell-rail-height": `${WORKSPACE_RAIL_HEIGHT_PX}px`,
          ...style,
        } as React.CSSProperties
      }
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
        side === "main" ? "relative z-0 px-2.5" : "relative z-20 pl-0 pr-2.5",
      )}
      style={
        {
          "--app-shell-surface-gutter": `${WORKSPACE_SURFACE_GUTTER_PX}px`,
          "--app-shell-surface-radius": `${WORKSPACE_SURFACE_RADIUS_PX}px`,
        } as React.CSSProperties
      }
    >
      <Card
        data-slot="app-shell-surface"
        className={cn(
          "h-full w-full gap-0 overflow-hidden rounded-[12px] border border-border bg-card py-0 ring-0 shadow-[0_2px_3px_rgb(0_0_0/0.004),0_4px_9px_rgb(0_0_0/0.01),0_8px_12px_rgb(0_0_0/0.004)]",
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
        "group !w-0 !bg-transparent after:!w-3 after:!bg-transparent before:pointer-events-none before:absolute before:inset-y-1 before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-border before:opacity-0 before:transition-opacity before:duration-500 motion-reduce:before:transition-none hover:before:opacity-60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
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
  const t = useTranslations("workspace.shell");

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
          leftCollapsed ? t("expandNavigation") : t("collapseNavigation")
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
  const t = useTranslations("workspace.shell");

  return (
    <div
      data-slot="app-shell-side-panel-trigger"
      className="absolute right-[26px] top-[15px] z-50"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("bg-transparent aria-expanded:bg-transparent", className)}
        aria-expanded={!rightCollapsed}
        aria-label={rightCollapsed ? t("expandContext") : t("collapseContext")}
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
  const t = useTranslations("workspace.shell");
  const { leftOverlayOpen, setLeftOverlayOpen, leftOverlayReturnFocusRef } =
    useAppShell();
  return (
    <Sheet open={leftOverlayOpen} onOpenChange={setLeftOverlayOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute left-2.5 top-[15px]"
            aria-expanded={leftOverlayOpen}
            aria-label={t("openNavigation")}
          />
        }
        onClick={(event) => {
          leftOverlayReturnFocusRef.current = event.currentTarget;
        }}
      >
        <AppHeaderSidebarSimpleIcon />
      </SheetTrigger>
      <SheetContent
        side="left"
        overlayClassName="motion-reduce:transition-none"
        className={cn(
          "w-[min(24rem,calc(100vw-2.5rem))] max-w-none bg-sidebar p-0 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("navigationTitle")}</SheetTitle>
          <SheetDescription>{t("navigationDescription")}</SheetDescription>
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
  const t = useTranslations("workspace.shell");
  const { rightOverlayOpen, setRightOverlayOpen, rightOverlayReturnFocusRef } =
    useAppShell();
  return (
    <Sheet open={rightOverlayOpen} onOpenChange={setRightOverlayOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-[26px] top-[15px]"
            aria-expanded={rightOverlayOpen}
            aria-label={t("openContext")}
          />
        }
        onClick={(event) => {
          rightOverlayReturnFocusRef.current = event.currentTarget;
        }}
      >
        <AppHeaderSidebarSimpleIcon className="rotate-180" />
      </SheetTrigger>
      <SheetContent
        side="right"
        overlayClassName="motion-reduce:transition-none"
        className={cn(
          "w-[min(24rem,calc(100vw-2.5rem))] max-w-none bg-sidebar p-2.5 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("contextTitle")}</SheetTitle>
          <SheetDescription>{t("contextDescription")}</SheetDescription>
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
