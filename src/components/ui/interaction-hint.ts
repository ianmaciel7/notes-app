import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

type HintSide = "top" | "right" | "bottom" | "left"

type InteractionTooltipConfig = {
  text: string
  description?: string
  shortcuts?: string | readonly string[]
  side?: HintSide
  delay?: number
  closeDelay?: number
  showOnMobile?: boolean
}

type InteractionTooltip = string | InteractionTooltipConfig | null | undefined

type InteractionHintPayload = {
  text: string
  description?: string
  shortcuts: string[]
  side: HintSide
  delay?: number
  closeDelay?: number
  showOnMobile: boolean
}

function normalizeShortcuts(shortcuts: InteractionTooltipConfig["shortcuts"]) {
  if (!shortcuts) return []
  return (Array.isArray(shortcuts) ? shortcuts : [shortcuts])
    .map((shortcut) => shortcut.trim())
    .filter(Boolean)
}

function resolveInteractionTooltip(
  tooltip: InteractionTooltip,
): InteractionHintPayload | undefined {
  if (!tooltip) return undefined

  if (typeof tooltip === "string") {
    const text = tooltip.trim()
    if (!text) return undefined

    return {
      text,
      description: undefined,
      shortcuts: [],
      side: "top",
      delay: undefined,
      closeDelay: undefined,
      showOnMobile: false,
    }
  }

  const text = tooltip.text.trim()
  if (!text) return undefined

  return {
    text,
    description: tooltip.description?.trim() || undefined,
    shortcuts: normalizeShortcuts(tooltip.shortcuts),
    side: tooltip.side ?? "top",
    delay: tooltip.delay,
    closeDelay: tooltip.closeDelay,
    showOnMobile: tooltip.showOnMobile ?? false,
  }
}

const interactionHintHandle = TooltipPrimitive.createHandle<InteractionHintPayload>()

export { interactionHintHandle, resolveInteractionTooltip }
export type {
  HintSide,
  InteractionHintPayload,
  InteractionTooltip,
  InteractionTooltipConfig,
}
