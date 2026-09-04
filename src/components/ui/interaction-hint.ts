import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

type HintSide = "top" | "right" | "bottom" | "left"

type InteractionHintPayload = {
  label: string
  description?: string
  shortcuts: string[]
  side: HintSide
}

const interactionHintHandle = TooltipPrimitive.createHandle<InteractionHintPayload>()

export { interactionHintHandle }
export type { HintSide, InteractionHintPayload }
