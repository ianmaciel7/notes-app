"use client";

import { Menu } from "lucide-react";
import * as React from "react";
import { usePanelRef } from "react-resizable-panels";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SIDEBAR_DEFAULT = "16rem";
const SIDEBAR_MIN = "12rem";
const SIDEBAR_MAX = "24rem";
const CONTEXT_DEFAULT = "24%";
const CONTEXT_MIN = "16rem";
const CONTEXT_MAX = "32rem";
const shellMotion =
  "transition-[width,height,transform,opacity] duration-200 ease-out motion-reduce:transition-none";

type ResizeSide = "left" | "right";
type ShellContextValue = {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  compactDesktop: boolean;
  leftOverlayOpen: boolean;
  rightOverlayOpen: boolean;
  resizingSide: ResizeSide | null;
  leftPanelRef: ReturnType<typeof usePanelRef>;
  rightPanelRef: ReturnType<typeof usePanelRef>;
  leftPanelElementRef: React.RefObject<HTMLDivElement | null>;
  leftOverlayReturnFocusRef: React.RefObject<HTMLElement | null>;
  rightOverlayReturnFocusRef: React.RefObject<HTMLElement | null>;
  rightPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
  setLeftCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setRightCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRightOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResizingSide: React.Dispatch<React.SetStateAction<ResizeSide | null>>;
  toggleLeft: () => void;
  toggleRight: () => void;
};

export const SpaceShellContext = React.createContext<ShellContextValue | null>(null);

function useSpaceShell() {
  const context = React.useContext(SpaceShellContext);
  if (!context) throw new Error("useSpaceShell must be used within a SpaceShellProvider.");
  return context;
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: The provider owns the shell's shared responsive state.
function SpaceShellProvider({ className, children, style, ...props }: React.ComponentProps<"div">) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const leftPanelRef = usePanelRef();
  const rightPanelRef = usePanelRef();
  const leftPanelElementRef = React.useRef<HTMLDivElement>(null);
  const leftOverlayReturnFocusRef = React.useRef<HTMLElement>(null);
  const rightOverlayReturnFocusRef = React.useRef<HTMLElement>(null);
  const rightPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [compactDesktop, setCompactDesktop] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [leftOverlayOpen, setLeftOverlayOpen] = React.useState(false);
  const [rightOverlayOpen, setRightOverlayOpen] = React.useState(false);
  const [resizingSide, setResizingSide] = React.useState<ResizeSide | null>(null);

  React.useEffect(() => {
    const sync = () => {
      setMobile(window.innerWidth < 769);
      setCompactDesktop(window.innerWidth >= 769 && window.innerWidth < 1100);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  React.useEffect(() => {
    if (!leftPanelRef.current || (!compactDesktop && !mobile)) return;
    if (!leftPanelRef.current.isCollapsed()) {
      setLeftCollapsed(true);
      leftPanelRef.current.collapse();
    }
  }, [compactDesktop, mobile, leftPanelRef]);

  const toggleLeft = React.useCallback(() => {
    const panel = leftPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      setLeftCollapsed(false);
      panel.expand();
    } else {
      setLeftCollapsed(true);
      panel.collapse();
    }
  }, [leftPanelRef]);

  const toggleRight = React.useCallback(() => {
    if (compactDesktop) {
      setRightOverlayOpen((open) => !open);
      return;
    }
    const panel = rightPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      setRightCollapsed(false);
      panel.expand();
    } else {
      setRightCollapsed(true);
      panel.collapse();
      window.setTimeout(() => rightPanelTriggerRef.current?.focus(), 0);
    }
  }, [compactDesktop, rightPanelRef]);

  const value = React.useMemo(
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
      rightPanelTriggerRef,
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
    <SpaceShellContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="space-shell-provider"
        className={cn("relative h-svh w-full overflow-hidden bg-sidebar", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SpaceShellContext.Provider>
  );
}

function SpaceShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="space-shell"
      className={cn("relative hidden h-full w-full min-[769px]:block", className)}
      {...props}
    />
  );
}

function SpaceShellPanelGroup({
  className,
  resizeSide = "left",
  ...props
}: React.ComponentProps<typeof ResizablePanelGroup> & { resizeSide?: ResizeSide }) {
  const { resizingSide } = useSpaceShell();
  return (
    <ResizablePanelGroup
      data-slot="space-shell-panel-group"
      data-resize-side={resizeSide}
      orientation="horizontal"
      className={cn("h-full w-full", resizingSide === resizeSide && "select-none", className)}
      {...props}
    />
  );
}

function SpaceShellSidebar({
  className,
  children,
  onResize,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  const { leftPanelRef, leftPanelElementRef, setLeftCollapsed } = useSpaceShell();
  return (
    <>
      <ResizablePanel
        id="space-shell-sidebar-panel"
        panelRef={leftPanelRef}
        elementRef={leftPanelElementRef}
        defaultSize={SIDEBAR_DEFAULT}
        minSize={SIDEBAR_MIN}
        maxSize={SIDEBAR_MAX}
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
        <aside data-slot="space-shell-sidebar" className="flex h-full min-w-0 flex-col">
          {children}
        </aside>
      </ResizablePanel>
      <SpaceShellResizeHandle side="left" />
    </>
  );
}

function SpaceShellWorkspace({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  return (
    <ResizablePanel
      id="space-shell-workspace"
      minSize="20rem"
      className={cn("h-full min-w-0 overflow-hidden bg-sidebar", className)}
      {...props}
    >
      <SpaceShellPanelGroup resizeSide="right">{children}</SpaceShellPanelGroup>
    </ResizablePanel>
  );
}

function SpaceShellMain({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ResizablePanel>) {
  const { compactDesktop } = useSpaceShell();
  return (
    <>
      <ResizablePanel
        id="space-shell-main"
        minSize="10%"
        className={cn("flex h-full min-w-0 flex-col overflow-hidden bg-sidebar", className)}
        {...props}
      >
        <main data-slot="space-shell-main" className="flex h-full min-w-0 flex-col">
          {children}
        </main>
      </ResizablePanel>
      {!compactDesktop && <SpaceShellResizeHandle side="right" />}
    </>
  );
}

function SpaceShellSidePanel({
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
  } = useSpaceShell();
  if (compactDesktop)
    return (
      <Sheet open={rightOverlayOpen} onOpenChange={setRightOverlayOpen}>
        <SheetContent
          side="right"
          className={cn(
            "w-[min(24rem,calc(100vw-2.5rem))] max-w-none gap-0 bg-sidebar p-2.5",
            className,
          )}
        >
          <aside
            data-slot="space-shell-side-panel"
            data-presentation="overlay"
            className="flex h-full min-w-0 flex-col"
          >
            {children}
          </aside>
        </SheetContent>
      </Sheet>
    );
  return (
    <ResizablePanel
      id="space-shell-side-panel"
      panelRef={rightPanelRef}
      defaultSize={CONTEXT_DEFAULT}
      minSize={CONTEXT_MIN}
      maxSize={CONTEXT_MAX}
      collapsedSize="0%"
      collapsible
      onResize={(size, id, previousSize) => {
        setRightCollapsed(size.inPixels <= 1);
        onResize?.(size, id, previousSize);
      }}
      className={cn(
        "relative z-10 flex h-full min-w-0 flex-col overflow-hidden bg-sidebar",
        shellMotion,
        rightCollapsed && "pointer-events-none opacity-0",
        className,
      )}
      {...props}
    >
      <aside
        data-slot="space-shell-side-panel"
        data-collapsed={rightCollapsed || undefined}
        aria-hidden={rightCollapsed}
        className={cn("flex h-full min-w-0 flex-col", rightCollapsed && "invisible")}
      >
        {children}
      </aside>
    </ResizablePanel>
  );
}

function SpaceShellHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="space-shell-header"
      className={cn("flex h-[46px] shrink-0 items-center", className)}
      {...props}
    />
  );
}
function SpaceShellContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="space-shell-content"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}
function SpaceShellSurface({
  className,
  side = "main",
  children,
  ...props
}: React.ComponentProps<typeof Card> & { side?: "main" | "side-panel" }) {
  return (
    <div
      data-slot="space-shell-surface-wrapper"
      data-side={side}
      className={cn(
        "min-h-0 flex-1 pb-2.5 pt-0",
        side === "main" ? "relative z-0 px-2.5" : "relative z-20 pl-0 pr-2.5",
      )}
    >
      <Card
        data-slot="space-shell-surface"
        className={cn(
          "h-full w-full gap-0 overflow-hidden rounded-xl border border-border bg-card py-0",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    </div>
  );
}

function SpaceShellResizeHandle({
  className,
  side,
  onPointerDown,
  ...props
}: React.ComponentProps<typeof ResizableHandle> & { side: ResizeSide }) {
  const { leftCollapsed, rightCollapsed, setResizingSide } = useSpaceShell();
  const collapsed = side === "left" ? leftCollapsed : rightCollapsed;
  return (
    <ResizableHandle
      data-slot="space-shell-resize-handle"
      data-side={side}
      disabled={collapsed}
      className={cn(
        "group !w-0 !bg-transparent after:!w-3 before:pointer-events-none before:absolute before:inset-y-1 before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-border before:opacity-0 before:transition-opacity hover:before:opacity-60",
        collapsed && "pointer-events-none",
        className,
      )}
      onPointerDown={(event) => {
        setResizingSide(side);
        onPointerDown?.(event);
      }}
      onPointerUp={() => setResizingSide(null)}
      {...props}
    />
  );
}

function SpaceShellSidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { leftCollapsed, toggleLeft } = useSpaceShell();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-expanded={!leftCollapsed}
      aria-label={leftCollapsed ? "Expand navigation" : "Collapse navigation"}
      className={cn("absolute left-2.5 top-2 z-50", className)}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) toggleLeft();
      }}
      {...props}
    >
      <Menu />
    </Button>
  );
}
function SpaceShellSidePanelTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { rightCollapsed, rightPanelTriggerRef, toggleRight } = useSpaceShell();
  if (!rightCollapsed) return null;
  return (
    <Button
      ref={rightPanelTriggerRef}
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-expanded={!rightCollapsed}
      aria-label="Expand context panel"
      className={cn("absolute right-2.5 top-2 z-50", className)}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) toggleRight();
      }}
      {...props}
    >
      <Menu className="rotate-180" />
    </Button>
  );
}

function SpaceShellMobile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="space-shell-mobile"
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-sidebar min-[769px]:hidden",
        className,
      )}
      {...props}
    />
  );
}
function SpaceShellMobileSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  const { leftOverlayOpen, setLeftOverlayOpen } = useSpaceShell();
  return (
    <Sheet open={leftOverlayOpen} onOpenChange={setLeftOverlayOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute left-2.5 top-2"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className={cn("w-[288px] max-w-[calc(100vw-2.5rem)] bg-sidebar p-0", className)}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Space navigation</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
function SpaceShellMobileSidePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  const { rightOverlayOpen, setRightOverlayOpen } = useSpaceShell();
  return (
    <Sheet open={rightOverlayOpen} onOpenChange={setRightOverlayOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2.5 top-2"
            aria-label="Open context panel"
          >
            <Menu className="rotate-180" />
          </Button>
        }
      />
      <SheetContent
        side="right"
        className={cn("w-[min(24rem,calc(100vw-2.5rem))] max-w-none bg-sidebar p-2.5", className)}
        {...props}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Context panel</SheetTitle>
          <SheetDescription>Space context panel</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export {
  SpaceShell,
  SpaceShellContent,
  SpaceShellHeader,
  SpaceShellMain,
  SpaceShellMobile,
  SpaceShellMobileSidebar,
  SpaceShellMobileSidePanel,
  SpaceShellPanelGroup,
  SpaceShellProvider,
  SpaceShellResizeHandle,
  SpaceShellSidebar,
  SpaceShellSidebarTrigger,
  SpaceShellSidePanel,
  SpaceShellSidePanelTrigger,
  SpaceShellSurface,
  SpaceShellWorkspace,
  useSpaceShell,
};
