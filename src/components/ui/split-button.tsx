'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SplitButtonProps = React.ComponentProps<typeof DropdownMenu>
type SplitButtonGroupProps = React.ComponentProps<typeof ButtonGroup>
type SplitButtonActionProps = React.ComponentProps<typeof Button>
type SplitButtonSeparatorProps = React.ComponentProps<typeof ButtonGroupSeparator>
type SplitButtonTriggerProps = Omit<
  React.ComponentProps<typeof DropdownMenuTrigger>,
  'render'
> & Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>
type SplitButtonContentProps = React.ComponentProps<typeof DropdownMenuContent>
type SplitButtonItemProps = React.ComponentProps<typeof DropdownMenuItem>

function SplitButton(props: SplitButtonProps) {
  return <DropdownMenu {...props} />
}

function SplitButtonGroup(props: SplitButtonGroupProps) {
  return <ButtonGroup {...props} />
}

function SplitButtonAction({ variant = 'outline', ...props }: SplitButtonActionProps) {
  return <Button data-slot='split-button-action' variant={variant} {...props} />
}

function SplitButtonSeparator(props: SplitButtonSeparatorProps) {
  return <ButtonGroupSeparator data-slot='split-button-separator' {...props} />
}

function SplitButtonTrigger({
  children,
  variant = 'outline',
  size = 'icon',
  ...props
}: SplitButtonTriggerProps) {
  return (
    <DropdownMenuTrigger
      data-slot='split-button-trigger'
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? <ChevronDownIcon aria-hidden='true' />}
    </DropdownMenuTrigger>
  )
}

function SplitButtonContent({ align = 'end', ...props }: SplitButtonContentProps) {
  return <DropdownMenuContent data-slot='split-button-content' align={align} {...props} />
}

function SplitButtonItem(props: SplitButtonItemProps) {
  return <DropdownMenuItem data-slot='split-button-item' {...props} />
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
