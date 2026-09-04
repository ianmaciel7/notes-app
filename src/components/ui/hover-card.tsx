"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import {
  floatingInteractionSurfaceClass,
  floatingPositionerClass,
  previewSurfaceMotionClass,
} from "@/components/ui/shared-styles"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  delay = 330,
  closeDelay = 180,
  disabled = false,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  const isMobile = useIsMobile()

  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={delay}
      closeDelay={closeDelay}
      disabled={disabled || isMobile}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  collisionPadding = 8,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "collisionPadding" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={floatingPositionerClass}
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            floatingInteractionSurfaceClass,
            previewSurfaceMotionClass,
            "w-72 p-1.5 text-xs",
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
