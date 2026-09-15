'use client'

import {
  BookOpen,
  ChevronsUpDown,
  Command,
  LayoutDashboard,
  Library,
  Plus,
  Settings,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { studyDecks } from '@/lib/study/fixtures'
import type { StudyDeck } from '@/lib/study/types'

type SpaceSidebarProps = {
  pathname?: string
  decks?: StudyDeck[]
}

const navigation = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'All cards', href: '/cards', icon: Library },
] as const

export function SpaceSidebar({
  pathname = '/',
  decks = studyDecks,
}: SpaceSidebarProps) {
  return (
    <Sidebar collapsible="icon" data-slot="space-sidebar">
      <SidebarHeader className="gap-3 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10"
              render={
                <a href="/" aria-label="KnowledgeOS">
                  KnowledgeOS
                </a>
              }
              tooltip="KnowledgeOS"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Command aria-hidden="true" />
              </span>
              <span className="font-serif text-base">KnowledgeOS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Space</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({ href, icon: Icon, label }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    render={
                      <a href={href} aria-label={label}>
                        {label}
                      </a>
                    }
                    tooltip={label}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Study decks</SidebarGroupLabel>
          <SidebarGroupAction
            aria-label="Add study deck"
            aria-disabled="true"
            tabIndex={-1}
            title="Add study deck"
          >
            <Plus aria-hidden="true" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {decks.map((deck) => {
                const href = `/study/${deck.id}`

                return (
                  <SidebarMenuItem key={deck.id}>
                    <SidebarMenuButton
                      isActive={pathname === href}
                      render={
                        <a href={href} aria-label={deck.title}>
                          {deck.title}
                        </a>
                      }
                      tooltip={deck.title}
                    >
                      <BookOpen aria-hidden="true" />
                      <span>{deck.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <a href="/settings" aria-label="Settings">
                  Settings
                </a>
              }
              tooltip="Settings"
            >
              <Settings aria-hidden="true" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10"
              render={<button type="button" />}
              tooltip="Switch space"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                I
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <span className="truncate">Ian's space</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  Personal
                </span>
              </span>
              <ChevronsUpDown aria-hidden="true" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
