"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import {
  floatingPositionerClass,
  tooltipMotionClass,
  tooltipSurfaceClass,
} from "@/components/ui/shared-styles"
import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 200,
  closeDelay = 0,
  timeout = 400,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipContentProps = TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "collisionPadding" | "side" | "sideOffset"
  > & {
    showArrow?: boolean
  }

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  collisionPadding = 8,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={floatingPositionerClass}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipSurfaceClass, tooltipMotionClass, "w-fit max-w-40", className)}
          {...props}
        >
          {children}
          {showArrow ? (
            <TooltipPrimitive.Arrow
              data-slot="tooltip-arrow"
              className="size-2 rotate-45 rounded-[1px] border-r border-b border-border/50 bg-popover/50 fill-popover/50 dark:bg-background/70"
            />
          ) : null}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
