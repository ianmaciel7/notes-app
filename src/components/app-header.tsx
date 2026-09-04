"use client";

import * as React from "react";

import {
  AppHeaderCaretLeftIcon,
  AppHeaderCaretRightIcon,
  AppHeaderCircleDashedIcon,
  AppHeaderCloseIcon,
} from "@/components/app-header-icons";
import { AppShellContext } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const appHeaderTheme = {} as React.CSSProperties;

type AppHeaderProps = React.ComponentProps<"header"> & {
  backDisabled?: boolean;
  forwardDisabled?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onFocus?: () => void;
  backLabel?: string;
  forwardLabel?: string;
  focusLabel?: string;
  end?: React.ReactNode;
  leftCollapsed?: boolean;
};

type AppFocusModeControlsProps = React.ComponentProps<"div"> & {
  backDisabled?: boolean;
  forwardDisabled?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onExit?: () => void;
  backLabel?: string;
  forwardLabel?: string;
  exitLabel?: string;
};

function AppHeader({
  className,
  children,
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  onFocus,
  backLabel = "Back",
  forwardLabel = "Forward",
  focusLabel = "Enter focus mode",
  end,
  leftCollapsed: propLeftCollapsed,
  style,
  ...props
}: AppHeaderProps) {
  const appShell = React.useContext(AppShellContext);
  const isLeftCollapsed = propLeftCollapsed ?? appShell?.leftCollapsed ?? false;

  return (
    <header
      data-slot="app-header"
      className={cn(
        "pointer-events-none flex h-[46px] w-full shrink-0 grow-0 items-center justify-between border-b-0",
        "bg-[var(--app-header-bg-back)] text-[var(--app-header-text-secondary)]",
        className,
      )}
      style={{ ...appHeaderTheme, ...style }}
      {...props}
    >
      <div
        data-slot="app-header-start"
        className={cn(
          "pointer-events-auto flex h-full shrink-0 items-center gap-x-2 transition-[padding] duration-200 ease-out",
          isLeftCollapsed ? "pl-[42px]" : "pl-2.5",
        )}
      >
        <AppHeaderHistory
          backDisabled={backDisabled}
          forwardDisabled={forwardDisabled}
          onBack={onBack}
          onForward={onForward}
          backLabel={backLabel}
          forwardLabel={forwardLabel}
        />
      </div>

      <div
        data-slot="app-header-content"
        className="pointer-events-auto flex min-w-0 flex-1 items-center"
      >
        {children}
      </div>

      <div
        data-slot="app-header-end"
        className="pointer-events-none flex max-w-max shrink-0 items-center justify-end pr-2.5 text-xs text-[var(--app-header-text-secondary)]"
      >
        <div className="pointer-events-auto flex items-center gap-1 px-1">
          <AppHeaderAction aria-label={focusLabel} tooltip={focusLabel} onClick={onFocus}>
            <AppHeaderCircleDashedIcon className="size-4" />
          </AppHeaderAction>
          {end}
        </div>
      </div>
    </header>
  );
}

function AppHeaderHistory({
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  backLabel = "Back",
  forwardLabel = "Forward",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  backDisabled?: boolean;
  forwardDisabled?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  backLabel?: string;
  forwardLabel?: string;
}) {
  return (
    <div data-slot="app-header-history" className={cn("flex items-center", className)} {...props}>
      <AppHeaderAction
        aria-label={backLabel}
        tooltip={backLabel}
        disabled={backDisabled}
        onClick={onBack}
      >
        <AppHeaderCaretLeftIcon className="size-4" />
      </AppHeaderAction>

      <AppHeaderAction
        aria-label={forwardLabel}
        tooltip={forwardLabel}
        disabled={forwardDisabled}
        onClick={onForward}
      >
        <AppHeaderCaretRightIcon className="size-4" />
      </AppHeaderAction>
    </div>
  );
}

function AppHeaderAction({
  className,
  variant = "ghost",
  size = "icon-sm",
  tooltip,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: React.ReactNode;
}) {
  const button = (
    <Button
      data-slot="app-header-action"
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "rounded-lg border border-transparent bg-transparent text-[var(--app-header-text-secondary)] shadow-none",
        "hover:bg-[var(--app-header-bg-front-hover)] hover:text-[var(--app-header-text-primary)]",
        "active:translate-y-0 active:brightness-[0.97] focus-visible:border-transparent focus-visible:ring-0",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="bottom" sideOffset={8}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function AppFocusModeControls({
  className,
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  onExit,
  backLabel = "Back",
  forwardLabel = "Forward",
  exitLabel = "Leave focus mode",
  style,
  ...props
}: AppFocusModeControlsProps) {
  return (
    <div
      data-slot="app-focus-mode-controls"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-center px-4 pt-2",
        className,
      )}
      style={{ ...appHeaderTheme, ...style }}
      {...props}
    >
      <div className="group/focus pointer-events-auto flex flex-row">
        <div className="grid min-w-0 grid-cols-[0fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-out group-hover/focus:grid-cols-[1fr] group-hover/focus:delay-50">
          <div className="min-w-0 overflow-hidden">
            <div className="flex min-w-0 flex-row overflow-hidden">
              <AppHeaderAction
                aria-label={backLabel}
                tooltip={backLabel}
                disabled={backDisabled}
                className="border-[var(--app-header-border-front)] bg-[color-mix(in_oklch,var(--app-header-bg-base),transparent_30%)] shadow-sm backdrop-blur"
                onClick={onBack}
              >
                <AppHeaderCaretLeftIcon className="size-4" />
              </AppHeaderAction>
              <AppHeaderAction
                aria-label={forwardLabel}
                tooltip={forwardLabel}
                disabled={forwardDisabled}
                className="border-[var(--app-header-border-front)] bg-[color-mix(in_oklch,var(--app-header-bg-base),transparent_30%)] shadow-sm backdrop-blur"
                onClick={onForward}
              >
                <AppHeaderCaretRightIcon className="size-4" />
              </AppHeaderAction>
            </div>
          </div>
        </div>

        <div className="h-0 w-0 bg-[var(--app-header-border-front)] opacity-0 transition-[width,height,opacity] duration-300 ease-out group-hover/focus:h-7 group-hover/focus:w-px group-hover/focus:opacity-100 group-hover/focus:delay-50" />

        <AppHeaderAction
          aria-label={exitLabel}
          tooltip={exitLabel}
          className="border-[var(--app-header-border-front)] bg-[color-mix(in_oklch,var(--app-header-bg-base),transparent_30%)] shadow-sm backdrop-blur"
          onClick={onExit}
        >
          <AppHeaderCloseIcon className="size-4" />
        </AppHeaderAction>
      </div>
    </div>
  );
}

export {
  AppFocusModeControls,
  type AppFocusModeControlsProps,
  AppHeader,
  AppHeaderAction,
  AppHeaderHistory,
  type AppHeaderProps,
};
