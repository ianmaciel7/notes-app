"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import {
  floatingInteractionSurfaceClass,
  floatingPositionerClass,
  previewSurfaceMotionClass,
} from "@/components/ui/shared-styles"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

function HoverCard({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: PreviewCardPrimitive.Root.Props) {
  const isMobile = useIsMobile()

  return (
    <PreviewCardPrimitive.Root
      data-slot="hover-card"
      open={isMobile ? false : open}
      defaultOpen={isMobile ? false : defaultOpen}
      onOpenChange={(nextOpen, eventDetails) => {
        if (isMobile && nextOpen) return
        onOpenChange?.(nextOpen, eventDetails)
      }}
      {...props}
    />
  )
}

function HoverCardTrigger({
  delay = 330,
  closeDelay = 180,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={delay}
      closeDelay={closeDelay}
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
