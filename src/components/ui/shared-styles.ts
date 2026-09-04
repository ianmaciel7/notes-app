const floatingPositionerClass = "isolate z-50"

const floatingInteractionSurfaceClass =
  "rounded-[12px] border border-border bg-popover text-popover-foreground shadow-[0_2px_3px_rgb(0_0_0/0.01),0_4px_9px_rgb(0_0_0/0.03),0_8px_12px_rgb(0_0_0/0.01)] outline-hidden"

const tooltipSurfaceClass =
  "box-content rounded-[8px] border border-border/50 bg-popover/50 px-2 py-1 text-xs font-medium leading-normal text-foreground shadow-sm backdrop-blur-[8px] dark:bg-background/70"

const tooltipMotionClass =
  "duration-[180ms] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none motion-reduce:transition-none"

const previewSurfaceMotionClass =
  "duration-150 data-open:animate-in data-open:fade-in-0 data-closed:duration-100 data-closed:animate-out data-closed:fade-out-0 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none motion-reduce:transition-none"

const overlayClass =
  "fixed inset-0 isolate z-50 bg-black/45 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none motion-reduce:transition-none"

const floatingSurfaceBaseClass =
  "rounded-[12px] border border-border bg-popover text-popover-foreground shadow-[0_12px_34px_rgb(0_0_0/0.16),0_2px_8px_rgb(0_0_0/0.08)] outline-hidden ring-1 ring-black/5 dark:ring-white/10"

const dialogSurfaceBaseClass =
  "rounded-[8px] border border-border bg-popover text-popover-foreground shadow-[0_18px_60px_rgb(0_0_0/0.22)] outline-none ring-1 ring-black/10 dark:ring-white/10"

const floatingSurfaceClass =
  "origin-(--transform-origin) duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none motion-reduce:transition-none"

const dialogSurfaceClass =
  "duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none motion-reduce:transition-none"

const floatingListItemClass =
  "relative flex h-8 min-h-8 cursor-default items-center gap-2 rounded-[8px] px-1 py-0 text-sm leading-normal outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-3"

const floatingListItemFocusClass =
  "focus:bg-muted focus:text-foreground not-data-[variant=destructive]:focus:**:text-foreground"

const floatingSearchListItemClass =
  "flex h-8 w-full items-center gap-2 rounded-lg px-1.5 text-left text-sm outline-none hover:bg-muted focus-visible:bg-muted"

const floatingListItemHighlightedClass =
  "data-highlighted:bg-muted data-highlighted:text-foreground not-data-[variant=destructive]:data-highlighted:**:text-foreground"

const floatingListItemSelectedClass =
  "data-selected:bg-[var(--app-bg-el-hover)] data-selected:text-foreground data-selected:*:[svg]:text-foreground"

const destructiveListItemClass =
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:text-destructive"

const controlIconClass =
  "pointer-events-none size-4 shrink-0 text-muted-foreground"

const controlIconSelectorClass =
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const floatingIndicatorClass =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center"

const floatingSeparatorClass = "my-1 h-px bg-border"

const workspaceRowStateClass =
  "transition-[background-color,color,filter,opacity] duration-200 ease-out motion-reduce:transition-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground data-[active=true]:brightness-[0.965]"

const workspaceRevealActionClass =
  "pointer-events-none invisible opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover/interactive:pointer-events-auto group-hover/interactive:visible group-hover/interactive:opacity-100 group-focus-within/interactive:pointer-events-auto group-focus-within/interactive:visible group-focus-within/interactive:opacity-100"

const workspaceSectionRevealActionClass =
  "pointer-events-none opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover/app-sidebar-section:pointer-events-auto group-hover/app-sidebar-section:opacity-100 group-focus-within/app-sidebar-section:pointer-events-auto group-focus-within/app-sidebar-section:opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100"

const workspaceTabStateClass =
  "transition-[background-color,border-color,color,opacity] duration-150 ease-out motion-reduce:transition-none"

const workspaceCompoundControlClass =
  "transition-[background-color,border-color,color,opacity,transform] duration-250 ease-out motion-reduce:transition-none"

const workspaceSmallActionStateClass =
  "transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none"

const workspaceSubmenuStateClass =
  "transition-[background-color,color,opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:animate-none"

const workspaceTooltipStateClass =
  "transition-opacity duration-[180ms] ease-out motion-reduce:transition-none motion-reduce:animate-none"

const workspaceSurfaceMotionClass =
  "transition-[width,height,transform,opacity] duration-200 ease-out motion-reduce:transition-none motion-reduce:animate-none"

export {
  controlIconClass,
  controlIconSelectorClass,
  destructiveListItemClass,
  dialogSurfaceBaseClass,
  dialogSurfaceClass,
  floatingIndicatorClass,
  floatingInteractionSurfaceClass,
  floatingListItemClass,
  floatingListItemFocusClass,
  floatingSearchListItemClass,
  floatingListItemHighlightedClass,
  floatingListItemSelectedClass,
  floatingPositionerClass,
  floatingSeparatorClass,
  floatingSurfaceBaseClass,
  floatingSurfaceClass,
  overlayClass,
  previewSurfaceMotionClass,
  tooltipMotionClass,
  tooltipSurfaceClass,
  workspaceCompoundControlClass,
  workspaceRevealActionClass,
  workspaceRowStateClass,
  workspaceSectionRevealActionClass,
  workspaceSmallActionStateClass,
  workspaceSubmenuStateClass,
  workspaceSurfaceMotionClass,
  workspaceTabStateClass,
  workspaceTooltipStateClass,
}
