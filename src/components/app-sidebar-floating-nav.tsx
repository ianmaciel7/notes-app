"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { AppSidebarSunIcon } from "@/components/app-sidebar-icons";
import { AppSidebarSourceIcon } from "@/components/app-sidebar-source-icon";
import type { ObjectIconProps } from "@/components/object-icons";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CompactMenuAccountPanel,
  CompactMenuPlanBadge,
  compactMenuActionButtonClass,
} from "@/components/ui/compact-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InteractionTooltipTrigger } from "@/components/ui/interaction-tooltip-trigger";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { AppSidebarSection } from "./app-sidebar-overview";

const workspaceRowStateClass =
  "transition-[background-color,color,filter,opacity] duration-200 ease-out motion-reduce:transition-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground data-[active=true]:brightness-[0.965]";

const utilityRowClass = cn(
  buttonVariants({ variant: "ghost", size: "default" }),
  "group/interactive group/utility h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
  workspaceRowStateClass,
  "active:brightness-[0.97]",
);

const footerIconClass = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "size-8 shrink-0 text-muted-foreground",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:brightness-[0.97]",
);

function AppSidebarUtilityRow({
  icon: Icon,
  label,
  external,
  href,
  tooltip,
  active,
  onClick,
}: {
  icon: React.ElementType<ObjectIconProps>;
  label: string;
  external?: boolean;
  href?: string;
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const row = (
    <span className="flex w-full min-w-0 items-center">
      <Icon className="mr-1.5 size-4 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
      {external && (
        <AppSidebarSourceIcon
          name="external"
          className={cn(
            "ml-auto size-3 shrink-0 opacity-0 transition-opacity duration-200 ease-out",
            "group-hover/utility:opacity-100",
          )}
        />
      )}
    </span>
  );

  if (href) {
    const link = (
      <a
        data-slot="app-sidebar-utility-row"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          utilityRowClass,
          "no-underline",
          active && "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]",
        )}
        onClick={onClick}
      >
        {row}
      </a>
    );

    return tooltip ? (
      <InteractionTooltipTrigger tooltip={{ text: tooltip, side: "right" }}>
        {link}
      </InteractionTooltipTrigger>
    ) : (
      link
    );
  }

  return (
    <Button
      data-slot="app-sidebar-utility-row"
      type="button"
      variant="ghost"
      tooltip={tooltip ? { text: tooltip, side: "right" } : undefined}
      className={cn(
        utilityRowClass,
        active && "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]",
      )}
      onClick={onClick}
    >
      {row}
    </Button>
  );
}

function AppSidebarHelpSection() {
  const t = useTranslations("workspace");
  const [open, setOpen] = React.useState(true);

  return (
    <AppSidebarSection
      icon={(props) => <AppSidebarSourceIcon name="help" {...props} />}
      label={t("sidebarHelp.title")}
      open={open}
      onOpenChange={setOpen}
    >
      <div data-slot="app-sidebar-help-items" className="flex flex-col px-2 pr-0.5">
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="graduation" {...props} />}
          label={t("sidebarHelp.getStarted")}
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="help" {...props} />}
          label={t("sidebarHelp.askQuestion")}
          external
          tooltip={t("sidebarHelp.askQuestionTooltip")}
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="documentation" {...props} />}
          label={t("sidebarHelp.documentation")}
          external
          href={t("sidebarHelp.documentationUrl")}
          tooltip={t("sidebarHelp.documentationTooltip")}
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="news" {...props} />}
          label={t("sidebarHelp.whatsNew")}
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="feedback" {...props} />}
          label={t("sidebarHelp.feedback")}
          href="https://capacities.io/feedback"
          external
          tooltip={t("sidebarHelp.feedbackTooltip")}
        />
      </div>
    </AppSidebarSection>
  );
}

function AppSidebarFooterAction({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      data-slot="app-sidebar-footer-action"
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      tooltip={{ text: label, side: "top" }}
      className={footerIconClass}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function AppSidebarFooterPopover({
  label,
  children,
  content,
}: {
  label: string;
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger
        data-slot="app-sidebar-footer-action"
        aria-label={label}
        className={footerIconClass}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent aria-label={label} side="top" align="start" sideOffset={7} className="w-64">
        {content}
      </PopoverContent>
    </Popover>
  );
}

function AppSidebarFooter({ onOpenShortcuts }: { onOpenShortcuts?: () => void }) {
  const t = useTranslations("workspace");
  const { isDark, toggleTheme } = useTheme();

  return (
    <footer
      data-slot="app-sidebar-footer"
      className="flex shrink-0 flex-col gap-y-px px-2.5 py-1.5 pr-1 text-xs"
    >
      <div className="flex w-full flex-wrap items-center gap-x-0.5">
        <AppSidebarFooterPopover
          label={t("footer.settings")}
          content={
            <>
              <PopoverHeader>
                <PopoverTitle>{t("footer.settingsTitle")}</PopoverTitle>
                <PopoverDescription>{t("footer.settingsDescription")}</PopoverDescription>
              </PopoverHeader>
              <div className="grid gap-1">
                {[
                  t("footer.general"),
                  t("footer.currentSpace"),
                  t("footer.resources"),
                  t("footer.integrations"),
                ].map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="ghost"
                    className="h-8 justify-start px-2 font-normal"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </>
          }
        >
          <AppSidebarSourceIcon name="settings" className="size-4" />
        </AppSidebarFooterPopover>

        <AppSidebarFooterAction
          label={isDark ? t("footer.useLightTheme") : t("footer.useDarkTheme")}
          onClick={toggleTheme}
        >
          {isDark ? (
            <AppSidebarSunIcon className="size-4" />
          ) : (
            <AppSidebarSourceIcon name="moon" className="size-4" />
          )}
        </AppSidebarFooterAction>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("footer.profile")}
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "h-8 w-auto shrink-0 gap-x-1.5 px-1.5 text-xs font-normal text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "active:brightness-[0.97] data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
            )}
          >
            <AppSidebarSourceIcon name="user" className="size-4" />
            <Badge
              variant="secondary"
              className="max-w-full gap-1 px-[0.49em] py-[0.2em] text-xs font-normal leading-[1.3] opacity-80"
            >
              <AppSidebarSourceIcon name="rocket" className="size-3" />
              <span className="truncate">{t("footer.plan")}</span>
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={6}
            className="w-auto min-w-0 overflow-visible p-0"
          >
            <CompactMenuAccountPanel
              name={t("footer.accountName")}
              email={t("footer.accountEmail")}
              badge={
                <CompactMenuPlanBadge
                  icon={(props) => <AppSidebarSourceIcon name="rocket" {...props} />}
                  label={t("footer.plan")}
                />
              }
              action={
                <Button type="button" variant="ghost" className={compactMenuActionButtonClass}>
                  <AppSidebarSourceIcon name="logout" className="size-[1em]" />
                  <span>{t("footer.signOut")}</span>
                </Button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="min-w-0 flex-1" />

        <AppSidebarFooterAction
          label={t("commands.openShortcuts.label")}
          onClick={() => onOpenShortcuts?.()}
        >
          <AppSidebarSourceIcon name="share" className="size-4" />
        </AppSidebarFooterAction>
      </div>
    </footer>
  );
}

export { AppSidebarFooter, AppSidebarHelpSection, AppSidebarUtilityRow };
