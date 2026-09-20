"use client";

import { LogOut, PanelLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { logout } from "@/actions/recall";
import { CommandPalette } from "@/components/recall/command-palette";
import { ObjectEditor } from "@/components/recall/object-editor";
import { SpaceSwitcher } from "@/components/recall/space-switcher";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { Snapshot } from "@/domain/recall";

const navItems = [
  { key: "overview", href: "/workspace", label: "Overview" },
  { key: "question", href: "/question", label: "Questions" },
  { key: "study", href: "/study", label: "Study session" },
  { key: "review", href: "/review", label: "Review queue" },
  { key: "settings", href: "/settings", label: "Settings" },
] as const;

export function WorkspaceFrame({
  children,
  title,
  eyebrow,
  data,
  active,
}: {
  children: ReactNode;
  title: string;
  eyebrow: string;
  data: Snapshot;
  active: (typeof navItems)[number]["key"];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);
  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[240px_1fr]">
      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}
      <aside
        className={`${navOpen ? "fixed inset-y-0 left-0 z-50 flex w-64" : "hidden"} flex-col border-r border-hairline bg-surface-soft lg:static lg:flex lg:w-auto`}
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
              onClick={() => setNavOpen(false)}
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
            <Search data-icon="inline-start" /> Search workspace
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
              aria-label="Open navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
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
