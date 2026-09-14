"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SplitButtonProps = React.ComponentProps<typeof DropdownMenu>

function SplitButton(props: SplitButtonProps) {
  return <DropdownMenu {...props} />
}

type SplitButtonGroupProps = React.ComponentProps<typeof ButtonGroup>

function SplitButtonGroup({
  ...props
}: SplitButtonGroupProps) {
  return (
    <ButtonGroup
      data-slot="split-button-group"
      {...props}
    />
  )
}

type SplitButtonActionProps = React.ComponentProps<typeof Button>

function SplitButtonAction({
  ...props
}: SplitButtonActionProps) {
  return (
    <Button
      data-slot="split-button-action"
      {...props}
    />
  )
}

type SplitButtonSeparatorProps =
  React.ComponentProps<typeof ButtonGroupSeparator>

function SplitButtonSeparator({
  ...props
}: SplitButtonSeparatorProps) {
  return (
    <ButtonGroupSeparator
      data-slot="split-button-separator"
      {...props}
    />
  )
}

type SplitButtonTriggerProps =
  Omit<React.ComponentProps<typeof DropdownMenuTrigger>, "render"> &
    Pick<ButtonProps, "variant" | "size">

function SplitButtonTrigger({
  children,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: SplitButtonTriggerProps) {
  return (
    <DropdownMenuTrigger
      data-slot="split-button-trigger"
      render={
        <Button
          variant={variant}
          size={size}
        />
      }
      {...props}
    >
      {children ?? <ChevronDownIcon aria-hidden="true" />}
    </DropdownMenuTrigger>
  )
}

type SplitButtonContentProps =
  React.ComponentProps<typeof DropdownMenuContent>

function SplitButtonContent({
  align = "end",
  ...props
}: SplitButtonContentProps) {
  return (
    <DropdownMenuContent
      data-slot="split-button-content"
      align={align}
      {...props}
    />
  )
}

type SplitButtonItemProps =
  React.ComponentProps<typeof DropdownMenuItem>

function SplitButtonItem({
  ...props
}: SplitButtonItemProps) {
  return (
    <DropdownMenuItem
      data-slot="split-button-item"
      {...props}
    />
  )
}

export {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
}

export type {
  SplitButtonActionProps,
  SplitButtonContentProps,
  SplitButtonGroupProps,
  SplitButtonItemProps,
  SplitButtonProps,
  SplitButtonSeparatorProps,
  SplitButtonTriggerProps,
}
