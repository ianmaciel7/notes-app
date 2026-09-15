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

interface SpaceSidebarProps extends ComponentProps<typeof Sidebar> {
  pathname?: string
}

const navigation = [
  { translationKey: 'overview', href: '/', icon: LayoutDashboard },
  { translationKey: 'allCards', href: '/cards', icon: Library },
] as const

function isNavigationItemActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SpaceSidebar({
  pathname = '/',
  collapsible = 'icon',
  ...sidebarProps
}: SpaceSidebarProps) {
  const t = useTranslations('space')

  return (
    <Sidebar
      {...sidebarProps}
      collapsible={collapsible}
      data-slot="space-sidebar"
    >
      <SidebarHeader className="gap-3 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10"
              render={
                <Link href="/" aria-label={t('brand')}>
                  {t('brand')}
                </Link>
              }
              tooltip={t('brand')}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Command aria-hidden="true" />
              </span>
              <span className="font-serif text-base">{t('brand')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('spaceLabel')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({ href, icon: Icon, translationKey }) => {
                const label = t(translationKey)
                const isActive = isNavigationItemActive(pathname, href)

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
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
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
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
              isActive={isNavigationItemActive(pathname, '/settings')}
              render={
                <Link
                  href="/settings"
                  aria-label={t('settings')}
                  aria-current={
                    isNavigationItemActive(pathname, '/settings')
                      ? 'page'
                      : undefined
                  }
                >
                  {t('settings')}
                </Link>
              }
              tooltip={t('settings')}
            >
              <Settings aria-hidden="true" />
              <span>{t('settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10"
              render={<button type="button" />}
              aria-label={t('switchSpace')}
              tooltip={t('switchSpace')}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                I
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <span className="truncate">{t('spaceName')}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {t('personal')}
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
