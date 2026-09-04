"use client";

import { cva } from "class-variance-authority";
import * as React from "react";

import {
  AppHeaderCaretDownIcon,
  AppHeaderCloseIcon,
  AppHeaderPlusIcon,
  AppHeaderPushPinFillIcon,
  AppHeaderPushPinIcon,
} from "@/components/app-header-icons";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { objectLifecycleContractSlots } from "@/lib/object-lifecycle-contracts";
import { cn } from "@/lib/utils";

const MAIN_TAB_MAX_WIDTH = 200;
const MAIN_TAB_MIN_WIDTH = 82;
const MAIN_TAB_GAP = 5;
const SIDE_TAB_MAX_WIDTH = 160;
const SIDE_TAB_MIN_WIDTH = 44;
const SIDE_TAB_GAP = 4;
const _SIDE_TAB_CONTROLS_WIDTH = 28;

const appHeaderTabTheme = {} as React.CSSProperties;

type DropPosition = "before" | "after";

type HeaderTabLayout = {
  tabWidth: number;
  cramped: boolean;
  maxVisible: number;
};

export type AppHeaderTab = {
  id: string;
  label: string;
  icon?: React.ElementType;
  iconClassName?: string;
  pinned?: boolean;
  draggable?: boolean;
  preview?: React.ReactNode;
};

export type AppHeaderTabActionLabels = {
  pin: string;
  unpin: string;
  close: string;
};

export type AppHeaderTabProps = React.ComponentProps<"div"> & {
  tab: AppHeaderTab;
  active?: boolean;
  neutral?: boolean;
  fitContent?: boolean;
  closable?: boolean;
  pinnable?: boolean;
  dragging?: boolean;
  showSeparator?: boolean;
  actionLabels?: Partial<AppHeaderTabActionLabels>;
  onOpen?: () => void;
  onShiftOpen?: () => void;
  onClose?: () => void;
  onTogglePin?: () => void;
};

export type AppSpaceHeaderProps = React.ComponentProps<"div"> & {
  tabs: AppHeaderTab[];
  value: string;
  onValueChange: (value: string) => void;
  onTabsChange: (tabs: AppHeaderTab[]) => void;
  onCreate?: () => void;
  onShiftOpen?: (tab: AppHeaderTab) => void;
  onCloseRequest?: (tab: AppHeaderTab) => boolean | undefined;
  createLabel?: string;
  tabListLabel?: string;
  searchTabsPlaceholder?: string;
  actionLabels?: Partial<AppHeaderTabActionLabels>;
};

function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let mounted = true;

    const update = () => {
      if (mounted) setWidth(element.getBoundingClientRect().width);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return [ref, width] as const;
}

function moveTab(tabs: AppHeaderTab[], sourceId: string, targetId: string, position: DropPosition) {
  if (sourceId === targetId) return tabs;

  const sourceIndex = tabs.findIndex((tab) => tab.id === sourceId);
  if (sourceIndex === -1) return tabs;

  const next = [...tabs];
  const [moving] = next.splice(sourceIndex, 1);
  if (!moving) return tabs;

  const targetIndex = next.findIndex((tab) => tab.id === targetId);
  if (targetIndex === -1) return tabs;

  next.splice(targetIndex + (position === "after" ? 1 : 0), 0, moving);
  return next;
}

function getMainLayout(width: number, count: number): HeaderTabLayout {
  if (!count || width <= 0) {
    return { tabWidth: MAIN_TAB_MAX_WIDTH, cramped: false, maxVisible: count };
  }

  const gaps = Math.max(0, count - 1) * MAIN_TAB_GAP;
  const reservedControls = 28 + MAIN_TAB_GAP;
  const initialAvailable = width - reservedControls - gaps;
  const initialWidth =
    initialAvailable <= 0
      ? 1
      : Math.max(1, Math.floor(Math.min(MAIN_TAB_MAX_WIDTH, initialAvailable / count)));
  const cramped = initialWidth < MAIN_TAB_MAX_WIDTH - 1;
  const available = cramped ? width - gaps : initialAvailable;
  const tabWidth =
    available <= 0 ? 1 : Math.max(1, Math.floor(Math.min(MAIN_TAB_MAX_WIDTH, available / count)));

  if (tabWidth >= MAIN_TAB_MIN_WIDTH) {
    return { tabWidth, cramped, maxVisible: count };
  }

  const maxVisible = Math.max(
    1,
    Math.floor((width + MAIN_TAB_GAP) / (MAIN_TAB_MIN_WIDTH + MAIN_TAB_GAP)),
  );

  return {
    tabWidth: MAIN_TAB_MIN_WIDTH,
    cramped: true,
    maxVisible: Math.min(maxVisible, count),
  };
}

function getVisibleRange(tabs: AppHeaderTab[], value: string, maxVisible: number) {
  const count = tabs.length;
  if (!count || maxVisible >= count) return { start: 0, end: count };

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === value),
  );
  let start = activeIndex >= maxVisible ? activeIndex - maxVisible + 1 : 0;
  start = Math.min(start, Math.max(0, count - maxVisible));

  return { start, end: start + maxVisible };
}

const tabIconBadgeVariants = cva(
  "inline-flex min-h-[1.3em] min-w-[1.3em] shrink-0 grow-0 items-center justify-center rounded-[0.33em]",
  {
    variants: {
      neutral: {
        true: "bg-transparent text-[var(--app-tab-text-secondary)]",
        false:
          "bg-[oklch(0.9856_0.0016_67.00)] text-[oklch(0.3887_0.0052_301.05)] dark:bg-[oklch(0.2987_0.0072_285.88)] dark:text-[oklch(0.9163_0.0017_67.07)]",
      },
    },
    defaultVariants: {
      neutral: false,
    },
  },
);

function AppHeaderTabIcon({ tab, neutral }: { tab: AppHeaderTab; neutral?: boolean }) {
  const Icon = tab.icon;
  if (!Icon) return null;

  return (
    <span
      data-slot="app-header-tab-icon"
      className={cn(tabIconBadgeVariants({ neutral: Boolean(neutral) }), tab.iconClassName)}
    >
      <span
        className="inline-flex min-h-[1.3em] min-w-[1.3em] items-center justify-center rounded-[0.33em] p-[0.1em] text-[0.94em]"
        style={{ verticalAlign: "-0.125em" }}
      >
        <Icon className="size-[1em]" />
      </span>
    </span>
  );
}

const tabActionVariants = cva(
  "relative h-7 w-[18px] shrink-0 rounded-[8px] border border-transparent bg-transparent p-0 text-xs text-[var(--app-tab-text-subtle)] transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] active:z-20 active:translate-y-0 active:brightness-[0.97] focus-visible:border-transparent focus-visible:ring-0",
);

function AppHeaderTabAction({
  label,
  className,
  children,
  onClick,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      data-slot="app-header-tab-action"
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      tooltip={{ text: label, side: "bottom" }}
      className={cn(tabActionVariants(), className)}
      onClick={onClick}
    >
      <span
        className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative"
        style={{ verticalAlign: "-0.125em" }}
      >
        <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
          {children}
        </span>
      </span>
    </Button>
  );
}

const tabNavigationKeys = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

function getNextTabFocusIndex(key: string, currentIndex: number, count: number) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const direction = key === "ArrowRight" ? 1 : -1;
  return (currentIndex + direction + count) % count;
}

function handleTabKeyDown(event: React.KeyboardEvent<HTMLElement>, onOpen?: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onOpen?.();
    return;
  }

  if (!tabNavigationKeys.has(event.key)) return;
  const tabList = event.currentTarget.closest('[role="tablist"]');
  if (!tabList) return;
  const tabs = Array.from(tabList.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
    (candidate) => candidate.getClientRects().length > 0,
  );
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0 || tabs.length < 2) return;

  event.preventDefault();
  tabs[getNextTabFocusIndex(event.key, currentIndex, tabs.length)]?.focus();
}

function dataFlag(value: boolean) {
  return value || undefined;
}

function getTabRenderItems(tabs: AppHeaderTab[]) {
  const seen = new Map<string, number>();
  return tabs.map((tab) => {
    const occurrence = seen.get(tab.id) ?? 0;
    seen.set(tab.id, occurrence + 1);
    return {
      tab,
      renderKey: occurrence === 0 ? tab.id : `${tab.id}:duplicate-${occurrence}`,
    };
  });
}

function hasReservedTabActions({
  fitContent,
  pinnable,
  closable,
}: Pick<AppHeaderTabProps, "fitContent" | "pinnable" | "closable">) {
  return !fitContent && Boolean(pinnable || closable);
}

const tabButtonVariants = cva(
  "relative flex h-8 min-w-0 cursor-pointer select-none items-center gap-x-[0.3em] py-[3px] pl-[6px] pr-px text-[13px] leading-[1.3] outline-none ring-0 transition-[background-color,border-color,color,opacity] duration-150 ease-out motion-reduce:transition-none",
  {
    variants: {
      fitContent: {
        true: "w-auto rounded-lg",
        false: "min-w-11 flex-1",
      },
      hasActions: {
        true: "",
        false: "rounded-lg",
      },
      neutral: {
        true: "border-transparent bg-transparent text-[var(--app-tab-text-primary)] font-normal",
        false: "border-[0.5px]",
      },
      active: {
        true: "",
        false: "",
      },
      dragging: {
        true: "cursor-grabbing opacity-40",
        false: "",
      },
    },
    compoundVariants: [
      {
        fitContent: false,
        hasActions: true,
        className: "rounded-l-lg rounded-r-none border-r-0",
      },
      {
        neutral: false,
        active: true,
        className:
          "border-[var(--app-tab-border-front)] bg-[var(--app-tab-bg-base)] font-medium text-[var(--app-tab-text-primary)]",
      },
      {
        neutral: false,
        active: false,
        className:
          "border-transparent text-[var(--app-tab-text-subtle)] hover:bg-[var(--app-tab-bg-back-hover)] hover:text-[var(--app-tab-text-secondary)]",
      },
    ],
    defaultVariants: {
      fitContent: false,
      hasActions: false,
      neutral: false,
      active: false,
      dragging: false,
    },
  },
);

function getTabButtonClassName({
  active,
  neutral,
  fitContent,
  dragging,
  hasActions,
}: Pick<AppHeaderTabProps, "active" | "neutral" | "fitContent" | "dragging"> & {
  hasActions: boolean;
}) {
  return tabButtonVariants({
    active: Boolean(active),
    neutral: Boolean(neutral),
    fitContent: Boolean(fitContent),
    dragging: Boolean(dragging),
    hasActions: Boolean(hasActions),
  });
}

function OverlayPinAction({
  pinned,
  labels,
  onTogglePin,
}: {
  pinned: boolean;
  labels: { pin: string; unpin: string };
  onTogglePin?: () => void;
}) {
  if (!onTogglePin) return null;
  return (
    <AppHeaderTabAction
      label={pinned ? labels.unpin : labels.pin}
      className={
        pinned ? "visible" : "invisible group-hover/tab:visible group-focus-within/tab:visible"
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onTogglePin();
      }}
    >
      {pinned ? (
        <AppHeaderPushPinFillIcon className="size-3.5" />
      ) : (
        <AppHeaderPushPinIcon className="size-3.5" />
      )}
    </AppHeaderTabAction>
  );
}

function OverlayCloseAction({
  active,
  neutral,
  label,
  onClose,
}: {
  active: boolean;
  neutral?: boolean;
  label: string;
  onClose?: () => void;
}) {
  if (!onClose) return null;
  return (
    <AppHeaderTabAction
      label={label}
      className={
        neutral
          ? "pointer-events-none opacity-0 transition-opacity duration-100 ease-out group-hover/tab:pointer-events-auto group-hover/tab:opacity-100 group-focus-within/tab:opacity-100"
          : active
            ? "visible"
            : "invisible group-hover/tab:visible group-focus-within/tab:visible"
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
    >
      <AppHeaderCloseIcon className="size-3.5" />
    </AppHeaderTabAction>
  );
}

const reservedActionsVariants = cva(
  "flex h-8 shrink-0 items-center justify-end rounded-r-[8px] border-[0.5px] border-l-0 pr-[2px] transition-[background-color,border-color,opacity] duration-200 ease-out motion-reduce:transition-none",
  {
    variants: {
      layout: {
        double: "w-[38px]",
        single: "w-5",
      },
      active: {
        true: "",
        false: "",
      },
      neutral: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        neutral: false,
        className: "border-[var(--app-tab-border-front)] bg-[var(--app-tab-bg-base)]",
      },
      {
        active: false,
        neutral: false,
        className:
          "border-transparent bg-[var(--app-tab-bg-back)] group-hover/tab:bg-[var(--app-tab-bg-back-hover)]",
      },
      {
        neutral: true,
        className:
          "border-transparent bg-[var(--app-tab-bg-back)] group-hover/tab:bg-[var(--app-tab-bg-back-hover)]",
      },
    ],
    defaultVariants: {
      layout: "single",
      active: false,
      neutral: false,
    },
  },
);

function ReservedTabActions({
  active,
  neutral,
  fitContent,
  closable,
  pinnable,
  pinned,
  labels,
  onClose,
  onTogglePin,
}: {
  active: boolean;
  neutral: boolean;
  fitContent: boolean;
  closable: boolean;
  pinnable: boolean;
  pinned: boolean;
  labels: { pin: string; unpin: string; close: string };
  onClose?: () => void;
  onTogglePin?: () => void;
}) {
  if (fitContent || (!pinnable && !closable)) return null;
  return (
    <span
      data-slot="app-header-tab-actions"
      className={reservedActionsVariants({
        layout: pinnable && closable ? "double" : "single",
        active: Boolean(active),
        neutral: Boolean(neutral),
      })}
    >
      {pinnable ? (
        <OverlayPinAction pinned={pinned} labels={labels} onTogglePin={onTogglePin} />
      ) : null}
      {closable ? (
        <OverlayCloseAction
          active={active}
          neutral={neutral}
          label={labels.close}
          onClose={onClose}
        />
      ) : null}
    </span>
  );
}

function FitContentCloseAction({
  fitContent,
  closable,
  label,
  onClose,
}: {
  fitContent: boolean;
  closable: boolean;
  label: string;
  onClose?: () => void;
}) {
  if (!fitContent || !closable || !onClose) return null;
  return (
    <div className="flex h-full shrink-0 items-center pr-[2px]">
      <AppHeaderTabAction
        label={label}
        className="pointer-events-none opacity-0 transition-opacity duration-100 ease-out group-hover/tab:pointer-events-auto group-hover/tab:opacity-100 group-focus-within/tab:opacity-100"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }}
      >
        <AppHeaderCloseIcon className="size-3.5" />
      </AppHeaderTabAction>
    </div>
  );
}

function FitContentPinAction({
  fitContent,
  pinnable,
  pinned,
  labels,
  onTogglePin,
}: {
  fitContent: boolean;
  pinnable: boolean;
  pinned: boolean;
  labels: { pin: string; unpin: string };
  onTogglePin?: () => void;
}) {
  if (!fitContent || !pinnable || !onTogglePin) return null;
  return (
    <div className="flex h-full shrink-0 items-center pr-[2px]">
      <AppHeaderTabAction
        label={pinned ? labels.unpin : labels.pin}
        className={cn(
          "transition-opacity duration-100 ease-out",
          pinned
            ? "opacity-100"
            : "pointer-events-none opacity-0 group-hover/tab:pointer-events-auto group-hover/tab:opacity-100",
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onTogglePin();
        }}
      >
        {pinned ? (
          <AppHeaderPushPinFillIcon className="size-3.5" />
        ) : (
          <AppHeaderPushPinIcon className="size-3.5" />
        )}
      </AppHeaderTabAction>
    </div>
  );
}

function AppHeaderTabItem({
  tab,
  active = false,
  neutral = false,
  fitContent = false,
  closable = true,
  pinnable = false,
  dragging = false,
  showSeparator = false,
  actionLabels,
  onOpen,
  onShiftOpen,
  onClose,
  onTogglePin,
  className,
  onPointerEnter,
  onPointerLeave,
  style,
  ...props
}: AppHeaderTabProps) {
  const labels = {
    pin: "Pin tab",
    unpin: "Unpin tab",
    close: "Close tab",
    ...actionLabels,
  };

  const hasReservedActions = hasReservedTabActions({
    fitContent,
    pinnable,
    closable,
  });

  const tabNode = (
    <div
      data-slot="app-header-tab"
      data-active={dataFlag(active)}
      data-neutral={dataFlag(neutral)}
      data-pinned={dataFlag(Boolean(tab.pinned))}
      className={cn(
        "group/tab pointer-events-auto relative min-w-0 max-w-full rounded-md",
        fitContent ? "inline-flex" : "w-full",
        className,
      )}
      style={{ ...appHeaderTabTheme, ...style }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      <div className={cn("relative flex min-w-0 items-center", fitContent ? undefined : "w-full")}>
        <div
          role="tab"
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectTab}
          aria-selected={active}
          tabIndex={active ? 0 : -1}
          className={getTabButtonClassName({
            active,
            neutral,
            fitContent,
            dragging,
            hasActions: hasReservedActions,
          })}
          onClick={(event) => {
            if (event.shiftKey) onShiftOpen?.();
            else onOpen?.();
          }}
          onKeyDown={(event) => handleTabKeyDown(event, onOpen)}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (closable) onClose?.();
          }}
        >
          <AppHeaderTabIcon tab={tab} neutral={neutral || fitContent} />
          <span className={cn("min-w-0 truncate text-left", fitContent ? undefined : "flex-1")}>
            {tab.label}
          </span>
          <FitContentPinAction
            fitContent={fitContent}
            pinnable={pinnable}
            pinned={Boolean(tab.pinned)}
            labels={labels}
            onTogglePin={onTogglePin}
          />
          <FitContentCloseAction
            fitContent={fitContent}
            closable={closable}
            label={labels.close}
            onClose={onClose}
          />
        </div>
        <ReservedTabActions
          active={active}
          neutral={neutral}
          fitContent={fitContent}
          closable={closable}
          pinnable={pinnable}
          pinned={Boolean(tab.pinned)}
          labels={labels}
          onClose={onClose}
          onTogglePin={onTogglePin}
        />

        {showSeparator && (
          <div className="absolute right-0 top-1/2 h-[18px] w-[0.5px] -translate-y-1/2 rounded-full bg-[var(--app-tab-border-front)] group-hover/tab:opacity-0" />
        )}
      </div>
    </div>
  );

  if (!tab.preview || active || dragging) return tabNode;

  return (
    <HoverCard>
      <HoverCardTrigger render={<div className="min-w-0" />}>{tabNode}</HoverCardTrigger>
      <HoverCardContent side="bottom" align="center" sideOffset={4}>
        {tab.preview}
      </HoverCardContent>
    </HoverCard>
  );
}

function AppHeaderTabList({
  tabs,
  value,
  visible,
  label,
  searchPlaceholder,
  onValueChange,
  onClose,
}: {
  tabs: AppHeaderTab[];
  value: string;
  visible: boolean;
  label: string;
  searchPlaceholder: string;
  onValueChange: (value: string) => void;
  onClose: (tab: AppHeaderTab) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  if (!visible) return null;

  const normalized = query.trim().toLocaleLowerCase();
  const filteredTabs = normalized
    ? tabs.filter((tab) => tab.label.toLocaleLowerCase().includes(normalized))
    : tabs;
  const filteredTabItems = getTabRenderItems(filteredTabs);

  return (
    <div data-slot="app-header-tab-list" className="relative shrink-0" style={appHeaderTabTheme}>
      <HeaderControlButton label={label} onClick={() => setOpen((current) => !current)}>
        <AppHeaderCaretDownIcon className="size-4" />
      </HeaderControlButton>

      {open && (
        <div className="absolute right-0 top-[34px] z-[80] w-64 rounded-lg border border-[var(--app-tab-border-front)] bg-[var(--app-tab-bg-front)] p-2 shadow-xl">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="mb-2 h-8"
          />
          <div className="max-h-64 overflow-y-auto">
            {filteredTabItems.map(({ tab, renderKey }) => (
              <div
                key={renderKey}
                className={cn(
                  "group/list flex h-9 items-center gap-1 rounded-md px-1",
                  "hover:bg-[var(--app-tab-bg-back-hover)]",
                  tab.id === value && "bg-[var(--app-tab-bg-back-hover)]",
                )}
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 px-1 text-left text-sm"
                  onClick={() => {
                    onValueChange(tab.id);
                    setOpen(false);
                  }}
                >
                  <AppHeaderTabIcon tab={tab} />
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                  {tab.pinned && (
                    <AppHeaderPushPinFillIcon className="size-3 text-[var(--app-tab-text-subtle)]" />
                  )}
                </button>
                {tabs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Close ${tab.label}`}
                    tooltip={{ text: `Close ${tab.label}`, side: "bottom" }}
                    className="text-[var(--app-tab-text-subtle)] opacity-0 hover:bg-[var(--app-tab-bg-front-hover)] group-hover/list:opacity-100"
                    onClick={() => onClose(tab)}
                  >
                    <AppHeaderCloseIcon className="size-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderControlButton({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      tooltip={{ text: label, side: "bottom" }}
      className={cn(
        "relative shrink-0 rounded-lg border border-transparent bg-transparent",
        "text-sm text-[var(--app-tab-text-secondary)] transition-[opacity] duration-200 ease-out",
        "hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)]",
        "active:z-20 active:translate-y-0 active:brightness-[0.97] focus-visible:border-transparent focus-visible:ring-0",
        className,
      )}
      onClick={onClick}
    >
      <span className="inline-flex size-4 items-center justify-center [&>svg]:size-full">
        {children}
      </span>
    </Button>
  );
}

function AppSpaceHeader({
  tabs,
  value,
  onValueChange,
  onTabsChange,
  onCreate,
  onShiftOpen,
  onCloseRequest,
  createLabel = "Create new tab",
  tabListLabel = "Tab list",
  searchTabsPlaceholder = "Search tabs",
  actionLabels,
  className,
  style,
  ...props
}: AppSpaceHeaderProps) {
  const [containerRef, width] = useElementWidth<HTMLDivElement>();
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{
    id: string;
    position: DropPosition;
  } | null>(null);

  const layout = React.useMemo(() => getMainLayout(width, tabs.length), [tabs.length, width]);
  const range = React.useMemo(
    () => getVisibleRange(tabs, value, layout.maxVisible),
    [layout.maxVisible, tabs, value],
  );
  const visibleTabs = getTabRenderItems(tabs).slice(range.start, range.end);
  const hasHiddenTabs = layout.maxVisible > 0 && layout.maxVisible < tabs.length;
  const showTabList = (layout.cramped || hasHiddenTabs) && tabs.length > 1;

  function togglePin(tab: AppHeaderTab) {
    onTabsChange(
      tabs.map((item) => (item.id === tab.id ? { ...item, pinned: !item.pinned } : item)),
    );
  }

  function closeTab(tab: AppHeaderTab) {
    if (tabs.length <= 1) return;
    if (onCloseRequest?.(tab) === false) return;

    const index = tabs.findIndex((item) => item.id === tab.id);
    const next = tabs.filter((item) => item.id !== tab.id);
    onTabsChange(next);

    if (value === tab.id) {
      const fallback = next[index] ?? next[index - 1] ?? next[0];
      if (fallback) onValueChange(fallback.id);
    }
  }

  return (
    <div
      data-slot="app-space-header"
      className={cn(
        "sticky top-0 z-[41] flex min-w-0 flex-1 select-none items-center justify-between bg-[var(--app-tab-bg-back)]",
        className,
      )}
      style={{ ...appHeaderTabTheme, ...style }}
      {...props}
    >
      <div
        ref={containerRef}
        data-slot="app-space-header-viewport"
        className="flex w-0 min-w-0 grow cursor-default items-center overflow-hidden px-1 [contain:layout_style_paint]"
      >
        <div
          role="tablist"
          aria-label="Workspace tabs"
          className="flex w-full min-w-0 items-center"
          style={{ gap: MAIN_TAB_GAP }}
        >
          {visibleTabs.map(({ tab, renderKey }, localIndex) => {
            const active = tab.id === value;
            const before = dropTarget?.id === tab.id && dropTarget.position === "before";
            const after = dropTarget?.id === tab.id && dropTarget.position === "after";
            const absoluteIndex = range.start + localIndex;
            return (
              <React.Fragment key={renderKey}>
                {before && (
                  <div className="h-6 w-[1.5px] shrink-0 rounded-full bg-[var(--app-block-selection-border)]" />
                )}
                {/* biome-ignore lint/a11y/noStaticElementInteractions: native drag events belong on the visual tab wrapper */}
                <div
                  role="presentation"
                  draggable={tab.draggable !== false}
                  data-slot="app-space-header-tab-wrapper"
                  data-tab-id={tab.id}
                  data-tab-active={active || undefined}
                  className={cn(
                    "relative min-w-0 transition-[width] duration-150 ease-out motion-reduce:transition-none",
                    tabs.length > 1 && "shrink-0",
                  )}
                  style={tabs.length === 1 ? { maxWidth: 500 } : { width: layout.tabWidth }}
                  onDragStart={(event) => {
                    if (tab.draggable === false) {
                      event.preventDefault();
                      return;
                    }
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", tab.id);
                    setDraggingId(tab.id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    const rect = event.currentTarget.getBoundingClientRect();
                    setDropTarget({
                      id: tab.id,
                      position: event.clientX < rect.left + rect.width / 2 ? "before" : "after",
                    });
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const sourceId = event.dataTransfer.getData("text/plain");
                    if (sourceId && sourceId !== tab.id) {
                      onTabsChange(
                        moveTab(
                          tabs,
                          sourceId,
                          tab.id,
                          dropTarget?.id === tab.id ? dropTarget.position : "after",
                        ),
                      );
                    }
                    setDraggingId(null);
                    setDropTarget(null);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTarget(null);
                  }}
                >
                  <AppHeaderTabItem
                    tab={tab}
                    active={active}
                    neutral={tabs.length === 1}
                    fitContent={tabs.length === 1}
                    closable={tabs.length > 1}
                    pinnable
                    dragging={draggingId === tab.id}
                    showSeparator={absoluteIndex === tabs.length - 1 && !active}
                    actionLabels={actionLabels}
                    onOpen={() => onValueChange(tab.id)}
                    onShiftOpen={() => onShiftOpen?.(tab)}
                    onClose={() => closeTab(tab)}
                    onTogglePin={() => togglePin(tab)}
                  />
                </div>
                {after && (
                  <div className="h-6 w-[1.5px] shrink-0 rounded-full bg-[var(--app-block-selection-border)]" />
                )}
              </React.Fragment>
            );
          })}

          {!layout.cramped && (
            <HeaderControlButton label={createLabel} onClick={onCreate}>
              <AppHeaderPlusIcon className="size-4" />
            </HeaderControlButton>
          )}
        </div>
      </div>

      <div data-slot="app-space-header-controls" className="flex shrink-0 items-center gap-1">
        <AppHeaderTabList
          tabs={tabs}
          value={value}
          visible={showTabList}
          label={tabListLabel}
          searchPlaceholder={searchTabsPlaceholder}
          onValueChange={onValueChange}
          onClose={closeTab}
        />

        {layout.cramped && (
          <HeaderControlButton label={createLabel} onClick={onCreate}>
            <AppHeaderPlusIcon className="size-4" />
          </HeaderControlButton>
        )}
      </div>
    </div>
  );
}

export {
  AppHeaderTabItem,
  AppSpaceHeader,
  MAIN_TAB_GAP,
  MAIN_TAB_MAX_WIDTH,
  MAIN_TAB_MIN_WIDTH,
  SIDE_TAB_GAP,
  SIDE_TAB_MAX_WIDTH,
  SIDE_TAB_MIN_WIDTH,
};
