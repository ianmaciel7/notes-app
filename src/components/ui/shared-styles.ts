const floatingPositionerClass = "isolate z-50"

const floatingSurfaceBaseClass =
  "rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden"

const floatingSurfaceClass =
  "origin-(--transform-origin) duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

const floatingListItemClass =
  "relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const floatingListItemFocusClass =
  "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground"

const floatingListItemHighlightedClass =
  "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground"

const floatingListItemSelectedClass =
  "data-selected:bg-accent data-selected:text-accent-foreground data-selected:*:[svg]:text-accent-foreground"

const destructiveListItemClass =
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:text-destructive"

const controlIconClass =
  "pointer-events-none size-4 shrink-0 text-muted-foreground"

const controlIconSelectorClass =
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const floatingIndicatorClass =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center"

const floatingSeparatorClass = "-mx-1 my-1 h-px bg-border"

export {
  controlIconClass,
  controlIconSelectorClass,
  destructiveListItemClass,
  floatingIndicatorClass,
  floatingListItemClass,
  floatingListItemFocusClass,
  floatingListItemHighlightedClass,
  floatingListItemSelectedClass,
  floatingPositionerClass,
  floatingSeparatorClass,
  floatingSurfaceBaseClass,
  floatingSurfaceClass,
}
