"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SplitButtonSize = Extract<NonNullable<ButtonProps["size"]>, "xs" | "sm" | "default" | "lg">

export interface SplitButtonOption {
  id: string
  label: React.ReactNode
  leadingIcon?: React.ReactNode
  onClick?: () => void
}

export interface SplitButtonProps {
  label?: React.ReactNode
  leadingIcon?: React.ReactNode
  options?: SplitButtonOption[]
  onPrimaryClick?: () => void
  onDisclosureClick?: () => void
  variant?: ButtonProps["variant"]
  size?: SplitButtonSize
  disabled?: boolean
  className?: string
  ariaLabel?: string
  dropdownAriaLabel?: string
}

function SplitButton({
  label,
  leadingIcon,
  options,
  onPrimaryClick,
  onDisclosureClick,
  variant = "ghost",
  size = "sm",
  disabled = false,
  className,
  ariaLabel,
  dropdownAriaLabel = "More options",
}: SplitButtonProps) {
  const hasOptions = options && options.length > 0
  const hasDisclosureAction = Boolean(onDisclosureClick)
  const groupAriaLabel = ariaLabel ?? (typeof label === "string" ? label : undefined) ?? dropdownAriaLabel

  return (
    <ButtonGroup aria-label={groupAriaLabel} className={className}>
      <Button
        size={size}
        variant={variant}
        onClick={onPrimaryClick}
        disabled={disabled}
        className="gap-1.5"
      >
        {leadingIcon}
        {label && <span>{label}</span>}
      </Button>

      <ButtonGroupSeparator
        orientation="vertical"
      />

      {hasOptions ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size={size}
                variant={variant}
                disabled={disabled}
                onClick={onDisclosureClick}
                aria-label={dropdownAriaLabel}
              />
            }
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {options.map((option) => (
              <DropdownMenuItem key={option.id} onClick={option.onClick}>
                {option.leadingIcon}
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size={size}
          variant={variant}
          onClick={onDisclosureClick}
          disabled={disabled || !hasDisclosureAction}
          aria-label={hasDisclosureAction ? dropdownAriaLabel : undefined}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </Button>
      )}
    </ButtonGroup>
  )
}

export { SplitButton }
