'use client'

import {
  ChevronsUpDown,
  Command,
  LayoutDashboard,
  Library,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useSpace } from './space-provider'

type SpaceSidebarProps = ComponentProps<typeof Sidebar>

const primaryNavigation = [
  { translationKey: 'overview', href: '/', icon: LayoutDashboard },
] as const

const studyNavigation = [
  { translationKey: 'allCards', href: '/cards', icon: Library },
] as const

function isNavigationItemActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavigationItem({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string
  icon: typeof LayoutDashboard
  label: string
  pathname: string
}) {
  const isActive = isNavigationItemActive(pathname, href)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        className="h-9 px-2.5"
        render={
          <Link
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </Link>
        }
        tooltip={label}
      >
        <Icon aria-hidden="true" className="size-4" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function SpaceSidebar({
  collapsible = 'icon',
  ...sidebarProps
}: SpaceSidebarProps) {
  const t = useTranslations('space')
  const { pathname } = useSpace()
  const settingsIsActive = isNavigationItemActive(pathname, '/settings')

  return (
    <Sidebar
      {...sidebarProps}
      collapsible={collapsible}
      data-slot="space-sidebar"
    >
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    className="h-11 px-2.5"
                    aria-label={t('switchSpace')}
                    tooltip={t('switchSpace')}
                  />
                }
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Command aria-hidden="true" className="size-3.5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 leading-tight">
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {t('brand')}
                  </span>
                  <span className="truncate font-serif text-[15px]">
                    {t('spaceName')}
                  </span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {t('personal')}
                  </span>
                </span>
                <ChevronsUpDown
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-56">
                <DropdownMenuLabel>{t('spaceLabel')}</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  <Command aria-hidden="true" />
                  <span>{t('spaceName')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup className="px-3 py-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {primaryNavigation.map(({ href, icon, translationKey }) => (
                <NavigationItem
                  key={href}
                  href={href}
                  icon={icon}
                  label={t(translationKey)}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-3 py-3">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            {t('study')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {studyNavigation.map(({ href, icon, translationKey }) => (
                <NavigationItem
                  key={href}
                  href={href}
                  icon={icon}
                  label={t(translationKey)}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={settingsIsActive}
              className="h-9 px-2.5"
              render={
                <Link
                  href="/settings"
                  aria-label={t('settings')}
                  aria-current={settingsIsActive ? 'page' : undefined}
                >
                  {t('settings')}
                </Link>
              }
              tooltip={t('settings')}
            >
              <Settings aria-hidden="true" className="size-4" />
              <span>{t('settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
