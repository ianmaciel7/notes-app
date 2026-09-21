"use client";

import { LogOut, PanelLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { logout } from "@/actions/recall";
import { CommandPalette } from "@/components/recall/command-palette";
import { ObjectEditor } from "@/components/recall/object-editor";
import { SpaceSwitcher } from "@/components/recall/space-switcher";
import { SpaceTabs } from "@/components/recall/space-tabs";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { RecallObject } from "@/domain/recall";
import { sidebarCookie, sidebarCookieMaxAgeSeconds } from "@/domain/sidebar";
import { isEditableTarget } from "@/lib/keyboard";
import type { SpaceData } from "@/lib/space";

function persistCollapsed(value: boolean) {
  document.cookie = `${sidebarCookie}=${value}; path=/; max-age=${sidebarCookieMaxAgeSeconds}; samesite=lax`;
}

const navItems = [
  { key: "overview", href: "/space", label: "Overview" },
  { key: "question", href: "/question", label: "Questions" },
  { key: "study", href: "/study", label: "Study session" },
  { key: "review", href: "/review", label: "Review queue" },
  { key: "settings", href: "/settings", label: "Settings" },
] as const;

export function SpaceFrame({
  children,
  title,
  eyebrow,
  data,
  active,
  current,
}: {
  children: ReactNode;
  title: string;
  eyebrow: string;
  data: SpaceData;
  active: (typeof navItems)[number]["key"];
  current?: RecallObject;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  // Desktop collapse (spec.md §5.4 "Collapse and peek"), persisted server-side
  // via requireSnapshot() so first paint already reflects it. Independent of
  // `navOpen`, which is the separate, never-persisted mobile drawer state.
  const [collapsed, setCollapsed] = useState(data.sidebarCollapsed);
  const navTrigger = useRef<HTMLButtonElement>(null);
  const desktopToggle = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  // spec.md 5.5: the drawer is a custom aside, not a Dialog, so it has to do
  // its own focus handling — move focus in on open, and hand it back to the
  // opener on every dismissal path rather than stranding it offscreen.
  function closeNav() {
    setNavOpen(false);
    navTrigger.current?.focus();
  }
  function toggleCollapsed(fromKeyboard = false) {
    setCollapsed((previous) => {
      const next = !previous;
      persistCollapsed(next);
      return next;
    });
    // A click already leaves focus on the button it landed on; a keyboard
    // shortcut has no such anchor, so give it one explicitly.
    if (fromKeyboard) desktopToggle.current?.focus();
  }
  useEffect(() => {
    if (!navOpen) return;
    drawer.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNavOpen(false);
      navTrigger.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);
  // spec.md §5.4 "Shortcuts": side-aware `[`/`]` — `[` is the left (this)
  // sidebar; the context panel on the right answers to `]` (see
  // context-panel.tsx). Desktop-only: the mobile drawer already has Escape.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key !== "[" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target)
      )
        return;
      event.preventDefault();
      toggleCollapsed(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  return (
    <div
      className={`min-h-screen bg-canvas text-ink lg:grid ${collapsed ? "lg:grid-cols-[1fr]" : "lg:grid-cols-[240px_1fr]"}`}
    >
      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeNav}
        />
      )}
      <aside
        ref={drawer}
        tabIndex={-1}
        aria-label="Space navigation"
        className={`${navOpen ? "fixed inset-y-0 left-0 z-50 flex w-64" : "hidden"} flex-col border-r border-hairline bg-surface-soft outline-none ${collapsed ? "lg:hidden" : "lg:static lg:flex lg:w-auto"}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-hairline px-6 text-sm font-medium">
          <span className="text-xl text-coral" aria-hidden="true">
            ✳
          </span>{" "}
          Recall
        </div>
        <div className="border-b border-hairline px-2 py-2">
          <SpaceSwitcher data={data} />
        </div>
        <div className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              className={
                item.key === active
                  ? "rounded-lg bg-surface-card px-3 py-2.5 text-sm text-ink"
                  : "rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-card hover:text-ink"
              }
              href={item.href}
              aria-current={item.key === active ? "page" : undefined}
              onClick={() => navOpen && closeNav()}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-hairline p-4">
          <Button
            variant="outline"
            className="w-full justify-start border-hairline bg-canvas"
            onClick={() => setSearching(true)}
          >
            <Search data-icon="inline-start" /> Search space
            <Kbd className="ml-auto">⌘K</Kbd>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={async () => {
              await logout();
              router.push("/login");
              router.refresh();
            }}
          >
            <LogOut data-icon="inline-start" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-hairline bg-canvas px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              ref={navTrigger}
              aria-label="Open navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <PanelLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              ref={desktopToggle}
              aria-label={collapsed ? "Show navigation" : "Hide navigation"}
              aria-expanded={!collapsed}
              onClick={() => toggleCollapsed()}
            >
              <PanelLeft />
            </Button>
            <span className="text-sm text-muted-foreground">
              {data.spaces.find((space) => space.id === data.spaceId)?.name ??
                "No Space"}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-ink">{title}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-hairline bg-canvas"
            disabled={!data.spaceId}
            onClick={() => setAdding(true)}
          >
            New object
          </Button>
        </header>
        <SpaceTabs tabs={data.tabs} current={current} />
        <main className="mx-auto max-w-6xl px-5 py-10 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-coral">
            {eyebrow}
          </p>
          <h1 className="display-face mt-3 text-4xl text-ink">{title}</h1>
          {children}
        </main>
      </div>
      <CommandPalette
        data={data}
        open={searching}
        onOpenChange={setSearching}
        onNewObject={() => setAdding(true)}
      />
      {adding && (
        <ObjectEditor
          data={data}
          onClose={() => setAdding(false)}
          onSaved={async (id) => {
            setAdding(false);
            router.push(`/question/${id}`);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
