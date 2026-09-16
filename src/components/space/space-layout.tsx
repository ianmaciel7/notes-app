import * as React from "react";
import { Archive, BarChart2, Library, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user/user-nav";
import { cn } from "@/lib/utils";

export interface SpaceLayoutProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  active?: "decks" | "analytics" | "backup";
}

export function SpaceLayout({ children, active, className, ...props }: SpaceLayoutProps) {
  return (
    <div className={cn("min-h-screen grid grid-cols-1 md:grid-cols-[232px_minmax(0,1fr)]", className)} {...props}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex sticky top-0 h-screen p-6 bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border"
        aria-label="Navegação principal"
      >
        <Link
          className="inline-flex items-center gap-2.5 text-inherit no-underline text-lg font-bold tracking-tight"
          href="/"
          aria-label="Revisa, início"
        >
          <span className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles size={17} />
          </span>
          <span>Revisa</span>
        </Link>

        <nav className="grid gap-1.5 mt-8">
          <Link
            className={cn(
              "min-h-10.5 flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors no-underline",
              active === "decks"
                ? "text-sidebar-accent-foreground bg-sidebar-accent font-semibold"
                : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
            href="/"
          >
            <Library size={18} />
            <span>Baralhos</span>
          </Link>
          <Link
            className={cn(
              "min-h-10.5 flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors no-underline",
              active === "analytics"
                ? "text-sidebar-accent-foreground bg-sidebar-accent font-semibold"
                : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
            href="/analytics"
          >
            <BarChart2 size={18} />
            <span>Desempenho</span>
          </Link>
          <Link
            className={cn(
              "min-h-10.5 flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors no-underline",
              active === "backup"
                ? "text-sidebar-accent-foreground bg-sidebar-accent font-semibold"
                : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
            href="/backup"
          >
            <Archive size={18} />
            <span>Backup</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-sidebar-border space-y-3">
          <UserNav />
          <div className="text-sidebar-foreground/60 flex items-start gap-2 text-xs leading-relaxed">
            <Settings2 size={16} className="shrink-0 mt-0.5" />
            <span>Dados salvos neste dispositivo</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-16 px-5 border-b border-border bg-background/95 backdrop-blur-xs flex items-center justify-between sticky top-0 z-10">
          <Link
            className="inline-flex items-center gap-2 text-inherit no-underline text-base font-bold"
            href="/"
            aria-label="Revisa, início"
          >
            <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles size={16} />
            </span>
            <span>Revisa</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserNav compact />
            <Button
              render={<Link href="/analytics" />}
              nativeButton={false}
              variant="outline"
              size="icon"
              aria-label="Abrir desempenho"
            >
              <BarChart2 size={18} />
            </Button>
            <Button
              render={<Link href="/backup" />}
              nativeButton={false}
              variant="outline"
              size="icon"
              aria-label="Abrir backup"
            >
              <Archive size={18} />
            </Button>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
