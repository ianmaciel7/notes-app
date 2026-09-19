import {
  BookOpenIcon,
  FolderIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";

import {
  type SpaceItem,
  SpaceSwitcher,
} from "@/components/spaces/space-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user/user-nav";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export interface SpaceShellProps {
  spaceId: string;
  lang: Locale;
  children: React.ReactNode;
  spaces?: SpaceItem[];
  user?: {
    email?: string | null;
    displayName?: string | null;
  } | null;
}

export async function SpaceShell({
  spaceId,
  lang,
  children,
  spaces = [],
  user = null,
}: SpaceShellProps) {
  const dictionary = await getDictionary(lang);

  const navItems = [
    {
      title: dictionary.spaces.overview,
      href: `/${lang}/spaces/${spaceId}`,
      icon: LayoutDashboardIcon,
    },
    {
      title: dictionary.objects.questions,
      href: `/${lang}/spaces/${spaceId}/questions`,
      icon: HelpCircleIcon,
    },
    {
      title: dictionary.objects.exams,
      href: `/${lang}/spaces/${spaceId}/exams`,
      icon: GraduationCapIcon,
    },
    {
      title: dictionary.objects.study,
      href: `/${lang}/spaces/${spaceId}/study`,
      icon: BookOpenIcon,
    },
    {
      title: dictionary.objects.collections,
      href: `/${lang}/spaces/${spaceId}/collections`,
      icon: FolderIcon,
    },
  ];

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {dictionary.common.skipToContent}
      </a>

      <div className="flex min-h-screen w-full">
        <Sidebar aria-label="Navigation sidebar">
          <SidebarHeader className="border-b border-sidebar-border p-2">
            <SpaceSwitcher
              spaces={spaces}
              currentSpaceId={spaceId}
              lang={lang}
            />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.href}
                            className="flex items-center gap-2"
                          />
                        }
                      >
                        <item.icon
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-2">
            <div className="flex items-center justify-between gap-2 px-2 py-1">
              <span className="text-xs text-muted-foreground truncate">
                {user?.email ?? user?.displayName ?? ""}
              </span>
              <UserNav user={user} />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
            <SidebarTrigger aria-label={dictionary.common.toggleSidebar} />
            <h1 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {spaces.find((s) => s.id === spaceId)?.name ??
                dictionary.spaces.title}
            </h1>
          </header>

          <main id="main-content" tabIndex={-1} className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
