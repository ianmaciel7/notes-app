"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import * as React from "react"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

import { interactionHintHandle } from "@/components/ui/interaction-hint"

function normalizeShortcutKey(value: string) {
  const keyLabels: Record<string, string> = {
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    Control: "Ctrl",
    Escape: "Esc",
    Meta: "⌘",
  }

  return keyLabels[value] ?? value
}

function HintShortcut({ shortcut }: { shortcut: string }) {
  const keys = shortcut.split("+").map((part) => normalizeShortcutKey(part))

  return (
    <KbdGroup className="gap-0.5">
      {keys.map((key, index) => (
        <Kbd key={`${shortcut}-${key}-${index}`}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

function InteractionProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <TooltipPrimitive.Root handle={interactionHintHandle} disableHoverablePopup>
        {({ payload }) => {
          if (!payload) return null

          return (
            <TooltipContent
              data-slot="interaction-hint"
              side={payload.side}
              sideOffset={6}
              className="pointer-events-none max-w-64"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="min-w-0 whitespace-pre-wrap">{payload.label}</div>
                {payload.description ? (
                  <div className="whitespace-pre-line font-normal text-muted-foreground">
                    {payload.description}
                  </div>
                ) : null}
                {payload.shortcuts.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {payload.shortcuts.map((shortcut, index) => (
                      <React.Fragment key={`${shortcut}-${index}`}>
                        {index > 0 ? <span className="text-muted-foreground">/</span> : null}
                        <HintShortcut shortcut={shortcut} />
                      </React.Fragment>
                    ))}
                  </div>
                ) : null}
              </div>
            </TooltipContent>
          )
        }}
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

export { InteractionProvider }
