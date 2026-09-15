'use client'

import {
  ChevronsUpDown,
  Command,
  LayoutDashboard,
  Library,
  Settings,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

type SpaceSidebarProps = {
  pathname?: string
}

const navigation = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'All cards', href: '/cards', icon: Library },
] as const

export function SpaceSidebar({ pathname = '/' }: SpaceSidebarProps) {
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
