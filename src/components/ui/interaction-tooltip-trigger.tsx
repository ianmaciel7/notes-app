"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import type { ReactElement } from "react"
import {
  interactionHintHandle,
  type InteractionTooltip,
  resolveInteractionTooltip,
} from "@/components/ui/interaction-hint"
import { useIsMobile } from "@/hooks/use-mobile"

type InteractionTooltipTriggerProps = {
  children: ReactElement
  tooltip: InteractionTooltip
  disabled?: boolean
}

function InteractionTooltipTrigger({
  children,
  tooltip,
  disabled = false,
}: InteractionTooltipTriggerProps) {
  const isMobile = useIsMobile()
  const payload = resolveInteractionTooltip(tooltip)

  if (!payload) return children

  return (
    <TooltipPrimitive.Trigger
      handle={interactionHintHandle}
      payload={payload}
      delay={payload.delay}
      closeDelay={payload.closeDelay}
      disabled={disabled || (isMobile && !payload.showOnMobile)}
      render={children}
      data-interaction-tooltip-trigger=""
    />
  )
}

export { InteractionTooltipTrigger }
export type { InteractionTooltipTriggerProps }
